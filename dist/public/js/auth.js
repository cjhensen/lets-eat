(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}]},{},[1]);
