/**
 *
 * For use on Campaign / Clearing pages that use a sticky button that 
 * when clicked animate scrolls to a registration form
 * that can be optionally hidden.
 * Also allows Google Campaign codes to be added to the form
 *
 */
(function () {
  var myScrollButton = document.querySelector('[data-scrollto]');
  if (!myScrollButton) return;
  var myTarget = myScrollButton.getAttribute('data-scrollto') ? document.getElementById(myScrollButton.getAttribute('data-scrollto')) : null;
  var myTarget2 = stir.t4Globals.myForm; // DEPRECATED

  var myTargetWrapper = stir.t4Globals.targetWrapper; // DEPRECATE?

  var aniSlideInTarget = stir.t4Globals.slideForm; // DEPRECATE? decide if the form should animate slide in or not

  var embedGCC = stir.t4Globals.embedGCC;
  var useScroll = false; // flag if the target is missing - revert to the default action
  // if a page is using the old var make the script work

  if (!myTarget && myTarget2) myTarget = myTarget2; // check all the elements we need are in place

  if (myTarget && myScrollButton) useScroll = true; // if no wrapper defined just use the actual target    

  if (!myTargetWrapper) myTargetWrapper = myTarget; // check a value for embed Google Camp Codes has been passed    

  if (typeof embedGCC === 'undefined') embedGCC = true; // if the forms to slide add the classes we need and hide by default

  if (aniSlideInTarget) {
    myTargetWrapper.classList.add('stir__slideup');
    myTargetWrapper.classList.remove('stir__slidedown');
  } // Google Campaign codes - add to the form
  // IS THIS STILL REQUIRED !!!


  if (useScroll && embedGCC) {
    var ls_utm_campaign = localStorage.getItem('utm_campaign') || '';
    var ls_utm_medium = localStorage.getItem('utm_medium') || '';
    var ls_utm_source = localStorage.getItem('utm_source') || '';
    if (document.getElementById('UTM_CAM')) document.getElementById('UTM_CAM').value = ls_utm_campaign;
    if (document.getElementById('UTM_MEDIUM')) document.getElementById('UTM_MEDIUM').value = ls_utm_medium;
    if (document.getElementById('UTM_SOURCE')) document.getElementById('UTM_SOURCE').value = ls_utm_source;
  } // Sticky Button click - slide the form in


  if (useScroll) {
    myScrollButton.onclick = function (e) {
      e.preventDefault(); // animate slide in if enabled

      if (aniSlideInTarget) myTargetWrapper.classList.toggle("stir__slidedown"); // slight delay to allow the target element to slide open

      setTimeout(function () {
        stir.scrollToElement(myTargetWrapper, 80);
      }, 200);
    };
  }
})();