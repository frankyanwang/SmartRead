module.exports = function(app, express) {

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.compress());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'super-duper-secret-secret' }));
    app.use(express.methodOverride());
    app.use(express.static(app.root + '/public'));
//    app.use(function(req, res, next) {
//        res.contentType('application/json');
//        next();
//    });
});

}