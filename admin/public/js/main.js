(function($) {

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
  
});
		
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
