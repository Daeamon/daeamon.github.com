/**
 * Application.js
 * Always Executed first, here you can specify middleware/functions
 * which might be reused over different controllers
 */
 
/**
 * Checks whether User is logged in
 */
function checkAuth(req,res,next) {
  req.is_logged = false;
  req.user = {};
  
  if (req.session && req.session.cred) {
    // get from session
    console.log('user logged in');
    req.user = req.session.cred;
    req.is_logged = true;
  }
  
  // req.is_logged = true;
  // req.user = {
  //     creds: "user:pass",
  //     user: "user"
  // }
  
  // Default Vars
  // NOTE: Do not Override res.vars by initializing it as a new object
  // Usage res.vars.foo = "bar"
  res.vars = {
      is_logged: req.is_logged
    , user: req.user.user
    , action: req.query.action
  }
  
  next();
}

/**
 * Redirects to Login Page if User is not logged in
 */
function redirectIfNotLoggedIn(req,res,next) {
  if (!req.is_logged) {
    res.redirect("/login");
    return;
  } else {
    next();
  }
}
 
/**
 * Gets Language
 */
function getLanguage(req,res,next) {
  res.vars.text = application.lib.getLanguage("en");
  next();
}

/**
 * Gets Gravatar
 */
function getGravatar(req,res,next) {
  res.vars.gravatar = application.lib.getGravatar("user@nodester.com");
  next();
}

application.middleware.checkAuth = checkAuth;
application.middleware.redirectFailedAuth = redirectIfNotLoggedIn;
application.middleware.getLanguage = getLanguage;
application.middleware.getGravatar = getGravatar;