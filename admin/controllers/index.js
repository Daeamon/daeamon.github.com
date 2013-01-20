
module.exports = {
  // Before Filters to be run
  before_filter: [
      [application.middleware.checkAuth]
    , [application.middleware.redirectFailedAuth, {only: "home"}]
    , [application.middleware.getLanguage]
    , [application.middleware.getGravatar]
  ],
  
  home: function(req,res,next) {
    console.log("logged as ", req.user);
		// Request Nodester for Apps List
	  application.lib.request(req.method
	    , "apps"
	    , {}
	    , req.user.creds
	    , function(response) {
	        // If Login Failed
	        if(response.status === "failure") {
	          req.session.destroy();
            res.redirect("/login?action=err");
            return false;
          }
  	      res.vars.applist = response;
  		    res.render("home");
    });
  },
  
  login: function(req,res,next) {
    // If already Logged in
    if(req.is_logged) { 
      console.log("already logged in"); 
      res.redirect("/"); 
      return false; 
    }
    
    // Show Login Form
    if(req.method === "GET") {
      res.render("login");
    } else if(req.method === "POST") { // On Login
      // Validate Input Fields
      if(!req.body.user 
        || req.body.user.user === "" 
        && req.body.user.pass === "") {
        res.redirect("/login?action=incomplete");
        return;
        next();
      }
      // Set Session so he can be authorized and logged in
      req.session.cred = {
          creds: req.body.user.user + ":" + req.body.user.pass
        , user:req.body.user.user
      }
      // Redirect to index
      res.redirect("/");
    }
  },
  
  logout: function(req,res,next) {
    // If already Logged in
    if(!req.is_logged) { 
      console.log("already logged out in"); 
      res.redirect("/"); 
      return false; 
    }
    req.session.destroy(); // destroy cookie session created
    res.redirect("/login"); // redirect to home after delete
  }
    
}