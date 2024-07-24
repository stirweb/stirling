// var stir = stir || {};
// (function () {
//   const scriptSrc = UoS_env.name.includes("preview") ? '<t4 type="media" id="174053" formatter="path/*" />' : UoS_env.wc_path + "js/other/stir-tabs.js";
//   stir.lazyJS(['[data-behaviour="tabs"]'], scriptSrc);
// })();
var stir = stir || {};

/*
   New Tabs Component
   @author: Ryan Kaye and Robert Morrison

   USAGE
   --
   eg myTabs = stir.tabs(el, true);

   PARAMS
   --
   @el is the element to be turned into tabs
   @doDeepLink true / false to allow / disallow deeplinking
 */

stir.tabhelper = (function () {
  var _id = 0;

  function _getId() {
	return ++_id;
  }

  return {
	getId: _getId,
  };
})();

/*
	TAB COMPONENT
*/

stir.tabs = function (el, doDeepLink_) {
  if (!el) return;

  /* The data-deeplink param will override the supplied param */
  const doDeepLink = el.dataset.deeplink && el.dataset.deeplink === "false" ? false : doDeepLink_;

  /* 
	WARNING GLOBALS
	@el param
  */
  let deeplinked = false;
  let browsersize = stir.MediaQuery.current;

  const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
  const sizes = ["small", "medium"];

  //const childElements = Array.prototype.slice.call(el.children);

  /*
	 Set up tabs and Listen for clicks
   */
  function init() {
	el.classList.add("stir-tabs");


	var tabGroupId = stir.tabhelper.getId();
	var tabId = 0;

	var tablist = document.createElement('div'); // a11y wrapper for tab elements only
	tablist.setAttribute("role", "tablist");
	el.insertAdjacentElement("afterbegin",tablist);


	getHeeders().forEach((header, index) => {
	  const panel = header.nextElementSibling.nodeName === "DIV" ? header.nextElementSibling : null;
	  const id = "_" + tabGroupId + "_" + ++tabId;
	  const button = document.createElement("button");

	  if (panel && 0 === header.children.length) {
		initComponent(button, header, panel, id);
		//initState(button, index);
		tablist.appendChild(button);
	  }
	});
	el.addEventListener("click", handleClick);
  }

  /*
	initComponent
  */
  const initComponent = (button, header, panel, id) => {

	// Classes
	button.classList.add("stir-tabs__tab");
	panel.classList.add("stir-tabs__content");
	// Attributes 
	button.setAttribute("role", "tab");
	//panel.setAttribute("data-tab-content", "");
	panel.setAttribute("role", "tabpanel");
	//panel.setAttribute("tabindex", "0");

	// Text
	button.textContent = header.textContent;
	var details = document.createElement('details');
	var summary = document.createElement('summary');
	details.open="true";
	summary.textContent = header.textContent;
	details.append(summary)
	panel.insertAdjacentElement("beforebegin",details); // h2
	details.append(panel);
	panel.prepend(header);


	// Mutual ARIA/ID references
	panel.id = panel.id || "panel" + id;
	button.id = button.id || "tab" + id;
	button.setAttribute("aria-controls", panel.id);
	panel.setAttribute("aria-labelledby", button.id);
  };

  /*
	State
  */
  //const initState = (control, index) => (index === 0 ? open(control) : close(control));

  const open = (control) => {
	control.classList.add("stir-tabs__tab--active"); // h2
	control.setAttribute("aria-selected", "true"); // btn
	//control.setAttribute("tabindex", "-1"); // btn
	var panel = document.getElementById(control.getAttribute('aria-controls'));
	if(!panel)return;
	panel.removeAttribute("aria-hidden"); //panel
	//panel.classList.remove("hide"); //panel
  };

  const close = (control) => {
	control.classList.remove("stir-tabs__tab--active");
	control.setAttribute("aria-selected", "false");
	//control.setAttribute("tabindex", "0");
	var panel = document.getElementById(control.getAttribute('aria-controls'));
	if(!panel)return;
	panel.setAttribute("aria-hidden", "true");
	//panel.classList.add("hide");
  };

  /*
	Helpers
  */
  const getBehaviour = () => sizes.includes(stir.MediaQuery.current) ? "accordion" : "tabs";

  const getHeeders = () => Array.prototype.slice.call(el.children).filter((el) => el.matches("h2,h3,h4"));

  const getClickedNode = (ev) => {
	if (ev.target.classList.contains("stir-tabs__tab")) return ev.target;
	//if ((ev.target.nodeName === "A" || ev.target.nodeName === "BUTTON") && ev.target.parentNode && ev.target.parentNode.classList.contains("stir-tabs__tab")) return ev.target.parentNode;
	return null;
  };

  /*
	 Events
   */

  const handleTabClick = (control) => {
	// Close all tabs
	Array.prototype.slice.call(control.parentElement.children).forEach((element) => {
	  if (element.classList.contains("stir-tabs__tab")) close(element);
	});

	open(control);
	return true;
  };

  /* 
	handleAccordionClick 
  */
  const handleAccordionClick = (control) => {
	//control.nextElementSibling.getAttribute("aria-hidden") === "true" ? open(control) : close(control);
	//return true;
  };

  /**
   * handle all clicks withing tab DOM
   **/
  function handleClick(ev) {
	const control = getClickedNode(ev);

	if (control) {
	  getBehaviour() === "tabs" ? handleTabClick(control) : handleAccordionClick(control);
	  if (doDeepLink) {
		const myhash = "#" + control.getAttribute('aria-controls');
		if (history.replaceState) history.replaceState(null, null, myhash);
		else location.hash = myhash;
	  }

	  /* Callbackify */
	  if (control.hasAttribute("data-tab-callback")) {
		var chain = window;
		var callback;
		var callbackdata = control.getAttribute("data-tab-callback").split(".");
		while (callbackdata.length > 0) {
		  var n = callbackdata.shift();
		  if ("function" === typeof chain[n]) {
			callback = chain[n];
		  } else if ("undefined" !== typeof chain[n]) {
			chain = chain[n];
		  }
		}
		callback && callback();
	  }
	  ev.preventDefault();
	}
  }

  /*
	 Reset the tabs to onload state
   */
  function reset(childElements) {
	if (!el || !childElements) return;

//	getHeeders().forEach((control, index) => {
//	  initState(control, index);
//	});
  }

  /*
	 Open correct tab panel if a deeplink is found
   */
  function deepLink() {
	var fragId, controller;
	if ((fragId = window.location.hash.slice(1))) {
	  if ((controller = el.querySelector('[aria-controls="' + fragId + '"]'))) {
		deeplinked = true;

		// Close all by default
		getHeeders().forEach((control) => {
		  if (control.classList.contains("stir-tabs__tab--active")) control.click();
		});

		// Open the required one
		if (controller.getAttribute("aria-selected") !== "true") controller.click();
	  }
	}
  }

  /*
	 Browser has been resized to new breakpoint so need to reinitialise the tabs
   */
  window.addEventListener("MediaQueryChange", () => {
	if (stir.MediaQuery.current !== browsersize) {
	  browsersize = stir.MediaQuery.current;
	  var behaviour = getBehaviour();
	  reset();
	  doDeepLink && deepLink();

	  console.info('[Tabs] resize!',getBehaviour());

	  console.info(document.querySelectorAll('.stir-tabs details'));

	  document.querySelectorAll('.stir-tabs details').forEach(
		panel=>panel.open=behaviour==="tabs"
	  );

	}
  });

  /* 
	Initial set up
  */
  init();
  doDeepLink && deepLink();

  /*  
	Public get and set Functions 
  */
  return {
	isDeepLinked: function () {
	  return deeplinked;
	},
	getEl: function () {
	  return el;
	},
	// nicer name
	getElement: function () {
	  return el;
	},
  };
};

/*
   ON LOAD 
   Set up any tabs found on the page
 */
(function () {
  const tabNodes = stir.nodes('.stir-tabs,[data-behaviour="tabs"]');
  const doDeepLink = true;
  //const foo = "";

  if (!tabNodes) return;

  const tabs = tabNodes.map((tab) => {
	return stir.tabs(tab, doDeepLink);
  });

  /* 
	Scroll to deep linked element if configured 
  */
  if (doDeepLink) {
	const deepLinkNodes = tabs.filter((tab) => {
	  if (tab.isDeepLinked()) return tab;
	});

	if (!deepLinkNodes[0]) return;
	setTimeout(function () { stir.scrollToElement(deepLinkNodes[0].getElement(), 120); }, 1500);
  }
})();
