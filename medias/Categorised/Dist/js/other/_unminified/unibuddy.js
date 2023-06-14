(function () {
  //var host = window.location.hostname;
  //var debug = host != "www.stir.ac.uk" ? true : false;

  function initialiseUniBuddyPopCard(key, value) {
    //debug && console.info("[UniBuddy] Initialising: ", { type: 'PopCard', filters: key && value ? {key: key, value: value} : null});

    window.unibuddySettings = {
      uni_id: "university-of-stirling",
      colour: "d41568",
      domain: "https://popcard.unibuddy.co/",
      title: "Unibuddy Popcard",
    };

    if (key) {
      window.unibuddySettings.filterKey = key;
      window.unibuddySettings.filterValue = value;
    }

    // inject the UniBuddy PopCard script:
    var script = document.createElement("script");
    script.src = "https://cdn.unibuddy.co/unibuddy-popcard.js";
    script.setAttribute("type", "text/javascript");
    document.body.insertAdjacentElement("beforeend", script);
  }

  /**
   * Set the UniBuddy filter based on the current page's URL.
   * If there's no match we don't trigger UniBuddy at all.
   */
  (function (path) {
    // exact page path matches
    // UG buddies only
    /* switch (path) {
            //case '/study/undergraduate/clearing/english-welsh-and-northern-irish-clearing-places/':
            case '/study/undergraduate/study-in-scotland-ruk/':
            case '/study/undergraduate/study-in-scotland-canada/':
            case '/study/undergraduate/adventure/':
            case '/study/undergraduate/study-in-scotland-usa/':
                return initialiseUniBuddyPopCard("level", "Undergraduate");
        } */

    // vvv   page paths that match and their sub-pages   vvv

    //POSTGRAD: PG buddies only
    /* if( 0 === path.indexOf("/courses/pg-taught/") ||
            0 === path.indexOf("/study/postgraduate/") //||
            //0 === path.indexOf("/study/visit-us/postgraduate-open-day/")
        ) return initialiseUniBuddyPopCard("level", "Postgraduate"); */

    //POSTGRAD: Exact matches
    switch (path) {
      case "https://www.stir.ac.uk/study/postgraduate/":
      case "https://www.stir.ac.uk/study/postgraduate/choosing-a-course/":
      case "https://www.stir.ac.uk/study/postgraduate/how-to-apply/":
      case "https://www.stir.ac.uk/study/postgraduate/how-to-apply/what-makes-a-good-personal-statement/":
      case " https://www.stir.ac.uk/study/postgraduate/flexible-learning/":
      case "https://www.stir.ac.uk/study/postgraduate/into-university-of-stirling-postgraduate-progression-courses/":
      case "https://www.stir.ac.uk/study/postgraduate/why-stirling-for-postgraduate-study/":
      case "https://www.stir.ac.uk/study/postgraduate/why-stirling-for-postgraduate-study/redefine-your-career/":
      case "https://www.stir.ac.uk/study/postgraduate/create-your-personalised-prospectus/":
      case "https://www.stir.ac.uk/study/postgraduate/ask-an-expert/":
      case "https://www.stir.ac.uk/study/postgraduate/ask-an-expert/ask-an-expert-banking-and-finance/":
      case "https://www.stir.ac.uk/study/postgraduate/ask-an-expert/ask-an-expert-media-culture-and-communications/":
      case "https://www.stir.ac.uk/study/postgraduate/ask-an-expert/ask-an-expert-tesol/":
      case "https://www.stir.ac.uk/study/postgraduate/ask-an-expert/ask-an-expert-health-sciences-and-sport/":
      case " https://www.stir.ac.uk/study/postgraduate/ask-an-expert/ask-an-expert-data-science-and-fintech/":
      case "https://www.stir.ac.uk/study/postgraduate/ask-an-expert/ask-an-expert-psychology/":
        return initialiseUniBuddyPopCard("level", "Postgraduate");
    }

    //INTERNATIONAL: any buddy
    if (0 === path.indexOf("/international/international-students/") || 0 === path.indexOf("/international/international-summer-school/") || 0 === path.indexOf("/international/study-abroad-exchange/")) return initialiseUniBuddyPopCard();

    // UNDERGRAD
    /* if( 
        0 === path.indexOf("/courses/ug/") ||
        0 === path.indexOf("/study/undergraduate/") ||
        0 === path.indexOf("/study/visit-us/undergraduate-open-days/" )
        ) return initialiseUniBuddyPopCard("level", "Undergraduate"); */

    //DOMESTIC — not currently in use
    /* if (path.indexOf("/example/ruk-students/etc") === 0) {
            UniBuddySetFilter("sameCountryAsUniversity", "1");
        } */

    //debug && console.info("[UniBuddy] No match for current page.");
  })(window.location.pathname);
})();
