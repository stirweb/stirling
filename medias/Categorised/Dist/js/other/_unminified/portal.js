var stir = stir || {};

stir.portal = (function () {
  var el = document.getElementById("portal-status");
  var sessionCookie = getCookie("psessv0");

  /* legacy function for portal status banner */
  function check() {
    if (!el) return;
    el.innerHTML = "";
    if (sessionCookie) {
      var b = sessionCookie.split("|");
      el.innerHTML = "<span>Welcome back <strong>" + b[2].replace("+", " ").split("_").join(" ") + "</strong>.</span> <span>You last logged on " + b[3].split("_").join(" ") + ".</span> " + '<span><a href="https://portal.stir.ac.uk/my-portal.jsp" class="portal00">My Portal</a> ' + '| <a href="https://portal.stir.ac.uk/security/logout.jsp" class="portal01">Log out</a></span>';
    }
  }

  /* show status message 2017-05-02-15.33 rwm2 - not used yet 2017-09-26 */
  /* function getStatusMessage() {
		var r = "";
		if (sessionCookie != null && sessionCookie != "") {
			var cookieData = sessionCookie.split("|");
			var userName = cookieData[2].split("+").join(" ");
			var lastLogon = cookieData[3].split("_").join(" ");
			var logon = '<a href="https://portal.stir.ac.uk/my-portal.jsp">Continue to Portal</a>';
			var logoff = '<a href="https://portal.stir.ac.uk/security/logout.jsp">log off now</a>';
			r = "<p>Welcome back <strong>" + userName + "</strong>. You last logged on <time>" + lastLogon + "</time>. " + logon + " or " + logoff + ".</p>";
		}
		return r;
	} */

  function getCookie(c_name) {
    if (document.cookie.length > 0) {
      c_start = document.cookie.indexOf(c_name + "=");
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return "";
  }

  return {
    check: check,
  };
})();
