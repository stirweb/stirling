/*
 * JavaScript Polyfills
 */

/*
 * element.closest()
 * For browsers that do not support Element.closest(),
 * but carry support for element.matches()
 * (or a prefixed equivalent, meaning IE9+)
 */

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

/*
 * element.remove();
 * https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
 */

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

/*
 * Array.includes()
 * https://github.com/kevlatus/polyfill-array-includes/blob/master/array-includes.js
 */

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

/*
 * String.includes()
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
 */

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

/*
 * Object.entries()
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
 */

if (!Object.entries) {
  Object.entries = function (obj) {
    var ownProps = Object.keys(obj),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}

/*
 * Object.values()
 */

if (!Object.values) {
  Object.values = function (obj) {
    var vals = Object.keys(obj).map(function (e) {
      return obj[e];
    });
    return vals;
  };
}

/**
 * Get a random value from an array [1,2,3,4] -> ?
 * return {mixed}
 */
/* Array.prototype.getRandomVal = function () {
    return this[Math.floor(Math.random() * this.length)];
};
 */

// String

/**
 * trim a string down and add ... to the end if exceeds max
 * return {string}
 */
/* String.prototype.trunc = String.prototype.trunc || function (maxChars, readMorePath) {
    return (this.length > maxChars) ?
        this.substr(0, maxChars - 1) + '&hellip; ' + ((readMorePath) ? ' <a href="' + readMorePath + '" class="more">Read more</a>' : '') :
        this.toString();
}; */

/**
 * Convert string to slugified version e.g. "Hello world!" -> "hello-world"
 * return {string}
 */
/* String.prototype.slugify = function () {
    var str = this;

    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
    return str;
}; */

/**
 * Will split a string and take the first element
 * e.g. "Fish bambinos | About | UoS" -> "Fish bambinos"
 * param delmiter {string} e.g. , or | or something else
 * return {string}
 */
/* String.prototype.getFirstFromSplit = function (delimiter) {
    if (this.indexOf(delimiter) > -1) {
        return this.split(delimiter)[0].trim();
    }
    return this;
}; */

/**
 * Remove html tags from a string
 * return {string}
 */
/* String.prototype.stripTags = function () {
    return this.replace(/(<([^>]+)>)/ig, "");
}; */

// Number

/** global prototype formatMoney function
 * param c {integer} count numbers of digits after sign
 * param d {string} decimals sign separator
 * param t {string} miles sign separator
 *
 *	example:
 *		(123456789.12345).formatMoney(2, ',', '.');
 *			=> "123.456.789,12" Latinoamerican moneyFormat
 */
/* Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}; */
