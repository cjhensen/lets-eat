module.exports = function(app, passport, express, pathVar) {

  const {User} = require('./models/user.js');
  
  app.use(express.static('dist/public'));  

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
    // console.log('request.user', request.user);
    // console.log('request', request.query);
    const arrayToGet = request.query.arrayToGet;
    // console.log('arrayToGet', arrayToGet);
    User
      .findById(request.user._id)
      .exec()
      .then(user => response.json(user[arrayToGet]))
      .catch(err => {
        console.error(err);
        response.status(500).json({message: "Internal server error"});
      });
  });

  // updating a user list
  app.put('/userdata', isLoggedIn, function(request, response) {
    const fieldsToUpdate = {};
    const updateableFields = ['history', 'liked', 'disliked'];

    // console.log('rb', request.body);
    updateableFields.forEach(field => {
      if(field in request.body) {
        fieldsToUpdate[field] = request.body[field];
      }
    });
    // console.log('ftu', fieldsToUpdate);

    User
      .findOneAndUpdate({_id: request.user._id}, {$addToSet: fieldsToUpdate})
      .exec()
      .then(user => response.status(204).end())
      .catch(err => response.status(500).json({message: 'Internal server error'}));
  });

  // creating a new user through POST
  app.post('/userdata', function(request, response) {

    const userCredentials = request.body;
    const newUser = new User();
    
    newUser.userInfo.username = userCredentials.username;
    newUser.userInfo.password = newUser.generateHash(userCredentials.password);

    newUser.save(function(err) {
      if(err) {
        response.status(500).json({message: 'Internal server error'});
        console.log('Error creating user');
        throw err;
      }
      response.status(201).json({message: 'New user successfully created'});
      console.log('New user successfully created');
    });
  });

  // deleting one restaurant (restaurant id) history
  app.delete('/userdata/history/:id', isLoggedIn, function(request, response) {
    // console.log('history request is working');

    const listToDelFrom = request.params.list;
    const itemToDel = request.params.id;

    // console.log('listToDelFrom', listToDelFrom);
    // console.log('itemToDel', itemToDel);

    User
      .findOneAndUpdate(
        {_id: request.user._id}, 
        {$pull: {'history': { id: itemToDel}}})
      .exec()
      .then(user => response.status(204).end())
      .catch(err => response.status(500).json({message: 'Internal server error'}));
  });

  // deleting one restaurant (restaurant id) liked
  app.delete('/userdata/liked/:id', isLoggedIn, function(request, response) {
    // console.log('liked request is working');

    const listToDelFrom = request.params.list;
    const itemToDel = request.params.id;

    // console.log('listToDelFrom', listToDelFrom);
    // console.log('itemToDel', itemToDel);

    User
      .findOneAndUpdate(
        {_id: request.user._id}, 
        {$pull: {'liked': { id: itemToDel}}})
      .exec()
      .then(user => response.status(204).end())
      .catch(err => response.status(500).json({message: 'Internal server error'}));
  });

  // deleting one restaurant (restaurant id) disliked
  app.delete('/userdata/disliked/:id', isLoggedIn, function(request, response) {
    // console.log('disliked request is working');

    const listToDelFrom = request.params.list;
    const itemToDel = request.params.id;

    // console.log('listToDelFrom', listToDelFrom);
    // console.log('itemToDel', itemToDel);

    User
      .findOneAndUpdate(
        {_id: request.user._id}, 
        {$pull: {'disliked': { id: itemToDel}}})
      .exec()
      .then(user => response.status(204).end())
      .catch(err => response.status(500).json({message: 'Internal server error'}));
  });

  
}