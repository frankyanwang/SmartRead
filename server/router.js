var _ = require('underscore');

var PM = require('./controllers/post-manager');
var AM = require('./controllers/account-manager');
var EM = require('./controllers/email-manager');
var IM = require('./controllers/invitation-manager');
var EventMgr = require('./controllers/event-manager');

var Utils = require('./server_utils');
var ADMIN_USER = require('./admin-users').adminUsers;

module.exports = function(app) {

    app.get('/stories', function(req, res){
        var category = Utils.getCategoryMapping()[req.query['category']];
        console.log("category: ", category);
        authenticate(req, res, function(){
            if(category){
                PM.findByCategory(category, function(err, items){
                    if(err){
                        console.log(err);
                    }else{
                        res.send(items);
                    }
                });
            }else{
                PM.findAll(req.session.user.user, function(err, items){
                    if(err){
                        console.log(err);
                    }else{
                        res.send(items);
                    }
                });
            }
        });
    });

    // This is not used now
//    app.get('/stories/:id', function(req, res){
//        authenticate(req, res, function(){
//            var storyId = req.params.id;
//            PM.findById(storyId, function(err, story){
////                console.log(req.session.user);
////                console.log("Story: ", story);
//                var userId = req.session.user._id;
//                var userName = req.session.user.user;
//                var tags = story.tags;
//                EventMgr.insert(userId, userName, storyId, tags, function(){
//                    //don't care for now success or fail.
//                });
//                res.send(200, story);
//            });
//        });
//    });

    // For admin use only
    app.get('/admin-stories', function(req, res){
        var category = Utils.getCategoryMapping()[req.query['category']];
        console.log("category: ", category);
        authenticate(req, res, function(){
            authorize(req, res, function(){
                if(category){
                    PM.findByCategoryForAdmin(category, function(err, items){
                        if(err){
                            console.log(err);
                        }else{
                            res.send(items);
                        }
                    });
                }else{
                    PM.findAllForAdmin(function(err, items){
                        if(err){
                            console.log(err);
                        }else{
                            res.send(items);
                        }
                    });
                }
            });

        });
    });

    app.get('/admin-stories/:id', function(req, res){
        authenticate(req, res, function(){
            authorize(req, res, function(){
                var storyId = req.params.id;
                PM.findById(storyId, function(err, story){
                    var userId = req.session.user._id;
                    var userName = req.session.user.user;
                    var tags = story.tags;
                    EventMgr.insert(userId, userName, storyId, tags, function(){
                        //don't care for now success or fail.
                    });
                    res.send(200, story);
                });
            });

        });
    });


//    app.post('/posts', PM.addPost);
    app.put('/admin-stories/:id', function(req, res){
        authenticate(req, res, function(){
            authorize(req, res, function(){
                PM.updatePost(req, res);
            });
        });

    });

    app.delete('/admin-stories/:id', function(req, res){
        authenticate(req, res, function(){
            authorize(req, res, function(){
                PM.deletePost(req, res);
            });
        });
    });

    app.post('/login', function(req, res){
        AM.manualLogin(req.param('user'), req.param('pass'), function(e, account){
            if (!account){
                console.log("*****",req.param('user'));
                res.send(e, 400);
            }	else{
                console.log("*****","login success");
                req.session.user = account;
                if (req.param('remember-me') == 'true'){
                    res.cookie('user', account.user, { maxAge: 900000 });
                    res.cookie('pass', account.pass, { maxAge: 900000 });
                }
                res.send(200, Utils.filterSessionUser(req.session.user));
            }
        });
    });

    app.post('/logout', function(req, res){
        res.clearCookie('user');
        res.clearCookie('pass');
        req.session.destroy(function(e){ res.send(200,{status: "success"}); });
    });

    app.get('/session', function(req, res){
        authenticate(req, res, function(){
            res.send(200,Utils.filterSessionUser(req.session.user));
        });
    });

    app.post('/signup', function(req, res){
        IM.getEmail(req.param('email'), function(o){
            if (o){
                if(o.isInvited){
                    AM.signup({
                        name 	: req.param('name'),
                        email 	: req.param('email'),
                        user 	: req.param('user'),
                        pass	: req.param('pass')
                    }, function(e){
                        if (e){
                            res.send(e, 400);
                        }	else{
                            AM.manualLogin(req.param('user'), req.param('pass'), function(e, account){
                                if (!account){
                                    res.send(e, 400);
                                }	else{
                                    req.session.user = account;
                                    res.send(200, Utils.filterSessionUser(req.session.user));
                                }
                            });
                        }
                    });
                }else{
                    res.send('email-not-invited-yet', 400);
                }
            }	else{
                res.send('email-not-found-in-invite', 400);
            }
        });
    });

    app.get('/lost-password', function(req, res){
        // look up the user's account via their email //
//        AM.getEmail(req.param('email'), function(o){
        AM.getEmail("frankyanwang@gmail.com", function(o){
            if (o){
                EM.dispatchResetPasswordLink(o, function(e, m){
                    // this callback takes a moment to return //
                    // should add an ajax loader to give user feedback //
                    if (!e) {
                        	res.send('ok', 200);
                    }	else{
                        res.send('email-server-error', 400);
                        for (k in e) console.log('error : ', k, e[k]);
                    }
                });
            }	else{
                res.send('email-not-found', 400);
            }
        });
    });

    app.post('/require-invite', function(req,res){
        IM.requireInvite(req.param('email'),function(e){
            if(e){
                res.send(e,400);
            }else{
                res.send('ok',200);
            }
        });

    });

    //=========  Admin Only Request ===========================================
    app.get('/invite-users', function(req,res){
        authenticate(req, res, function(){
            authorize(req, res, function(){
                IM.getAllRecords(function(e, invites){
                    if(e){
                        res.send('no records found',200);
                    }else{
                        res.send(200,invites);
                    }
                });
            });
        });
    });

    app.post('/email-invite', function(req,res){
        authenticate(req, res, function(){
            authorize(req, res, function(){
                console.log("email",req.param('email'));
                IM.getEmail(req.param('email'), function(o){
                    if (o){
                        EM.dispatchSignupLink(o.email, function(e, m){
                            // this callback takes a moment to return //
                            // should add an ajax loader to give user feedback //
                            if (!e) {
                                _.extend(o,{isInvited: true});
                                IM.update(o,function(){
                                    res.send('ok', 200);
                                });
                            }	else{
                                res.send('email-server-error', 400);
                                for (k in e) console.log('error : ', k, e[k]);
                            }
                        });
                    }	else{
                        res.send('email-not-found', 400);
                    }
                });
            });
        });

    });

    //=========================================================================
    app.get('*', function(req, res) {
        res.send("oops! page not found", 404);

    });

};

function authenticate(req, res, callback){
    if(req.session.user != null){
        console.log("****6", req.session.user);
        callback();
        return;
    }

    if (req.cookies.user === undefined || req.cookies.pass === undefined){
        Utils.log(req.cookies);
        Utils.log(1);
        res.send(401,"unauthorized");
    }	else{
        Utils.log(req.cookies);
        Utils.log(2);
        // attempt automatic login //
        AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
            Utils.log(3);
            if (o != null){
                Utils.log(4);
                req.session.user = o;
                callback();
            }	else{
                Utils.log(5);
                res.send(401,"unauthorized");
            }
        });
    }
}

function authorize(req, res, callback){
    if(req.session.user != null && _.indexOf(ADMIN_USER, req.session.user.email) > -1){
        callback();
    }else{
        res.send(401,"unauthorized action");
    }
}

