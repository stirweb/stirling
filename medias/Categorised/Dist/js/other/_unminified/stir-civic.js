var stir = stir || {};
/**
 * Requires Civic CookieControl
 */

stir.cookieControl = function cookieControl() {
  var _name = "Stir Cookie Control";
  var debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
  var widgets = [];
  var templates = Array.prototype.slice.call(document.querySelectorAll("script[data-optin]"));
  var placeholderText = "<p>Thirdparty media element - privacy opt-in</p>";
  templates.forEach(function (template, i) {
    var button = document.createElement("button");
    var placeholder = document.createElement("div");
    button.innerText = "Okay";
    button.setAttribute("class", "button");
    button.addEventListener("click", optin);
    placeholder.innerHTML = placeholderText;
    placeholder.setAttribute("class", "u-bg-dark-grey u-white--all cell u-padding-y text-center");
    placeholder.appendChild(button);
    widgets.push({
      template: template,
      placeholder: placeholder,
      button: button
    });
  });

  function _magicButton() {
    var ccc = document.getElementById("ccc-icon"); //var button = document.createElement("button");
    //var dismiss = document.getElementById('ccc-dismiss-button');
    //button.innerHTML = "Accept all";
    //button.classList.add('ccc-notify-button');
    //button.classList.add('ccc-accept-button');
    // var stirOptInAll = function() {
    // 	CookieControl.changeCategory(0, true);
    // 	CookieControl.changeCategory(1, true);
    // 	CookieControl.changeCategory(2, true);
    // 	//CookieControl.acceptAll();
    // 	CookieControl.hide();
    // };
    //button.addEventListener("click", stirOptInAll);

    var moveButton = function moveButton() {
      console.log("clicked");
      var dismiss = document.getElementById("ccc-dismiss-button");

      if (dismiss) {
        var targetElement = document.getElementById("ccc-button-holder");
        targetElement && targetElement.appendChild(dismiss);
        console.info("Move button", {
          button: dismiss
        });
      }
    };

    ccc && moveButton();
    ccc && ccc.addEventListener("click", moveButton);
  }
  /**
   * This will be called automatically by Civic once CookieControl
   * has been initialised (and the consent for each category is known).
   */


  function _init() {
    if (!window.CookieControl) return console.error("[" + _name + "] Civic CookieControl not initialised. ");

    _magicButton();

    debug && console.info("[" + _name + "] Initialising…");

    if (!CookieControl.getCategoryConsent(2)) {
      debug && console.info("[" + _name + "] 3rd party cookie consent not given, adding placeholders.");
      deactivate();
    }

    if (!CookieControl.getCategoryConsent(1)) {
      debug && console.info("[" + _name + "] Performance cookie consent not given, activate request thing.");
      appealCategoryConsent(1);
    } else {
      activateCategory(1);
    }
  }

  function appealCategoryConsent(category) {
    var templates = Array.prototype.slice.call(document.querySelectorAll('script[data-optin-appeal][data-category="' + category + '"]'));
    templates.forEach(function (template, i) {
      template.insertAdjacentHTML("afterend", template.innerHTML);
      template.remove();
    });
  }

  function activateCategory(category) {
    var templates = Array.prototype.slice.call(document.querySelectorAll('script[data-optin-thanks][data-category="' + category + '"]'));
    templates.forEach(function (template, i) {
      template.insertAdjacentHTML("afterend", template.innerHTML);
      template.remove();
    });
  }

  function optin() {
    CookieControl.changeCategory(2, true);
  }

  function deactivate() {
    widgets.forEach(function (widget, i) {
      widget.template.insertAdjacentElement("afterend", widget.placeholder);
    });
  }

  function activate() {
    // activate all widgets
    widgets.forEach(function (widget) {
      widget.placeholder.parentElement && widget.placeholder.parentElement.removeChild(widget.placeholder);
      widget.template.insertAdjacentHTML("afterend", widget.template.innerHTML);
    });
  }

  function _accept() {
    debug && console.info("[" + _name + "] ACCEPTED");
    activate();
  }

  function _revoke() {
    debug && console.info("[" + _name + "] REVOKED");
    /* deactivate(); */

    if (debug) {
      if (confirm("[Debug] Page will now reload to remove the 3rd party content.")) {
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  }

  return {
    accept: _accept,
    revoke: _revoke,
    init: _init,
    activateCategory: activateCategory
  };
}();