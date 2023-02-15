/**
 * 
 * *******************************
 * !!!!!!!!! DEPRECATED !!!!!!!!!!
 * *******************************
 * 
 *  Please use scroll-button.js instead
 * 
 */

/**
 *
 * For use on Campaign / Clearing pages that use a sticky button that 
 * when clicked animate scrolls to a registration form
 * that can be optionally hidden.
 * Also allows Google Campaign codes to be added to the form
 *
 * TODO - Add para to decide whether to add Google Campaign Code vars
 */

(function () {
  var myForm = stir.t4Globals.myForm;
  var myFormWrapper = stir.t4Globals.myFormWrapper;
  var myFormButton = stir.t4Globals.myFormButton;
  var slideForm = stir.t4Globals.slideForm; // should the form slide in or not
  var embedGCC = stir.t4Globals.embedGCC;
  var useForm = false; // if the form goes missing just revert to the default action

  // force a regulp
  var foo = true;
  foo = false;

  // check all the elements we need are in place
  if (myForm && myFormButton) useForm = true;

  // if no wrapper defined just use the actual form    
  if (!myFormWrapper) myFormWrapper = myForm;

  // check a value for slideForm has been passed
  if (typeof slideForm === 'undefined') slideForm = false;

  // check a value for embed Google Camp Codes has been passed    
  if (typeof embedGCC === 'undefined') embedGCC = true;

  // if the forms to slide add the classes we need and hide by default
  if (slideForm) {
    myFormWrapper.classList.add('stir__slideup');
    myFormWrapper.classList.remove('stir__slidedown');
  }

  // Google Campaign codes - add to the form
  if (useForm && embedGCC) {
    var ls_utm_campaign = localStorage.getItem('utm_campaign') || '';
    var ls_utm_medium = localStorage.getItem('utm_medium') || '';
    var ls_utm_source = localStorage.getItem('utm_source') || '';
    if (document.getElementById('UTM_CAM')) document.getElementById('UTM_CAM').value = ls_utm_campaign;
    if (document.getElementById('UTM_MEDIUM')) document.getElementById('UTM_MEDIUM').value = ls_utm_medium;
    if (document.getElementById('UTM_SOURCE')) document.getElementById('UTM_SOURCE').value = ls_utm_source;
  }

  // Sticky Button click - slide the form in
  if (useForm) {
    myFormButton.onclick = function (e) {
      if (slideForm) myFormWrapper.classList.toggle("stir__slidedown");

      // slight delay to allow the form to slide open
      setTimeout(function () {
        //var stickyHgt = myFormButton.offsetHeight;
        //var offset   = myFormWrapper.getBoundingClientRect().top - document.body.getBoundingClientRect().top - stickyHgt; 
        //window.scroll({ top: (offset), left: 0, behavior: 'smooth' }); 

        stir.scrollToElement(myFormWrapper.parentElement, 40);
      }, 200);
      e.preventDefault();
    };
  }
})();