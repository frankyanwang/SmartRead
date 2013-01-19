var _       = require('underscore');
var Utils   = require('../server/server_utils');

var feedparser  = require('feedparser'),
    cheerio     = require('cheerio'),
    request     = require('request'),
    mongo       = require('mongodb'),
    gridstore   = mongo.GridStore,
    config      = require('./config.js'),
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var Iconv  = require('iconv-jp').Iconv;

var DataProvider = require('../server/db-provider').DataProvider;

var CATEGORY_MAP = {
    news:"新闻",
    sports:"体育",
    tech:"科技",
    web:"互联网",
    fashion:"时尚",
    education:"教育",
    movie:"电影，电视",
    finance:"财经"
};

//// UTF8 Regular RSS Sites
_.each(config.sites, function (value, key) {
    _.each(value, function (element, index) {
        new DataProvider({auto_reconnect: false}, function(err, dataProvider){
            if(err){
                console.log(err, " Exit!");
            }else{
                parseFeed(element, dataProvider, CATEGORY_MAP[key]);
                console.log(CATEGORY_MAP[key], element);
            }
        });
    });
});

// Baidu RSS feed sites
_.each(config.baidu_feeds, function (value, key) {
    new DataProvider({auto_reconnect: false}, function(err, dataProvider){
        if(err){
            console.log(err, " Exit!");
        }else{
            parseFeedBaidu(key, dataProvider, value.split(', '));
            console.log(value, key);
        }
    });
});

function getTags(link, fn) {

    request(link, function (error, response, body) {
        if (error) throw error
        var $ = cheerio.load(body);
        fn($('meta[name=keywords]').attr('content'));
    });

}

function parseFeed(feedurl, dataProvider, category) {

    request(
        {   method: "GET",
            uri: feedurl,
            timeout: 60000
        },
        function (error, response, body) {

        if (!error && response.statusCode == 200) {

            feedparser.parseString(body, function(error, meta, articles){

                if (error) {
                    console.error(error);
                    console.log("close db connection");
                    dataProvider.db.close();
                } else {
                    //console.log(meta);
                    console.log("category", category);

                    dataProvider.db.collection("posts", function (err, collection) {
                        if(err){
                            console.log("query posts collection failed.", err);
                        }else{
                            articles.forEach(function (article) {


                                var $ = cheerio.load(article.description);
                                var imgurl = $('img').first().attr('src');
                                var id = new mongo.ObjectID();

                                var filename;
                                if (imgurl) {
                                    filename = id + '.' + imgurl.split('.').pop();
                                }

                                var tags = _.union([category],article.categories);
                                //console.log(tags);

                                //console.log(meta.link + "\n\n\n")
                                var content = contentFilter(article.description, meta.link);

                                collection.update({
                                    guid:article.guid
                                }, {
                                    _id:id,
                                    source:meta.title,
                                    name:article.title,
                                    link:article.link,
                                    description:content.summary,
                                    content:content.body,
                                    wordcount:content.wordcount,
                                    pubDate:article.pubdate,
                                    date:article.date,
                                    guid:article.guid,
                                    author:article.author,
                                    comments:article.comments,
                                    tags:tags,
                                    picture:imgurl
                                }, {
                                    upsert:true
                                }, function () {
                                    console.log(id + " with url=" + article.guid + " successfully inserted or updated!");
                                });

                            });
                        }
                        dataProvider.db.close();
                        console.log("close db connection");
                    });
                }
            });
        } else{
            dataProvider.db.close();
            console.log("request failed.");
            console.log("close db connection");

        }
    });
}


function parseFeedBaidu(feedurl, dataProvider, category) {

    request(
        {   method: "GET",
            uri: feedurl,
            timeout: 60000,
            encoding: null
        },
        function (error, response, body) {

            if (!error && response.statusCode == 200) {

                var covertedBody = new Iconv('gb2312', 'utf8').convert(body);

                feedparser.parseString(covertedBody, function(error, meta, articles){

                    if (error) {
                        console.error(error);
                        console.log("close db connection");
                        dataProvider.db.close();
                    } else {
                        dataProvider.db.collection("posts", function (error, collection) {

                            articles.forEach(function (article) {

                                var $ = cheerio.load(article.description);
                                var imageUrl = getImageUrl($);


                                if(imageUrl === undefined){
                                    return false;
                                }
                                if(UrlBroken(imageUrl)){
                                    return false;
                                }

                                var id = new mongo.ObjectID();

                                var tags = _.union([category],article.categories);
                                //console.log(tags);

                                collection.update({
                                    guid:article.guid
                                }, {
                                    _id : id,
                                    source : getSourceName(article, meta),
                                    name : article.title,
                                    link : article.link,
                                    description : getCleanDescription($,article),
                                    content : article.description,
                                    pubDate : article.pubdate,
                                    date : article.date,
                                    guid : article.guid,
                                    author : article.author,
                                    comments : article.comments,
                                    tags:  tags,
                                    picture : imageUrl
                                }, {
                                    upsert:true
                                }, function () {
                                    console.log(id + " with url=" + article.guid + " successfully inserted!");
                                });

                            });
                            dataProvider.db.close();
                            console.log("close db connection");
                        });
                    }
                });
            } else{
                dataProvider.db.close();
                console.log("request failed.");
                console.log("close db connection");
            }
        }
    );
}

function storeImage(filename, imgurl) {
    var gs = new gridstore(dataProvider.db, filename, 'w');

    // Open the new file
    gs.open(function (err, gridStore) {

        // Write the file to gridFS
        gs.writeFile(imgurl, function (err, doc) {
            console.log('image ' + filename + ' inserted into gridstore.');
        });
    });
}


function contentFilter(html, link) {

    switch(link){

        case 'http://www.ifanr.com':
            var content = cheerio.load(html);
            var removable = cheerio.load(html);
            removable('p').last().replaceWith('')
            return {
                summary: content('p').text(),
                body: removable.html('p'),
                wordcount: content('p').text().length
            }
            break;
        case 'http://tech2ipo.com/feed':
            var content = cheerio.load(html);
            return {
                summary: content('p').text(),
                body: content.html('p'),
                wordcount: content('p').text().length
            }
            break;
        case 'http://www.36kr.com/':
            var content = cheerio.load(html);
            var removable = cheerio.load(html);
            removable('p').last().replaceWith('')
            return {
                summary: content('p').text(),
                body: removable.html('p'),
                wordcount: content('p').text().length
            }
            break;
        case 'http://www.fashiondes.com/':
            var content = cheerio.load(html);
            var children = content('p').children().text();
            return {
                summary: children ? children : content('p').text() ,
                body: content.html(),
                wordcount: children ? children.length : content('p').text().length
            }
            break;
        default :
            var content = cheerio.load(html);
            //console.log("%%%%%%%" + content.html() + "%%%%%%%\n")
            return {
                summary: content('p').text(),
                body: content.html('p'),
                wordcount: content('p').text().length
            }
            break;
    }
}

function getSourceName(article, meta){
    if(article.source){
        if(typeof article.source === "string"){
            return article.source;
        }else if(article.source.title && article.source.title.length > 0){
            return article.source.title
        }
    }
    return meta.title;
}

function getImageUrl($){
    //http://t1.baidu.com/it/u=http%3A%2F%2Fphotocdn.sohu.com%2F20130116%2FImg363568894.jpg&fm=30
    var imageUrl = $('img').first().attr('src');

    if(imageUrl === undefined){
        return imageUrl;
    }
    //get embeded img url.
    imageUrl = imageUrl.split("&")[0].split("=")[1];
    //decode it.
    try {
        imageUrl = decodeURIComponent(imageUrl);
    }catch(Err){
        console.log(Err);
        console.log(imageUrl);
        return undefined;
    }
    return imageUrl;
}

function getCleanDescription($,article){
    var root = $.root();

    $('a').remove();
    $('span').remove();
    $('br').remove();
    $('nobr').remove();

    var description = Utils.stringTrim(root.text());

    description = description.split('...')[0] + "... [更多]";

    return description;
}

function UrlBroken(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 200;
}
