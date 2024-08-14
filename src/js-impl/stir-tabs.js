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

  const instance = {};

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

  /*
	 Set up tabs and Listen for clicks
   */
  function init() {
		var tabGroupId = stir.tabhelper.getId();
		var tabId = 0;
		var tablist = document.createElement('div'); 
		// tablist is an a11y wrapper for tab elements
		// only and must NOT contain tabpanels.
		
		el.classList.add("stir-tabs");
		el.insertAdjacentElement("afterbegin",tablist);
		tablist.setAttribute("role", "tablist");

		instance.tabs = [];

		getHeeders().forEach(header => {
			const id = "_" + tabGroupId + "_" + ++tabId;
			const tab = document.createElement("button");
			const content = header.nextElementSibling.nodeName === "DIV" ? header.nextElementSibling : null;
			
			if (content) {
				tablist.appendChild(tab);
				instance.tabs.push(
					initComponent(id, header, content, tab)
				);
			}
		});

		tablist.addEventListener("click", handleClick);
		tablist.addEventListener("keyup", handleKeyboard, true);
		reset();
  }

  /*
	initComponent
  */
  const initComponent = (id, header, content, tab) => {
	const accordion = document.createElement("button");
	const panel = document.createElement('div');
	const label = header.textContent;
	header.insertAdjacentElement("beforebegin",panel);
	panel.append(header);
	panel.append(content);

	if(header.hasAttribute("data-tab-callback")){
		tab.setAttribute("data-tab-callback",header.getAttribute("data-tab-callback"))
		accordion.setAttribute("data-tab-callback",header.getAttribute("data-tab-callback"))
	}

	// Text
	tab.textContent = label;
	accordion.textContent = label;

	// Unique IDs for ARIA references later
	panel.id = panel.id || "panel" + id;
	tab.id = tab.id || "tab" + id;
	accordion.id = accordion.id || "accordion" + id;
	content.id = content.id || "content" + id;

	accordion.setAttribute("type","button");
	accordion.classList.add('pseudotab');
	accordion.addEventListener("click",handleAccordionClick);
	
	return {
		id:id,
		label:label,
		header:header,
		content:content,
		tab:tab,
		panel:panel,
		accordion:accordion
	}
	
};

/**
 * Handle the DOM transformation to implement either
 * Tabbed or Accordion behaviours. Called on
 * initialisation and on (debounced) browser resizing.
 */
function goGoGadgetTabbordian() {
	
	const tabs = ("tabs"===getBehaviour());
	const accordion = ("accordion"===getBehaviour());

	if(tabs) {
		instance.tabs.forEach((tab,index)=>{
			tab.panel.setAttribute("tabindex","0"); // needed for a11y
			tab.panel.setAttribute("role", "tabpanel");
			tab.tab.setAttribute("role", "tab");
			tab.panel.setAttribute("aria-labelledby", tab.tab.id);
			tab.tab.setAttribute("aria-controls", tab.panel.id);
			// Autoselect first tab
			tab.tab.setAttribute("aria-selected", !index);
			(0!==index) && tab.panel.setAttribute("hidden","");
		});
		instance.tabActive = instance.tabs[0].tab
	} else {
		instance.tabs.forEach(tab=>{
			tab.panel.removeAttribute("tabindex");
			tab.panel.removeAttribute("role");
			tab.panel.removeAttribute("hidden");
			tab.tab.removeAttribute("role");
			tab.panel.removeAttribute("aria-labelledby");
			tab.tab.removeAttribute("aria-controls");
		});
	}

	if(accordion){
		instance.tabs.forEach(tab => {
			tab.content.setAttribute("role","region");
			tab.header.textContent = '';
			tab.header.append(tab.accordion);
			tab.accordion.setAttribute("aria-expanded","false");
			tab.accordion.setAttribute("aria-controls",tab.content.id);
			tab.content.setAttribute("aria-labelledby",tab.accordion.id);
			tab.content.setAttribute("hidden","");
		});
		
	} else {
		instance.tabs.forEach(tab => {
			tab.accordion.remove();
			tab.header.textContent = tab.label;
			tab.content.removeAttribute("role");			
			tab.content.removeAttribute("aria-labelledby");
			tab.content.removeAttribute("hidden");
		});
	}

	deepLink();

  }

  /*
	State
  */

  const open = control => {
	control.setAttribute("aria-selected", "true");
	// There's no need explicitly to set tabindex to zero for <button>
	control.removeAttribute("tabindex");
	instance.tabActive = control;
	var panel = document.getElementById(control.getAttribute('aria-controls'));
	if(panel) {
		panel.removeAttribute("hidden"); //panel
	}
  };

  const close = (control) => {
	control.setAttribute("aria-selected", "false");
	control.setAttribute("tabindex", "-1");
	// Non-selected tabs should not be keyboard-tabbable (use cursor keys instead)
	var panel = document.getElementById(control.getAttribute('aria-controls'));
	if(panel) {
		panel.setAttribute("hidden","");
	}
  };

  /*
	Helpers
  */
  const getBehaviour = () => sizes.includes(stir.MediaQuery.current) ? "accordion" : "tabs";

  const getHeeders = () => Array.prototype.slice.call(el.children).filter((el) => el.matches("h2,h3,h4"));

  const getClickedNode = ev => ev.target.getAttribute("role")==="tab" ? ev.target : null;

  /*
	 Events
   */

  const handleTabClick = (control) => {
	// Close all tabs
	instance.tabs.forEach(tab => close(tab.tab));

	open(control);
	return true;
  };


  function handleAccordionClick(event) {
	const controller = event.target;
	const id = controller.getAttribute("aria-controls");
	if(!controller||!id) return;
	const expander = document.getElementById(id);
	const myhash = "#" + id.replace('content','panel');
	
	if(expander.hidden) {
		if (history.replaceState) history.replaceState(null, null, myhash);
		expander.removeAttribute("hidden");
		controller.setAttribute("aria-expanded","true");
		stir.callback.enqueue(controller.getAttribute("data-tab-callback"));
	} else {
		expander.setAttribute("hidden","");
		controller.setAttribute("aria-expanded","false");
	}
  };

	/**
	 * Tablist click delegate
	 **/
	function handleClick(event) {
		const control = getClickedNode(event);

		if (control) {
			control.focus();
			handleTabClick(control)
			//getBehaviour() === "tabs" ? handleTabClick(control) : handleAccordionClick(control);

			if (doDeepLink) {
				const myhash = "#" + control.getAttribute('aria-controls');
				if (history.replaceState) history.replaceState(null, null, myhash);
				else location.hash = myhash;
			}

			/* Callbackify */
			stir.callback.enqueue(control.getAttribute("data-tab-callback"));
			event.preventDefault();
		}
	}

  function handleKeyboard(event) {
	if("ArrowRight"===event.code) {
		//next tab
		if(instance.tabActive.nextElementSibling) {
			instance.tabActive.nextElementSibling.click();
		} else {
			// wrap around to first tab:
			instance.tabs[0].tab.click();
		}
		
	} else if ("ArrowLeft"===event.code) {
		//previous tab
		if(instance.tabActive.previousElementSibling) {
			instance.tabActive.previousElementSibling.click();
	 	} else {
			// wrap around to last tab:
			instance.tabs[instance.tabs.length-1].tab.click();
		}

	} else if("Home"===event.code){
		//first tab
		instance.tabs[0].tab.click();
		event.preventDefault();

	} else if("End"===event.code){
		//last tab
		instance.tabs[instance.tabs.length-1].tab.click();
		event.preventDefault();
	}
  }

  /*
	 Reset the tabs to onload state:
	 0th tab open, the rest closed.
   */
  function reset() {
	if (!el) return;
	goGoGadgetTabbordian();
  }

  /*
	 Open respective tab panel if a deeplink is found, otherwise open the first 
   */
  function deepLink() {
	if(!doDeepLink) return;
	var fragId, controller;
	if ((fragId = window.location.hash.slice(1))) {
		// TABS
		if ((controller = el.querySelector('[aria-controls="' + fragId + '"]'))) {
			deeplinked = true;

			// Close all by default
//			instance.tabs.forEach((tab) => {
//				if ("true"===tab.tab.getAttribute("aria-selected")) tab.tab.click();
//			});

			// Open the required one (if not already open)
			if ("true"!==controller.getAttribute("aria-selected")) controller.click();

		}
		// ACCORDION
		else if ((controller = el.querySelector('[aria-controls="' + fragId.replace('panel','content') + '"]'))) {
			instance.tabs.forEach((tab) => {
				if ("true"===tab.accordion.getAttribute("aria-expanded")) tab.accordion.click();
			});
			controller.click();
		}
	} else {

	}
  }

  /*
	 Browser has been resized to new breakpoint so need to reinitialise the tabs
   */
  window.addEventListener("MediaQueryChange", () => {
	if (stir.MediaQuery.current !== browsersize) {
	  browsersize = stir.MediaQuery.current;
	  reset();
	}
  });

  /* 
	Initial set up
  */
  init();

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
