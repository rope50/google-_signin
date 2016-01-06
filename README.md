# google-_signin
Minimal Wrapper for Google+ Sign in.

You need to add a google+ sign in buttton. Here is an example:
```
<span id="signin-button" style="display:none">
  <span
    class="g-signin"
    data-callback="YOUR_CALLBACK_FUNCTION"
    data-clientid="YOUR_CLIENT_ID"
    data-cookiepolicy="single_host_origin"
    data-requestvisibleactions="http://schemas.google.com/AddActivity"
    data-scope="https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email">
  </span>
</span>

```

Where your callback function can be this:
 
```

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

```