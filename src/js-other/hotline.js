(function () {
  var clock;

  if ("function" == typeof UoS_ClearingClock) {
    clock = new UoS_ClearingClock();
  }

  if (!clock) {
    console.error("[Clearing hotline] clock unavailable");
  }

  function set(hotline) {
    var open = "open" == this.getAttribute("data-hotline");
    var closed = "closed" == this.getAttribute("data-hotline");

    if (hotline) {
      open && this.removeAttribute("aria-hidden"); // reveal open
      closed && this.setAttribute("aria-hidden", true); // hide closed
    } else {
      closed && this.removeAttribute("aria-hidden"); // reveal closed
      open && this.setAttribute("aria-hidden", true); // hide open
    }
  }
  function toggle(date, early) {
    set.call(this, clock ? clock.clearingHotlineOpen(date, early != null) : false);
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-hotline]"), function (el) {
    toggle.call(el, null, el.getAttribute("data-early"));
  });

  // Finish here for the live site (else continue on for debug features)
  if (window.location.hostname == "www.stir.ac.uk") return;

  /**
   * DEBUG/TEST STUFF
   */

  function timewarp(force, state, date) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-hotline]"), function (el) {
      if (force) {
        set.call(el, state);
      } else {
        toggle.call(el, date, el.getAttribute("data-early"));
      }
    });
  }
  
  window.timewarp = timewarp;

  function delorean() {
    var value = Number(fluxCapacitor.value);

    //REALTIME
    if (-1 === value) {
      timewarp(null, null, null);
      debugOutputElement.classList.remove("timeshift");
      phoneline.is(clock.clearingHotlineOpen(null, allowEarly.checked) ? "Open" : "Closed");
    }
    //ALT-TIME"
    else if (2 === value) {
      timewarp(null, null, new Date(date.value + "T" + time.value));
      debugOutputElement.classList.add("timeshift");
      phoneline.is(clock.clearingHotlineOpen(new Date(date.value + "T" + time.value), allowEarly.checked) ? "Open" : "Closed");
    }
    //FORCED open OR closed:
    else {
      timewarp(true, value, null);
      debugOutputElement.classList.add("timeshift");
      phoneline.is(value ? "Open" : "Closed");
    }
  }

  var fluxCapacitor = document.querySelector("#demo select");
  if (fluxCapacitor) {
    var debugOutputElement = document.querySelector("#status");
    var allowEarly = document.getElementById("allow-early");
    var date = document.getElementById("date");
    var time = document.getElementById("time");
    var now = new Date();

    date.value = now.getFullYear() + "-" + ("0" + (now.getUTCMonth() + 1).toString()).slice(-2) + "-" + ("0" + now.getUTCDate().toString()).slice(-2);
    time.value = ("0" + now.getHours().toString()).slice(-2) + ":" + ("0" + now.getMinutes().toString()).slice(-2);

    fluxCapacitor.addEventListener("change", delorean);
    date.addEventListener("change", delorean);
    time.addEventListener("change", delorean);
    allowEarly.addEventListener("change", delorean);

    try {
      debugOutputElement.querySelector('[data-value="current-time-utc"]').textContent = clock.convert("UTC", "en-GB");
      debugOutputElement.querySelector('[data-value="current-time-local"]').textContent = new Date().toLocaleString("en-GB");
      // won't work in IE:
      debugOutputElement.querySelector('[data-value="current-time-stirling"]').textContent = clock.convert("Europe/London", "en-GB");
    } catch (error) {
      console.error(error.stack ? error.stack : error.message);
      debugOutputElement.querySelector('[data-value="current-time-stirling"]').textContent = Math.random() > 0.5 ? "There is no spoon." : "The cake is a lie.";
    }

    var phoneline = {
      is: function (statustext) {
        document.querySelector('[data-value="hotline-open"]').textContent = statustext;
      },
    };
    phoneline.is(clock.clearingHotlineOpen() ? "Open" : "Closed");
  }
})();
