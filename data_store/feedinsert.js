var _ = require('underscore');

var feedparser = require('feedparser'),
    cheerio = require('cheerio'),
    request = require('request'),
    mongo = require('mongodb'),
    gridstore = mongo.GridStore,
    config = require('./config.js');

var DataProvider = require('../server/db-provider').DataProvider;
var options = require('../server/db-settings');


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


//var dataProvider;
_.each(config.sites, function (value, key) {
    _.each(value, function (element, index) {
        new DataProvider(options, function(){
            var dataProvider = this;
            parseFeed(element, dataProvider, CATEGORY_MAP[key]);
            console.log(CATEGORY_MAP[key], element);
        });
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

    request(feedurl, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            feedparser.parseString(body, function(error, meta, articles){

                if (error) {
                    console.error(error);
                    dataProvider.db.close();
                } else {
                    //console.log(meta);
                    console.log("category", category);

                    dataProvider.db.collection("posts", function (error, collection) {

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


                            // getTags(article.link, function(keywords){
                            // 	console.log("curent id is " +id + ", and tags is " + keywords);

                            // 	collection.update({
                            // 		link: article.link
                            // 	}, { $set:{ tags: keywords }
                            // 	}, function(){
                            // 		console.log("Updated tags for id " + id);

                            // 	});
                            // });

                            //insert images to db
//                          storeImage(filename, imgurl);


                        });
                    });
                    dataProvider.db.close();
                    console.log("close db connection");
                }
            });
        }
    });
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