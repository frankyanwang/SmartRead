var request = require('request');
var cheerio = require('cheerio');
var Iconv  = require('iconv-jp').Iconv;
var mongo = require('mongodb');
var DataProvider = require('../server/db-provider').DataProvider;


var url = 'http://top.sogou.com/hotword0.html' 
request(url, function(err, resp, body){
    //var covertedBody = new Iconv('gb2312', 'utf8').convert(body);
    $ = cheerio.load(body);
    var hotlist = $('div .hotlist');
    var ul = $(hotlist).children('ul');
    i=0;
    $('li', $(ul)).each(function(i, elem){
        console.log($(elem).children('a').text());
        new DataProvider({auto_reconnect: false}, function(err, dataProvider){
            if(err){
                console.log(err, " Exit!");
            }else{
                dataProvider.db.collection("tags", function (err, collection){
                    if(err){
                        console.log("insert into tags", err);
                    }else{
                        collection.update({
                            name:$(elem).children('a').text()
                        }, {
                            name:$(elem).children('a').text()
                        }, {
                            upsert:true
                        }, function () {
                            console.log("successfully insert tag into tags");
                        });
                    }
                });
            }
            dataProvider.db.close();
            console.log("close db connection");
        });
    });
});

