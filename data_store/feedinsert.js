var feedparser = require('feedparser'),
    cheerio = require('cheerio'),
	mongo = require('mongodb'),
	gridstore = mongo.GridStore,
	config = require('./config.js'),
	host = require('./config.js').host,
	port = require('./config.js').port,
	db = new mongo.Db("newstest", new mongo.Server(host, port, {}), {safe:false});


function callback (error, meta, articles){
  if (error) {
  	console.error(error);
  } else {

	db.open(function(error){

		console.log("connected " + host + ":" + port);

		db.collection("story", function(error, collection){
			
		    articles.forEach(function (article){

  				var $ = cheerio.load(article.description);
 
			    //console.log($('img').first().attr('src') + '\n');
			    var imgurl = $('img').first().attr('src');
				var id = new mongo.ObjectID();
				var filename = id + '.' + imgurl.split('.').pop();	
				
				collection.update({
					pubdate: article.pubdate,
					guid: article.guid
				}, {
					_id: id,
					source: meta.title,
					title: article.title,
					link: article.link,
					summary: article.summary,
					description: article.description,
					pubdate: article.pubdate,
					guid: article.guid,
					author: article.author,	
					comments: article.comments,
					category: config.category[meta.link],
					image: imgurl				
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

feedparser.parseUrl(config.sites.tech.url1, callback);
// for(var i = 0; i <urllist.length; i++){
// 	feedparser.parseUrl(urllist[i], callback);
// }

//console.log(config.divimg["http://www.ifanr.com"]);
//console.log(config.sites.tech.link3);