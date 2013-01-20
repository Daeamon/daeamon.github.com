application.routes.root("index#home");
application.routes.match("/login","index#login", {via:"get,post"});
application.routes.match("/logout","index#logout");

// resources generates the following
// resourceful routes i.e
// GET /apps -> apps.index
// GET /apps/:id -> app.show
// GET /apps/new ->  app.new
// GET /apps/:id/edit ->  app.edit
// POST /apps -> app.create
// PUT /apps/ -> app.update
// DEL /apps/:id -> app.delete
application.routes.resources("app");
application.routes.match("/apps/*/delete","apps#delete", {via:"get,post,delete"});

application.routes.resources("appdomain");
//application.routes.match("/module/install/*","modules#install");
//application.routes.match("/module/update/*","moduless#update");
//application.routes.match("/module/uninstall/*","moduless#uninstall");

// GET /users/:id -> user.show
// GET /users/:id/edit ->  user.edit
application.routes.resources("user");