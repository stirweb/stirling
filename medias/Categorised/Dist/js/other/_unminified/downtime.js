/*
 * Load this file on the course pages during scheduled Portal downtime
 * 
 * 2019-06-29 r.w.morrison@stir.ac.uk
 */
var StirUniModules = StirUniModules || {};

(function () {
  var portalDowntimeErrorMessageRenderer = function portalDowntimeErrorMessageRenderer(data) {
    var container = document.querySelector(StirUniModules.getOptions()["container"]);

    if (container) {
      var alertBox = document.createElement("div");
      alertBox.style.border = "1px solid darkgray";
      alertBox.style.padding = "1em 1em 0";
      alertBox.style.marginBottom = "1em";
      alertBox.innerHTML = '<p><strong>Module information is currently unavailable</strong>.<br> We are carrying out some essential maintenance work on our website today, which means that some of our web pages are currently unavailable. We&rsquo;re sorry for any inconvenience and we hope to restore full service as soon as possible.</p>';
      container.insertAdjacentElement("beforeend", alertBox);
    }

    console.error("University of Stirling internal systems are offline for maintenance.");
  };

  StirUniModules.setShowRoutesErrorRenderer(portalDowntimeErrorMessageRenderer);
  StirUniModules.setShowOptionsErrorRenderer(portalDowntimeErrorMessageRenderer);
})();
/*
 *   Interupt all portal processes with a downtime pop up
 */


(function () {
  /*
   *  Config - general vars
   */
  var downtime = true; // disable switch to counter publish delay set to false to disable immediately

  var start = 1562043600000; // start of downtime in UTC milliseconds - https://currentmillis.com/

  var now = parseInt(Date.now()); // current time in UTC milliseconds

  var errMess = '<h3 class="header-stripped">Offline for maintenance</h3><p>We are carrying out some essential maintenance work on our website today, which means that some of our web pages are currently unavailable. We&rsquo;re sorry for any inconvenience and we hope to restore full service as soon as possible.</p><p>See how to <a href="https://www.stir.ac.uk/about/contact-us/">contact us</a></p><button class="close-button" data-close aria-label="Close modal" type="button"><span aria-hidden="true">&times;</span></button>';
  /* 
   *  Config - buttons / links
   */
  // These ones dont open in a modal so need to create one 

  var linksAddModal = [document.getElementById('coursebodyenquiry'), document.getElementById('coursestickyenquiry'), document.getElementById('header-portal__button'), document.querySelector('.courseapply_pg'), document.querySelectorAll('.courseapply_pg')[1]]; // These 2 already open in a modal so we can use it but overwrite the content 

  var linksAmendModal = [document.querySelectorAll('[data-modalopen]')[0], document.querySelectorAll('[data-modalopen]')[1]];
  /*
   * Function: Determine if downtime is active
   */

  var isDowntime = function isDowntime() {
    if (downtime) {
      if (now > start) {
        console.log('Downtime script active - ' + start + ' - ' + now);
        return true;
      }
    }

    return false;
  };
  /* 
   *  Function: Pop up the new Modal if Downtime is active and add the offline message
   */


  var displayModal = function displayModal(e) {
    if (isDowntime()) {
      // create a modal and output the error message
      var mymodal = stir.Modal();
      mymodal.render('downTimeModal', 'Downtime alert message');
      mymodal.setContent(errMess);
      mymodal.open();
      e.preventDefault();
      return false;
    }
  };
  /* 
   *  Function: Amend the in use Modal with the offline message
   */


  var amendModal = function amendModal(e) {
    if (isDowntime()) {
      if (stir.t4Globals.modals) {
        Array.prototype.forEach.call(stir.t4Globals.modals, function (m) {
          if (m.getId() === e.target.dataset.modalopen) m.setContent(errMess);
        });
      }

      return false;
    }
  };
  /* 
   *  Events - Button / link clicks - loop the two arrays
   */


  for (var i = 0; i < linksAddModal.length; i++) {
    if (linksAddModal[i]) {
      linksAddModal[i].onclick = function (e) {
        displayModal(e);
      };
    }
  }

  for (var i = 0; i < linksAmendModal.length; i++) {
    if (linksAmendModal[i]) {
      linksAmendModal[i].onclick = function (e) {
        amendModal(e);
      };
    }
  }
})();