var mongo = require('mongodb');

var bcrypt = require('bcrypt');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var dbPort = global.port;
var dbHost = global.host;
var dbName = global.dbname;

var moment = require('moment');

var IM = {};

IM.db = new Db(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}, {}));
IM.db.open(function(err, db){
    if(!err) {
        console.log("Connected to 'smartreaddb' database");
    }else{
        console.log(err);
    }

    IM.invites =  IM.db.collection('invites');
});

module.exports = IM;

IM.requireInvite = function(email, callback)
{
    IM.invites.findOne({email:email}, function(e, o) {
        if (o){
            callback('email already existed.');
        }else{
            IM.invites.insert({
                email: email,
                accountId: undefined,
                isInvited: false
            },function(err, result) {
                if (err) {
                    //TODO log it.
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
};

//List all of the entries from invites collection.
IM.listAllInvitees = function(){


};

//List only the entries whos' invitation email not been sent out yet.
IM.listUninvitees = function(){

};