// wrap everything in an IIFE so we don't pollute the Global Scope
(function () {
  // get a reference to the Section ID meta tag
  var pageSID = document.head.querySelector('[name=sid][content]'); // only continue if the meta tag exists. if it didn't (and we
  // don't check) a Reference Error would be thrown.

  if (pageSID) {
    // get all links that match our criteria…
    var upcomingEventLinks = document.querySelectorAll('a[data-section-id="' + pageSID.getAttribute("content") + '"][data-type="event"]'); //…and loop thru to remove them all

    for (var i = 0; i < upcomingEventLinks.length; i++) {
      upcomingEventLinks[i].parentNode.removeChild(upcomingEventLinks[i]); //upcomingEventLinks[i].style.display = "none"; // <- or just hide them if you want!
    }
  }
})();