Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

(function($) {
  var curr_page = null;
  
  window.onpopstate = function(e) { 
    if(e.state == undefined)
      return false;
    $("a[href='"+ e.state.uri +"']").trigger('click');
  };
  
// on ready
$(document).ready(function() {

	// tooltips
	$(".git .button img").tooltip();
	$(".app-listing a").tooltip();
	$(".actions a").tooltip();

	// initiate copy to clipboard
	$('.git .button').zclip({
		path:'/static/swf/ZeroClipboard.swf',
		copy:function(){return $(this).next("input").val();}
	});

	  // cache some doms
	  var $loader = $("#loader"),
	      $content_area = $("#content_area");
	  // create the modal
	  //$("body").append('<div id="modal"><!-- --></div>');
	  

	  // Main Links
	  // Apps List
	  // AppDomain List
		$("a[rel='ajaxify_menu']").click(function(e) {
		  // show loader first
			e.preventDefault(); // prevent default
			// init vars
			var $this = $(this),
			    href = $this.attr("href"), // get href from a
			    curr_page = {uri: href, path: Helper.getPath(href)};
			    
			//remove active class
			$(".lnav .active").removeClass("active"); 
			// push state of page
			// NOTE : have to remove this for back button
			history.pushState(curr_page, null, curr_page.uri);
			// add active class
			$this.parent().addClass("active"); 
			// fadeout tree
			$content_area.fadeOut('fast', function() {
			  // show loader
			  $loader.fadeIn('fast');
			});
			
			AjaxHelpers.main(curr_page, function(template) {
  			// hide loader, but show table
  			$loader.fadeOut('fast', function() {
  			  $content_area.html(template).fadeIn("fast");
  			}); // hide loader
			});
			
			return false;
		}); // end onclick
		
		// default view to be loaded
		if(window.location.pathname == "/")
      $("a[href='/apps']").trigger('click');
		  
	}); // end doc ready
	
	// Click event for links with method=PUT
	// Methods
	// Update User
	// curl -X PUT -u "testuser:123" -d "password=test" http://api.nodester.com/user
  // curl -X PUT -u "testuser:123" -d "rsakey=1234567" http://api.nodester.com/user	
  // Change application details (start|stop|restart) and app_details
  // curl -X PUT -u "testuser:123" -d "appname=a&running=true" http://api.nodester.com/app
  // curl -X PUT -u "testuser:123" -d "appname=a&start=hello1.js" http://api.nodester.com/app
	$("a[rel='put']").live("click", function(e) {
	  e.preventDefault();
	  var $this = $(this),
	      href = $this.attr("href"),
	      actionText = $this.text(),
	      $allRels = $("a[rel='put']"), 
		  $modal = $("#modal");
	      
	  // remove put from rel --- temporary
	  $allRels.removeAttr("rel");
	  $this.html(Helper.inlineLoader($this));
	  // send ajax request
	  
	  $.ajax({
	    url: href,
	    type:"PUT",
	    data: $this.attr("data-params"),
	    success:function( response ) {
		  $modal.modal(
            {content: response, 
              onOpen: function() {
               
              } // onopen
    	    }); //end modal
			
			/*
	      if(r.status == "success") {
	        // if restart was clicked
	        if(actionText == "restart") return;
	        
  	      // since href can be /apps or /appdomains
  	      switch(href.split("/")[1]) {
  	        case 'app':
  	          var $tRow = $this.parent().parent().parent(),
  	              opts = {},
  	              appname = $tRow.find(".appname").text();
  	          
  	          if(r.running == "true")
  	            opts = {
  	              "statusText" : "running",
  	              "action" : "stop",
  	              "data-params" : "appname=" + appname +"&running=false"
  	            }
  	          else
  	            opts = {
  	              "statusText" : "stopped",
  	              "action" : "start",
  	              "data-params" : "appname=" + appname +"&running=true" 
  	            }
  	          $tRow.find(".status").html(opts["statusText"]); // change status in table
  	          // change data-params
  	          $this.attr("data-params", opts['data-params']);
  	          // change clicked event name
  	          actionText = opts.action;
  	        break;
  	        case 'user':
	        
  	        break;
  	      }
        } else {
          // error
        }*/
	    },
	    // on ajax complete, instill put agin
	    complete:function() {
	      $allRels.attr("rel", "put");
	      $this.html(actionText);
	    }
	  })
	  return false;
	});
	
	
	// Click event for links with method=DELETE
	// Methods
	// Delete App
	// curl -X DELETE -u "testuser:123" -d "appname=test" http://api.nodester.com/app
	// Delete AppDomain
	// curl -X DELETE -u "testuser:123" -d "appname=test&domain=example.com" http://api.nodester.com/appdomains
	$("a[rel='delete']").live("click", function(e) {
	  e.preventDefault();
	  var $this = $(this),
	      href = $this.attr("href"),
	      thisHtml = $this.html(),
	      thisCss = $this.attr("class"),
	      data = $this.attr("data-params"), 
		  //data = JSON.parse($this.attr("data-params")), 
		  $modal = $("#modal");
		  
	  // remove put from rel --- temporary
    $this.removeAttr("rel").removeAttr("class");
    $this.html(Helper.inlineLoader($this)); //loader 
	  $.ajax({
	    url: href,
	    type:"DELETE",
	    data:data,
	    success:function(r) {
	      //if(r.status && r.status == "success") {
	      //  window.location = "/apps";
	      //} else {
	        // error
	      //}
		  $modal.modal(
            {content: r, 
              onOpen: function() {
               
              } // onopen
    	    }); //end modal
			
	    },
      complete:function() {
	      $this.attr("rel", "put").attr("class",thisCss);
	      $this.html(thisHtml);
	    }
	  })
	  return false;
	});
	
	
	// Click event for links with method=POST
	// Methods
	// CREATE App
	// curl -X POST -u "testuser:123" -d "appname=a&start=hello.js" http://api.nodester.com/app
	// Delete AppDomain
	// curl -X DELETE -u "testuser:123" -d "appname=test&domain=example.com" http://api.nodester.com/appdomains
	$("a[rel='post']").live("click", function(e) {
	  e.preventDefault();
	  var $this = $(this),
	      thisHtml = $this.html(),
	      href = $(this).attr("href"),
	      data = JSON.parse($(this).attr("data-params"));
	      // remove put from rel --- temporary
    $this.attr("rel", "");
	  $.ajax({
	    url:"/api" + href,
	    type:"POST",
	    data:data,
	    success:function(r) {
	      
	    }
	  })
	  return false;
	});
	
	/*
	$("a[rel='confirm']").live("click", function(e) {
	  var $modal = $("#modal"),
	      $this = $(this),
	      href = $this.attr("href"),
	      modal_type = $this.attr("class");
	  // prevent default
	  e.preventDefault();
	  // show confitmation
	  $modal.modal(
            {content: response});
	  
	});
	*/
	
	// Click Event to display Modal Box
	// Methods
	// SHow Information about APP
	$("a[rel='modal']").live("click", function(e) {
	  var $modal = $("#modal"),
	      $this = $(this),
	      href = $this.attr("href"),
	      modal_type = $this.attr("class");
	  // prevent default
	  e.preventDefault();
	  // send ajax
	  $.ajax({
      url: href,
      success: function(response) {
          $modal.modal(
            {content: response, 
              onOpen: function() {
                switch(modal_type) {
            	    case 'info':
            	      
            	    break;

            	    case 'app-create':
            	    // form
            	      // bind the create app form
            	      $modal.find(".form").submit(function(e) {
            	        var $this = $(this),// form obj
            	            href = $this.attr("action"),
            	            $err = $this.find("#failed"); 
            	        // hide error box
            	        $err.hide();
            	        $.ajax({
            	          url: "/api/app",
            	          type:"post",
            	          data: {appname:$("#params_appname").val(), start:$("#params_start").val()},
            	          success: function(r) {
            	            if(r.status && r.status == "success") {
            	              $("a[href='/apps']").trigger("click"); // refresh app list
            	              $modal.find(".close").trigger("click"); // close modal box
                          } else {
                            $this.find(".input").addClass("error"); // add error class to text
                            $err.html(r.message).show(); // show error
                          }
            	          }          
            	        });
            	        e.preventDefault;
            	        return false;
            	      }); //end form
                  break;
                } // switch
              } // onopen
    	    }); //end modal
      }
    });
    
    return false;
	});
	
	
	/**
   * AjaxHelpers class here
   * @class
   */
	var AjaxHelpers = {
	  /**
     * Returns template of main links i.e Apps | Domains
     * @function
     * @param page {object} uri of the link to query from
     * @returns {callback} callback with template
     * @lends AjaxHelpers#
     */
	  main: function(page,callback) {
	    // to get the apps|domains list pages
			$.ajax({
				url: page.uri,
				success:function(r) {
				  // if r.status (for errors)
				  // if r.length (if not array or == 0)
				  if(r.status == 0) {
				    callback("err");
				    return;  // get out
			    }
				  // callback with the template
				  callback(r.template);
				} // end success of ajax
			}); // end ajax
	  }
	}
	
  /**
   * AjaxHelpers class here
   * @class
   */
	var Helper = {
	  /**
     * Returns path from uri
     * @function
     * @param uri {string} entire uri
     * @returns {string} last path from the uri
     * @lends Helper#
     */
    getPath: function(uri) {
      var temp = uri.split("/").clean("");
      return temp[temp.length-1];
    },
    
    /**
     * Returns keys of Object
     * @function
     * @param obj {object} Javascript Object
     * @returns {array} keys of all the object
     * @lends Helper#
     */
    getKeys: function(obj) {
  	  var keys = [];
      for(var key in obj) {
        keys.push(key);
      }
      return keys;      
    },
    
    /**
     * Returns inline loader
     * @function
     * @param $dom {jQuery} jQuery DOM
     * @returns {string} loader template
     * @lends Helper#
     */
    inlineLoader: function($dom) {
      return "<span style='width:" + $dom.width()+ "px; display:inline-block'><img src='/static/img/loader-small.gif' /></span>"
    }
  }
})(jQuery);

function ajaxFormSubmit(name){
	var form = document.forms[name];
	$.ajax({
   		type: form["method"],
   		url: form['action'],
   		data: $(form).serialize(),
	   success: function(msg){
		   // Display the returned message
		   $(form).parent().html(msg);
	   }
 	});
	//modal_content
	return false;
}
