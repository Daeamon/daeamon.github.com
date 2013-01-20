var nodester_api_prefix = "app";

module.exports = {
  // Before Filters to be run
  before_filter: [
      [application.middleware.checkAuth]
    , [application.middleware.redirectFailedAuth]
    , [application.middleware.getLanguage]
  ],
  
  'show': function(req,res,next) {
    var appname = res.vars.appname = req.route.params["id"];
    application.lib.request(req.method
      , nodester_api_prefix + "/" + appname
      , {}
      , req.user.creds
      , function(response) {
    	  	res.vars.app = response;
    		  res.render("app/show");
        }
    );
  }, 
  
 'edit': function(req,res,next) {
	var appname = res.vars.appname = req.route.params["id"];
	application.lib.request(req.method
	  , nodester_api_prefix + "/" + appname
	  , {}
	  , req.user.creds
	  , function(response) {
		  res.vars.app = response;
		  res.render("app/edit");
		  }
	);
  },
  
  'new': function(req,res,next) {
		res.render("app/new", {
			layout: false
		});
  }, 
  
  'create': function(req,res,next) {
	var appname = res.vars.appname = req.body.appname;
	application.lib.request(req.method
      , nodester_api_prefix
      , req.body
      , req.user.creds
      , function(response) {
		  res.vars = response;
		  // available in views: 
		  // appname, status, port, gitrepo, start, running, pid
		  res.render("app/create", {
           layout: false
          });
        }
    );
  },
  
  'update': function(req,res,next) {
	  console.log("______________________________________________", req.body);
	  application.lib.request(req.method
	  , nodester_api_prefix
	  , req.body
	  , req.user.creds
	  , function(response) {
		  res.vars.app = response;
		  res.render("app/update", {
           layout: false
          });
		}
	);
  },
    
  'delete': function(req,res,next) {
	  // res.render();
	  if( req.method == "DELETE" ) {
	  var appname = res.vars.appname = req.route.params[0];
	  application.lib.request(req.method
	  , nodester_api_prefix
      , req.body
      , req.user.creds
      , function(response) {
		  res.vars.app = response;
		  res.render("app/delete", {
           layout: false
          });
        }
    	); 
	  } else {
		  var appname = res.vars.appname = req.route.params[0];
		  res.render("app/delete-confirmation", {
           layout: false
          });
	  }
  }
  
}