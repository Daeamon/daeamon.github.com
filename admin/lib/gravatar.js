function getGravatar( email ) {
  /*if(req.user.email != undefined){
  	// when this becomes dynamic first convert the email string to lower case .toLowerCase()
  	var email_hash = application.lib.md5( req.user.email );
  	res.vars.gravatar = "http://www.gravatar.com/avatar/"+email_hash;
  } else {*/
	// revert to a default image
  	return  "/static/img/gravatar-48.png";
  //}
}


// Expose Library Methods
exports.getGravatar = getGravatar;