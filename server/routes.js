module.exports = function(app, passport) {

  // home page (login form/signup form)
  app.get('/', function(request, response) {
    // response.render('');
    console.log('new router works');
    response.sendFile('index.html', { root: '/public/'});
  });

  // app.post('/login', passport stuff);
  // app.post('/signup', passport stuff);

  // protected app
  app.get('/app', isLoggedIn, function(request, response) {
    response.render('');
  });

  // logout
  app.get('/logout', function(request, response) {
    request.logout();
    response.redirect('/');
  });

  // middleware for checking if a user is logged in
  function isLoggedIn(request, response, next) {
    if(request.isAuthenticated()) {
      return next;
    } else {
      response.redirect('/');
    }
  }


}