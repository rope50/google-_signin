var googleUser;

function googleSignin(authResult){
	googleUser = googleUser ||  new GooglePlus({
	    domain: 'axiovista.com', //specify a domain, you can use a wildcard * too
	    userEmail:  $("#user-email")[0], // also is posible, document.getElementById
	    userName:   $("#user-name")[0],
	    userImage:  $("#user-image")[0],
	    logout:     $('#logout-button')[0], 
	    signin:     $('#signin-button')[0],    
	    onSignin: function(){
	    },
	    onGetUserInfo: function(user){
	    },
	    onLogout: function(){
	      document.location.href="index.html"
	    }
	  });
	googleUser.signinCallback.call(googleUser,authResult);
}