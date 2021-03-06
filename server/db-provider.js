var _ = require('underscore');
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var options = require('./db-settings');

module.exports = {

    DataProvider : function(serverOptions, callback) {
        var DEFAULT_SERVER_OPTION = {auto_reconnect: true};
        _.extend(DEFAULT_SERVER_OPTION,serverOptions);
        //store this for later use
        var _parent = this;
        console.log(DEFAULT_SERVER_OPTION);
        //connect to the db
        this.db = new Db(
            options.db,
            new Server(
                options.host,
                options.port,
                {auto_reconnect: DEFAULT_SERVER_OPTION['auto_reconnect']}
            )
        );

        //open the db connection and then authenticate
        this.db.open(function(err) {
            if (err) {
                console.log("db.open.error: ", err);
                if(callback && typeof callback === "function"){
                    callback.call(_parent, "Open DB connection failed!");
                }
            }else{
                if(options.username !== undefined && options.username.length > 0){
                    _parent.db.authenticate(
                        options.username,
                        options.password,
                        function(err) {
                            if (err) {
                                console.log(err);
                                if(callback && typeof callback === "function"){
                                    callback.call(_parent, "Open DB connection failed in authenticate!");
                                }
                            }else{
                                console.log("Connected to 'smartreaddb' database");
                                if(callback && typeof callback === "function"){
                                    callback.call(_parent, null, _parent);
                                }
                            }
                        }
                    );
                }else{
                    console.log("Connected to 'smartreaddb' database, no username provided.");
                    if(callback && typeof callback === "function"){
                        callback.call(_parent,null,_parent);
                    }
                }
            }
        });
    }

//    DataProvider.prototype.close : function()

};