module.exports = function(app, passport, express, pathVar) {

  const {User} = require('./models/user.js');
  
  app.use(express.static('dist/public'));  
  // app.use('/app', express.static(pathVar.join(__dirname) + 'dist/app'));
  // app.use('/app', isLoggedIn);
  // app.use('/app', express.static('dist/app'));
  // app.use(express.static(pathVar.join(__dirname, '/../dist/app')));
  

  // HOME
  app.get('/', function(request, response) {
    // response.render('');
    console.log('new router works');
    response.sendFile('index.html', { root: '/dist/public/' });
  });

  // SIGNUP
  app.post('/signup', 
    passport.authenticate('local-signup', {
      successRedirect: '/app',
      failureRedirect: '/',
      failureFlash: true
    })
  );

  // LOGIN
  app.post('/login', 
    passport.authenticate('local-login', {
      successRedirect: '/app',
      failureRedirect: '/',
      failureFlash: true
    })
  );

  // PROTECTED APP
  app.get('/app', isLoggedIn, function(request, response) {
    console.log('dirname', __dirname);
    app.use(express.static(pathVar.join(__dirname, '/../dist/app')));


    response.sendFile('index.html', { root: `${__dirname}/../dist/app/` });
  });

  // LOGOUT
  app.get('/logout', function(request, response) {
    request.logout();
    response.redirect('/');
  });

  // middleware for checking if a user is logged in
  function isLoggedIn(request, response, next) {
    if(request.isAuthenticated()) {
      console.log('user is authenticated');
      next();
    } else {
      console.log('not authenticated');
      response.redirect('/');
    }
  }


  // User Data Routes
  // Get list by user id
  app.get('/userdata', isLoggedIn, function(request, response) {
    console.log('request.user', request.user);
    console.log('request', request.query);
    const arrayToGet = request.query.arrayToGet;
    console.log('arrayToGet', arrayToGet);
    User
      .findById(request.user._id)
      .exec()
      .then(user => response.json(user[arrayToGet]))
      .catch(err => {
        console.error(err);
        response.status(500).json({message: "Internal server error"});
      });
  });

  app.put('/userdata', isLoggedIn, function(request, response) {
    const fieldsToUpdate = {};
    const updateableFields = ['history', 'liked', 'disliked'];

    console.log('rb', request.body);
    updateableFields.forEach(field => {
      if(field in request.body) {
        fieldsToUpdate[field] = request.body[field];
      }
    });
    console.log('ftu', fieldsToUpdate);

    User
      .findByIdAndUpdate(request.user._id, {$addToSet: fieldsToUpdate})
      .exec()
      .then(user => response.status(204).end())
      .catch(err => response.status(500).json({message: 'Internal server error'}));
  });
  
}