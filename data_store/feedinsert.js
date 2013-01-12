var feedparser = require('feedparser'),
    cheerio = require('cheerio'),
	request = require('request'),
	mongo = require('mongodb'),
	gridstore = mongo.GridStore,
	config = require('./config.js');

var DataProvider = require('../server/db-provider').DataProvider;
var options = require('../server/db-settings');

var dataProvider = new DataProvider(options);

function getTags(link, fn){

	request(link, function(error, response, body) {
		if (error) throw error
        var $ = cheerio.load(body);
        fn($('meta[name=keywords]').attr('content'));       
    });

}

function callback(error, meta, articles){
  if (error) {
  	console.error(error);
  } else {
        //console.log(meta);

		dataProvider.db.collection("posts", function(error, collection){
			
        articles.forEach(function (article){


            var $ = cheerio.load(article.description);
            var imgurl = $('img').first().attr('src');
            var id = new mongo.ObjectID();

            var filename;
            if (imgurl) {
				filename = id + '.' + imgurl.split('.').pop();		
			}

            collection.update({
                guid: article.guid
            }, {
                _id: id,
                source: meta.title,
                name: article.title,
                link: article.link,
                description: cheerio.load(article.description)('p').text(),
                content: article.description,
                pubDate: article.pubdate,
                date: article.date,
                guid: article.guid,
                author: article.author,
                comments: article.comments,
                tags: article.categories,
                picture: imgurl
            }, {
                upsert: true
            }, function(){
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
              // Open a new file
 				var gs = new gridstore(dataProvider.db, filename, 'w');

 				// Open the new file
 				gs.open(function(err, gridStore) {

   					// Write the file to gridFS
	   				gs.writeFile(imgurl, function(err, doc) {
	   					console.log('image ' + filename + ' inserted into gridstore.');
	   				});
 				});


        });
    });
    dataProvider.db.close();
  }//else
}//callback


function parsefeed(feedurl){
	request(feedurl, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    feedparser.parseString(body, callback);
	  }
	});
}

parsefeed(config.sites.tech.url1);

// for(var i in config.sites.tech) {
//     if (config.sites.tech.hasOwnProperty(i)) {
//         parsefeed(config.sites.tech[i]);
//     }
// }