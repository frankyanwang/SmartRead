var feedparser = require('feedparser'),
    cheerio = require('cheerio'),
	request = require('request'),
	mongo = require('mongodb'),
	gridstore = mongo.GridStore,
	config = require('./config.js'),
	host = require('./config.js').host,
	port = require('./config.js').port,
	db = new mongo.Db("smartreaddb", new mongo.Server(host, port, {}), {safe:false});

function getTags(link, fn){

	request(link, function(error, response, body) {
		if (error) throw error
        var $ = cheerio.load(body);
        fn($('meta[name=keywords]').attr('content'));       
    });

};

function callback(error, meta, articles){
  if (error) {
  	console.error(error);
  } else {

	db.open(function(error){

		console.log("connected " + host + ":" + port);

		db.collection("posts", function(error, collection){
			
		    articles.forEach(function (article){

                console.log(article);

		  //   	request(article.link, function(error, response, body) {
    //     			var $ = cheerio.load(body);
    //       			tags = $('meta[name=keywords]').attr('content');
    //   			});
				// //var tags = getTags(article.link);

				// (function getTags(){

				// 	var tags;
				// 	request(article.link, function(error, response, body) {
				// 		if (error) throw error
				// 	    var $ = cheerio.load(body);
				// 	    tags = $('meta[name=keywords]').attr('content');
					       
				// 	});
				// 	console.log(tags);
				// 	return tags;
				// } ());


			    	// request(article.link, function(error, response, body) {
	       //  			var $ = cheerio.load(body);
	       //    			var tags = $('meta[name=keywords]').attr('content');

	       //    			collection.findAndModify({_id:id}, {$set:{tags:tags}}, function(error, doc){
	       //    				console.log("tags added!");
	       //    			});
	      	// 		});	



  				var $ = cheerio.load(article.description);
			    var imgurl = $('img').first().attr('src');
				var id = new mongo.ObjectID();
				var filename = id + '.' + imgurl.split('.').pop();	
				
				collection.update({
					guid: article.guid
				}, {
					_id: id,
					source: meta.title,
					name: article.title,
					link: article.link,
					description: article.summary,
					content: article.description,
					pubDate: article.pubdate,
					date: article.date,
					guid: article.guid,
					author: article.author,	
					comments: article.comments,
					tags: article.categories,
					//: config.category[meta.link],
					//tags: "",
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

feedparser.parseUrl(config.sites.tech.url1, callback);
// for(var i = 0; i <urllist.length; i++){
// 	feedparser.parseUrl(urllist[i], callback);
// }

//console.log(config.divimg["http://www.ifanr.com"]);
//console.log(config.sites.tech.link3);