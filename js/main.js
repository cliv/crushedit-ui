/* eslint-env jquery, browser */
/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

// object.watch
if (!Object.prototype.watch) {
  Object.defineProperty(Object.prototype, 'watch', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function(prop, handler) {
      var
        oldval = this[prop],
        newval = oldval,
        getter = function() {
          return newval;
        },
        setter = function(val) {
          oldval = newval;
          return newval = handler.call(this, prop, oldval, val);
        };

      if (delete this[prop]) { // can't watch constants
        Object.defineProperty(this, prop, {
          get: getter,
          set: setter,
          enumerable: true,
          configurable: true
        });
      }
    }
  });
}

// object.unwatch
if (!Object.prototype.unwatch) {
  Object.defineProperty(Object.prototype, 'unwatch', {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function(prop) {
      var val = this[prop];
      delete this[prop]; // remove accessors
      this[prop] = val;
    }
  });
}

var vote = {};

function changeVote(data) {
  vote = data;
  console.log('updating vote', vote);
  $('#voteTotals .score').html(vote.score);
  $('#voteTotals').show();
  $('#yes-button .score').html('(' + vote.up + ')');
  $('#no-button .score').html('(' + vote.down + ')');
}

$(document).ready(function() {
  $.get('http://api-672645973.us-east-1.elb.amazonaws.com/image/', function(image) {
    console.log('Image Data', image);
    $('#imageWindow').prepend('<img id="theImg" src="' + image.image_path + '" />');
    $.get('http://api-672645973.us-east-1.elb.amazonaws.com/votes/' + image.image_hash, function(votedata) {
      changeVote(votedata);
    });
    $('#yes-button').on('click', function() {
      $.get('http://api-672645973.us-east-1.elb.amazonaws.com/votes/' + image.image_hash + '/up', function(votedata) {
        changeVote(votedata);
      });
    });
    $('#no-button').on('click', function() {
      $.get('http://api-672645973.us-east-1.elb.amazonaws.com/votes/' + image.image_hash + '/down', function(votedata) {
        changeVote(votedata);
      });
    });
  });
});
