function getLanguage( lng ){ 
	// currently just a static JSON - could become an API call...
	var text = {
		"en" : {
  			"login" : { "title" : "Login | Nodester Admin Panel"}
  		, "home" : { "title" : "Nodester Admin Panel"}
  		, "app" : { "title" : "App | Nodester Admin Panel"}
  		, "500" : { "title" : "Server Error"}
		}
	};
  return text[ lng ];
}

// Expose Library Methods
exports.getLanguage = getLanguage;
