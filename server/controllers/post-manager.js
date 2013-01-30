var NUM_STORIES = 100;

var _ = require('underscore');
var DataProvider = require('../db-provider').DataProvider;
var Utils = require('../server_utils');

var BSON = require('mongodb').BSONPure;

var PM = {};

var dp = new DataProvider();

PM.db = dp.db;
PM.posts =  PM.db.collection('posts');
PM.topStories =  PM.db.collection('top_stories');
PM.userStories =  PM.db.collection('user_stories');


module.exports = PM;

PM.findById = function(storyId, callback) {
    PM.topStories.findOne({'_id':new BSON.ObjectID(storyId)}, function(err, item) {
        if (err){
            callback('story-not-found');
        }	else{
            callback(null, item);
        }
    });
};

//PM.findAll = function(req, res) {
PM.findAll = function(userName, callback) {
    var startTime = new Date().getTime();
    PM.userStories.findOne({user: userName}, function(err, item) {
        if(err){
            console.log("query user_stories collection failed: ", err);
            callback("query_failed");
        }else{
            Utils.logTime("query user stories", startTime);
            if(item === null){
                console.log("find by regular top_stories!");
                PM.topStories.find().sort({score:-1,pubDate:-1}).limit(NUM_STORIES).toArray(function(err, items) {
                    Utils.logTime("query top stories", startTime);
                    _.each(items, function(value, index){
                        value['pubDate'] = Utils.getTimeAgo(value['pubDate']);
                        value['content'] = null;
                    });
                    Utils.logTime("modify each story", startTime);
                    callback(null, items);
                    Utils.logTime("Total FindAll time spent", startTime);
                });
            }else{
                console.log("find by user own top_stories!");
//            console.log("index : ", item.index);
//            console.log("index : ", item.list);
                var ids = _.map(item.index, function(score, storyId){ return new BSON.ObjectID(storyId); });
                Utils.logTime("map ids to BSON objectID", startTime);

                ids = _.first(ids, NUM_STORIES);
                Utils.logTime("chop first num stories", startTime);
//                console.log("ids : ", ids);

                PM.topStories.find({_id: {$in: ids}}).limit(100).toArray(function(err, items) {
                    Utils.logTime("query top stories", startTime);
                    _.each(items, function(value, index){
                        value['pubDate'] = Utils.getTimeAgo(value['pubDate']);
                        value['score'] = item.index[value['_id']];
                        value['content'] = null;
//                    console.log(value['_id']);
                    });
                    Utils.logTime("modify each story", startTime);
                    items = _.sortBy(items, function(item){
                        return -item['score'];
                    });
                    Utils.logTime("sort story by score", startTime);
                    callback(null, items);
                    Utils.logTime("Total FindAll time spent", startTime);
                });
            }
        }
    });
};

PM.findByCategory = function(category, callback){
    var startTime = new Date().getTime();
    PM.topStories.find({category: category}).sort({score:-1,pubDate:-1}).limit(NUM_STORIES).toArray(function(err, items) {
        Utils.logTime("query top stories by category", startTime);
        _.each(items, function(value, index){
            value['pubDate'] = Utils.getTimeAgo(value['pubDate']);
            value['content'] = null;
        });
        Utils.logTime("modify each story", startTime);
        callback(null, items);
        Utils.logTime("Total findByCategory time spent", startTime);
    });
};


//===================================================================
// Admin functions

//PM.addPost = function(req, res) {
//    var post = req.body;
//    console.log('Adding post: ' + JSON.stringify(post));
//    PM.posts.insert(post, {safe:true}, function(err, result) {
//        if (err) {
//            res.send({'error':'An error has occurred'});
//        } else {
//            console.log('Success: ' + JSON.stringify(result[0]));
//            res.send(result[0]);
//        }
//    });
//};
//
PM.updatePost = function(req, res) {
    var id = req.params.id;
    var post = req.body;
    delete post._id;
    console.log('Updating story: ' + id);
    console.log(JSON.stringify(post));
        PM.topStories.update({'_id':new BSON.ObjectID(id)}, post, {safe:true}, function(err, result) {
        if (err) {
            console.log('Error updating story: ' + err);
            res.send({'error':'An error has occurred'});
        } else {
            console.log('' + result + ' document(s) updated');
            res.send(post);
        }
    });
};

PM.deletePost = function(req, res) {
    var id = req.params.id;
    console.log('Deleting story: ' + id);
    PM.topStories.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
        if (err) {
            res.send({'error':'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.send(req.body);
        }
    });
};