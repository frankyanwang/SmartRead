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

function getTags(link, fn) {

    request(link, function (error, response, body) {
        if (error) throw error;
        var $ = cheerio.load(body);
        fn($('meta[name=keywords]').attr('content'));
    });

}

function parseFeed(feedurl, dataProvider, category, callback) {

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
                        callback("parse-feed-failed");
                    } else {
                        //console.log(meta);
                        console.log("category", category);

                        dataProvider.db.collection("posts", function (err, collection) {
                            if(err){
                                console.log("query posts collection failed.", err);
                            }else{
                                var initScore = config.intialScore[feedurl] || config.DEFAULT_INIT_SCORE;
                                console.log("init score: ", initScore);

                                articles.forEach(function (article) {
                                    var $ = cheerio.load(article.description);
                                    var imgurl = $('img').first().attr('src');
                                    var id = new mongo.ObjectID();

                                    var filename;
                                    if (imgurl) {
                                        filename = id + '.' + imgurl.split('.').pop();
                                    }

//                                    var tags = _.union(category,article.categories);
                                    var tags = article.categories || [];
                                    //console.log(tags);

                                    //console.log(meta.link + "\n\n\n")
                                    var content = contentFilter(article.description, meta.link);

                                    collection.findAndModify({
                                        guid:article.guid
                                    }, [['_id', 1]], {
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
                                        category: category,
                                        tags:tags,
                                        score: initScore--,
                                        picture:imgurl
                                    }, {
                                        upsert:true
                                    }, function (err) {
                                        if(err){
                                            console.log("upsert story failed");
                                        }else{
                                            console.log(id + " with url=" + article.guid + " successfully inserted or updated!");
                                        }
                                    });

                                });
                            }
                            callback();
                        });
                    }
                });
            } else{
                console.log("request failed.");
                callback("request-failed");
            }
        }
    );
}


function parseFeedBaidu(feedurl, dataProvider, category, callback) {

    request(
        {   method: "GET",
            uri: feedurl,
            timeout: 60000,
            encoding: null
        },
        function (error, response, body) {

            if (!error && response.statusCode == 200) {

                try{
                    body = new Buffer(body, 'binary');
                    body = new Iconv('gb2312', 'utf8').convert(body).toString();
                }catch(err){
                    console.log("encoding convert failed: ", err);
                    callback("encoding-convert-failed");
                    return false;
                }

                feedparser.parseString(body, function(error, meta, articles){

                    if (error) {
                        console.error(error);
                        callback("parse-feed-failed");
                    } else {
                        dataProvider.db.collection("posts", function (error, collection) {

                            var initScore = config.intialScore[feedurl] || config.DEFAULT_INIT_SCORE;;
                            console.log("init score: ", initScore);

                            articles.forEach(function (article) {

                                var $ = cheerio.load(article.description);
                                var imageUrl = getImageUrl($);


                                if(imageUrl === undefined){
                                    return false;
                                }
//                                if(UrlBroken(imageUrl)){
//                                    return false;
//                                }

                                var id = new mongo.ObjectID();

//                                var tags = _.union(category,article.categories);
                                var tags = article.categories || [];

                                //console.log(tags);

                                collection.findAndModify({
                                    guid:article.guid
                                }, [['_id', 1]], {
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
                                    category: category,
                                    tags:  tags,
                                    score: initScore--,
                                    picture : imageUrl
                                }, {
                                    upsert:true
                                }, function (err) {
                                    if(err){
                                        console.log("Upsert story: ", article.guid, " failed");
                                    }else{
                                        console.log(id + " with url=" + article.guid + " successfully inserted or updated!");
                                    }
                                });

                            });
                            callback();
                        });
                    }
                });
            } else{
                console.log("request failed.");
                callback("request-failed");
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
            removable('p').last().replaceWith('');
            return {
                summary: content('p').text(),
                body: removable.html('p'),
                wordcount: content('p').text().length
            };
            break;
        case 'http://tech2ipo.com/feed':
            var content = cheerio.load(html);
            return {
                summary: content('p').text(),
                body: content.html('p'),
                wordcount: content('p').text().length
            };
            break;
        case 'http://www.36kr.com/':
            var content = cheerio.load(html);
            var removable = cheerio.load(html);
            removable('p').last().replaceWith('');
            return {
                summary: content('p').text(),
                body: removable.html('p'),
                wordcount: content('p').text().length
            };
            break;
        case 'http://www.fashiondes.com/':
            var content = cheerio.load(html);
            var children = content('p').children().text();
            return {
                summary: children ? children : content('p').text() ,
                body: content.html(),
                wordcount: children ? children.length : content('p').text().length
            };
            break;
        default :
            var content = cheerio.load(html);
            //console.log("%%%%%%%" + content.html() + "%%%%%%%\n")
            return {
                summary: content('p').text(),
                body: content.html('p'),
                wordcount: content('p').text().length
            };
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

    var domain = imageUrl.split(/\/+/g)[1];
    if(_.contains(config.forbiddenImageDomain, domain)){
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

// insert feed.
(function(){

    var dataProvider = new DataProvider();
    var counter = 0;

////// UTF8 Regular RSS Sites
    _.each(config.sites, function (value, key) {
        _.each(value, function (element, index) {
            counter++;
            console.log("callback counter: ", counter);
            parseFeed(element, dataProvider, config.CATEGORY_MAP[key], function(){
                counter--;
                if(counter === 0){
                    dataProvider.db.close();
                    console.log("db connection closed.");
                }
                console.log("callback counter: ", counter);
            });
            console.log(config.CATEGORY_MAP[key], element);
        });
    });

    var dataProviderBaidu = new DataProvider();
    var counterBaidu = 0;

//////// Baidu RSS Sites
    _.each(config.baidu_feeds, function (value, key) {
        counterBaidu++;
        console.log("counter: ", counterBaidu);
        parseFeedBaidu(key, dataProviderBaidu, value, function(){
            counterBaidu--;
            if(counterBaidu === 0){
                dataProviderBaidu.db.close();
                console.log("Baidu db connection closed.");
            }
            console.log("callback counter: ", counterBaidu);
        });
        console.log(value, key);
    });

})();
