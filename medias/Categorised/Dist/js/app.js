/**
 * what-input - A global utility for tracking the current input method (mouse, keyboard or touch).
 * @version v5.2.1
 * @link https://github.com/ten1seven/what-input
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("whatInput", [], factory);
	else if(typeof exports === 'object')
		exports["whatInput"] = factory();
	else
		root["whatInput"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = function () {
	  /*
	   * bail out if there is no document or window
	   * (i.e. in a node/non-DOM environment)
	   *
	   * Return a stubbed API instead
	   */
	  if (typeof document === 'undefined' || typeof window === 'undefined') {
	    return {
	      // always return "initial" because no interaction will ever be detected
	      ask: function ask() {
	        return 'initial';
	      },

	      // always return null
	      element: function element() {
	        return null;
	      },

	      // no-op
	      ignoreKeys: function ignoreKeys() {},

	      // no-op
	      specificKeys: function specificKeys() {},

	      // no-op
	      registerOnChange: function registerOnChange() {},

	      // no-op
	      unRegisterOnChange: function unRegisterOnChange() {}
	    };
	  }

	  /*
	   * variables
	   */

	  // cache document.documentElement
	  var docElem = document.documentElement;

	  // currently focused dom element
	  var currentElement = null;

	  // last used input type
	  var currentInput = 'initial';

	  // last used input intent
	  var currentIntent = currentInput;

	  // UNIX timestamp of current event
	  var currentTimestamp = Date.now();

	  // check for sessionStorage support
	  // then check for session variables and use if available
	  try {
	    if (window.sessionStorage.getItem('what-input')) {
	      currentInput = window.sessionStorage.getItem('what-input');
	    }

	    if (window.sessionStorage.getItem('what-intent')) {
	      currentIntent = window.sessionStorage.getItem('what-intent');
	    }
	  } catch (e) {}

	  // form input types
	  var formInputs = ['button', 'input', 'select', 'textarea'];

	  // empty array for holding callback functions
	  var functionList = [];

	  // list of modifier keys commonly used with the mouse and
	  // can be safely ignored to prevent false keyboard detection
	  var ignoreMap = [16, // shift
	  17, // control
	  18, // alt
	  91, // Windows key / left Apple cmd
	  93 // Windows menu / right Apple cmd
	  ];

	  var specificMap = [];

	  // mapping of events to input types
	  var inputMap = {
	    keydown: 'keyboard',
	    keyup: 'keyboard',
	    mousedown: 'mouse',
	    mousemove: 'mouse',
	    MSPointerDown: 'pointer',
	    MSPointerMove: 'pointer',
	    pointerdown: 'pointer',
	    pointermove: 'pointer',
	    touchstart: 'touch',
	    touchend: 'touch'

	    // boolean: true if the page is being scrolled
	  };var isScrolling = false;

	  // store current mouse position
	  var mousePos = {
	    x: null,
	    y: null

	    // map of IE 10 pointer events
	  };var pointerMap = {
	    2: 'touch',
	    3: 'touch', // treat pen like touch
	    4: 'mouse'

	    // check support for passive event listeners
	  };var supportsPassive = false;

	  try {
	    var opts = Object.defineProperty({}, 'passive', {
	      get: function get() {
	        supportsPassive = true;
	      }
	    });

	    window.addEventListener('test', null, opts);
	  } catch (e) {}

	  /*
	   * set up
	   */

	  var setUp = function setUp() {
	    // add correct mouse wheel event mapping to `inputMap`
	    inputMap[detectWheel()] = 'mouse';

	    addListeners();
	    doUpdate('input');
	    doUpdate('intent');
	  };

	  /*
	   * events
	   */

	  var addListeners = function addListeners() {
	    // `pointermove`, `MSPointerMove`, `mousemove` and mouse wheel event binding
	    // can only demonstrate potential, but not actual, interaction
	    // and are treated separately
	    var options = supportsPassive ? { passive: true } : false;

	    // pointer events (mouse, pen, touch)
	    if (window.PointerEvent) {
	      window.addEventListener('pointerdown', setInput);
	      window.addEventListener('pointermove', setIntent);
	    } else if (window.MSPointerEvent) {
	      window.addEventListener('MSPointerDown', setInput);
	      window.addEventListener('MSPointerMove', setIntent);
	    } else {
	      // mouse events
	      window.addEventListener('mousedown', setInput);
	      window.addEventListener('mousemove', setIntent);

	      // touch events
	      if ('ontouchstart' in window) {
	        window.addEventListener('touchstart', setInput, options);
	        window.addEventListener('touchend', setInput);
	      }
	    }

	    // mouse wheel
	    window.addEventListener(detectWheel(), setIntent, options);

	    // keyboard events
	    window.addEventListener('keydown', setInput);
	    window.addEventListener('keyup', setInput);

	    // focus events
	    window.addEventListener('focusin', setElement);
	    window.addEventListener('focusout', clearElement);
	  };

	  // checks conditions before updating new input
	  var setInput = function setInput(event) {
	    var eventKey = event.which;
	    var value = inputMap[event.type];

	    if (value === 'pointer') {
	      value = pointerType(event);
	    }

	    var ignoreMatch = !specificMap.length && ignoreMap.indexOf(eventKey) === -1;

	    var specificMatch = specificMap.length && specificMap.indexOf(eventKey) !== -1;

	    var shouldUpdate = value === 'keyboard' && eventKey && (ignoreMatch || specificMatch) || value === 'mouse' || value === 'touch';

	    // prevent touch detection from being overridden by event execution order
	    if (validateTouch(value)) {
	      shouldUpdate = false;
	    }

	    if (shouldUpdate && currentInput !== value) {
	      currentInput = value;

	      try {
	        window.sessionStorage.setItem('what-input', currentInput);
	      } catch (e) {}

	      doUpdate('input');
	    }

	    if (shouldUpdate && currentIntent !== value) {
	      // preserve intent for keyboard interaction with form fields
	      var activeElem = document.activeElement;
	      var notFormInput = activeElem && activeElem.nodeName && formInputs.indexOf(activeElem.nodeName.toLowerCase()) === -1 || activeElem.nodeName.toLowerCase() === 'button' && !checkClosest(activeElem, 'form');

	      if (notFormInput) {
	        currentIntent = value;

	        try {
	          window.sessionStorage.setItem('what-intent', currentIntent);
	        } catch (e) {}

	        doUpdate('intent');
	      }
	    }
	  };

	  // updates the doc and `inputTypes` array with new input
	  var doUpdate = function doUpdate(which) {
	    docElem.setAttribute('data-what' + which, which === 'input' ? currentInput : currentIntent);

	    fireFunctions(which);
	  };

	  // updates input intent for `mousemove` and `pointermove`
	  var setIntent = function setIntent(event) {
	    var value = inputMap[event.type];

	    if (value === 'pointer') {
	      value = pointerType(event);
	    }

	    // test to see if `mousemove` happened relative to the screen to detect scrolling versus mousemove
	    detectScrolling(event);

	    // only execute if scrolling isn't happening
	    if (!isScrolling && !validateTouch(value) && currentIntent !== value) {
	      currentIntent = value;

	      try {
	        window.sessionStorage.setItem('what-intent', currentIntent);
	      } catch (e) {}

	      doUpdate('intent');
	    }
	  };

	  var setElement = function setElement(event) {
	    if (!event.target.nodeName) {
	      // If nodeName is undefined, clear the element
	      // This can happen if click inside an <svg> element.
	      clearElement();
	      return;
	    }

	    currentElement = event.target.nodeName.toLowerCase();
	    docElem.setAttribute('data-whatelement', currentElement);

	    if (event.target.classList && event.target.classList.length) {
	      docElem.setAttribute('data-whatclasses', event.target.classList.toString().replace(' ', ','));
	    }
	  };

	  var clearElement = function clearElement() {
	    currentElement = null;

	    docElem.removeAttribute('data-whatelement');
	    docElem.removeAttribute('data-whatclasses');
	  };

	  /*
	   * utilities
	   */

	  var pointerType = function pointerType(event) {
	    if (typeof event.pointerType === 'number') {
	      return pointerMap[event.pointerType];
	    } else {
	      // treat pen like touch
	      return event.pointerType === 'pen' ? 'touch' : event.pointerType;
	    }
	  };

	  // prevent touch detection from being overridden by event execution order
	  var validateTouch = function validateTouch(value) {
	    var timestamp = Date.now();

	    var touchIsValid = value === 'mouse' && currentInput === 'touch' && timestamp - currentTimestamp < 200;

	    currentTimestamp = timestamp;

	    return touchIsValid;
	  };

	  // detect version of mouse wheel event to use
	  // via https://developer.mozilla.org/en-US/docs/Web/Events/wheel
	  var detectWheel = function detectWheel() {
	    var wheelType = void 0;

	    // Modern browsers support "wheel"
	    if ('onwheel' in document.createElement('div')) {
	      wheelType = 'wheel';
	    } else {
	      // Webkit and IE support at least "mousewheel"
	      // or assume that remaining browsers are older Firefox
	      wheelType = document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
	    }

	    return wheelType;
	  };

	  // runs callback functions
	  var fireFunctions = function fireFunctions(type) {
	    for (var i = 0, len = functionList.length; i < len; i++) {
	      if (functionList[i].type === type) {
	        functionList[i].fn.call(undefined, type === 'input' ? currentInput : currentIntent);
	      }
	    }
	  };

	  // finds matching element in an object
	  var objPos = function objPos(match) {
	    for (var i = 0, len = functionList.length; i < len; i++) {
	      if (functionList[i].fn === match) {
	        return i;
	      }
	    }
	  };

	  var detectScrolling = function detectScrolling(event) {
	    if (mousePos['x'] !== event.screenX || mousePos['y'] !== event.screenY) {
	      isScrolling = false;

	      mousePos['x'] = event.screenX;
	      mousePos['y'] = event.screenY;
	    } else {
	      isScrolling = true;
	    }
	  };

	  // manual version of `closest()`
	  var checkClosest = function checkClosest(elem, tag) {
	    var ElementPrototype = window.Element.prototype;

	    if (!ElementPrototype.matches) {
	      ElementPrototype.matches = ElementPrototype.msMatchesSelector || ElementPrototype.webkitMatchesSelector;
	    }

	    if (!ElementPrototype.closest) {
	      do {
	        if (elem.matches(tag)) {
	          return elem;
	        }

	        elem = elem.parentElement || elem.parentNode;
	      } while (elem !== null && elem.nodeType === 1);

	      return null;
	    } else {
	      return elem.closest(tag);
	    }
	  };

	  /*
	   * init
	   */

	  // don't start script unless browser cuts the mustard
	  // (also passes if polyfills are used)
	  if ('addEventListener' in window && Array.prototype.indexOf) {
	    setUp();
	  }

	  /*
	   * api
	   */

	  return {
	    // returns string: the current input type
	    // opt: 'intent'|'input'
	    // 'input' (default): returns the same value as the `data-whatinput` attribute
	    // 'intent': includes `data-whatintent` value if it's different than `data-whatinput`
	    ask: function ask(opt) {
	      return opt === 'intent' ? currentIntent : currentInput;
	    },

	    // returns string: the currently focused element or null
	    element: function element() {
	      return currentElement;
	    },

	    // overwrites ignored keys with provided array
	    ignoreKeys: function ignoreKeys(arr) {
	      ignoreMap = arr;
	    },

	    // overwrites specific char keys to update on
	    specificKeys: function specificKeys(arr) {
	      specificMap = arr;
	    },

	    // attach functions to input and intent "events"
	    // funct: function to fire on change
	    // eventType: 'input'|'intent'
	    registerOnChange: function registerOnChange(fn, eventType) {
	      functionList.push({
	        fn: fn,
	        type: eventType || 'input'
	      });
	    },

	    unRegisterOnChange: function unRegisterOnChange(fn) {
	      var position = objPos(fn);

	      if (position || position === 0) {
	        functionList.splice(position, 1);
	      }
	    }
	  };
	}();

/***/ })
/******/ ])
});
;
/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!this.json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

/*! @vimeo/player v2.6.5 | (c) 2018 Vimeo | MIT License | https://github.com/vimeo/player.js */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e.Vimeo=e.Vimeo||{},e.Vimeo.Player=t())}(this,function(){"use strict";function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var e="undefined"!=typeof global&&"[object global]"==={}.toString.call(global);function i(e,t){return 0===e.indexOf(t.toLowerCase())?e:"".concat(t.toLowerCase()).concat(e.substr(0,1).toUpperCase()).concat(e.substr(1))}function c(e){return/^(https?:)?\/\/((player|www)\.)?vimeo\.com(?=$|\/)/.test(e)}function u(){var e,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},n=t.id,r=t.url,o=n||r;if(!o)throw new Error("An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.");if(e=o,!isNaN(parseFloat(e))&&isFinite(e)&&Math.floor(e)==e)return"https://vimeo.com/".concat(o);if(c(o))return o.replace("http:","https:");if(n)throw new TypeError("“".concat(n,"” is not a valid video id."));throw new TypeError("“".concat(o,"” is not a vimeo.com url."))}var t=void 0!==Array.prototype.indexOf,n="undefined"!=typeof window&&void 0!==window.postMessage;if(!(e||t&&n))throw new Error("Sorry, the Vimeo Player API is not available in this browser.");var o="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};!function(e){if(!e.WeakMap){var n=Object.prototype.hasOwnProperty,o=function(e,t,n){Object.defineProperty?Object.defineProperty(e,t,{configurable:!0,writable:!0,value:n}):e[t]=n};e.WeakMap=function(){function e(){if(void 0===this)throw new TypeError("Constructor WeakMap requires 'new'");if(o(this,"_id","_WeakMap"+"_"+t()+"."+t()),0<arguments.length)throw new TypeError("WeakMap iterable is not supported")}function r(e,t){if(!i(e)||!n.call(e,"_id"))throw new TypeError(t+" method called on incompatible receiver "+typeof e)}function t(){return Math.random().toString().substring(2)}return o(e.prototype,"delete",function(e){if(r(this,"delete"),!i(e))return!1;var t=e[this._id];return!(!t||t[0]!==e)&&(delete e[this._id],!0)}),o(e.prototype,"get",function(e){if(r(this,"get"),i(e)){var t=e[this._id];return t&&t[0]===e?t[1]:void 0}}),o(e.prototype,"has",function(e){if(r(this,"has"),!i(e))return!1;var t=e[this._id];return!(!t||t[0]!==e)}),o(e.prototype,"set",function(e,t){if(r(this,"set"),!i(e))throw new TypeError("Invalid value used as weak map key");var n=e[this._id];return n&&n[0]===e?n[1]=t:o(e,this._id,[e,t]),this}),o(e,"_polyfill",!0),e}()}function i(e){return Object(e)===e}}("undefined"!=typeof self?self:"undefined"!=typeof window?window:o);var a,s=(function(e){var t,n,r;r=function(){var t,a,n,e=Object.prototype.toString,r="undefined"!=typeof setImmediate?function(e){return setImmediate(e)}:setTimeout;try{Object.defineProperty({},"x",{}),t=function(e,t,n,r){return Object.defineProperty(e,t,{value:n,writable:!0,configurable:!1!==r})}}catch(e){t=function(e,t,n){return e[t]=n,e}}function i(e,t){n.add(e,t),a||(a=r(n.drain))}function u(e){var t,n=typeof e;return null==e||"object"!=n&&"function"!=n||(t=e.then),"function"==typeof t&&t}function c(){for(var e=0;e<this.chain.length;e++)o(this,1===this.state?this.chain[e].success:this.chain[e].failure,this.chain[e]);this.chain.length=0}function o(e,t,n){var r,o;try{!1===t?n.reject(e.msg):(r=!0===t?e.msg:t.call(void 0,e.msg))===n.promise?n.reject(TypeError("Promise-chain cycle")):(o=u(r))?o.call(r,n.resolve,n.reject):n.resolve(r)}catch(e){n.reject(e)}}function s(e){var t=this;t.triggered||(t.triggered=!0,t.def&&(t=t.def),t.msg=e,t.state=2,0<t.chain.length&&i(c,t))}function l(e,n,r,o){for(var t=0;t<n.length;t++)!function(t){e.resolve(n[t]).then(function(e){r(t,e)},o)}(t)}function f(e){this.def=e,this.triggered=!1}function d(e){this.promise=e,this.state=0,this.triggered=!1,this.chain=[],this.msg=void 0}function h(e){if("function"!=typeof e)throw TypeError("Not a function");if(0!==this.__NPO__)throw TypeError("Not a promise");this.__NPO__=1;var r=new d(this);this.then=function(e,t){var n={success:"function"!=typeof e||e,failure:"function"==typeof t&&t};return n.promise=new this.constructor(function(e,t){if("function"!=typeof e||"function"!=typeof t)throw TypeError("Not a function");n.resolve=e,n.reject=t}),r.chain.push(n),0!==r.state&&i(c,r),n.promise},this.catch=function(e){return this.then(void 0,e)};try{e.call(void 0,function(e){(function e(n){var r,o=this;if(!o.triggered){o.triggered=!0,o.def&&(o=o.def);try{(r=u(n))?i(function(){var t=new f(o);try{r.call(n,function(){e.apply(t,arguments)},function(){s.apply(t,arguments)})}catch(e){s.call(t,e)}}):(o.msg=n,o.state=1,0<o.chain.length&&i(c,o))}catch(e){s.call(new f(o),e)}}}).call(r,e)},function(e){s.call(r,e)})}catch(e){s.call(r,e)}}n=function(){var n,r,o;function i(e,t){this.fn=e,this.self=t,this.next=void 0}return{add:function(e,t){o=new i(e,t),r?r.next=o:n=o,r=o,o=void 0},drain:function(){var e=n;for(n=r=a=void 0;e;)e.fn.call(e.self),e=e.next}}}();var v=t({},"constructor",h,!1);return t(h.prototype=v,"__NPO__",0,!1),t(h,"resolve",function(n){return n&&"object"==typeof n&&1===n.__NPO__?n:new this(function(e,t){if("function"!=typeof e||"function"!=typeof t)throw TypeError("Not a function");e(n)})}),t(h,"reject",function(n){return new this(function(e,t){if("function"!=typeof e||"function"!=typeof t)throw TypeError("Not a function");t(n)})}),t(h,"all",function(t){var a=this;return"[object Array]"!=e.call(t)?a.reject(TypeError("Not an array")):0===t.length?a.resolve([]):new a(function(n,e){if("function"!=typeof n||"function"!=typeof e)throw TypeError("Not a function");var r=t.length,o=Array(r),i=0;l(a,t,function(e,t){o[e]=t,++i===r&&n(o)},e)})}),t(h,"race",function(t){var r=this;return"[object Array]"!=e.call(t)?r.reject(TypeError("Not an array")):new r(function(n,e){if("function"!=typeof n||"function"!=typeof e)throw TypeError("Not a function");l(r,t,function(e,t){n(t)},e)})}),h},(n=o)[t="Promise"]=n[t]||r(),e.exports&&(e.exports=n[t])}(a={exports:{}},a.exports),a.exports),l=new WeakMap;function f(e,t,n){var r=l.get(e.element)||{};t in r||(r[t]=[]),r[t].push(n),l.set(e.element,r)}function d(e,t){return(l.get(e.element)||{})[t]||[]}function h(e,t,n){var r=l.get(e.element)||{};if(!r[t])return!0;if(!n)return r[t]=[],l.set(e.element,r),!0;var o=r[t].indexOf(n);return-1!==o&&r[t].splice(o,1),l.set(e.element,r),r[t]&&0===r[t].length}var v=["autopause","autoplay","background","byline","color","height","id","loop","maxheight","maxwidth","muted","playsinline","portrait","responsive","speed","title","transparent","url","width"];function p(r){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};return v.reduce(function(e,t){var n=r.getAttribute("data-vimeo-".concat(t));return(n||""===n)&&(e[t]=""===n?1:n),e},e)}function m(e,t){var n=e.html;if(!t)throw new TypeError("An element must be provided");if(null!==t.getAttribute("data-vimeo-initialized"))return t.querySelector("iframe");var r=document.createElement("div");return r.innerHTML=n,t.appendChild(r.firstChild),t.setAttribute("data-vimeo-initialized","true"),t.querySelector("iframe")}function y(i){var a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},u=2<arguments.length?arguments[2]:void 0;return new Promise(function(t,n){if(!c(i))throw new TypeError("“".concat(i,"” is not a vimeo.com url."));var e="https://vimeo.com/api/oembed.json?url=".concat(encodeURIComponent(i),"&domain=").concat(window.location.hostname);for(var r in a)a.hasOwnProperty(r)&&(e+="&".concat(r,"=").concat(encodeURIComponent(a[r])));var o="XDomainRequest"in window?new XDomainRequest:new XMLHttpRequest;o.open("GET",e,!0),o.onload=function(){if(404!==o.status)if(403!==o.status)try{var e=JSON.parse(o.responseText);if(403===e.domain_status_code)return m(e,u),void n(new Error("“".concat(i,"” is not embeddable.")));t(e)}catch(e){n(e)}else n(new Error("“".concat(i,"” is not embeddable.")));else n(new Error("“".concat(i,"” was not found.")))},o.onerror=function(){var e=o.status?" (".concat(o.status,")"):"";n(new Error("There was an error fetching the embed code from Vimeo".concat(e,".")))},o.send()})}function w(e){return"string"==typeof e&&(e=JSON.parse(e)),e}function g(e,t,n){if(e.element.contentWindow&&e.element.contentWindow.postMessage){var r={method:t};void 0!==n&&(r.value=n);var o=parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/,"$1"));8<=o&&o<10&&(r=JSON.stringify(r)),e.element.contentWindow.postMessage(r,e.origin)}}function b(n,r){var t,e=[];if((r=w(r)).event){if("error"===r.event)d(n,r.data.method).forEach(function(e){var t=new Error(r.data.message);t.name=r.data.name,e.reject(t),h(n,r.data.method,e)});e=d(n,"event:".concat(r.event)),t=r.data}else if(r.method){var o=function(e,t){var n=d(e,t);if(n.length<1)return!1;var r=n.shift();return h(e,t,r),r}(n,r.method);o&&(e.push(o),t=r.value)}e.forEach(function(e){try{if("function"==typeof e)return void e.call(n,t);e.resolve(t)}catch(e){}})}var E=new WeakMap,k=new WeakMap,Player=function(){function Player(i){var a=this,r=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Player),window.jQuery&&i instanceof jQuery&&(1<i.length&&window.console&&console.warn&&console.warn("A jQuery object with multiple elements was passed, using the first element."),i=i[0]),"undefined"!=typeof document&&"string"==typeof i&&(i=document.getElementById(i)),!(i instanceof window.HTMLElement))throw new TypeError("You must pass either a valid element or a valid id.");if("IFRAME"!==i.nodeName){var e=i.querySelector("iframe");e&&(i=e)}if("IFRAME"===i.nodeName&&!c(i.getAttribute("src")||""))throw new Error("The player element passed isn’t a Vimeo embed.");if(E.has(i))return E.get(i);this.element=i,this.origin="*";var t=new s(function(o,t){var e=function(e){if(c(e.origin)&&a.element.contentWindow===e.source){"*"===a.origin&&(a.origin=e.origin);var t=w(e.data),n="event"in t&&"ready"===t.event,r="method"in t&&"ping"===t.method;if(n||r)return a.element.setAttribute("data-ready","true"),void o();b(a,t)}};if(window.addEventListener?window.addEventListener("message",e,!1):window.attachEvent&&window.attachEvent("onmessage",e),"IFRAME"!==a.element.nodeName){var n=p(i,r);y(u(n),n,i).then(function(e){var t,n,r,o=m(e,i);return a.element=o,a._originalElement=i,t=i,n=o,r=l.get(t),l.set(n,r),l.delete(t),E.set(a.element,a),e}).catch(function(e){return t(e)})}});return k.set(this,t),E.set(this.element,this),"IFRAME"===this.element.nodeName&&g(this,"ping"),this}var e,t,n;return e=Player,(t=[{key:"callMethod",value:function(n){var r=this,o=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};return new s(function(e,t){return r.ready().then(function(){f(r,n,{resolve:e,reject:t}),g(r,n,o)}).catch(function(e){t(e)})})}},{key:"get",value:function(n){var r=this;return new s(function(e,t){return n=i(n,"get"),r.ready().then(function(){f(r,n,{resolve:e,reject:t}),g(r,n)})})}},{key:"set",value:function(r,e){var o=this;return s.resolve(e).then(function(n){if(r=i(r,"set"),null==n)throw new TypeError("There must be a value to set.");return o.ready().then(function(){return new s(function(e,t){f(o,r,{resolve:e,reject:t}),g(o,r,n)})})})}},{key:"on",value:function(e,t){if(!e)throw new TypeError("You must pass an event name.");if(!t)throw new TypeError("You must pass a callback function.");if("function"!=typeof t)throw new TypeError("The callback must be a function.");0===d(this,"event:".concat(e)).length&&this.callMethod("addEventListener",e).catch(function(){}),f(this,"event:".concat(e),t)}},{key:"off",value:function(e,t){if(!e)throw new TypeError("You must pass an event name.");if(t&&"function"!=typeof t)throw new TypeError("The callback must be a function.");h(this,"event:".concat(e),t)&&this.callMethod("removeEventListener",e).catch(function(e){})}},{key:"loadVideo",value:function(e){return this.callMethod("loadVideo",e)}},{key:"ready",value:function(){var e=k.get(this)||new s(function(e,t){t(new Error("Unknown player. Probably unloaded."))});return s.resolve(e)}},{key:"addCuePoint",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};return this.callMethod("addCuePoint",{time:e,data:t})}},{key:"removeCuePoint",value:function(e){return this.callMethod("removeCuePoint",e)}},{key:"enableTextTrack",value:function(e,t){if(!e)throw new TypeError("You must pass a language.");return this.callMethod("enableTextTrack",{language:e,kind:t})}},{key:"disableTextTrack",value:function(){return this.callMethod("disableTextTrack")}},{key:"pause",value:function(){return this.callMethod("pause")}},{key:"play",value:function(){return this.callMethod("play")}},{key:"unload",value:function(){return this.callMethod("unload")}},{key:"destroy",value:function(){var t=this;return new s(function(e){k.delete(t),E.delete(t.element),t._originalElement&&(E.delete(t._originalElement),t._originalElement.removeAttribute("data-vimeo-initialized")),t.element&&"IFRAME"===t.element.nodeName&&t.element.parentNode&&t.element.parentNode.removeChild(t.element),e()})}},{key:"getAutopause",value:function(){return this.get("autopause")}},{key:"setAutopause",value:function(e){return this.set("autopause",e)}},{key:"getColor",value:function(){return this.get("color")}},{key:"setColor",value:function(e){return this.set("color",e)}},{key:"getCuePoints",value:function(){return this.get("cuePoints")}},{key:"getCurrentTime",value:function(){return this.get("currentTime")}},{key:"setCurrentTime",value:function(e){return this.set("currentTime",e)}},{key:"getDuration",value:function(){return this.get("duration")}},{key:"getEnded",value:function(){return this.get("ended")}},{key:"getLoop",value:function(){return this.get("loop")}},{key:"setLoop",value:function(e){return this.set("loop",e)}},{key:"getPaused",value:function(){return this.get("paused")}},{key:"getPlaybackRate",value:function(){return this.get("playbackRate")}},{key:"setPlaybackRate",value:function(e){return this.set("playbackRate",e)}},{key:"getTextTracks",value:function(){return this.get("textTracks")}},{key:"getVideoEmbedCode",value:function(){return this.get("videoEmbedCode")}},{key:"getVideoId",value:function(){return this.get("videoId")}},{key:"getVideoTitle",value:function(){return this.get("videoTitle")}},{key:"getVideoWidth",value:function(){return this.get("videoWidth")}},{key:"getVideoHeight",value:function(){return this.get("videoHeight")}},{key:"getVideoUrl",value:function(){return this.get("videoUrl")}},{key:"getVolume",value:function(){return this.get("volume")}},{key:"setVolume",value:function(e){return this.set("volume",e)}}])&&r(e.prototype,t),n&&r(e,n),Player}();return e||(function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:document,t=[].slice.call(e.querySelectorAll("[data-vimeo-id], [data-vimeo-url]")),n=function(e){"console"in window&&console.error&&console.error("There was an error creating an embed: ".concat(e))};t.forEach(function(t){try{if(null!==t.getAttribute("data-vimeo-defer"))return;var e=p(t);y(u(e),e,t).then(function(e){return m(e,t)}).catch(n)}catch(e){n(e)}})}(),function(){var r=0<arguments.length&&void 0!==arguments[0]?arguments[0]:document;if(!window.VimeoPlayerResizeEmbeds_){window.VimeoPlayerResizeEmbeds_=!0;var e=function(e){if(c(e.origin)&&e.data&&"spacechange"===e.data.event)for(var t=r.querySelectorAll("iframe"),n=0;n<t.length;n++)if(t[n].contentWindow===e.source){t[n].parentElement.style.paddingBottom="".concat(e.data.data[0].bottom,"px");break}};window.addEventListener?window.addEventListener("message",e,!1):window.attachEvent&&window.attachEvent("onmessage",e)}}()),Player});

/*
    Polyfills
 */

/*
    element.closest()
    For browsers that do not support Element.closest(),
    but carry support for element.matches()
    (or a prefixed equivalent, meaning IE9+)


if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
 */
/*
    element.remove();
    https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md


(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty("remove")) {
      return;
    }
    Object.defineProperty(item, "remove", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        this.parentNode.removeChild(this);
      },
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
 */
/*
    Array.includes()
    https://github.com/kevlatus/polyfill-array-includes/blob/master/array-includes.js


if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, "includes", {
    value: function (searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      var len = o.length >>> 0;

      if (len === 0) {
        return false;
      }

      var n = fromIndex | 0;

      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y));
      }

      while (k < len) {
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        k++;
      }

      return false;
    },
  });
}
 */
/*
    String.includes()
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    "use strict";

    if (search instanceof RegExp) {
      throw TypeError("first argument must not be a RegExp");
    }
    if (start === undefined) {
      start = 0;
    }
    return this.indexOf(search, start) !== -1;
  };
}
   */

/*
    Object.entries()
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries


if (!Object.entries) {
  Object.entries = function (obj) {
    var ownProps = Object.keys(obj),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}
 */
/*
    Object.values()


if (!Object.values) {
  Object.values = function (obj) {
    var vals = Object.keys(obj).map(function (e) {
      return obj[e];
    });
    return vals;
  };
}
 */

/**
 * Generate an avatar image from letters
 */
(function (w, d) {

  function AvatarImage(letters, color, size) {
    var canvas = d.createElement('canvas');
    var context = canvas.getContext("2d");
    var size = size || 60;

    // // Generate a random color every time function is called
    // var color =  "#" + (Math.random() * 0xFFFFFF << 0).toString(16);

    // Set canvas with & height
    canvas.width = size;
    canvas.height = size;

    // Select a font family to support different language characters
    // like Arial
    context.font = Math.round(canvas.width / 2) + "px Arial";
    context.textAlign = "center";

    // Setup background and front color
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FFF";
    context.fillText(letters, size / 2, size / 1.5);

    // Set image representation in default format (png)
    dataURI = canvas.toDataURL();

    // Dispose canvas element
    canvas = null;

    return dataURI;
  }

  w.AvatarImage = AvatarImage;

})(window, document);

(function(w, d) {

  function generateAvatars() {
    var images = d.querySelectorAll('img[data-letters]');

    for (var i = 0, len = images.length; i < len; i++) {
      var img = images[i];
      img.src = AvatarImage(img.getAttribute('data-letters'), img.getAttribute('data-color'), img.getAttribute('width'));
      img.removeAttribute('data-letters');
    }
  }

  d.addEventListener('DOMContentLoaded', function (event) {
      generateAvatars();
  });

})(window, document);

/**
 * Site wide tools
 */
var AvatarImageSVG = (function() {

	// PRIVATE

	/**
	 * Get initials from name E.g. "Robert Morrison" ( -> RM icon)
	 * @param name {string}
	 * @return string Initials e.g. RM
	 */
	var _initials = function (name) {
		if ((typeof (name) == "undefined") || (name == "Unknown name")) return "";
		var nameChunk = name.split(" ");
		return nameChunk[0].charAt(0) + nameChunk[nameChunk.length - 1].charAt(0);
	}

	/**
	 * Generate the html for svg initials icon from name
	 * @param alpha {string}
	 * @return integer
	 */
	var _hue = function (alpha) {
		if (typeof (alpha) == "undefined") return 0;
		return 360 * ((1 / 26) * (alpha.toLowerCase().charCodeAt(0) - 96)) - 0.01;
	}


	// PUBLIC

	/**
	 * Generate the html for svg initials icon from name
	 * @param id {string} ?
	 * @param name {string} E.g. "Robert Morrison" ( -> RM icon)
	 * @return string SVG HTML
	 */
	var _generateIcon = function(id, name) {
		var hue = _hue(name);
		var initials = _initials(name);

		return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 300" width="158" height="158">'+
			'<defs><style type="text/css">.st1{fill:#FFFFFF;}.st3{font-size:102.68px;}</style></defs>'+
			'<linearGradient id="SVGID_'+id+'_" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="300" y2="0">'+
			'	<stop offset="0" style="stop-color:#FFFFFF; stop-color:hsl('+hue+', 33%, 40%)"/>'+
			'	<stop offset="1" style="stop-color:#CCCCCC; stop-color:hsl('+hue+', 33%, 60%)"/>'+
			'</linearGradient>'+
			'<rect x="0" y="0" style="fill:url(#SVGID_'+id+'_);" width="300" height="300"/>'+
			'<title>'+name+'</title>'+
			'<text x="50%" y="50%" class="st1 st3" alignment-baseline="central" dominant-baseline="central" text-anchor="middle">'+ initials +'</text>'+
			'</svg>';
	}

	return {
		generateIcon: _generateIcon
	}

})();

/**
 * useful function for getting/setting the query url params in the address bar
 * @author Martyn Bissett <martyn.bissett1@stir.ac.uk>
 * @author Robert Morrison <r.w.morrison@stir.ac.uk>
 * 
 * Updated 2022-02-14
 * - Fix unnecessary History API push-states (i.e. only push when the URL actually changes).
 * - Add URI encoding (e.g. if the user-submitted content contains `&` etc).
 * 
 */
// TODO reload is false by default? check other pages not dependant on this being true
var QueryParams = (function () {
  /**
   * This can be replaced when running tests
   * @var {function}
   */
  var _pushStateHandler = function (url) {
    history.pushState(null, null, url);
  };

  var _replaceStateHandler = function (url, state) {
    history.replaceState(state, "", url);
  };

  /**
   * To swap _pushStateHandler when running tests
   * @var {function} handler Handler for mocking(?) push state
   */
  var _setPushStateHandler = function (handler) {
    _pushStateHandler = handler;
  };

  /**
   * Get single query param from url
   * @param {string} name
   * @param {string} defaultValue
   * @param {string} url (optional)
   */
  function _get(name, defaultValue, url) {
    if (typeof url === "undefined") url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return defaultValue;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  /**
   * Get single query param from url
   * @param {string} url (optional)
   * @returns {object}
   */
  function _getAll(queryString) {
    if (typeof queryString === "undefined") queryString = window.location.search;

    var obj = {};
    queryString.substring(1).replace(/([^=&]+)=([^&]*)/g, function (m, key, value) {
      obj[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    return obj;
  }

  /**
   * Same as _getAll but returns an array of objects rather than pure object
   * @param {string} url (optional)
   * @returns {object}
   */
  function _getAllArray(queryString) {
    if (typeof queryString === "undefined") queryString = window.location.search;

    var arr = [];
    queryString.substring(1).replace(/([^=&]+)=([^&]*)/g, function (m, key, value) {
      var obj = { name: decodeURIComponent(key), value: decodeURIComponent(value) };
      arr.push(obj);
    });

    return arr;
  }

  /**
   * Will update a param match from a given url
   * @param {string} url Url query string e,g, "path/to/res?name=value"
   * @param {string|object} name Name of param to update, or name/value pairs object for multiples
   * @param {string} value New value
   * @returns {string}
   */
  function _updateQueryStringParameter(url, name, value) {
    // we'll assume a name/value object for the rest of this script
    var values = {};
    if (typeof name === "string") {
      values[name] = value;
    } else {
      values = name;
    }

    for (var name in values) {
      if (values.hasOwnProperty(name)) {
        value = values[name];

        var re = new RegExp("([?&])" + name + "=.*?(&|#|$)(.*)", "gi"), hash;

        if (re.test(url)) {
          if (typeof value !== "undefined" && value !== null)
            url = url.replace(re, "$1" + name + "=" + encodeURIComponent(value) + "$2$3");
          else {
            hash = url.split("#");
            url = hash[0].replace(re, "$1$3").replace(/(&|\?)$/, "");
            if (typeof hash[1] !== "undefined" && hash[1] !== null) url += "#" + hash[1];
          }
        } else {
          if (typeof value !== "undefined" && value !== null) {
            var separator = url.indexOf("?") !== -1 ? "&" : "?";
            hash = url.split("#");
            url = hash[0] + separator + name + "=" + encodeURIComponent(value);
            if (typeof hash[1] !== "undefined" && hash[1] !== null) url += "#" + hash[1];
          }
        }
      }
    }

	return url;

  }

  /**
   * Set value in query string
   * @param {string} name Name of param to update
   * @param {string} value New value
   * @param {boolean} reload
   */
  function _set(name, value, reload, queryString) {
    if (typeof queryString === "undefined") queryString = document.location.search;

    var newQueryString = _updateQueryStringParameter(queryString, name, value);
	if(newQueryString!==queryString) _pushStateHandler(newQueryString);

    if (reload) {
      window.location.href = document.location.href;
    }
  }

  /**
   * Will remove a param match from a given url
   * @param {string} url Url query string e,g, "path/to/res?name=value"
   * @param {string} name Name of param to remove eg. name
   * @returns {string}
   */
  function _removeURLParameter(url, name) {
    // if (!url) url = window.location.href;

    //prefer to use l.search if you have a location/link object
    var urlparts = url.split("?");
    if (urlparts.length >= 2) {
//      var prefix = encodeURIComponent(name) + "=";
		var prefix  = name + "=";
      var pars = urlparts[1].split(/[&;]/g);

      //reverse iteration as may be destructive
      for (var i = pars.length; i-- > 0; ) {
        //idiom for string.startsWith
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      url = urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
      return url;
    } else {
      return url;
    }
  }

  /**
   * Remove param by name
   * @param {string} name Name of param to update
   * @param {boolean} reload [Optional] Automatically reload the window after changing the URL
   * @param {string} url [Optional] The URL to be acted upon
   * @param {boolean} replace [Optional] Use replaceState instead of pushState
   * @param {boolean} noencode [Optional] Don't use encodeURIComponent on name parameter [default = false]
   */
  function _remove(name, reload, url, replace, noencode) {

    const u = new URL(url||window.location);

    if (u.searchParams.has(name)) {
      u.searchParams.delete(name);
      if (replace) {
        _replaceStateHandler(u.href)
      } else {
        _pushStateHandler(u.href);
      }
      if (reload) {
        window.location.href = document.location.href;
      }
    }
  }

  return {
    get: _get,
    getAll: _getAll,
    getAllArray: _getAllArray,
    set: _set,
    remove: _remove,
    setPushStateHandler: _setPushStateHandler,
  };
})();

var UoS_StickyWidget = (function() {

    var StickyWidget =  function(element){
        
        if(!element) return;
        this.element  = element;
        this.offset  = element.getAttribute("data-offset");
        this.trigger = this.setTrigger( element.getAttribute( 'data-observe' ) );
        this.offsetRatio = 0;
		this.wrapper = document.createElement('div');
        this.controls = {
            close: element.querySelectorAll('[data-close]')
        };
		var that=this;

		this.offset && element.classList.add("offset" + this.offset);
		recentreOffset();

        this.callback = function(entry) {
            // entry.intersectionRatio -1 means intersection not supported (IE etc):
            if(entry.intersectionRatio < 0)
                return this.element.setAttribute("data-sticky-polyfill", true);

            // we're only interested in intersections above the viewport
            if(entry.boundingClientRect.y > entry.rootBounds.y) {
                this.element.classList.remove("stuck");
                /* this.element.classList.remove("flush"); */
                return;
            }

            if(entry.intersectionRatio >= 0 && entry.intersectionRatio <= this.offsetRatio)
                return this.element.classList.add("stuck");

            this.element.classList.remove("stuck");
        };

        this.observer = stir.createIntersectionObserver({
            element: this.trigger,
            threshold: [0, this.offsetRatio, 0.9],
            callback: this.callback.bind(this)
        });

        function getElementHeight() {
            var height;
			var display = element.style.display || ''
            // temporarily make sure element is displayed:
            element.style.display = 'block';
            // get the height value
            height = Number(element.offsetHeight);
            // reset the style
            element.style.display = display;
            return height;
        }

		function recentreOffset(e) {
			if(!element.getAttribute("data-offset")) return;

			var height = getElementHeight();
			if(height > 0) {
				that.offsetRatio = (height/2)/height
			}

			// set top and bottom margins to balance the overlap with
			// the button's actual height (except on mobile, which has
			// a fixed margin):
			if(window.stir && stir.MediaQuery && stir.MediaQuery.current!=="small") {
				if(element.hasAttribute("data-bg")){
					element.style.marginTop = (0-height-1) + "px";			// -1 to avoid rounding-error pixel gap
				} else {
					element.style.marginTop = (0-height/2) + "px";
				}
				that.wrapper.style.paddingBottom = (height/2) + "px";
			} else {
				that.wrapper.style.paddingBottom = element.style.marginTop = null; 
			}
		}

        this.hideyslidey = function() {
            if(("IntersectionObserver" in window))
                this.element.style.marginBottom = (-1 * (getElementHeight())).toString() + "px";
        };


        {   // Init stuff:
    
            for(var closer in this.controls.close) {
                if(this.controls.close.hasOwnProperty(closer)){
                    this.controls.close[closer].addEventListener("click", function(event) {
                        event.preventDefault();
                        element.parentElement.removeChild(element);
                    });
                }
            }
    
            if(this.element.classList.contains('u-hidey-slidey')) {
                var zIndex = Number(window.getComputedStyle(this.element).getPropertyValue("z-index"));
                this.trigger.style.zIndex = ++zIndex;
                this.hideyslidey();
            }

			this.element.hasAttribute("data-bg") && this.setBGWrapper();

            element.setAttribute("data-initialised", true);
			window.addEventListener("resize", stir.debounce(recentreOffset, 400));
        
        }

    }

    /**
     * Sticky widgets can define the DOM element they want to observe to trigger sticky behaviour
     * or the previous sibling can be used as a default.
     * 
     * @param {String} observe selector that defines the DOM element to observe
     */
    StickyWidget.prototype.setTrigger = function setTrigger(observe) {
        var trigger;
        if(observe){
            trigger = document.querySelector(observe);
        }
        trigger = trigger || this.element.previousElementSibling;
        if(trigger.offsetHeight == 0) {
            // if the previous sibling has zero height, use the previous-previous one instead.
            trigger = trigger.previousElementSibling;
        }
        this.offset && trigger.setAttribute('data-has-overlapper', this.offset);
        return trigger;

    }

	StickyWidget.prototype.setBGWrapper = function setBGWrapper() {
		this.element.previousElementSibling.insertAdjacentElement("beforebegin",this.wrapper)
		this.wrapper.append(this.element.previousElementSibling)
		this.wrapper.classList.add(this.element.getAttribute("data-bg").trim());
    }

    return StickyWidget;
})();
var stir = stir || {};

stir.capitaliseFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/*
 * Function: Ajax Helper Function
 **/
stir.load = function (url, callback) {
  if (typeof url == "undefined") return;
  if (typeof callback != "function") callback = function () {};

  var request = new XMLHttpRequest();
  request.open("GET", url, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      callback.call(null, request.responseText);
    } else {
      callback.call(null, {
        error: {
          status: request.status,
          statusText: request.statusText,
        },
      });
    }
  };

  request.onerror = function (event) {
    callback.call(null, {
      error: event,
    });
  };

  request.ontimeout = function (event) {
    callback.call(null, {
      error: event,
    });
  };

  request.send();
  return request;
};

stir.getJSONp = function (url, onload, onerror) {
  if (typeof url == "undefined") return;
  const script = document.createElement("script");
  if ("function" === typeof onload) script.onload = onload;
  if ("function" === typeof onerror) script.onerror = onerror;
  script.src = url;
  document.head.appendChild(script);
};

stir.loadAuthenticated = function (url, callback) {
  if (typeof url == "undefined") return;
  if (typeof callback != "function") callback = function () {};

  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.withCredentials = true;

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      callback.call(null, request.responseText);
    } else {
      callback.call(null, {
        error: {
          status: request.status,
          statusText: request.statusText,
        },
      });
    }
  };

  request.onerror = function (event) {
    callback.call(null, {
      error: event,
    });
  };

  request.ontimeout = function (event) {
    callback.call(null, {
      error: event,
    });
  };

  request.send();

  return request;
};

stir.getJSON = function (url, callback) {
  return stir.load(url, function (data) {
    try {
      data = JSON.parse(data);
    } catch (error) {
      data = {
        error: error,
      };
    }
    callback.call(null, data);
  });
};

stir.getJSONAuthenticated = function (url, callback) {
  stir.loadAuthenticated(url, function (data) {
    try {
      data = JSON.parse(data);
    } catch (error) {
      data = {
        error: error,
      };
    }
    callback.call(null, data);
  });
};

stir.Math = {
  fileSize: (bytes, fixedPoint) => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(isNaN(fixedPoint) ? 2 : fixedPoint) * 1 + ["B", "kB", "MB", "GB", "TB"][i];
  },
  random: (max) => Math.floor(Math.random() * max),
};

stir.Number = {
  clamp: function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  },
  formatMoney: function formatMoney(c, d, t) {
    var n = this,
      c = isNaN((c = Math.abs(c))) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      s = n < 0 ? "-" : "",
      i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
      j = (j = i.length) > 3 ? j % 3 : 0;
    return (
      s +
      (j ? i.substr(0, j) + t : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
      (c
        ? d +
          Math.abs(n - i)
            .toFixed(c)
            .slice(2)
        : "")
    );
  },
};

/**
 * Library functions for Strings
 */
stir.String = {
  rot: function rot(s, i) {
    // modified for general rot# from
    // http://stackoverflow.com/a/617685/987044
    return s.replace(/[a-zA-Z]/g, function (c) {
      return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + i) ? c : c - 26);
    });
  },
  slug: (input) =>
    String(input)
      .toLowerCase()
      .replace(/[^a-z]+/g, "-"),
  embolden: function boldicise(haystack, needle) {
    return haystack.replace(new RegExp(needle, "gi"), "<b>" + needle + "</b>"); //legit use of <b> not <strong>
  },
  truncate: function truncate(n, useWordBoundary) {
    if (this.length <= n) {
      return this;
    }
    var subString = this.substr(0, n - 1);
    return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(" ")) : subString) + "&hellip;";
  },
  htmlEntities: function htmlEntities(str) {
    //return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&"+"quot;");
    //return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, ["&", "quot;"].join(""));
    var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': ["&", "quot;"].join(""),
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;",
    };
    return String(str).replace(/[&<>"'`=\/]/g, (s) => entityMap[s]);
  },
  stripHtml: function stripHtml(dirtyString) {
    var doc = new DOMParser().parseFromString(dirtyString, "text/html");
    return doc.body.textContent || "";
  },
  getFirstFromSplit: function getFirstFromSplit(delimiter) {
    if (this.indexOf(delimiter) > -1) {
      return this.split(delimiter)[0].trim();
    }
    return this;
  },
  domify: (HTMLString) => new DOMParser().parseFromString(HTMLString, "text/html").body,
};

/**
 * Additional String function
 * Created separately because it refers to other stir.String helper functions.
 */
stir.String.fixHtml = (function () {
  /**
   * fixHtml() is intended to fix broken/partial HTML strings coming from the
   * Degree Program Tables (SSoCI) and possibly other short snippets of HTML.
   * As a side-effect it could be used to strip out non-text content such as
   * <script> tags, for example. Relies on three internal helper functions,
   * domify(), wrapRawNodes() and removeEmptyElements().
   */

  /**
   * Use the browser's DOM parser to make sense of the HTMLString, but away from the
   * main DOM so we can make further adjustments. Returns an HTMLDocument's body element.
   */
  const domify = stir.String.domify;

  /**
   * Wrap any raw (i.e. text content) nodes into <p> tags. This is immediate
   * children only, not recursive.
   */
  function wrapRawNodes(DomEl) {
    if (!DomEl || !DomEl.childNodes) return;
    Array.prototype.forEach.call(DomEl.childNodes, function (node) {
      if (3 === node.nodeType || "A" === node.nodeName) {
        var p = document.createElement("p");
        node.parentNode.insertBefore(p, node);
        p.appendChild(node);
      }
    });
    return DomEl;
  }

  /**
   * SSoCI entries tend to have mismatched </p> tags which leads to
   * empty <p></p> tag pairs. We'll strip them out:
   */
  function removeEmptyElements(DomEl) {
    if (!DomEl || !DomEl.childNodes) return;
    Array.prototype.forEach.call(DomEl.childNodes, function (node) {
      if (1 === node.nodeType && "" === node.innerText) {
        DomEl.removeChild(node);
      }
    });
    return DomEl;
  }

  /**
   * This is the only exposed function within fixHTML.
   * @param dirtyString {String} This is the input HTML in string format.
   * @param returnDomFrag {Boolean} return a DOM fragment instead of a string. Defaults to string.
   */
  return function fixHtml(dirtyString, returnDomFrag) {
    var domNodes = removeEmptyElements(wrapRawNodes(domify(dirtyString)));
    var frag = stir.DOM.frag(domNodes);
    return returnDomFrag ? frag : frag.textContent;
  };
})();

/**
 * Library functions for working with the DOM
 */
stir.DOM = {
  frag: (nodes) => {
    const frag = document.createDocumentFragment();
    while (nodes.firstChild) {
      frag.appendChild(nodes.firstChild);
    }
    return frag;
  },
};

/**
 * Library functions for working with Arrays
 */
stir.Array = {
  oxfordComma: function oxfordComma(items, oxford, adjoiner) {
    var nonEmptyItems = items.filter((item) => item);
    return nonEmptyItems.length > 1 ? [nonEmptyItems.slice(0, -1).join(", "), nonEmptyItems.slice(-1)].join((oxford ? "," : "") + (adjoiner ? " " + adjoiner + " " : " and ")) : nonEmptyItems.slice(-1).toString();
  },
  getRandomVal: function () {
    return this[Math.floor(Math.random() * this.length)];
    // example usage: var randomItem = stir.Array.getRandomVal.call( arrayOfItems );
  },
};

/**
 * Library functions for working with Objects
 */
stir.Object = {
  extend: function extend(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key];
      }
    }

    return out;
  },
};

// e.g. stir.Object.extend({}, objA, objB);

/**
 * DATE HANDLING
 */

stir.Date = (() => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  //const abrMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const abrDay = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

  const newsDate = (date) => `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  const galleryDate = (date) => `${abrDay[date.getDay()]} ${date.getDate()} ${months[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
  const funnelbackDate = (date) => `${date.getDate()}${months[date.getMonth()].slice(0, 3)}${date.getFullYear()}`;
  const timeElementDatetime = (date) => `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
  const time24 = (date) => `${date.getHours()}:${(date.getMinutes() + "0").slice(0, 2)}`;
  const swimTimetable = (date) => `${days[date.getDay()]}: ${date.getDate()} ${months[date.getMonth()]}`;

  return {
    newsDate: newsDate,
    galleryDate: galleryDate,
    funnelbackDate: funnelbackDate,
    time24: time24,
    timeElementDatetime: timeElementDatetime,
    swimTimetable: swimTimetable,
  };
})();

stir.formatStirDate = stir.Date.galleryDate;

/*
 * Function: Determine if a date is BST or GMT
 * Parameter should be a JavaScript Date Object

stir.BSTorGMT = function (d) {
  var objBST = [
    { year: 2021, start: 20210328, end: 20211031 },
    { year: 2022, start: 20220327, end: 20221030 },
    { year: 2023, start: 20230326, end: 20231029 },
    { year: 2024, start: 20240331, end: 20241027 },
    { year: 2025, start: 20250330, end: 20251026 },
    { year: 2026, start: 20260329, end: 20261025 },
    { year: 2027, start: 20270328, end: 20271031 },
    { year: 2028, start: 20280326, end: 20281029 },
    { year: 2029, start: 20290325, end: 20291028 },
  ];

  if (Object.prototype.toString.call(d) === "[object Date]") {
    var start, end;
    var year = String(d.getFullYear());
    var month = String(d.getMonth() + 1);
    var day = String(d.getDate());

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var date = parseInt(year + month + day);

    for (var i = 0; i < objBST.length; i++) {
      item = objBST[i];
      if (item.year === parseInt(year)) {
        start = item.start;
        end = item.end;
        break;
      }
    }

    if (date >= start && date <= end) return "BST";

    return "GMT";
  }
  console.error("Parameter one of stir.BSTorGMT() should be a JavaScript Date Object");
  return "";
};
 */

stir.createDOMFragment = function (htmlStr) {
  if (!htmlStr) return;

  return document.createRange().createContextualFragment(htmlStr);

  //var frag = document.createDocumentFragment();
  //var temp = document.createElement("div");
  //temp.innerHTML = htmlStr;

  // while (temp.firstChild) {
  //   frag.appendChild(temp.firstChild);
  // }

  //return frag;
};

stir.createDOMElement = function (htmlStr) {
  if (!htmlStr) {
    return;
  }
  var temp = document.createElement("div");
  temp.innerHTML = htmlStr;
  return temp;
};

stir.addScript = function (src) {
  var script = document.createElement("script");
  script.src = src;
  document.body.insertAdjacentElement("beforeend", script);
};

stir.addStyle = function (href) {
  var link = document.createElement("link");
  link.href = href;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.insertAdjacentElement("beforeend", link);
};

stir.animate = function (el, animation) {
  if (!el) return;
  if ("undefined" == el.classList) return;

  switch (animation) {
    case "slideDown":
      el.classList.add("animation__show");
      el.classList.add("animation__slidedown");
      el.classList.remove("animation__hide");
      break;
  }
};

/*
 * Observe a DOM element, and trigger a function when it
 * scrolls (past a given threshold) into view.
 *
 * @param options object properties:
 * element – the element we want to observe
 * threshold – how far into the viewport it must scroll to trigger the function
 * callback – the function to be triggered
 */
stir.createIntersectionObserver = function (options) {
  if (!options) return;
  var thresholds = options.threshold || [0.7]; //set a default threshold
  var callbacks = [];

  if (typeof thresholds != "object") thresholds = [thresholds];

  if ("function" != typeof options.callback) {
    options.callback = function (intersectionObserverEntry) {
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i].call(options.element, intersectionObserverEntry);
      }
    };
  }

  // just trigger the callback now if IntObs not available…
  if (!("IntersectionObserver" in window)) {
    return options.callback.call(options.element, {
      intersectionRatio: -1,
    });
  }

  // …otherwise we'll queue it up to be triggered on-scroll:
  var observer = new IntersectionObserver(
    function (entries) {
      for (var id in entries) {
        if (entries.hasOwnProperty(id)) {
          options.callback.call(entries[id].target, entries[id]);
        }
      }
    },
    {
      root: options.root || null,
      threshold: thresholds,
    }
  );

  // attach the observer to the observee
  options.element && observer.observe(options.element);

  var _setClassAdd = function (classname) {
    callbacks.push(function (intersectionObserverEntry) {
      for (var i = 0; i < thresholds.length; i++) {
        if (intersectionObserverEntry.intersectionRatio >= thresholds[i]) {
          options.element.classList.add(classname);
        }
      }
    });
    return this;
  };
  var _setClassRemove = function (classname) {
    callbacks.push(function (intersectionObserverEntry) {
      for (var i = 0; i < thresholds.length; i++) {
        if (intersectionObserverEntry.intersectionRatio >= thresholds[i]) {
          options.element.classList.remove(classname);
        }
      }
    });
    return this;
  };
  var _setClassToggle = function (classname) {
    callbacks.push(function () {
      if (options.element.classList.contains(classname)) {
        options.element.classList.remove(classname);
      } else {
        options.element.classList.add(classname);
      }
    });
    return this;
  };

  // return a reference to the observer in case we want to
  // do something else with it, e.g. add more observees:
  return {
    observer: observer,
    setClassToggle: _setClassToggle,
    setClassAdd: _setClassAdd,
    setClassRemove: _setClassRemove,
  };
};

stir.lazyJS = (nodes, scriptSrc) => {
  const nodesInUse = nodes.filter((item) => stir.node(item));
  if (!nodesInUse.length) return;

  nodesInUse.forEach((item) => {
    let observer = stir.createIntersectionObserver({
      element: stir.node(item),
      threshold: [0.001],
      callback: function (entry) {
        if (entry.isIntersecting) {
          stir.addScript(scriptSrc);
          observer && observer.observer.unobserve(this);
        }
      },
    });
  });
};

stir.cardinal = (function () {
  var numberWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  return function cardinal(ordinal) {
    return numberWords[parseInt(ordinal)] || "";
  };
})();

// is an element currently visible or not
stir.elementIsHidden = function (el) {
  var style = window.getComputedStyle(el);
  return style.display === "none" || style.visibility === "hidden";
};

/* 
  Feedback message used by various scripts
*/
stir.getMaintenanceMsg = function () {
  var node = document.createElement("div");

  node.appendChild(
    stir.createDOMFragment(`
      <div class="callout">
        <h3 class="header-stripped">Offline for maintenance</h3>
        <p>We are carrying out some essential maintenance work on our website today, which means that 
        some of our web pages are currently unavailable. We&rsquo;re sorry for any inconvenience and we 
        hope to restore full service as soon as possible.</p>
        <p>See how to <a href="https://www.stir.ac.uk/about/contact-us/">contact us</a></p>
      </div>`)
  );

  return node.firstElementChild;
};

// Scroll the window to the element's position
// Offset is optional.
stir.scrollToElement = function (el, offsetUp) {
  offsetUp = offsetUp || 0;
  stir.scrollTo(el.getBoundingClientRect().top - document.body.getBoundingClientRect().top - offsetUp, 0);
};

// Detects browser then use the supported method of window.scroll()
stir.scroll = (function () {
  if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Trident/7.0") != -1 || navigator.userAgent.indexOf("Edge") != -1) {
    return function (y, x) {
      if (this.scroll) {
        this.scroll(x, y);
      } else {
        this.scrollLeft = x;
        this.scrollTop = y;
      }
    };
  }
  return function (top, left) {
    this.scroll({
      top: top,
      left: left,
      behavior: "smooth",
    });
  };
})();

stir.scrollTo = stir.scroll.bind(null);

stir.research = {
  hub: (() => {
    const orgUnitFacultyMap = {
      "Faculty of Arts and Humanities": ["Arts", "Communications, Media and Culture", "English Studies", "History and Politics", "Literature and Languages", "Law and Philosophy", "Philosophy", "French", "History", "Law", "Politics", "Religion", "Spanish"],
      "Faculty of Health Sciences and Sport": ["Health Sciences Stirling", "Sport", "Institute for Social Marketing", "NMAHP"],
      "Faculty of Natural Sciences": ["Computing Science", "Institute of Aquaculture", "Biological and Environmental Sciences", "Psychology", "Computing Science and Mathematics", "Machrihanish"],
      "Faculty of Social Sciences": ["Education", "Sociology, Social Policy & Criminology", "Social Work", "Dementia and Ageing", "Dementia Services Development Centre"],
      "Stirling Management School": ["Accounting & Finance", "Economics", "Management, Work and Organisation", "Marketing & Retail"],
    };
    const getFacultyFromOrgUnitName = (oUName) => {
      const name = oUName.replace(" - Division", "");
      for (const faculty in orgUnitFacultyMap) {
        if (name == faculty || orgUnitFacultyMap[faculty].indexOf(name) >= 0) {
          return faculty;
        }
      }
      return "University of Stirling";
    };

    return { getFacultyFromOrgUnitName: getFacultyFromOrgUnitName };
  })(),
};

/*
 * Manager class for loading activity indicator.
 */
stir.Spinner = function Spinner(el) {
  this.element = document.createElement("div");
  this.element.classList.add("c-search-loading__spinner");
  this.element.classList.add("show-for-medium");
  this.element.classList.add("hide");

  if (el && el.nodeType === 1) {
    el.appendChild(this.element);
  }
  this.show = function () {
    this.element.classList.remove("hide");
  };
  this.hide = function () {
    this.element.classList.add("hide");
  };
};

/*
 * Manager class for "togglable widgets" i.e. the search box and results panel.
 */
stir.ToggleWidget = function ToggleWidget(el, showClass, hideClass) {
  this.show = function show() {
    el.removeAttribute("aria-hidden");
    el.removeAttribute("tabindex");
    showClass && el.classList.add(showClass);
    hideClass && el.classList.remove(hideClass);
  };
  this.hide = function hide() {
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("tabindex", "-1"); //  Firefox needs this if the element has overflow
    hideClass && el.classList.add(hideClass);
    showClass && el.classList.remove(showClass);
  };
  this.hidden = function visible() {
    return el.hasAttribute("aria-hidden") ? true : false;
  };
  /* this.toggle = function toggle() {
        if(this.hidden) {
            this.show();
        } else {
            this.hide();
        }
    } */
};

/*
 * Debounce function from Underscore.js (via David Walsh blog).
 * Creates and returns a new debounced version of the passed function
 * which will postpone its execution until after `wait` milliseconds
 * have elapsed since the last time it was invoked. Useful for implementing
 * behavior that should only happen after the input has stopped arriving.
 * Pass true for the immediate argument to cause debounce to trigger the
 * function on the *leading* instead of the trailing edge of the wait
 * interval. Useful in circumstances like preventing accidental
 * double-clicks on a "submit" button from firing a second time.
 * Examples: wait until the user stops typing before launching a
 * search query. Wait until the user has stopped scrolling before
 * triggering (an expensive) layout repaint.
 * @param {*} func expensive or slow function to call
 * @param {*} wait length of time in miliseconds to wait
 * @param {*} immediate trigger with first rather than last event
 */
stir.debounce = function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

stir.lazy = function (targets) {
  if (!targets) return;

  var observer;

  // The action to be carried out when lazy-loading is triggered.
  function lazyAction(element) {
    // (i) image src-swap method:
    if (element.hasAttribute("data-img-src")) {
      return element.setAttribute("src", element.getAttribute("data-img-src"));
      // (Using `.getAttribute()` here instead of `.dataset` for better browser support.)
    }
    // (ii) noscript content-import method:
    Array.prototype.forEach.call(element.querySelectorAll('noscript[data-load="lazy"]'), function (item) {
      // Extract dormant HTML code from inside the noscript, and append it to the DOM:
      item.insertAdjacentHTML("beforebegin", item.innerText.trim().toString());
      // …then remove the noscript tag:
      item.parentNode.removeChild(item);
    });
  }

  // Only initialise the lazy-load observer if (i) we have lazy elements on
  // this page and (ii) if IntersectionObserver is supported.
  if (targets.length > 0) {
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.intersectionRatio > 0) {
            lazyAction(entry.target); // trigger lazy action
            observer.unobserve(entry.target); // stop observing this target once the action has been triggered
          }
        });
      });
    }
    for (var i = 0; i < targets.length; i++) {
      // Cue-up lazy-loading for each target, if observer is available.
      // If there's no observer (i.e. IE etc) just allow images to load non-lazily.
      if (observer) {
        // wait and observe
        observer.observe(targets[i]);
      } else {
        // trigger immediately
        lazyAction(targets[i]);
      }
    }
  }
};

stir.truncate = function truncate(options) {
  var wrapper = document.querySelector(options.selector);
  if (!wrapper) return;

  var modern = "open" in document.createElement("details");
  var elements = Array.prototype.slice.call(wrapper.children, options.start || 3);
  var trigger, accordion;

  trigger = (function () {
    return modern ? document.createElement("summary") : document.createElement("button");
  })();
  accordion = (function () {
    return modern ? document.createElement("details") : document.createElement("div");
  })();

  trigger.innerText = "Read more";
  accordion.classList.add("stir-content-expand");
  trigger.classList.add("stir-content-expander");

  if (elements.length > 1) {
    var last = options.offset ? elements.pop() : null;

    if (modern) {
      accordion.appendChild(trigger);
    } else {
      wrapper.appendChild(trigger);
    }
    wrapper.appendChild(accordion);
    last && wrapper.appendChild(last);

    for (var i = 0; i < elements.length; i++) {
      accordion.appendChild(elements[i]);
    }
  }

  if (modern) return;

  accordion.classList.add("show-for-sr");

  var toggleHandlerForIe = function (event) {
    accordion.classList.remove("show-for-sr");
    trigger.removeEventListener("click", toggleHandlerForIe);
    trigger.parentNode.removeChild(trigger);
  };

  trigger.addEventListener("click", toggleHandlerForIe);
};

stir.indexBoard = (function () {
  var CHAR_CODE_RANGE = {
    start: 65,
    end: 90,
  };
  var index = {};

  function reset() {
    for (var cc = CHAR_CODE_RANGE.start; cc <= CHAR_CODE_RANGE.end; cc++) {
      index[String.fromCharCode(cc)] = false;
    }
  }

  return function (element) {
    this.element = element || document.createElement("div");
    this.reset = reset;

    this.enable = function (key) {
      if (index.hasOwnProperty(key)) index[key] = true;
    };
    this.disable = function (key) {
      if (index.hasOwnProperty(key)) index[key] = false;
    };
    this.hide = function () {
      this.element.classList.remove("stir__slidedown");
      this.element.classList.add("stir__slideup");
    };
    this.show = function () {
      this.element.classList.remove("stir__slideup");
      this.element.classList.add("stir__slidedown");
    };
    this.update = function () {
      for (var key in index) {
        if (index.hasOwnProperty(key)) {
          var el = this.element.querySelector('[data-letter="' + key + '"]');
          if (index[key]) {
            el && el.removeAttribute("data-disabled");
          } else {
            el && el.setAttribute("data-disabled", true);
          }
        }
      }
    };
  };
})();

/*
   Helpers for document.querySelector / document.querySelectorAll
 */

stir.node = (identifier) => document.querySelector(identifier);
stir.nodes = (identifier) => Array.prototype.slice.call(document.querySelectorAll(identifier));

/*
  Safely replace the inner html of a node with new html
*/
stir.setHTML = (node, html) => {
  Array.prototype.slice.call(node.childNodes).forEach((node) => node.remove());

  if (!html) return;
  node.appendChild(stir.createDOMFragment(html));
};

/*
  Create a DOM node from a html string
*/
stir.stringToNode = (htmlString) => stir.createDOMFragment(htmlString).firstElementChild;

/* 
   FUNCTIONAL PROGRAMMING HELPERS
   ---
   Mostly obtained from Functional-Light-JS
   github.com/getify/Functional-Light-JS
   See FP Tests document for how to use
 */

const _isArray = Array.isArray;
const _keys = Object.keys;

const reverseArgs = function (fn) {
  return function argsReversed(...args) {
    return fn(...args.reverse());
  };
};

/*
   Clone helper function - 27/09/2024 replaced with structuredClone (Ryan)
 */
stir.clone = function (input) {
  return structuredClone(input);
};

/*
   Compose helper function
*/
stir.compose = function (...fns) {
  return fns.reduceRight(function reducer(fn1, fn2) {
    return function composed(...args) {
      return fn2(fn1(...args));
    };
  });
};

/*
    Pipe helper function - Performs left-to-right function composition. 
 */
stir.pipe = reverseArgs(stir.compose);

/*
    Curry helper function
 */
stir.curry = function (fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(...nextArgs) {
      var args = [...prevArgs, ...nextArgs];

      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    };
  })([]);
};

/*
   Curried version of Sort that returns a new list
 */
stir.sort = stir.curry(function (fn, list) {
  if (typeof fn === "function") return stir.clone(list).sort(fn);

  return stir.clone(list).sort();
});

/*
   Sequence generator function (commonly referred to as "range", e.g. Clojure, PHP etc)
 */
stir.range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

/*
   Deeply flattens an array. 
   eg [1, 2, [3, 30, [300]], [4] => [ 1, 2, 3, 30, 300, 4 ]
 */
stir.flatten = function (list, input) {
  const willReturn = input === undefined ? [] : input;

  for (let i = 0; i < list.length; i++) {
    if (_isArray(list[i])) {
      stir.flatten(list[i], willReturn);
    } else {
      willReturn.push(list[i]);
    }
  }

  return willReturn;
};

stir.removeDuplicates = stir.curry((data) => {
  return data.filter((c, index) => {
    return data.indexOf(c) === index;
  });
});

/*
   Helper - More readable than doing !isNaN double negative shenanigans
 */
stir.isNumeric = function (input) {
  return !isNaN(input);
};
stir.callback = {};
stir.callback.queue = [];

stir.callback.enqueue = (ticket) => {
  if (!ticket) return;
  var chain = window;
  var callback;
  var data = ticket.split(".");
  while (data.length > 0) {
    var n = data.shift();
    if ("function" === typeof chain[n]) {
      callback = chain[n];
    } else if ("undefined" !== typeof chain[n]) {
      chain = chain[n];
    }
  }
  if (callback) {
    callback();
  } else {
    stir.callback.queue.push(ticket);
  }
};

/*
   Unbound and curried map filter reduce each etc functions
 */

stir.map = unboundMethod("map", 2);
stir.filter = unboundMethod("filter", 2);
stir.reduce = unboundMethod("reduce", 3);
stir.each = unboundMethod("forEach", 2);
stir.all = unboundMethod("every", 2);
stir.any = unboundMethod("some", 2);
stir.join = unboundMethod("join", 2);

function unboundMethod(methodName, argCount = 2) {
  return stir.curry((...args) => {
    var obj = args.pop();
    return obj[methodName](...args);
  }, argCount);
}

/**
 * Google Analytics helpers
 */

stir.ga = (() => {
  const trackingId = "UA-340900-19";

  const getClientId = () => {
    if (typeof window.ga == "undefined") return false;
    const trackers = ga.getAll ? ga.getAll() : [];
    for (let i = 0, len = trackers.length; i < len; i += 1) {
      if (trackers[i].get("trackingId") === trackingId) {
        return trackers[i].get("clientId");
      }
    }
    return false;
  };

  return {
    getClientId: getClientId,
  };
})();

/*
   Environment object so we don't have to repeat switch commands with hostnames etc
 */

var UoS_env = (function () {
  var hostname = window.location.hostname;

  const funnelback = {
    stirling: "search.stir.ac.uk", // CNAME alias
    public: "stir-search.clients.uk.funnelback.com", // Public alias
    shared: "shared-15-24-search.clients.uk.funnelback.com", // FQDN
    staging: "stage-shared-15-24-search.clients.uk.funnelback.com", // Staging server
  };

  var env_name = "prod";
  var wc_path = "/media/dist/";
  var t4_tags = false;
  var search = funnelback.stirling;

  switch (hostname) {
    case "localhost":
      env_name = "dev";
      wc_path = "/medias/Categorised/Dist/";
      //search = funnelback.staging;
      break;

    case "stiracuk-cms01-production.terminalfour.net":
      env_name = "preview";
      wc_path = "";
      t4_tags = true;
      break;

    case "stiracuk-cms01-test.terminalfour.net":
      env_name = "appdev-preview";
      wc_path = "";
      t4_tags = true;
      search = funnelback.staging;
      break;

    case "stir.ac.uk":
      env_name = "pub";
      break;

    case "stirweb.github.io":
      env_name = "qa";
      wc_path = "/medias/Categorised/Dist/";
      search = funnelback.staging;
      break;
  }

  switch (window.location.port) {
    case "3000":
    case "8000":
      env_name = "dev";
      wc_path = "/medias/Categorised/Dist/";
  }

  return {
    name: env_name,
    wc_path: wc_path,
    t4_tags: t4_tags,
    search: search,
  };
})();

/*
    This is a function to called when opening a widget, and contains handlers
    to close other widgets. So we don't have to go through the entire site adding
    widget close instructions everywhere, we can do it with a single call and just
    update here
    @param exception {string} The name here of the widget to ignore, but close others
   */

var UoS_closeAllWidgetsExcept = (function () {
  var widgetRequestClose = document.createEvent("Event");
  widgetRequestClose.initEvent("widgetRequestClose", true, true);

  var handlers = {
    breadcrumbs: function () {
      var bcItems = document.querySelectorAll(".breadcrumbs > li");
      if (bcItems)
        Array.prototype.forEach.call(bcItems, function (item) {
          item.classList.remove("is-active");
        });
    },
    courseSearchWidget: function () {
      var cs = document.getElementById("course-search-widget__wrapper");
      if (cs) {
        cs.classList.remove("stir__slidedown");
        cs.classList.add("stir__slideup");
      }
    },
    megamenu: function () {
      var hnp = document.querySelector(".c-header-nav--primary a");
      hnp && hnp.classList.remove("c-header-nav__link--is-active");
    },
    internalDropdownMenu: function () {
      var idm = document.getElementById("internal-dropdown-menu");
      idm && idm.classList.remove("is-active");
    },
    internalSignpost: function () {
      var isds = document.getElementById("internal-signpost-dropdown__submenu");
      isds && isds.classList.add("hide");
      var isdl = document.getElementById("internal-signpost-dropdown__link");
      isdl && isdl.classList.remove("is-active");
    },
  };

  return function (exception) {
    // new way: dispatch a close request to any open (listening) widgets:
    document.dispatchEvent(widgetRequestClose);

    // old way: cycle through each close handler and close any widgets
    // other than the exception. Exception will be undefined if all widgets
    // are supposed to close.
    for (var name in handlers) {
      if (handlers.hasOwnProperty(name) && name !== exception) {
        handlers[name]();
      }
    }
  };
})();
document.body.addEventListener("click", UoS_closeAllWidgetsExcept);

/*
    Helper object to let us do adaptive page loading (e.g. megamenu, mobile menu)
    UoS_AWD is framework agnostic, so we'll pass in values from Foundation here
   */
/*
    Replaces the object from Foundation.util.MediaQuery.js
    https://get.foundation/sites/docs/media-queries.html
    eg Foundation.MediaQuery.current & Foundation.MediaQuery.get (not in use)
    Just migrating what we use ie stir.MediaQuery.current and the dispatch event
   */

var stir = stir || {};

stir.MediaQuery = (function () {
  var MediaQueryChangeEvent;

  var breakpoints = {
    small: 640,
    medium: 1024,
    large: 1240,
    xlarge: 1440,
    xxlarge: Infinity,
  };

  /*
       Get the current breakpoint eg "small", "medium" ...
     */
  function getCurrent() {
    var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    for (var index in breakpoints) {
      if (breakpoints.hasOwnProperty(index) && vw <= breakpoints[index]) break;
    }
    return index;
  }

  /*
       Check viewport size and dispatch an event if it has changed since last time.
     */
  function checkCurrent() {
    var size = getCurrent();
    if (size !== stir.MediaQuery.current) {
      stir.MediaQuery.current = size;
      window.dispatchEvent(MediaQueryChangeEvent);
    }
  }

  /*
       Set up custom event "MediaQueryChange".
     */
  if (typeof Event === "function") {
    MediaQueryChangeEvent = new Event("MediaQueryChange"); // Event API version
  } else {
    MediaQueryChangeEvent = document.createEvent("Event"); // IE version
    MediaQueryChangeEvent.initEvent("MediaQueryChange", true, true);
  }

  /*
       Listen for (debounced) resize events and re-check the viewport against the named breakpoints.
     */
  window.addEventListener("resize", stir.debounce(checkCurrent, 150));

  return {
    current: getCurrent(),
  };
})();

/*
 * Alternative accordion component
 * Converts a T4 Link menu nav object with class accordion-listing.
 * @author: Ryan Kaye
 * @date: 2021-06-16
 * @version: 1
 *

(function (accordLists) {

    /*
     * Away we go: Get all accordions on page then loop all accordion components
     *

	if(!accordLists) return;

	Array.prototype.forEach.call(accordLists, function (item, index) {
		buildAccordion(item, index);
	});

    /*
     * Function: Config an accordion on load so its ready to use
     *
    function buildAccordion(item, index) {
        var headingId = "accordlist-control-" + index;
        var contentId = "accordlist-panel-" + index;

        var headings = item.querySelectorAll(".accordion-listing > ul > li > ul > li > a");
        var contents = item.querySelectorAll(".accordion-listing > ul > li > ul > li > ul");

        // Heading buttons - add new attributes / listen for clicks
        Array.prototype.forEach.call(headings, function (heading, index2) {
            heading.setAttribute("id", headingId + index2);
            heading.setAttribute("aria-controls", contentId + index2);
            heading.setAttribute("aria-expanded", "false");
            heading.addEventListener("click", accordionClick);
        });

        // Content Panels - add new attributes
        Array.prototype.forEach.call(contents, function (content, index2) {
            content.setAttribute("id", contentId + index2);
            content.classList.add("hide");
            content.setAttribute("role", "region");
            content.setAttribute("hidden", "true");
            content.setAttribute("aria-labelledby", headingId + index2);
        });
    }

    /*
     * Function: Deal with heading button click events
     * ie open or close the content box
     *
    function accordionClick(e) {
        e.preventDefault();
        var heading = e.target;
        var content = e.target.parentNode.children[1];

        content.classList.toggle("hide");
        if (content.classList.contains("hide")) setCloseAttributes(content, heading);
        if (!content.classList.contains("hide")) setOpenAttributes(content, heading);
    }

    /*
     * Function: Updates accessibilty attributes for close state
     *
    function setCloseAttributes(content, heading) {
        content.setAttribute("hidden", "true");
        heading.setAttribute("aria-expanded", "false");
    }

    /*
     * Function: Updates accessibilty attributes for open state
     *
    function setOpenAttributes(content, heading) {
        content.removeAttribute("hidden");
        heading.setAttribute("aria-expanded", "true");
    }

})(document.querySelectorAll(".accordion-listing"));

*/

(function () {
  if (!stir.node(".c-half-n-half.js-animation")) return;

  const elements = stir.nodes(".c-half-n-half.js-animation");

  elements.forEach((item) => item.classList.add("u-opacity-0"));

  elements.forEach((item) => {
    let observer = stir.createIntersectionObserver({
      element: item,
      threshold: [0.1],
      callback: function (entry) {
        if (entry.isIntersecting) {
          item.classList.remove("u-opacity-0");
          const divs = Array.prototype.slice.call(item.querySelectorAll("div"));
          divs[0] && divs[0].classList.add("fadein-slide-right");
          divs[1] && divs[1].classList.add("fadein-slide-left");
          observer && observer.observer.unobserve(this);
        }
      },
    });
  });
})();

// this is the half n half
// (function () {
//   if (!window.AOS) return;

//   var containers, element;
//   var left = "fade-left",
//     right = "fade-right",
//     offset = 100,
//     duration = 600;
//   var image = ".c-half-n-half__image",
//     content = ".c-half-n-half__content",
//     container = ".c-half-n-half.js-animation";

//   var setAnimationAttrs = function (goLeft) {
//       if (!typeof this.setAttribute == "function") return;
//       this.setAttribute("data-aos", goLeft ? left : right);
//       this.setAttribute("data-aos-offset", offset);
//       this.setAttribute("data-aos-duration", duration);
//     },
//     isOdd = function (num) {
//       return num % 2;
//     };

//   /**
//    * Alternate left/right animations for each container on the page
//    */
//   containers = Array.prototype.slice.call(document.querySelectorAll(container));
//   for (var i = 0; i < containers.length; i++) {
//     if ((element = containers[i].querySelector(image))) setAnimationAttrs.call(element, isOdd(i));
//     if (element && isOdd(i)) element.setAttribute("data-aos__initialized", "true"); // is this actually used for anything?
//     if ((element = containers[i].querySelector(content))) setAnimationAttrs.call(element, !isOdd(i));
//   }

//   AOS.init({
//     once: true,
//     disable: "phone",
//   });
// })();

/**
 * BREADCRUMBS
 * @param trail the DomElement for the breadcrumb trail
 * @param useSchemaDotOrg boolean whether to use Schema.org or not
 * @param collapse boolean whether to collapse or not
 *
 */
(function (trail, useSchemaDotOrg, collapse) {
  if (!trail) return; // just bail out now if there is no breadcrumb trail

  const compact = "small"===stir.MediaQuery.current;


  var schemaData = [];
  var hierarchyLevel = 0; // track the depth as we move through the hierarchy
  //var hierarchyMax = trail.getAttribute("data-hierarchy-max") || (compact?1:4);
  const hierarchyMax = {
    small: 1,
    medium: 2,
    large:3
  };
  var TRUNC_THRESHOLD = 25;
  // Max level befor collapsing kicks in. Default to 4 levels, but can be
  // changed by setting the data-* attribute in the HTML/template.
  
	// Here we'll prevent the click event on the crumb (or any of its child elements) bubbling up.
	// Elsewhere we've set a click handler (on the document body) which will trigger
	// the menu (or any other widgets) to close. By trapping the clicks within the crumb
	// it prevents the user accidentally closing the dropdown by e.g. clicking in the margin
	// around the links.
  trail.addEventListener("click", event=>event.stopPropagation());

  // loop through all the "crumbs" in the breadcrumb trail, looking for
  // DOM elements only (element type "1") i.e. not a whitespace text node etc.
  // Todo: consider using newer API `firstElementChild` as that would simplify things.
  for (var crumb = trail.firstChild; crumb; crumb = crumb.nextSibling) {
    if (1 === crumb.nodeType) {
      // t4 adds empty breadcrumbs so we'll remove them:
      if ("" === crumb.textContent.trim()) {
        crumb = crumb.previousSibling; // move pointer back a step
        crumb.parentNode.removeChild(crumb.nextSibling); // remove the empty crumb
      } else {
        var link = crumb.querySelector("a");
        var subMenu = crumb.querySelector("ul");

        if (subMenu) {
          crumb.classList.add("breadcrumbs__item--has-submenu");
          // make a copy the breadcrumb link in the submenu so we can still navigate
          // to that page. The original link will be used instead to toggle submenu open/closed.
          var subMenuHomeItem = document.createElement("li");
          subMenuHomeItem.appendChild(link.cloneNode(true));
          subMenu.insertAdjacentElement("afterbegin", subMenuHomeItem);

		  link.addEventListener("click", crumbListener);
        }

        // Add the data for Schema.org JSON-LD
        if (useSchemaDotOrg) {
          schemaData.push({
            "@type": "ListItem",
            position: Array.prototype.indexOf.call(trail.children, crumb) + 1,
            item: {
              "@id": link.href,
              name: link.textContent,
            },
          });
        }

        if (collapse) {
          crumb.setAttribute("data-hierarchy-level", hierarchyLevel++);
        }
      }
    }
  }

  if (collapse) {
    if (hierarchyLevel > hierarchyMax.small) {
      // Out of all the crumbs, select just the ones we want to collapse
      // and transform the resulting NodeList into a regular Array:
      var crumbsToCollapse = Array.prototype.slice.call(trail.querySelectorAll("[data-hierarchy-level]")).slice(0, 0 - hierarchyMax.small);
      
      // Just return early if there are too few crumbs:
      if (1 === crumbsToCollapse.length) return;

      // Remove the first crumb (i.e. never hide "home"), but store it
      // as 'home' for reference later.
      var home = crumbsToCollapse.shift();

      // Create the ellipsis drop-down menu to contain the collapsed breadcrumbs
      var ellipsis = document.createElement("li");
      var ellipsisLink = document.createElement("a");
      var ellipsisMenu = document.createElement("ul");

      ellipsis.appendChild(ellipsisLink);
      ellipsis.appendChild(ellipsisMenu);

      // add the ellipsis just after 'home' breadcrumb
      home.insertAdjacentElement("afterend", ellipsis);
      ellipsisLink.innerText = "…";
      ellipsis.classList.add("breadcrumbs__item--has-submenu");
      if(crumbsToCollapse.length<hierarchyMax.medium) {
        ellipsis.classList.add("hide-for-medium");
      } else if(crumbsToCollapse.length<hierarchyMax.large) {
        ellipsis.classList.add("hide-for-large");
      }
      ellipsis.setAttribute("data-collapse", "");

      // Collapse the breadcrumbs and append them to the new ellipsis menu:
      crumbsToCollapse.forEach((crumb,index) => {
        var li = document.createElement("li");
        var a = crumb.querySelector("a").cloneNode(true);
        li.appendChild(a); 
        ellipsisMenu.appendChild(li);
        if(index>crumbsToCollapse.length-hierarchyMax.medium){
          crumb.classList.add("show-for-medium");
          a.classList.add("show-for-small-only");
        } else if(index>crumbsToCollapse.length-hierarchyMax.large) {
          crumb.classList.add("show-for-large");
          a.classList.add("hide-for-large");
        } else {
          crumb.remove();
        }
      });

      // Set the ellipsis to have the same behaviour as the other breadcrumbs
      // i.e. click to show the drop-down menu
      //applyCrumbClickListener(ellipsis, ellipsisLink);
	  ellipsisLink.addEventListener("click", crumbListener);
    }

    // Truncate the remaining links…
	const remaining = Array.prototype.slice.call(trail.querySelectorAll("li[data-hierarchy-level] > a"));
	
	// Just set this to -1 to NOT truncate the last item
	// otherwise this will truncate it on small screens
	const truncateLastItem = compact?remaining.length:-1;

    remaining.slice(1,truncateLastItem).forEach(function (link) {
      if (link.textContent.length > TRUNC_THRESHOLD) {
        link.setAttribute("title", link.textContent);
        link.innerHTML = stir.String.truncate.apply(link.textContent, [TRUNC_THRESHOLD, true]);
		// must use innerHTML to properly encode the ellipsis!
      }
    });
  }

  // Add the attributes/markup for Schema.org microdata
  // See: https://schema.org/BreadcrumbList
  if (useSchemaDotOrg && window.JSON) {
    var schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: schemaData,
    });
    trail.insertAdjacentElement("beforebegin", schema);
  }
  function crumbListener (event) {
	  event.preventDefault();
	  var wasActive = trail.querySelector(".is-active");
	  event.target.parentElement.classList.toggle("is-active");
	  wasActive && wasActive.classList.remove("is-active");

	  // close all other on-screen widgets
	  if (self.UoS_closeAllWidgetsExcept) UoS_closeAllWidgetsExcept("breadcrumbs");
	}
})(
  document.querySelector(".breadcrumbs"), // {HTMLElement} DOM element to use
  true, // {boolean}     Use Schema.org markup?
  true // {boolean}     Collapse breadcrumbs?
);

/**
 * HEADER CONCIERGE SEARCH ver 4.0 (NOT USING MARTYN'S SEARCHBOX)
 * @author: Ryan Kaye <ryan.kaye@stir.ac.uk>, Robert Morrison <r.w.morrison@stir.ac.uk>
 */

// we will add some new modules to the stir library
var stir = stir || {};

/**
 * Concierge
 * Instantiated below with `new stir.Concierge();`
 */
stir.Concierge = function Concierge(popup) {
  const button = document.querySelector("#header-search__button");
  if (!popup || !button) return;

  var obj2param = this.obj2param;

  // DOM elements
  const nodes = {
    overlay: popup.querySelector(".overlay"),
    input: popup.querySelector('input[name="query"]'),
    submit: popup.querySelector("button"),
    wrapper: popup.querySelector("#header-search__wrapper"),
    news: popup.querySelector(".c-header-search__news"),
    courses: popup.querySelector(".c-header-search__courses"),
    all: popup.querySelector(".c-header-search__all"),
    suggestions: popup.querySelector(".c-header-search__suggestions"),
  };

  //Dynamic view managers
  var search, results, spinner;

  // Settings and data
  const funnelbackServer = "https://stir-search.clients.uk.funnelback.com";
  const funnelbackUrl = funnelbackServer + "/s/";
  const searchFunnelbackUrl = funnelbackUrl + "search.json?";
  const suggestFunnelbackUrl = funnelbackUrl + "suggest.json?collection=stir-www&show=10&partial_query=";

  const courseUrl = "https://www.stir.ac.uk/courses/";
  const searchUrl = "https://www.stir.ac.uk/search/";

  var prevQuery = "";

  var keyUpTime = 400; // miliseconds; keystroke idle time, i.e. stopped typing
  var minQueryLength = 3; // min query length for activating the suggest box
  var KEY_ESC = 27;

  (function init() {
    search = new stir.ToggleWidget(popup, "stir__fadeIn", "stir__fadeOut");
    results = new stir.ToggleWidget(nodes.wrapper, "stir__slidedown", "stir__slideup");
    spinner = new stir.Spinner(nodes.input.parentElement);
    spinner.element.classList.add("c-search-loading__spinner-small");

    // hide the results panel (no results to show yet)
    results.hide();

    // Assign various event handlers
    button.addEventListener("click", opening);
    nodes.input.addEventListener("focus", focusing);
    nodes.input.addEventListener("keyup", stir.debounce(handleInput, keyUpTime));

    popup.addEventListener("click", function (event) {
      // trap all clicks _except_ those on the overlay
      if (event.target !== nodes.overlay) {
        event.stopPropagation();
      }
    });
  })();

  //  H E L P E R   F U N C T I O N S

  function doSearches(query) {
    stir.getJSON(suggestFunnelbackUrl + query, parseSuggestions.bind(nodes.suggestions));
  }

  // R E N D E R E R S

  function render(label, data) {
    if (this.nodeType !== 1) return;

    this.innerHTML = renderHeading(label.heading, label.icon) + "<ul>" + renderBody(label, data) + "</ul>";
  }

  const renderHeading = (title, icon) => {
    return `
        <h3 class="c-header-search__title header-stripped">
          <span class="${icon}"></span> 
          ${title}
        </h3>`;
  };

  const renderBody = (label, data) => (data.length > 0 ? data.join("") : renderGenericItem(label.none));

  const renderGenericItem = (text) => `<li class="c-header-search__item">${text}</li>`;

  const renderAllItem = (item) => {
    const url = item.collection === "stir-events" ? item.metaData.page : funnelbackServer + item.clickTrackingUrl;
    return `
      <li class="c-header-search__item">
        <a href="${url}">
        ${item.title.split(" | ")[0]} - ${item.title.split(" | ")[1] ? item.title.split(" | ")[1] : ""}</a>
      </li>`;
  };

  const renderCourseItem = (item) => {
    return `
      <li class="c-header-search__item">
        <a href="${funnelbackServer}${item.clickTrackingUrl}">
        ${item.metaData.award ? item.metaData.award : ""} 
        ${item.title.split(" | ")[0]}</a>
      </li>`;
  };

  const renderSuggestItem = (suggest) => {
    return `
      <li class="c-header-search__item">
        <a href="${searchUrl}?query=${suggest}">${suggest}</a>
      </li>`;
  };

  // P A R S I N G

  function getSeachParams(query_) {
    return obj2param({
      query: query_,
      SF: "[c,d,access,award,page]",
      collection: "stir-main",
      num_ranks: 25,
      "cool.21": 0.9,
    });
  }

  function parseSuggestions(suggests) {
    const max = 5;

    if (suggests.length > 0) {
      // perform search using first suggested term as the query
      stir.getJSON(searchFunnelbackUrl + getSeachParams(suggests[0]), parseFunnelbackResults);
      const suggestsUnique = suggests.filter((c, index) => suggests.indexOf(c) === index);
      const suggestsLtd = stir.filter((item, index) => index < max, suggestsUnique);

      render.call(nodes.suggestions, { heading: "Suggestions", none: "No suggestions found", icon: "uos-magnifying-glass" }, suggestsLtd.map(renderSuggestItem));
    } else {
      // no suggests so use the raw inputted query to perform the search
      stir.getJSON(searchFunnelbackUrl + getSeachParams(prevQuery), parseFunnelbackResults);

      render.call(nodes.suggestions, { heading: "Suggestions", none: "No suggestions found", icon: "uos-magnifying-glass" }, []);
    }

    spinner.hide();
    results.show();
  }

  function parseFunnelbackResults(data) {
    const max = 3;
    const obj = data.response.resultPacket.results;

    if (data.response.resultPacket.resultsSummary.fullyMatching > 0) {
      const coursesHtml = stir.compose(
        stir.map(renderCourseItem),
        stir.filter((item, index) => index < max),
        stir.filter((item) => item.liveUrl.includes(courseUrl))
      )(obj);

      const allHtml = stir.compose(
        stir.map(renderAllItem),
        stir.filter((item, index) => index < max),
        stir.filter((item) => !item.liveUrl.includes(courseUrl))
      )(obj);

      render.call(nodes.news, { heading: "All pages", none: "No results found", icon: "uos-all-tab" }, allHtml);

      render.call(nodes.courses, { heading: "Courses", none: "No courses found", icon: "uos-course-tab" }, coursesHtml);
    } else {
      render.call(nodes.news, { heading: "All pages", none: "No results found", icon: "uos-all-tab" }, []);
      render.call(nodes.courses, { heading: "Courses", none: "No courses found", icon: "uos-course-tab" }, []);
    }
  }

  // E V E N T   H A N D L E R   F U N C T I O N S

  function handleInput(event) {
    if (this.value != prevQuery) {
      results.hide();
      if (this.value.length >= minQueryLength) {
        spinner.show();
        doSearches(this.value);
        prevQuery = this.value;
      } else {
        spinner.hide();
        results.hide();
        prevQuery = "";
      }
    }
  }
  /**
   * If the search recieves focus, also reopen the
   * results-panel if there are results to display.
   **/
  function focusing(event) {
    if (this.value !== "" && results.hidden()) {
      results.show();
      spinner.hide();
    }
    //UoS_closeAllWidgetsExcept('headerSearch');
  }
  /*
   * Search icon in the header. Clicking it should open the big search input
   */
  function opening(event) {
    if (search.hidden()) {
      search.show();
      nodes.input.focus();
      nodes.input.removeAttribute("tabindex");
      nodes.submit.removeAttribute("tabindex");
    }

    // we don't want both search boxes visible at the same time. So we
    // tell this box to hide the other when active, and vice versa
    UoS_closeAllWidgetsExcept("headerSearch");

    // while the search is open, listen for keystrokes and close requests:
    document.addEventListener("keyup", escaping);
    document.addEventListener("focusin", focusouting);
    document.addEventListener("widgetRequestClose", closing);

    event.stopPropagation(); // prevent triggering the closeWidget listener on body
    event.preventDefault();
  }
  /**
   * When overlay is clicked, hide the header search panel
   **/
  function closing(event) {
    results.hide();
    search.hide();
    nodes.input.setAttribute("tabindex", "-1");
    nodes.submit.setAttribute("tabindex", "-1");

    // when the search is closed, stop listening for keystrokes and close requests:
    document.removeEventListener("keyup", escaping);
    document.removeEventListener("focusin", focusouting);
    document.removeEventListener("widgetRequestClose", closing);
  }

  function focusouting(event) {
    if (!popup.contains || !event.target) return; // IE won't support Node.contains()
    if (!popup.contains(event.target)) closing(event);
  }

  function escaping(event) {
    if (event.keyCode === KEY_ESC) closing(event);
  }
};

stir.Concierge.prototype.obj2param = function (obj) {
  // transform key/value pairs from object to URL formatted
  // query string, in this case for use with Funnelback.
  var elements = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      elements.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
    }
  }
  return elements.join("&");
};

(function () {
  // instantiate a new anonymous concierge
  new stir.Concierge(document.getElementById("header-search"));
})();

/* 
 *
 * Cookie Banner Code
 *
*

(function(){
	if(window.location.hostname.indexOf('stir.ac.uk')>-1) return;
    if(!window.Cookies) return;
    if(Cookies.get("cookiebanner")) return;

    // set up our elements
    var banner = document.createElement('section');
    var action = document.createElement('button');
    var url = 'https://www.stir.ac.uk/about/professional-services/student-academic-and-corporate-services/policy-and-planning/legal-compliance/data-protectiongdpr/privacy-notices/users-of-the-universitys-website/';
    var message = (function() {
        if (window.location.hostname === "www.stir.ac.uk") {
            // Banner message for the main website:
            return '<p>The University of Stirling uses cookies for advertising and analytics. Read our <a href="'+url+'">website privacy notice</a> to find out more.</p>';
        }
        // banner message for the satellite sites:
        return '<p>This site is hosted by The University of Stirling. Read our <a href="'+url+'">website privacy notice</a> to find out more about how we use cookies.</p>';
    })();

    // apply attributes and classes
    banner.setAttribute("id", "cookiebanner");
	banner.setAttribute("aria-label", "cookie-banner");
	banner.setAttribute("class", "u-bg-grey");
    action.setAttribute("class", 'button button--close');
    action.innerText = "Close";

    // build HTML and add to DOM
    banner.insertAdjacentHTML("afterbegin", message);
    banner.appendChild(action);
    document.body.appendChild(banner);

    // listen for click events
    action.addEventListener('click', closeCookieBanner);

    function closeCookieBanner() {
        // Set cookie so banner no longer appears on subsequent page loads
        Cookies.set("cookiebanner", true, { expires: 30 });
        // stop listening for clicks
        action.removeEventListener('click', closeCookieBanner);
        // destroy banner HTML (and references)
        banner.parentNode.removeChild(banner);
        banner = null;
    }
})();
*/
//var stir = stir || {};
//(function () {
//const scriptSrc = UoS_env.name.includes("preview") ? '<t4 type="media" id="176763" formatter="path/*" />' : UoS_env.wc_path + "js/other/favourites.js";
//const scriptSrc2 = UoS_env.name.includes("preview") ? '<t4 type="media" id="174052" formatter="path/*" />' : UoS_env.wc_path + "js/other/course-favs.js";

//stir.lazyJS(["#coursefavsarea", "#coursesharedarea", "#coursefavsbtn"], scriptSrc);
//stir.lazyJS(["#coursefavsarea", "#coursesharedarea", "#coursefavsbtn"], scriptSrc2);

// const scriptSrc = UoS_env.name.includes("preview") ? `<t4 type="media" id="174052" formatter="path/*" />` : UoS_env.wc_path + "js/other/" + "course-favs.js";

// const nodes = ["#coursefavsarea", "#coursesharedarea", "#coursefavsbtn"];
// const nodesInUse = nodes.filter((item) => stir.node(item));

// if (!nodesInUse.length) return;

// nodesInUse.forEach((item) => {
//   let observer = stir.createIntersectionObserver({
//     element: stir.node(item),
//     threshold: [0.001],
//     callback: function (entry) {
//       if (entry.isIntersecting) {
//         stir.addScript(scriptSrc);
//         observer && observer.observer.unobserve(this);
//       }
//     },
//   });
// });
//})();


// this will swap the native action for js-action. Useful for search
// forms where we want non-js situations to be able to submit
// to the Funnelback page, but js situations (i.e. using the search api) to submit to
// the js action page
(function(forms) {
    for(var i=0; i<forms.length; i++) {
        forms[i].action = forms[i].getAttribute('data-js-action') || forms[i].action;
    }
})(Array.prototype.slice.call(document.querySelectorAll("form[data-js-action]")));

/**
 *  T4 Form submit - outputs this message on all submits - but is only seen if the form fails to submit
 
 NOW IN THE T4 FORM CONTENT TYPE TEXT/FOOT

(function() {
    document.addEventListener('click', function (e) {
        if (e.target.matches('.js-submit')) {
    		// remove any earlier error messages
    		var el = document.getElementsByClassName("form-message")[0];
    		if(el)
    		    el.parentNode.removeChild(el);
            
            setTimeout(function() {
                // output the message after a slight delay
                var html = '<div class="clearfix"></div><p class="has-error form-message">You have missed some required fields in the form. Please complete these then click submit again.</p>';
                document.querySelectorAll('.c-form .js-submit')[0].insertAdjacentHTML('afterend', html);
            }, 500);
    	}
    }, false);
})();
 */
/*
 * Object Fit hack
 * For browsers that dont support object fit
 * Will remove the image tag and instead add a inline background image style
 * @author: Ryan Kaye
 *

(function () {
  var els = stir.nodes("[data-objectfit]");

  if (!els) return;

  if (els.length > 0 && "objectFit" in document.documentElement.style === false) {
    for (var i = 0; i < els.length; i++) {
      if (els[i].children[0]) {
        var src = els[i].children[0].getAttribute("src");
        els[i].removeChild(els[i].children[0]);
        els[i].style.backgroundImage = "url(" + src + ")";
      }
    }
  }
})();

/*
 * Pullquote fixes for Old Edge and IE
 * @author: Ryan Kaye
 *

(function () {
  if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Edge") != -1) {
    var el = stir.nodes(".pullquote");

    if (el) {
      for (var i = 0; i < el.length; i++) {
        el[i].style.borderRight = "15px solid #fff";
      }
    }

    var el = stir.nodes(".pullquote-vid>div.responsive-embed");
    if (el) {
      for (var i = 0; i < el.length; i++) {
        el[i].style.minHeight = parseInt(el[i].offsetWidth / 1.78 + 20) + "px";
      }
    }
  }
})();

/*
 * .c-link fix for Safari chevron
 * @author: Ryan Kaye
 */

(function () {
  if (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1) {
    var els = stir.nodes(".c-link");
    if (els) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("safariFix");
    }
  }
})();

/*
  
  @title: Header Link JS
  @author: Ryan Kaye
  @description: Dynamically add links to the header / mobile navs on the fly
  @date: 
  @updated: 24 August 2022 
    
*/

(function () {
  /*
    Create a header nav item (not the megamenu) 
  */
  const renderHeaderNavLink = (text, url, ident) => {
    return `
      <li class="c-header-nav__item c-header-nav__item-${ident} show-for-large">
          <a ident="header-link-${ident}" class="c-header-nav__link" rel="nofollow" href="${url}">${text}</a>
      </li>`;
  };

  /*
      Create a mobile nav menu item
   */
  const renderMobileNavLink = (text, url, ident) => {
    return `
      <li class="slidemenu__other-links-${ident} text-sm">
        <a ident="menu-link-${ident}" href="${url}" rel="nofollow">${text}</a>
      </li>`;
  };

  /* 
      Main 
  */
  const main = (text, url, ident) => {
    const headerHtml = renderHeaderNavLink(text, url, ident);
    const headerNode = stir.node(".c-header-nav--secondary");

    headerNode && headerNode.insertAdjacentHTML("afterbegin", headerHtml);

    const mobileHtml = renderMobileNavLink(text, url, ident);
    const mobileNode = stir.node(".slidemenu__other-links");

    mobileNode && mobileNode.insertAdjacentHTML("afterbegin", mobileHtml);
  };

  /* 
    getUserType 
  */
  const getUserType = () => {
    if (UoS_env.name === "dev") return "STAFF";
    return window.Cookies && Cookies.get("psessv0") !== undefined ? Cookies.get("psessv0").split("|")[0] : "";
  };

  /*
    On load
  */

  if (getUserType() === "STAFF") {
    main("Staff info", "/internal-staff/", "staff");
  }

  if (getUserType() === "STUDENT") {
    main("Student info", "/internal-students/", "students");
  }
})();

/*
 * INTERNAL MENUS
 */

/*
 * Main Mobile Burger Menu (Internal)
 * Only used by brandbank and Microsites
 */

(function () {
    var intSideMenu = document.querySelector('.internal-sidebar-menu');

    var intMainMobileBurger = document.getElementById('mobileMenuBurger');
    var intMainMobileNav = document.getElementById('mobilemenulinks');

    var intSubMobileBurger = document.querySelector('.burger--internal-sidebar-menu');
    var intSubMobileNav = document.querySelector(".internal-pages-mobile-menu");

    //var intBurger = document.querySelector('burger--internal-sidebar-menu');
    //var intNav = document.querySelector(".internal-pages-mobile-menu");

    /**
     * Function: show / hide relavent menu (m) 
     * when burger (b) is clicked
     */
    function intMenutoogle(m, b) {
        m.style.display = 'block'; // just in case there is a display none on the el
        if (m.classList.contains("hide")) {
            m.classList.remove("hide");
            b.classList.add("nav-is-open");
        } else {
            m.classList.add("hide");
            b.classList.remove("nav-is-open");
        }
    }

    /**
     * Click events
     */
    if (intMainMobileBurger && intMainMobileNav) {
        intMainMobileBurger.onclick = function (e) {
            intMenutoogle(intMainMobileNav, intMainMobileBurger)
            e.preventDefault();
        };
    }
    if (intSubMobileBurger && intSubMobileNav) {
        intSubMobileBurger.onclick = function (e) {
            intMenutoogle(intSubMobileNav, intSubMobileBurger)
            e.preventDefault();
        };
    }
    /*if (intBurger) {
        intBurger.onclick = function (e) {
            intMenutoogle(intNav, intBurger)
            e.preventDefault();
        }; 
    }*/

    /**
     * On load events
     */
    if (!intSideMenu)
        if (intSubMobileBurger)
            intSubMobileBurger.classList.add('hide'); // remove the sub menu burger if no sub menu

})();


/**
 * INTERNAL SIGNPOST DROPDOWN
 */

var intSignPostBtn = document.getElementById('internal-signpost-dropdown__link');
var intSignPostMenu = document.getElementById('internal-signpost-dropdown__submenu');

if (intSignPostBtn && intSignPostMenu) {
    intSignPostBtn.onclick = function (e) {
        e.stopPropagation();

        if (intSignPostMenu.classList.contains('hide')) {
            intSignPostMenu.classList.remove('hide');
            intSignPostBtn.classList.add('is-active');
        } else {
            intSignPostMenu.classList.add('hide');
            intSignPostBtn.classList.remove('is-active');
        }

        // kill other popups
        UoS_closeAllWidgetsExcept("internalSignpost");

        e.preventDefault();
        return false;
    };

    // Not sure if this is needed
    //intSignPostMenu.onclick = function (e) {
    //e.preventDefault();  
    //};
}

/*
 * Replacement for Foundation dropdown component
 * Used on Brandbank for file picker
 */
(function (scope) {

    if(!scope) return;
    
    var ddPanes = document.querySelectorAll(".dropdown-pane");
    var ddBtns = document.querySelectorAll(".button--dropdown");

    for (var i = 0; i < ddPanes.length; i++) {
        ddPanes[i].classList.add('hide');
    }

    function doClick(el) {
        el.onclick = function (e) {
            e.target.nextElementSibling.classList.toggle('hide');
            e.preventDefault();
        };
    }

    for (var i = 0; i < ddPanes.length; i++) {
        doClick(ddBtns[i]);
    }

})( document.querySelector(".c-download-box") );
/**
 * Lazy loading
 **/

stir.lazy(document.querySelectorAll('.stirlazy,[data-lazy-container]'));
(function() {
	if(!document.querySelector(".c-zoom")) return;
	switch (window.location.hostname) {
		case "localhost": stir.addScript('/src/js-other/loupe.js'); break;
		case "www.stir.ac.uk":
		case "stiracuk-cms01-production.terminalfour.net":
			stir.addScript('<t4 type="media" id="158075" formatter="path/*" />'); break;
		default:
			break;
	}
})();
/**
 * MEGAMENU
 * Load megamenu only if above certain breakpoint
 * If the megamenu html fails to load the links will just do their default behaviour
 * e.g. goto /study landing page
 *  REMOVE JQUERY
 */

(function () {
	var url;
	var KEY_ESC = "Escape";
	var mm = document.getElementById("megamenu__container__dev") || document.getElementById("megamenu__container");

	if (!mm) return;

	switch (UoS_env.name) {
		case "dev":
			url = "/pages/data/awd/megamenu.html";
			break;

		case "qa":
			url = "/stirling/pages/data/awd/megamenu.html";
			break;

		case "preview":
		case "production":
			url = "https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/2834";
			break;

		case "app-preview":
		case "appdev-preview":
		case "test":
			url = "https://stiracuk-cms01-test.terminalfour.net/terminalfour/preview/1/en/2834";
			break;

		default: // live
			url = "/developer-components/includes/template-external/mega-menu/";
			break;
	}

	function initMegamenu() {
		var primaryNav = document.querySelector("#layout-header .c-header-nav--primary");
		var mainSections = document.querySelectorAll(".megamenu__links > ul > li > a");
		var megalinks = document.querySelectorAll(".megamenu .megamenu__links");
		var active_class = "c-header-nav__link--is-active";
		var activeElement;

		for (var i = 0; i < mainSections.length; i++) {
			mainSections[i].insertAdjacentText("afterbegin", "Visit ");
			mainSections[i].insertAdjacentText("beforeend", " home");
		}

		// prevent click propagating up through to body (which will close the mm)
		mm.addEventListener("click", function (e) {
			e.stopPropagation();
		});

		Array.prototype.forEach.call(document.querySelectorAll(".megamenu"), function (el) {
			el.classList && el.classList.add("animation-slide");
			el.setAttribute("tabindex", -1);
			manageTabIndex(el, false);
		});

		const mm_clicked = function (e) {
			e.preventDefault();
			e.stopPropagation();

			var id, mm;
			id = e.target.getAttribute("aria-controls");
			id && (mm = document.querySelector("#" + id));

			// if related megamenu found, prevent defaults and apply behaviour
			if (mm) {
				/**
				 * If the megamenu related to this link item is already open, close it.
				 * If it is not already open, close any that are, then open this one.
				 */
				if (mm.classList && mm.classList.contains("animation-slide__down")) {
					mmSlideUp(mm);
				} else {
					mmSlideUpAll();
					mmSlideDown(mm);
				}

				e.target.classList && e.target.classList.toggle(active_class);
			} else {
				UoS_closeAllWidgetsExcept();
			}
		};

		function mmSlideDown(el) {
			if (!el || !el.classList) return;
			el.classList.remove("animation-slide__up");
			el.classList.add("animation-slide__down");
			manageTabIndex(el, true);
			mmFocusFirstElement(el);
			// listen for 'close' requests etc.
			document.addEventListener("widgetRequestClose", closing);
			document.addEventListener("keyup", escaping);
			activeElement = el;
		}

		function mmSlideUp(el) {
			if (!el || !el.classList) return;
			el.classList.add("animation-slide__up");
			el.classList.remove("animation-slide__down");
			manageTabIndex(el, false);
			// stop listening for requests
			document.removeEventListener("keyup", escaping);
			document.removeEventListener("widgetRequestClose", closing);
			el.id && returnFocus(el.id);
			activeElement = null;
		}

		function mmSlideUpAll() {
			unhighlight();
			Array.prototype.forEach.call(document.querySelectorAll(".megamenu.animation-slide__down"), function (el) {
				mmSlideUp(el);
			});
		}

		function mmFocusFirstElement(el) {
			const focusable = el.querySelector("a,button,input");
			focusable && focusable.focus();
		}

		function unhighlight() {
			Array.prototype.forEach.call(primaryNav.querySelectorAll("." + active_class), function (el) {
				el.classList && el.classList.remove(active_class);
			});
		}

		function manageTabIndex(mm, state) {
			Array.prototype.forEach.call(mm.querySelectorAll("a"), function (el) {
				state ? el.removeAttribute("tabindex") : el.setAttribute("tabindex", -1);
			});
		}

		const returnFocus = (id) => {
			const el = document.querySelector(`[aria-controls="${id}"]`);
			el && el.focus();
		};

		function escaping(event) {
			if (event.code === KEY_ESC) mmSlideUpAll();
			if (event.code === "ArrowRight" || event.code === "ArrowLeft") panning(event);
		}

		function closing() {
			unhighlight();
			mmSlideUp(document.querySelector(".megamenu.animation-slide__down"));
		}

		function panning(event) {
			var dollyTrack = activeElement.querySelector("ul>li>ul");
			var prev = activeElement.querySelector(".megamenu__prev-button");
			var next = activeElement.querySelector(".megamenu__next-button");

			if (event.code === "ArrowRight") {
				dollyTrack && stir.scroll.call(dollyTrack, 0, dollyTrack.scrollWidth - dollyTrack.clientWidth);
				next.style.display = 'none';
				prev.style.display = 'block';
			}
			if (event.code === "ArrowLeft") {
				dollyTrack && stir.scroll.call(dollyTrack, 0, 0);
				prev.style.display = 'none';
				next.style.display = 'block';
			}
		}

		{
			/* Megamenu "subpage" scrolling behaviour */

			function pan(sibling, positive, event) {
				var dollyTrack = this.parentNode.querySelector("ul > li > ul");
				var distance = positive ? dollyTrack.scrollWidth - dollyTrack.clientWidth : 0;
				stir.scroll.call(dollyTrack, 0, distance);
				this.style.display = "none";
				sibling && (sibling.style.display = "block");
				event.preventDefault();
			}

			for (var i = 0; i < megalinks.length; i++) {
				var prev = megalinks[i].querySelector(".megamenu__prev-button");
				var next = megalinks[i].querySelector(".megamenu__next-button");
				if (prev && next) {
					prev.addEventListener("click", pan.bind(prev, next, false));
					next.addEventListener("click", pan.bind(next, prev, true));
				}
			}
		}

		primaryNav.querySelectorAll("[data-menu-id]").forEach((nav) => {
			const mmid = nav.getAttribute("data-menu-id");
			const mmel = mm.querySelector(`#${mmid}`);
			if (mmid && mmel) {
				nav.setAttribute("aria-controls", mmid);
			}
		});

		primaryNav.addEventListener("click", mm_clicked);

		loaded = true;
	}

	/**
	 * Only load the MegaMenu if the viewport is (currently) larger than 1240px.
	 */
	var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	if (vw >= 1240) {
		stir.load(url, function (data) {
			if (data && !data.error) {
				mm.innerHTML = data;
				initMegamenu();
			} else {
				console.error("Unable to load MegaMenu");
			}
		});
	}
})();

/*
Tempate Favourites
*/

const TempateFavs = () => {
	const COOKIE_ID = "favs=";
	const FB_URL = "https://search.stir.ac.uk/s/search.json?collection=stir-main&SF=[sid,type,award]&query=&meta_sid_or=";

	/* 
		renderCourseLink: Returns an array of html strings 
	*/
	const renderCourseLink = (item) => `<li><a href="${item.url}">${item.title}</></li>`;

	/* 
		renderIcon: Returns a html strings 
	*/
	const renderIcon = () => {
		return `<svg version="1.1" data-stiricon="heart-active" fill="currentColor" viewBox="0 0 50 50" >
					<path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2h-0.1c-3,0-5.8,1.2-7.9,3.4 c-4.3,4.5-4.2,11.7,0.2,16L24,44.4c0.5,0.5,1.6,0.5,2.1,0L44,26.5c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
	C47.5,15,46.3,12.2,44.1,10.1z"></path>
				</svg>`;
	};

	/* 
		getfavsCookie: Returns an array of objects 
	*/
	function getfavsCookie(cookieId) {
		const favCookie = document.cookie
			.split(";")
			.filter((i) => i.includes(cookieId))
			.map((i) => i.replace(cookieId, ""));

		return favCookie.length ? JSON.parse(favCookie) : [];
	}

	/* 
		getFavsList: Returns an array of objects. PARAM: cookieType = accomm, course etc 
	*/
	function getFavsList(cookieType, cookieId) {
		const favsCookieAll2 = getfavsCookie(cookieId);

		const favsCookieAll = favsCookieAll2.map((item) => {
			if (!item.type) item.type = "course";
			return item;
		});

		const favsCookie = favsCookieAll.filter((item) => item.type === cookieType);

		if (!favsCookie.length || favsCookie.length < 1) return [];
		return favsCookie.sort((a, b) => b.date - a.date);
	}

	/*
		Controller
	*/
	function initMega(cookieId, fbUrl) {
		const favCourses = getFavsList("course", cookieId);

		if (!favCourses.length) return;

		const query = favCourses
			.filter((item) => Number(item.id))
			.map((item) => item.id)
			.join("+");
		const fbUrlFull = fbUrl + query;

		stir.getJSON(fbUrlFull, (results) => {
			const arrayResults = results?.response?.resultPacket?.results || [];
			if (!arrayResults.length) return;

			const favList = query.split("+").map((item) => {
				return arrayResults
					.filter((element) => {
						if (Number(item) === Number(element.metaData.sid)) {
							return item;
						}
					})
					.map((element) => {
						return {
							id: item,
							date: favCourses.filter((fav) => fav.id === item)[0].date,
							title: (element.metaData.award ? element.metaData.award : "") + " " + element.title.split(" | ")[0],
							url: element.liveUrl + `?orgin=datacoursefavs`,
						};
					});
			});

			const courses = stir.flatten(favList).sort((a, b) => b.date - a.date);

			// Make sure Megamenu has loaded then insert the links
			stir.nodes("[data-coursefavs]").forEach((element) => {
				element.insertAdjacentHTML("beforeend", `<ul class="no-bullet text-sm">${courses.map(renderCourseLink).join("")}</ul>`);
			});
		});
	}

	/*
		Controller
	*/
	function initHeader(cookieId) {
		const favs = getfavsCookie(cookieId);

		const iconNodes = stir.nodes("[data-stiricon=heart-inactive]");

		if (!iconNodes.length || !favs.length) return;

		iconNodes.forEach((element) => {
			stir.setHTML(element, renderIcon());
		});

		if (!favs.length) return;
		const iconNodeParent = stir.node("header [data-stiricon=heart-inactive]").parentNode;
		iconNodeParent && iconNodeParent.insertAdjacentHTML("beforebegin", `<em data-aos="u-fade-up-out" class=" u-heritage-green text-sm">${favs.length}</em>`);
	}

	/*
		On Load
	*/

	initHeader(COOKIE_ID);

	const callbackMegaMenu = (mutationList, observer) => {
		for (const mutation of mutationList) {
			for (const addedNode of mutation.addedNodes) {
				if (addedNode.id == "mm__study") {
					initMega(COOKIE_ID, FB_URL);
				}
			}
		}
	};

	const config = { attributes: true, childList: true, subtree: true };
	const observer = new MutationObserver(callbackMegaMenu);
	const menucontainer = stir.node("#megamenu__container");
	menucontainer && observer.observe(menucontainer, config);
};

TempateFavs();
var stir = stir || {};
(function () {
  const scriptSrc = UoS_env.name.includes("preview") ? '<t4 type="media" id="174054" formatter="path/*" />' : UoS_env.wc_path + "js/other/mobile-nav.js";
  stir.lazyJS(["#open_mobile_menu"], scriptSrc);
})();



(function() {

    /**
     * Category heading
     */
    var category = document.head.querySelector('meta[name="category"]');
    var heading = document.querySelector("h1.c-automatic-page-heading");
    if(category && heading) {
        category = category.getAttribute("content");
        heading.insertAdjacentHTML("afterend", '<p class="c-category-label" data-category="'+category+'">'+category+'</p>');
    }

    /**
     * Inline Pullquotes
     */
    var pullquotes = Array.prototype.slice.call(document.querySelectorAll('blockquote.c-pullquote[data-element-anchor]'));

    for(var i=0; i<pullquotes.length; i++) {
        var alignWith, pqParent, destinationContainer, destination;
        var pq = pullquotes[i];
        
        alignWith = pq.getAttribute("data-element-anchor");
        pqParent  = pq.parentElement;
        destinationContainer = pqParent.previousElementSibling;

        if(destinationContainer) {

            if(alignWith && Number.parseInt(alignWith) > 0) {
                destination = destinationContainer.querySelector(".c-wysiwyg-content > :nth-child("+alignWith+")");
                destination && destination.insertAdjacentElement("beforebegin", pq);
            } else {
                destination = destinationContainer.querySelector(".c-wysiwyg-content");
                destination && destination.insertAdjacentElement("beforeend", pq);
            }
    
            destination && pqParent.parentNode.removeChild(pqParent);
        }
    }
})();
/**
 * Scroll back to the top button
 */
(function(backToTopButton) {

	var element; // the observed element

    if(backToTopButton) {
        backToTopButton.addEventListener("click", function() {
            stir.scrollTo(0,0);
		});

		if(element = document.querySelector('#layout-header')) {
			stir.createIntersectionObserver({
				element: element,
				threshold: [0,1],
				callback: function(entry) {
					if(entry.intersectionRatio>0) {
						backToTopButton.classList.remove("c-scroll-to-top__visible");
					} else {
						backToTopButton.classList.add("c-scroll-to-top__visible");
					}
				}
			});
		}
    }

})(document.querySelector(".c-scroll-to-top"));

/*
@author: Ryan Kaye
@date: March 2022
@description: Enables a simple generic show / hide component with example html below

<div class="cell" data-showyhidey>
    <select>
        <option>Test</option>
        <option>Test2</option>
    </select>
    <div data-show="Test">
        <p>Test</p>
    </div>
    <div data-show="Test2">
        <p>Test 2</p>
    </div>
</div>
*/

(function (scope) {
  if (!scope) return;

  const initShowyHidey = (element) => {
    const select = element.querySelector("select");
    const contents = Array.prototype.slice.call(element.querySelectorAll("[data-show]"));

    const showSelectedItem = (e) => {
      const id = e.target.options[e.target.selectedIndex].value;
      const el = stir.node('[data-show="' + id + '"]');

      el && stir.each((item) => item.classList.add("hide"), contents);
      el && el.classList.remove("hide");
    };

    stir.each((item, index) => index !== 0 && item.classList.add("hide"), contents);
    select && (select.selectedIndex = "0");
    select && select.addEventListener("change", showSelectedItem);
  };

  stir.each(initShowyHidey, scope);
})(stir.nodes("[data-showyhidey]"));

if(self.UoS_StickyWidget)(function(widgets) {
    for(var sticky in widgets) {
        if(widgets.hasOwnProperty(sticky)){
            new UoS_StickyWidget(widgets[sticky]);
        }
    }
})(document.querySelectorAll('.u-sticky'));
var stir = stir || {};

stir.widgets = stir.widgets || {};

/**
 * @name New Accordion
 * @author Ryan Kaye <ryan.kaye@stir.ac.uk>
 * @author Robert Morrison <r.w.morrison@stir.ac.uk>
 * @description example usage: myAccord = new stir.accord(el, true);
 * @param {Element} el is the element to be turned into an accordion
 * @param {Boolean} doDeepLink  true to allow deeplinking (off by default)
 **/

stir.accord = (function () {
  /**
   * Just some housekeeping, not essential
   * 1) quick fixes: clen up any aria-expanded="false" attrs.
   * 2) check for Unique IDs
   */

  HOUSEKEEPING: {
    var debug = UoS_env.name !== "prod" ? true : false;
    var accordionIDs = [];

    Array.prototype.forEach.call(document.querySelectorAll(".stir-accordion"), function (item) {
      Array.prototype.forEach.call(item.querySelectorAll("[aria-controls]"), function (a) {
        accordionIDs.push(a.getAttribute("aria-controls"));
      });
      Array.prototype.forEach.call(item.querySelectorAll(".stir-accordion--inactive"), function (b) {
        b.classList.remove("stir-accordion--inactive");
      });
      Array.prototype.forEach.call(item.querySelectorAll(".stir__slideup,.stir__slidedown"), function (c) {
        c.classList.remove("stir__slideup");
        c.classList.remove("stir__slidedown");
      });
    });

    debug &&
    accordionIDs.length >
      accordionIDs.filter(function (v, i, s) {
        return s.indexOf(v) === i;
      }).length
      ? console.warn("[Accordion] Duplicate IDs found!")
      : null;
  }

  /**
   * Links elsewhere on the page that link-to and automatically open an accordion item.
   * If the accordion is already open, leave it open (don't click() again or it will toggle closed).
   * Links must have:
   * 	- an href that matches the accordion ID
   *  - a data-attribute of `remote` with the value `accordion`
   */
  REMOTECONTROL: {
    var remotes = document.querySelectorAll('[data-remote="accordion"]');
    Array.prototype.forEach.call(remotes, function (remote) {
      remote.addEventListener("click", function (event) {
        var el = this.hasAttribute("href") && document.querySelector(this.getAttribute("href"));
        /* if the accordion exists, scroll to it; if it's not already expanded then do so */
        el && (stir.scrollToElement(el, 20), !el.hasAttribute("aria-expanded") && el.click());
        if (history.pushState) history.pushState(null, null, this.getAttribute("href"));
        else location.hash = "#" + this.getAttribute("href");
        event.preventDefault();
      });
    });
  }

  var _id = 0;

  var Accordion = function (element, enableDeeplink) {
    if (typeof this.init === "undefined") return console.error("Please call stir.accord() with `new`.");

    this.id = ++_id;

    this.settings = {
      deeplinked: false,
      doDeepLink: enableDeeplink ? true : false,
    };

    if (!element) return;
    this.element = element;
    var _control = element.querySelector("[aria-controls]");
    var _region = element.querySelector('[role="region"]');

	if(_control && _region && _control.getAttribute('aria-controls') === _region.id) {
		debug && console.info('[Accordion] legacy markup found')
		this.control = _control;
		this.panel = _region;
	} else {
		debug && console.info('[Accordion] legacy markup NOT found, creating unique ARIA objects')
		this.control = null;
		this.panel = null;
	}

    this.init();
  };

  Accordion.prototype.getHeading = function getHeading() {
    var heading;
    Array.prototype.forEach.call(this.element.children, function (child) {
      if (child.matches("h1,h2,h3,h4,h5,h6,accordion-summary")) {
        heading = child;
      }
      if (heading) return;
    });
    return heading;
  };
  Accordion.prototype.init = function () {
    var cid = "accordion-control-" + this.id;
    var pid = "accordion-panel-" + this.id;

    if (!this.control) {
      var h2 = this.getHeading();
      if (!h2) return;
      this.control = document.createElement("button");
      this.control.innerText = h2.innerText;
      this.control.classList.add("stir-accordion--btn");
      this.control.setAttribute("aria-controls", pid);
      this.control.setAttribute("aria-expanded", "false");
      this.control.id = cid;
      h2.innerHTML = "";
      h2.appendChild(this.control);
    }

    if (!this.panel) {
      this.panel = this.element.querySelector("div");
      if (!this.panel) return;
      this.panel.setAttribute("role", "region");
      this.panel.setAttribute("aria-labelledby", cid);
      this.panel.id = pid;
    }

    this.element.classList.add("stir-accordion");

    this.element.addEventListener("click", this.handleClick.bind(this));
    if (this.element.getAttribute("data-deeplink") === "false") {
      this.settings.doDeepLink = false;
      // Deeplinks forced off: this takes priority over
      // the more general `enableDeeplinks` setting.
    }

    // Activate the deeplink if
    // (a) deeplinks are allowed, and…
    if (this.settings.doDeepLink) {
      // (b) this accordion matches the current URL hash, and…
      if (this.panel.id == window.location.hash.slice(1)) {
        // (c) only toggle (i.e. open) the accordion if it's NOT already expanded
        if (!this.control.hasAttribute("aria-expanded") || this.control.getAttribute("aria-expanded") === "false");
        this.toggle();
      }
    }
  };

  /**
   * Toggle accordion open/closed:
   * The container element needs a CSS class.
   * The button control needs an aria attribute.
   */
  Accordion.prototype.toggle = function () {
    this.element && this.element.classList.toggle("stir-accordion--active");
    this.control && this.control.setAttribute("aria-expanded", this.control.getAttribute("aria-expanded") === "true" ? "false" : "true");
  };

  Accordion.prototype.handleClick = function (e) {
    if (!e.target) return;

    // capture clicks on CONTROL directly (<a>) or its
    // parent element (e.g. <h2> or <h3>) or a child
    // element (e.g. <span>). Ignore any other clicks and
    // just let those bubble on through.
    if (e.target == this.control || e.target == this.control.parentNode || e.target.parentNode == this.control) {
      this.toggle();

      if (this.settings.doDeepLink) {
        if (history.replaceState) history.replaceState(null, null, "#" + this.panel.id);
        else location.hash = "#" + this.panel.id;
      }

      e.preventDefault();
    }
  };

  return Accordion;
})();

/**
 * On load: Set up the accordions
 **/
(function () {
  var debug = UoS_env.name !== "prod" ? true : false;
  // Loop through all stir-accordion elements on the page, and
  // initialise each one as an Accordion widget.
  Array.prototype.forEach.call(document.querySelectorAll(".stir-accordion"), function (accordion) {
    debug && console.warn('[Accordion] Deprecated. Use data-behaviour="accordion" instead of .stir-accordion', accordion);
    new stir.accord(accordion, false);
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-behaviour="accordion"]'), function (accordion) {
    new stir.accord(accordion, false);
  });
})();

var stir = stir || {};
(function () {
  const scriptSrc = UoS_env.name.includes("preview") ? '<t4 type="media" id="185628" formatter="path/*" />' : UoS_env.wc_path + "js/other/micro-gallery.js";
  //stir.addScript(scriptSrc);
  stir.lazyJS([".stir-microgallery"], scriptSrc);
})();

var stir = stir || {};

/*
   Replaces the Foundation reveal modal
   @author: Ryan Kaye
   Will find modals already in the html
   or allow a modal to be built on the fly
 */

stir.Modal = function Modal(el) {
  var id;

  /* 
    Initiate the modal 
  */
  function initModal() {
    if (!el.hasAttribute("data-stirreveal")) return;

    id = el.id;

    var overlay = document.createElement("section");
    var openButtons = stir.nodes('[data-modalopen="' + id + '"]');
    var closeButton = el.querySelector(".close-button");

    if (!el.parentElement || !el.parentElement.classList.contains("reveal-overlay")) {
      overlay.insertAdjacentElement("beforeend", el);
      el.setAttribute("aria-hidden", true);
      el.setAttribute("role", "dialog");
      el.style.display = "none";

      overlay.classList.add("reveal-overlay");
      document.querySelector("body").insertAdjacentElement("beforeend", overlay);
    }

    overlay.setAttribute("aria-label", "Container for modal " + id);
    overlay.addEventListener("click", overlayClickHandler);

    /*
      Event: Listen for "Show Modal" clicks
     */
    openButtons.forEach((button) => {
      button.addEventListener("click", function (event) {
        open_();
        event.preventDefault();
      });
    });

    /*
      Event: Listen for "Close Modal" clicks
     */
    if (closeButton) {
      closeButton.onclick = function (e) {
        close_();
        e.preventDefault();
      };
    }
  }

  /*
    Function: Show the modal
   */
  function open_() {
    if (!el.hasAttribute("data-stirreveal")) return;
    //el.setAttribute('aria-hidden', false);
    el.removeAttribute("aria-hidden");
    el.style.display = "block";
    el.parentNode.style.display = "block";
  }

  /*
    Function: Hide the modal
   */
  function close_() {
    if (!el.hasAttribute("data-stirreveal")) return;

    if (el.classList.contains("reveal")) {
      el.setAttribute("aria-hidden", true);
      el.style.display = "none";
      el.parentNode.style.display = "none";
    }
  }

  function overlayClickHandler(event) {
    if (event.target != this) return;
    event.preventDefault();
    close_();
  }

  /*
    Function: Use this to create a modal if one doesnt already exist on the page
   */
  function _render(id, label) {
    var html = [];
    var modal = document.createElement("div");

    html.push('<button class="close-button" data-close aria-label="Close modal" type="button">');
    html.push('<span aria-hidden="true">&times;</span>');
    html.push("</button>");

    modal.innerHTML = html.join("\n");
    modal.setAttribute("aria-label", label);
    modal.setAttribute("data-stirreveal", "");
    modal.classList.add("reveal");
    modal.id = id;

    el = modal;
    initModal();
  }

  /*
    Function: Helper: Set the modal content
   */
  function setContent_(html, docFragment) {
    if (!el.hasAttribute("data-stirreveal")) return;
    var button = el.querySelector(".close-button"); // retain the close button for re-use
    el.innerHTML = html;
    docFragment && el.appendChild(docFragment); // insert DOM elements
    button && el.insertAdjacentElement("beforeend", button);
  }

  /*
    On Load: set the modal up
   */
  if (el) initModal();

  /*
    Public functions
   */
  return {
    getId: function () {
      return el.id;
    },

    setContent: function (html, el) {
      setContent_(html, el);
    },

    open: function () {
      open_();
    },

    close: function () {
      close_();
    },

    render: function (newid, newlabel) {
      id = newid;
      _render(newid, newlabel);
    },
  };
};

/*

   Dialog Component

 */

stir.Dialog = function Dialog(element_) {
  const close_ = () => element.close();
  const open_ = () => {
    if (element.getAttribute("open") === null) element.showModal();
  };

  /*
    Getters
  */

  const getOpenBtns_ = (id_) => stir.nodes('[data-opendialog="' + id_ + '"]');
  const getCloseBtn_ = () => element.querySelector("[data-closedialog]");

  /*
    Renderers
  */

  const renderCloseBtn_ = () => `<button data-closedialog class="close-button">&times;</button>`;
  const renderOpenBtn_ = (text) => stir.stringToNode(`<button data-opendialog="${element.dataset.dialog}" class="button u-mt-sm">${text}</button>`);

  /*
    Listeners
  */

  const initListeners = () => {
    const id_ = element.dataset.dialog;

    if (!id_) return;
    const closeBtn = getCloseBtn_();

    getOpenBtns_(id_).forEach((button) => {
      button.addEventListener("click", (e) => open_());
    });

    closeBtn && closeBtn.addEventListener("click", (e) => close_());
  };

  /*
    Setters
  */

  const setId_ = (id) => {
    element.dataset.dialog = id;
    initListeners(id);
  };

  const setContent_ = (html) => {
    stir.setHTML(element, html + renderCloseBtn_());
    initListeners();
  };

  /*
    Initilaise
  */

  const element = element_ ? element_ : document.createElement("dialog");
  //const id = element.dataset.dialog ? element.dataset.dialog : null;

  !getCloseBtn_() && setContent_("");
  initListeners();

  /*
    Public functions
   */

  return {
    getId: function () {
      return element.dataset.dialog;
    },

    getDialog: function () {
      return element;
    },

    renderOpenBtn: function (text) {
      return renderOpenBtn_(text);
    },

    setId: function (id) {
      setId_(id);
    },

    setContent: function (html) {
      setContent_(html);
    },

    listen: function () {
      initListeners();
    },

    open: function () {
      open_();
    },

    close: function () {
      close_();
    },
  };
};

/*

   On load: Set up Modals and Dialogs found on the page
 
 */

(function (modals_, dialogs) {
  /* InitDialogs */
  const initDialogs = (dialogs) => {
    stir.t4Globals = stir.t4Globals || {};
    stir.t4Globals.dialogs = stir.t4Globals.dialogs || [];

    dialogs.forEach((element) => {
      stir.t4Globals.dialogs.push(stir.Dialog(element));
    });
  };

  /* Fallback to use legacy modal code */
  const dialogFallback = (dialogs) => {
    const dialogBtns = stir.nodes("[data-opendialog]");

    dialogs.forEach((element) => {
      element.removeAttribute("data-dialog");
      element.classList.add("reveal");
      element.setAttribute("data-stirreveal", "");
      element.setAttribute("aria-label", "Modal box");
      element.setAttribute("id", element.dataset.dialog);
    });

    dialogBtns.forEach((element) => {
      element.removeAttribute("data-opendialog");
      element.dataset.modalopen = element.dataset.opendialog;
    });
  };

  /* 
    ON LOAD   
  */

  if (!modals_ && !dialogs) return;

  if (stir.node("dialog")) {
    /* Dialog support??? */
    typeof HTMLDialogElement === "function" ? initDialogs(dialogs) : dialogFallback(dialogs);
  }

  /* Legacy modals - rescan to get Dialog fallbak instances */
  const modals = stir.nodes("[data-stirreveal]");

  stir.t4Globals = stir.t4Globals || {};
  stir.t4Globals.modals = stir.t4Globals.modals || [];

  modals.forEach((el) => {
    stir.t4Globals.modals.push(new stir.Modal(el));
  });
})(stir.nodes("[data-stirreveal]"), stir.nodes("dialog"));

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
			tab.header.classList.add('x-header-control')
			tab.accordion.setAttribute("aria-expanded","false");
			tab.accordion.setAttribute("aria-controls",tab.content.id);
			tab.content.setAttribute("aria-labelledby",tab.accordion.id);
			tab.content.setAttribute("hidden","");
		});
		
	} else {
		instance.tabs.forEach(tab => {
			tab.accordion.remove();
			tab.header.textContent = tab.label;
			tab.header.classList.remove('x-header-control')
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

var stir = stir || {};

(function () {
  // if we are in preview, dynamically load the preview tools
  // otherwise just skip this

  if("www.stir.ac.uk"===window.location.hostname) return;

  switch (window.location.hostname) {
    case "localhost":
      stir.addScript("/src/js-other/t4-preview-tools.js");
      break;
    case "stirweb.github.io":
      stir.addScript("/stirling/src/js-other/qa-protect.js");
      break;
    case "stiracuk-cms01-production.terminalfour.net":
    case "stiracuk-cms01-test.terminalfour.net":
      stir.addScript('<t4 type="media" id="158095" formatter="path/*" />');
      break;
  }
})();

// ((sliders) => {
//   const renderWrapper = (classes) => `<div class="u-padding-y ${classes}"></div>`;

//   sliders.forEach((el) => {
//     // Additional wrapper for wrappers now required
//     if (el.getAttribute("data-ct") === "wrapper") {
//       const div = stir.stringToNode(renderWrapper(el.classList.value));
//       el.insertAdjacentElement("beforebegin", div);
//       div.insertAdjacentElement("afterbegin", el);
//     }

//     tns({
//       container: el,
//       controls: false,
//       navPosition: "bottom",
//       autoHeight: true,
//       lazyload: true,
//     });
//   });
// })(Array.prototype.slice.call(document.querySelectorAll("[data-tns]")).filter((el) => el.id));

/**
 *  Vimeo API background masthead embeds
 */
(function () {
  var autoplay = true;
  var pausedEvent = document.createEvent("Event");
  var endedEvent = document.createEvent("Event");
  pausedEvent.initEvent("paused", true, true);
  endedEvent.initEvent("ended", true, true);

  var insertBackgroundVideo = function (autoplay) {
    // only when not small
    //if (window.Foundation && "small" == Foundation.MediaQuery.current) return;
    if (stir.MediaQuery.current === "small") return;

    var elements = document.querySelectorAll(".vimeo-bg-video");
    elements &&
      Array.prototype.forEach.call(elements, function (el, i) {
        var video = el.querySelector("div[data-videoId]"); // the container element
        var loops = video.getAttribute("data-noOfLoops"); // the number of times to loop the video
        var id = video.getAttribute("data-videoId"); // the Vimeo ID of the video
        var videoPlayer;

        var options = {
          id: id,
          background: true, // if true will ignore 'autoplay' setting and force autoplay
          loop: true,
          autoplay: autoplay,
          controls: false,
          transparent: true,
        };
		/* dnt: true, */

        videoPlayer = new Vimeo.Player(video, options);

        videoPlayer.on("play", function (data) {
          if (!autoplay) {
            videoPlayer.pause();
            video.setAttribute("data-playback", "paused");
          } else {
            video.setAttribute("data-playback", "playing");
          }
        });

        if (autoplay) {
          /* var videoTimeout = setTimeout(function() {
                    console.info('timeout!');
                    video.setAttribute("data-playback", "timeout");
                }, 2000); */

          videoPlayer
            .getDuration()
            .then(function (duration) {
              //clearTimeout(videoTimeout);
              // stop playing after n loops
              (function (video, duration, loops) {
                setTimeout(function () {
                  video.setAttribute("data-playback", "ended");
                  videoPlayer.pause();
                  video.dispatchEvent(endedEvent);
                }, duration * loops * 1000);
              })(video, duration, loops);
            })
            .catch(function (error) {
              console.error(error.name);
              video.style.display = "none";
            });
        }
      });
  };

  //if ("connection" in navigator && navigator.connection.saveData) {
  //console.info("Data saving is enabled. Video background will not be enabled.");
  //TODO: trigger fallback function
  //return;
  //}

  /* if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        autoplay = false;
        console.info('User Agent prefers reduced motion. Video banners will not auto-play.');
    } */

  if (document.querySelector("div[data-videoId]")) insertBackgroundVideo(autoplay);
})();

/**
 * Vimeo API general embeds
 */
(function () {
  /**
   * Function: Embed the video on the page
   **/
  function insertEmbeddedVideo() {
    var id,
      thumb,
      date,
      title,
      elements = document.querySelectorAll("div[data-videoEmbedId]");
    elements &&
      Array.prototype.forEach.call(elements, function (el, i) {
        id = el.getAttribute("data-videoEmbedId");
        id &&
          new Vimeo.Player(el.id, {
            id: id,
            loop: false,
		});
		/* dnt: true, */ // tracking enabled 2022-11-09 to improve analytics
      });
  }

  /**
   * Function: Build the Schema  Object
   **/
  function buildSchema() {
    var schemaData = [];
    var i = 0;

    if (stir.vimeo) {
      for (var index in stir.vimeo) {
        schemaData.push({
          "@type": "VideoObject",
          position: i + 1,
          name: stir.vimeo[index].name,
          description: stir.vimeo[index].description,
          thumbnailUrl: "https://www.stir.ac.uk/data/video/?content=thumbnail&id=" + stir.vimeo[index].id,
          embedUrl: "https://www.stir.ac.uk/data/video/?content=video&id=" + stir.vimeo[index].id,
          url: "https://www.stir.ac.uk/data/video/?content=video&id=" + stir.vimeo[index].id,
          uploadDate: stir.vimeo[index].uploadDate,
        });
        i++;
      }

      var schema = document.createElement("script");
      schema.type = "application/ld+json";
      schema.textContent = JSON.stringify({
        "@context": "http://schema.org",
        "@type": "ItemList",
        itemListElement: schemaData,
      });

      document.body.insertAdjacentElement("afterbegin", schema);
    }
  }

  /**
   * ON LOAD
   * Loop through all the vided-embed elements on the page and activate
   * the Vimeo Player API for each one.
   */
  if (document.querySelector("div[data-videoEmbedId]")) {
    insertEmbeddedVideo();
  }

  if (document.querySelector("div[data-videoschema]")) {
    buildSchema();
  }
})();
