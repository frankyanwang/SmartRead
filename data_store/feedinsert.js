var feedparser = require('feedparser'),
    cheerio = require('cheerio'),
    request = require('request'),
	mongo = require('mongodb'),
	gridstore = mongo.GridStore,
	config = require('./config.js'),
	host = require('./config.js').host,
	port = require('./config.js').port,
	db = new mongo.Db("smartreaddb", new mongo.Server(host, port, {}), {safe:false});

//var tags;
// function getTags(link){

// 	var tags;
// 	request(link, function(error, response, body) {
// 		if (error) throw error
//         var $ = cheerio.load(body);
//         tags = $('meta[name=keywords]').attr('content');
       
//     });
//     console.log(tags);
//     return tags;
// };

function callback(error, meta, articles){
  if (error) {
  	console.error(error);
  } else {

	db.open(function(error){

		console.log("connected " + host + ":" + port);

		db.collection("posts", function(error, collection){
			
		    articles.forEach(function (article){

		  //   	request(article.link, function(error, response, body) {
    //     			var $ = cheerio.load(body);
    //       			tags = $('meta[name=keywords]').attr('content');
    //   			});
				// //var tags = getTags(article.link);

  				var $ = cheerio.load(article.description);
			    var imgurl = $('img').first().attr('src');
				var id = new mongo.ObjectID();
				var filename = id + '.' + imgurl.split('.').pop();	
				
				collection.update({
					pubdate: article.pubdate,
					guid: article.guid
				}, {
					_id: id,
					source: meta.title,
					name: article.title,
					link: article.link,
					description: article.summary,
					content: article.description,
					pubDate: article.pubdate,
					guid: article.guid,
					author: article.author,	
					comments: article.comments,
					//: config.category[meta.link],
					//keywords: tags,
					picture: imgurl				
				}, {
					upsert: true
				}, function(){
					console.log(id + " with url=" + article.guid + " successfully inserted or updated!");					
				});	

				//insert images to db
				  // Open a new file
  				var gs = new gridstore(db, filename, 'w');

  				// Open the new file
  				gs.open(function(err, gridStore) {

    				// Write the file to gridFS
    				gs.writeFile(imgurl, function(err, doc) {
    					console.log('image ' + filename + ' inserted into gridstore.');
    				});
  				});


		    });
			db.close();	
		});

	});//open
  }//else
}//callback

feedparser.parseUrl(config.sites.tech.url2, callback);
// for(var i = 0; i <urllist.length; i++){
// 	feedparser.parseUrl(urllist[i], callback);
// }

//console.log(config.divimg["http://www.ifanr.com"]);
//console.log(config.sites.tech.link3);