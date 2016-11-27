jQuery(document).ready(function             ($) {
  $('.menu').click(function(e) {
    e.preventDefault();
    $(".menu").toggleClass('open');
    $('.mobile-nav-container').toggleClass('open');
  });
});
