$('.btn-login-open').on('click', function(event) {
  event.preventDefault();
  console.log('login click');
  $('.le-login').toggleClass('login-expand');
});

// $('.btn-login-open').on('blur', function(event) {
//   $('.le-login').toggleClass('login-expand');
// });