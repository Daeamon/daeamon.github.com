var Express = null
  , App = null
  , Fs = require('fs')
  , Inflection = require('./inflection')
  , app_dir = process.env['app_dir']
    CONTROLLERS = {};

// Others
var resource_urls = ["index","new","create","edit","update","destroy","show"];

// Lokki Framework
var LokkiFramework = function(appname) {
  this._libs = "";
}

// Lokki Framework Init
LokkiFramework.prototype.init = function(cb) {
  console.log("going to boot lokki mvc"); 
  // Boot Libraries
  this._libs = bootLibs();
  // Create Global Namespace using application name
  // NOTE : Checks required to make sure programming constructs
  // are not used as app name
  GLOBAL["application"] = {lib: this._libs, routes:methods, middleware: {}, vars: {}};
  // Execute Callback
  if(typeof cb === 'function')
    cb(GLOBAL["application"]);
    
  // Boot Controllers
  // Loads the controller and its actions
  // NOTE : Add Before Filters
  bootControllers();
  // Boot Routes
  bootRoutes();
}

// Route Methods exposed by Namespace
var methods = {
  // For Root
  root:function(route) {
    var route_split = route.split("#")
      , temp_route = Inflection.singularize(route_split[0])
      , controller_name = temp_route === undefined ? route_split[0] : temp_route
      , controller_name_plural = Inflection.pluralize(controller_name)
      , action = route_split[1]
      , actions = CONTROLLERS[controller_name];
    
    // if controller or action is not valid i.e function
    // not found, throw error
    if(!actions[action].fn) throw("action not found");
    
    var fn = controllerAction(controller_name,controller_name_plural,action,actions[action].fn);
    // Generate Routes
    App.get("/", actions[action].filters, fn);
  },
  // Generic Match
  match: function(url,route,params) {
    var defaults = merge({via:"get"}, params || {})
      , route_split = route.split("#")
      , temp_route = Inflection.singularize(route_split[0])
      , controller_name = temp_route === undefined ? route_split[0] : temp_route
      , controller_name_plural = Inflection.pluralize(controller_name)
      , action = route_split[1]
      , actions = CONTROLLERS[controller_name]
      , prefix = (url[0] != "/") ? "/" + url : url;
    
    // Need to check whether prefix contains    
    // url :id in proper format
            
    // if controller or action is not valid i.e function
    // not found, throw error
    if(!actions[action].fn) throw("action not found");
    
    var fn = controllerAction(controller_name,controller_name_plural,action,actions[action].fn);
    // Generate Routes
    generate_routes(action,defaults.via,prefix,actions[action].filters, fn);
  },
  
  resources: function(controller_name,params) {
    var actions = CONTROLLERS[controller_name]
      , controller_name_plural = Inflection.pluralize(controller_name)
      , prefix = "/" + controller_name_plural
      , params = params || {}
      , controller_actions = Object.keys(actions);
    // if params.as present
    if(params.as)
      prefix = (params.as.length === 1 && params.as[0] === "/") ? "" : 
               (params.as.length > 1 && params.as[0] === "/") ? params.as : 
               "/" + params.as;
    // Get all actions in controller
    resource_urls.map(function(action) {
      // action is not before_filter
      // and action is part of resource_urls
      if(controller_actions.indexOf(action) != -1) {
        var fn = controllerAction(controller_name,controller_name_plural,action,actions[action].fn);
        // Generate Respective Route
        generate_routes(action, "get", prefix, actions[action].filters, fn);
      }
    });
  }
}

/**
 * Generates Express Routes
 *
 * @param action (string) - controller action
 * @param method (Array) - Supported VERBs for that action
 * @param prefix (string) - url prefix
 * @param before_filter (Array) - Array of before filters to be attached
 * @param fn (function) - controller file name
 * @return actions (Object) - Object of actions with filters associated with them
 *
 */
function generate_routes(action, methods, prefix, before_filter, fn) {
  switch(action) {
    case 'index':
      console.log(">>>>>",action, ((prefix === "") ? "/" : prefix), before_filter)
      App.get(((prefix === "") ? "/" : prefix), before_filter, fn);
      break;
    case 'show':
      console.log(">>>>>",action, prefix + '/:id', before_filter)
      App.get(prefix + '/:id',before_filter, fn);
      break;
    case 'new':
      console.log(">>>>>",action, prefix + '/new', before_filter)
      App.get(prefix + '/new',before_filter, fn);
      break;
    case 'create':
      console.log(">>>>>",action, prefix, before_filter)
      App.post(prefix,before_filter, fn);
      break;
    case 'edit':
      console.log(">>>>>",action, prefix + '/:id/edit', before_filter)
      App.get(prefix + '/:id/edit',before_filter, fn);
      break;
    case 'update':
      console.log(">>>>>",action,prefix + '/:id', before_filter)
      App.put(prefix + '/:id',before_filter, fn);
      break;
    case 'destroy':
      console.log(">>>>>",action, prefix + '/:id', before_filter)
      App.del(prefix + '/:id',before_filter, fn);
      break;
    default:
      methods.split(",").forEach(function(method) {
        App[method](prefix,before_filter,fn);
      });
    break;
  }
}

/**
 * Custom Render Method for every action in controller
 *
 * @param name (string) - controller name
 * @param plural (string) - plural version of the controller name
 * @param action (string) - controller action
 * @param fn (function) - function to be bound to a controller action
 * @return fn (function)
 *
 */
function controllerAction(name, plural, action, fn) {
  return function(req, res, next){
    var render = res.render, 
        format = req.params.format, 
        path =  ((name === "app") ? "" : name + '/');
        
    res.render = function(obj, options, fn){
      res.render = render;
      res.vars.controller = name;
      res.vars.action = action;
      options = merge(res.vars || {},options || {});
      console.log("000000->", options)
      // Template path
      if (typeof obj === 'string') {
        if(obj[0] === "/") {
          path = obj.substr(1,obj.length);
        } else {
          path += obj;
        }
        return res.render(path, options, fn);
      } else {
        path += action;
      }
      
      // Expose obj as the "users" or "user" local
      if (action === 'index') {
        options[plural] = obj;
      } else {
        options[name] = obj;
      }
      
      console.log("path ====> " ,path);
      console.log("options ====> " ,options);
      
      return res.render(path, options, fn);
    };
    fn.apply(this, arguments);
  };
}


/**
 * Boots the routes
 *
 */
function bootRoutes() {
  console.log('loading routes => routes.js');
  require(app_dir + "/config/routes");
}


/**
 * Boots the Controller
 *
 */
function bootControllers() {
  // Boot Each Controller
  var files = Fs.readdirSync(app_dir + '/controllers');
  // Load Application Controller First
  require(app_dir + "/controllers/application");
  // Load rest of the controller
  files.forEach(function(file){
    file = file.replace('.js', '');
    console.log('loading controller =>', file);
    if(file != "application") {
      CONTROLLERS[file.replace("_controller","")] = bootController(file);
    }
  });
}


/**
 * Boot Individual Controller
 * Forms Datastructure for controller filters + action for routes
 *
 * @param controller (string) - controller file name
 * @return actions (Object) - Object of actions with filters associated with them
 *
 */
function bootController(controller) {
  var controller_actions = require(app_dir + "/controllers/" + controller),
      before_filters = controller_actions.before_filter||[],
      filters = {},
      actions = [];

  // Remove Before_filters as an action from Controller
  if(before_filters.length > 0) {
    delete controller_actions.before_filter;
  }
        
  // Lets try to create nice Datastructure for every action
  // which includes before filter to be applied with that action
  Object.keys(controller_actions).map(function(action) {
    // Assign Action Function
    actions[action] = {}
    actions[action].fn = controller_actions[action];
    actions[action].filters = [];
    // Run for every action in controller
    // Needs Optimization
    before_filters.map(function(filter) {
      var filter_fn = filter[0] || function(req,res,next) { next(); }
        , args = filter[1] || {}
        , except = args.except ? args.except.split(",") : []
        , only = args.only ? args.only.split(",") : [];
      
      // if this action was found in the except list
      // if this action was not found in the only list
      if (except.length > 0 && except.indexOf(action) != -1) {
        // do nothing
      } else if (only.length > 0 && only.indexOf(action) != -1) {
        actions[action].filters.push(filter_fn);
      } else if (only.length === 0) {
        actions[action].filters.push(filter_fn);
      }
    });
  });
  
  return actions;
}


/**
 * Boots all Library files fron lib folders
 *
 * @return libs (Object) - Object of exposed lib
 *
 */
var bootLibs = function() {
  var libs = {};
  
  var files = Fs.readdirSync(app_dir + '/lib');

  files.forEach(function(file){
    console.log('loading lib =>', file);
    var methods = require(app_dir + "/lib/" + file.replace('.js', ''));
    Object.keys(methods).map(function(method){
      libs[method] = methods[method];
    });
  });
  
  return libs;
}

/**
 * Init App
 * Creates Lokki Obj
 *
 */
var initApp = function() {
  var app_init = 0;
  // Return Closure functon
  return function(name, express, app, cb) {
    // without express, we are nothing ...
    Express = express;
    App = app;
    // Set App Settings
    if(app_init === 0) {
      app_init = 1;
      var lokkiObj = new LokkiFramework(name);
      lokkiObj.init(cb);
      console.log(name + " App is being initialized");      
    } else {
      console.log(name + " App has been already initialized");
    }
  }
};


module.exports.initApp = initApp();


// UTILS
function merge(a, b){
  var keys = Object.keys(b);
  for (var i = 0, len = keys.length; i < len; ++i) {
    var key = keys[i];
    a[key] = b[key]
  }
  return a;
};