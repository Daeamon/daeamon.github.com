var nodester_api_prefix = "npm";

module.exports = {
  // Before Filters to be run
  before_filter: [
      [application.middleware.checkAuth]
    , [application.middleware.redirectFailedAuth]
    , [application.middleware.getLanguage]
  ],
  
  index: function(req,res,next) {
      res.render("index");
  },
  
  install: function(req,res,next) {
      application.lib.request(req.method
      , nodester_api_prefix
      , req.body
      , req.user.creds
      , function(response) {
    	  	res.render("install", {
           layout: false
          });
        }
    );
  }, 
  
  update: function(req,res,next) {
      application.lib.request(req.method
      , nodester_api_prefix
      , req.body
      , req.user.creds
      , function(response) {
    	  	res.render("update", {
           layout: false
          });
        }
    );
  }, 
  
  uninstall: function(req,res,next) {
      application.lib.request(req.method
      , nodester_api_prefix
      , req.body
      , req.user.creds
      , function(response) {
    	  	res.render("uninstall", {
           layout: false
          });
        }
    );
  }
      
}