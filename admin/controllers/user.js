module.exports = {
  // Before Filters to be run
  before_filter: [
      [application.middleware.checkAuth]
    , [application.middleware.redirectFailedAuth]
    , [application.middleware.getLanguage]
    , [application.middleware.getGravatar]
  ],
  
  'show': function(req,res,next) {
	var username = req.user.user || "";
	//var appname = res.vars.appname = req.route.params["id"];
    //application.lib.request(req.method
    //  , nodester_api_prefix + "/" + appname
    //  , {}
    //  , req.user.creds
    //   , function(response) {
    // 	  	res.vars.app = response;
   	res.vars.username = username;
    res.render("show");
    //    }
    // );
  },
  
  'edit': function(req,res,next) {
	var username = res.vars.username =  req.user.user || "";
    res.render("edit");
  }
      
}