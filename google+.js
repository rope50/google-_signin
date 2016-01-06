(function() {
   var po = document.createElement('script'); po.type = 'text/javascript';
   po.async = true;
   po.src = 'https://apis.google.com/js/client:plusone.js';
   var s = document.getElementsByTagName('script')[0]; 
   s.parentNode.insertBefore(po, s);
})();

var GooglePlus = function(opt){
  this.properties = {
    elements : {
      userEmail: null,
      userName: null,
      userImage: null,
      logout: null, 
      signin: null,
      revoke: null
    },
    callbacks: {
      onLogout: null,
      onSignin: null,
      onGetUserInfo: null,
    },
    domain :null
  };
  this.setproperties(opt);
}

GooglePlus.prototype.setproperties = function(obj){
  var t = this;
  if(typeof(obj['userEmail']) ==='object' )
    this.properties.elements.userEmail = obj['userEmail'];
  if(typeof(obj['userName']) ==='object')
    this.properties.elements.userName = obj['userName'];  
  if(typeof(obj['userImage']) ==='object')
    this.properties.elements.userImage = obj['userImage'];
  if(typeof(obj['logout']) ==='object'){
    this.properties.elements.logout = obj['logout'];
    $(this.properties.elements.logout).click(function(){
      t.logOut.call(t);
    });
  }
  if(typeof(obj['signin']) === 'object')
    this.properties.elements.signin = obj['signin'];
  if(typeof(obj['revoke']) === 'object')
    this.properties.elements.revoke = obj['revoke'];
  if(typeof(obj['onLogout']) === 'function')
    this.properties.callbacks.onLogout = obj['onLogout'];
  if(typeof(obj['onSignin']) === 'function')
    this.properties.callbacks.onSignin = obj['onSignin'];
  if(typeof(obj['onGetUserInfo']) === 'function')
    this.properties.callbacks.onGetUserInfo = obj['onGetUserInfo'];
  if(typeof(obj['domain']) === 'string')
    this.properties.domain = obj['domain'];
}

GooglePlus.prototype.signinCallback = function (authResult) {
  this.accessToken = authResult['access_token'];
  if (authResult['access_token']) {
    console.log("Loging In");
    $(this.properties.elements.signin).hide();
    $(this.properties.elements.logout).show();
    if(typeof(this.properties.callbacks.onSignin) === 'function'){
      this.properties.callbacks.onSignin();
    }
    this.getUserInfo();
  } else if (authResult['error']) {
    if(typeof(this.properties.callbacks.onLogout) === 'function'){
      this.properties.callbacks.onLogout();
    }
    console.log("Error in Login");
  }
}

GooglePlus.prototype.revokeUser = function  () {
  var access_token = gapi.auth.getToken().access_token;
  var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' +
  access_token;
  console.log(access_token);
  var t = this;
  $.ajax({
    type: 'GET',
    url: revokeUrl,
    async: false,
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(nullResponse) {
        t.logOut();
    },
    error: function(e) {
      console.log("Error while user revoking");
    }
  });
}

GooglePlus.prototype.getUserInfo = function(){
    var t = this
    gapi.client.load('oauth2', 'v2', function() {
          var request = gapi.client.oauth2.userinfo.get();
          request.execute(function(obj){
            t.getUserInfoCallback.call(t,obj);
          });
    });
}

GooglePlus.prototype.getUserInfoCallback = function (obj){
  var dmn = obj['email'].split('@')[1];
  if(this.properties.domain === dmn || this.properties.domain ==='*'){
    this.properties.callbacks.onGetUserInfo(obj);
    $(this.properties.elements.userImage).attr("src",obj['picture']);
    $(this.properties.elements.userName).html(obj['name']);
    $(this.properties.elements.userEmail).html(obj['email']);
  }
  else{
    alert('Usuario No autorizado, solo se admiten usuarios para el dominio: '+this.properties.domain);
    this.revokeUser();
  }    
}

GooglePlus.prototype.logOut = function(){
  gapi.auth.signOut();
  if(typeof(this.properties.callbacks.onLogout) === 'function'){
    this.properties.callbacks.onLogout();
  }
  $(this.properties.elements.userImage).attr("src",'');
  $(this.properties.elements.userName).html('');
  $(this.properties.elements.userEmail).html('');
  $(this.properties.elements.logout).hide();
  $(this.properties.elements.signin).show();
}