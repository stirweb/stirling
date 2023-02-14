/*
 * @author: Ryan Kaye / Robert Morrison
 */
(function () {
  var countries = document.getElementById('countries');
  var letterToggle = document.getElementById('search-letters__toggle-link');
  var letterLinks = document.getElementById('search-letters__links');
  var countrySearchQuery = document.getElementById('country-search__query');
  var letter = '',
      currentName,
      currentLetter,
      clickedLetter,
      jumpToLetter;

  if (!countries) {
    return;
  }

  countries = countries.children;
  /*
   * Function: Create the nodes for the letter headings
   */

  function addLetterHeaders() {
    for (var i = 0; i < countries.length; i++) {
      if (currentName = countries[i].getAttribute('data-name')) {
        currentLetter = currentName.charAt(0);

        if (currentLetter !== letter) {
          // on to a new letter - so add the anchor:
          var anchor = document.createElement("div");
          anchor.setAttribute("id", "link__" + currentLetter);
          anchor.classList.add('cell');
          anchor.classList.add('small-12');
          anchor.classList.add('u-margin-top');
          anchor.classList.add('c-letter-heading');
          anchor.innerHTML = '<h3 class="c-page-heading c-page-heading--stripped">' + currentLetter + '</h3>';
          countries[i].parentNode.insertBefore(anchor, countries[i]);
          letter = currentLetter;
        }
      }
    }
  }

  if (letterToggle && letterLinks) {
    if (window.Element.prototype.hasOwnProperty('classList')) {
      letterLinks.classList.add('show-for-medium');

      letterToggle.onclick = function (e) {
        this.classList.toggle('c-search-letters__toggle-link--is-active');
        letterLinks.classList.toggle('show-for-medium');
        e.preventDefault();
      };
    }
  }
  /*
   * Event: Letter link click
   */


  letterLinks.onclick = function (e) {
    var el = document.getElementById('link__' + e.target.getAttribute('data-letter'));
    el && stir.scrollToElement(el);
    e.preventDefault();
  };
  /*
   * Event: Search form entry
   */


  countrySearchQuery.onkeyup = function (e) {
    // No query input - so rest everything
    if (countrySearchQuery.value === '') {
      // show all letter headings
      for (var i = 0; i < document.getElementsByClassName('c-letter-heading').length; i++) {
        document.getElementsByClassName('c-letter-heading')[i].classList.remove('hide');
      } // show all countries


      for (var c = 0; c < countries.length; c++) {
        countries[c].classList.remove('hide');
      }

      return;
    } // We have a query so search the country names for it


    for (var c = 0; c < countries.length; c++) {
      countries[c].classList.add('hide');

      if (countries[c].dataset.name) {
        var myname = countries[c].dataset.name.toLowerCase();

        if (myname.indexOf(countrySearchQuery.value.toLowerCase()) > -1) {
          countries[c].classList.remove('hide');
        }
      }
    }

    e.preventDefault();
  }; // Add letter headings


  addLetterHeaders();
})();