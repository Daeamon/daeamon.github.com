module.exports.setConfig = function(express, app) {
  
  //app.port = process.env['app_port'];
  app.port = 11220;
  //app.name = "nodester_admin";
  app.name = "cp";
  
  app.configure(function() {
    app.set('views', process.env['app_dir'] + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({key :"ns",secret: "keyboard cat" }));
    app.use(app.router);
    app.use("/static/", express.static( process.env['app_dir'] + '/public/',{ maxAge: "6000000" }));
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  });

  app.configure('production', function(){
    //app.use(express.errorHandler()); 
  });
  
  // Error 500
  app.error(function(err, req, res){
    res.render('500', {is_logged: false, title: "500 Error",status: 500});
  });
  
  // Example 404 page via simple Connect middleware
  app.use(function(req, res){
    res.render('404', {title: "404 Error",status: 404});
  });
  
  console.log("Server Listening at port ", app.port)  
  
  app.listen(app.port);
}