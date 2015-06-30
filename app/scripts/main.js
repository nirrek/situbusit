'use strict';

// Replicate what the JSON response would be from the web server
var courseAvailability = {
  "Puppy Preschool": [
    {isAvailable: true, listing: "1st June (3 spots)"},
    {isAvailable: true, listing: "1st July (10 spots)"}
  ],
  "Basic Obedience": [
    {isAvailable: false, listing: "1st June (no spots)"},
    {isAvailable: true, listing: "1st July (6 spots)"}
  ],
  "Tricks For Your Dog": [
    {isAvailable: true, listing: "1st June (7 spots)"},
    {isAvailable: true, listing: "1st July (11 spots)"}
  ],
  "Agility Course Training": [
    {isAvailable: true, listing: "1st June (5 spots)"},
    {isAvailable: true, listing: "1st July (7 spots)"}
  ]
};

// Ensure all jQuery runs after the DOMContentLoaded event has fired.
$(function(){
  // Initialize jQuery wrappers of the relevant DOM nodes
  var $body = $('body'),
      $overlay = $('.Overlay'),
      $enrolmentSection = $('.js-enrolmentSection'),
      $form = $('.js-booking'),
      $formInputs = $form.find('input'),
      $enrolBtn = $('[data-action="enrol"]'),
      $msg = $('.Message--success'),
      $courseSelect = $('[data-action="selectCourse"]'),
      $courseAvailability = $('[data-action="updateAvailability"]'),
      $marquee = $('.marquee'),
      $marqueeContent = $('.marquee-content'),
      $window = $(window);

  // ---------------------------------------------------------------------------
  // Fadeout/in Marquee Content On Scroll
  // ---------------------------------------------------------------------------
  var marqueeHeight = $marquee.outerHeight(),
      opacityVal,
      pageYOffset;

  $window.on('scroll', function() {
    pageYOffset = $window.scrollTop();
    if (pageYOffset < marqueeHeight) {
      opacityVal = 1 - (pageYOffset / 240);
      $marqueeContent.css('opacity', opacityVal);
    }
  });

  // ---------------------------------------------------------------------------
  // Overlay Functions
  // ---------------------------------------------------------------------------
  var openOverlay = function openOverlay() {
    // Prevent scrolling of main body when the overlay is open
    $body.addClass('u-preventScrolling');

    // Open the overlay
    $overlay.addClass('is-Open');

    // Fade in the overlay
    setTimeout(function() {
      $overlay.addClass('fadeIn');
    }, 0);
  };

  var closeOverlay = function closeOverlay(callback) {
    // Re-enable scrolling on the body
    $body.removeClass('u-preventScrolling');

    // Close the overlay
    $overlay.removeClass('fadeIn');
    setTimeout(function() {
      $overlay.removeClass('is-Open');
      if (callback) {
        callback();
      }
    }, 150);
  };

  // Attach click listeners for elements that will open the overlay
  $('[data-action="open-overlay"]').click(function(e) {
    e.preventDefault();
    openOverlay();
  });

  // Attach click listeners for elements that will close the overlay
  $('[data-action="close-overlay"]').click(function(e) {
    e.preventDefault();
    closeOverlay();
  });


  // ---------------------------------------------------------------------------
  // Enrolment Form Section
  // ---------------------------------------------------------------------------

  // Function for resetting a form to its initial state
  var resetForm = function resetForm() {
    $enrolmentSection.show();
    $formInputs.val("");
    $enrolBtn.text("Enrol My Dog");
    $msg.hide();
  };

  // Initialize form validation for jquery.validate
  $form.validate({
    onfocusout: true,
    rules: {
      name: {
        required: true
      },
      mobile: {
        required: true,
        digits: true,
      },
      email: {
        required: true,
        email: true,
      },
      dogsName: {
        required: true,
      }
    },
    submitHandler: function(form) {
      $enrolBtn.text("Enrolling...");
      $enrolmentSection.fadeOut({
        done: function(){
          $msg.attr("style", "display: inline-block;");
          setTimeout(function() {
            closeOverlay(resetForm);
          }, 2000);
        },
      });
    }
  });

  // Prevent default browser behaviour on form submission
  $form.submit(function(e) {
    e.preventDefault();
  });

  // Update starting date select options to match the selected course
  $courseSelect.change(function() {
    var $option,
        courseType = $(this).val(),
        availabilities = courseAvailability[courseType];

    // Remove the current availability options
    $courseAvailability.empty();

    // Insert new availabilities
    availabilities.forEach(function(availability) {
      var $option = $('<option>').text(availability.listing);
      if (!availability.isAvailable) {
        $option.attr("disabled", "disabled");
      }
      $option.appendTo($courseAvailability);
    });
  });


  // ---------------------------------------------------------------------------
  // Animated scrolling between onpage anchor links
  // ---------------------------------------------------------------------------
  $.localScroll({
    offset: {
      left: 0,
      top: -100
    }
  });


  // ---------------------------------------------------------------------------
  // Show navigation on scroll up
  // ---------------------------------------------------------------------------
  (function() {
    var didScroll = false,
        lastScrollTop = 0,
        scrollDelta = 5,
        $window = $(window),
        $document = $(document),
        $header = $('.Header'),
        headerHeight = $header.outerHeight(),
        marqueeHeight = $('.Marquee').outerHeight();

    // Update UI as appropriate when user has scrolled
    var hasScrolled = function hasScrolled() {
      var currentScrollTop = $window.scrollTop();

      // Ensure user has scrolled more than the required delta
      if (Math.abs(lastScrollTop - currentScrollTop) <= scrollDelta) return;

      // If user has scrolled down and are past the header, add .isOffscreen
      if (currentScrollTop > lastScrollTop && currentScrollTop > headerHeight) {
        $header.addClass('isOffscreen');
      }
      // Else, check that the user has scrolled up and that the scroll up
      // occurred within the height of the document (prevents issues
      // with OSX caused by elastic scroll going past the document height);
      else if (currentScrollTop + $window.height() < $document.height()) {
        $header.removeClass('isOffscreen');
      }

      // Change bg of header when not over the marquee
      if (currentScrollTop > (marqueeHeight - headerHeight)) {
        $header.addClass('isBelowMarquee');
      }
      else {
        $header.removeClass('isBelowMarquee');
      }

      lastScrollTop = currentScrollTop;
    }

    // Update didScroll state on scroll event
    $(window).scroll(function() {
      didScroll = true;
    });

    // Periodically check if we have scrolled. If we have, update UI
    setInterval(function() {
      if (didScroll) hasScrolled();
      didScroll = false;
    }, 200);
  }());

});
