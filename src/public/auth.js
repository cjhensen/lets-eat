// Expand login form
$('.btn-login-open').on('click', function(event) {
  event.preventDefault();
  console.log('login click');
  $('.le-login').toggleClass('login-expand');
});

// $('.btn-login-open').on('blur', function(event) {
//   $('.le-login').toggleClass('login-expand');
// });

// Switch to signup form
$('.signup-link').on('click', function(event) {
  event.preventDefault();
  console.log('signup link clicked');
  $('.signup-form').toggleClass('signup-display');
  $('.login-form').toggleClass('login-display');
});

$('.login-link').on('click', function(event) {
  event.preventDefault();
  console.log('login link clicked');
  $('.login-form').toggleClass('login-display');
  $('.signup-form').toggleClass('signup-display');
});