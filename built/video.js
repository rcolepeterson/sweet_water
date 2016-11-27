
var theVideo = null;

$(document).ready(function() {
  $(window).smartresize(checkPlatform);
  checkPlatform();
});

var checkPlatform = function () {
  'use strict';
  var w = $(window).width() > 767;
  var $cover = $('.cover');
  var $tv = $('.tv');
  if (w) {
    $tv.removeClass('hidden');
    $cover.removeClass('hidden');
    if (theVideo === null) {
      theVideo = runVideo();
    }else{
      theVideo.vidRescale();
    }
  }
  else {
    $tv.addClass('hidden');
    $cover.addClass('hidden');
  }
};

var runVideo = function () {
  'use strict';
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/player_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  var tv;
  var playerDefaults = {
    autoplay: 0,
    autohide: 1,
    modestbranding: 0,
    rel: 0,
    showinfo: 0,
    controls: 0,
    disablekb: 1,
    enablejsapi: 0,
    iv_load_policy: 3
  };
  var vid = [{
    videoId: 'Zh4UnHwdks0',
    startSeconds: 6,
    endSeconds: 221,
    suggestedQuality: 'hd720'
  }];
  var randomVid = Math.floor(Math.random() * vid.length);
  var currVid = randomVid;

    // $('.hi em:last-of-type').html(vid.length);

  window.onYouTubePlayerAPIReady = function onYouTubePlayerAPIReady() {
    tv = new YT.Player('tv', {
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      },
      playerVars: playerDefaults
    });
  };

  function onPlayerReady() {
    tv.loadVideoById(vid[currVid]);
    tv.mute();
  }

  function onPlayerStateChange(e) {
    if (e.data === 1) {
      $('#tv').addClass('active');

    }
    else if (e.data === 2) {
      $('#tv').removeClass('active');
      if (currVid === vid.length - 1) {
        currVid = 0;
      }
      else {
        currVid++;
      }
      tv.loadVideoById(vid[currVid]);
      tv.seekTo(vid[currVid].startSeconds);
    }
  }

  function vidRescale() {
    if (!tv) {
      return;
    }

    var w = $(window).width() + 200,
      h = $(window).height() + 200;

    if (w / h > 16 / 9) {
      tv.setSize(w, w / 16 * 9);
      $('.tv .screen').css({
        left: '0px'
      });
    }
    else {
      tv.setSize(h / 9 * 16, h);
      $('.tv .screen').css({
        left: -($('.tv .screen').outerWidth() - w) / 2
      });
    }
  }

  $(window).on('load resize', function () {
    vidRescale();
  });

  $('.hi span:first-of-type').on('click', function () {
    $('#tv').toggleClass('mute');
    $('.hi em').toggleClass('hidden');
    if ($('#tv').hasClass('mute')) {
      tv.mute();
    }
    else {
      tv.unMute();
    }
  });

    // $('.hi span:last-of-type').on('click', function() {
    //     tv.pauseVideo();
    // });

  return {tv:tv,vidRescale:vidRescale};
};

(function ($, sr) {

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
    var timeout;

    return function debounced() {
      var obj = this,
        args = arguments;

      function delayed() {
        if (!execAsap) { func.apply(obj, args); }
        timeout = null;
      }

      if (timeout) { clearTimeout(timeout); }
      else if (execAsap) { func.apply(obj, args); }

      timeout = setTimeout(delayed, threshold || 100);
    };
  };
    // smartresize
  jQuery.fn[sr] = function (fn) {
    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery, 'smartresize');
