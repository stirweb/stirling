/**
 * Internally the clock uses UTC as it's the most widely supported,
 * but the convert() function can take any valid timezone.
 */
var UoS_Clock = (function () {
  var StirClock = function (timezone, locale) {
    this.timezone = timezone || "Europe/London";
    this.locale = locale || "en-GB";
    this.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.timeZoneOffsetHours = this.time().getTimezoneOffset() / 60;
  };

  StirClock.prototype.time = function () {
    return new Date();
  };

  StirClock.prototype.convert = function (timezone, locale) {
    timezone = typeof timezone == "undefined" ? this.timezone : timezone;
    locale = typeof locale == "undefined" ? this.locale : locale;
    return this.time().toLocaleString(locale, { timeZone: timezone });
  };

  StirClock.prototype.getCurrentDay = function getCurrentDay() {
    return this.time().getDay();
  };

  StirClock.prototype.getDayName = function getCurrentDay(day) {
    var day = typeof day == "undefined" ? this.getCurrentDay() : day;
    return this.daysOfWeek[day];
  };

  return StirClock;
})();

/**
 * Since the clock uses UTC we'll convert the Stirling local
 * time (which during the summer is BST, i.e GMT+1) to UTC
 * which is one hour behind. 9am BST is 8am UTC, and so on.
 */
var UoS_ClearingClock = (function () {
  // create a proto-clock:
  var proto = Object.create(UoS_Clock.prototype);

  // extend the prototype by adding a new member function:
  proto.clearingHotlineOpen = function clearingHotlineOpen(date, sqa) {
    var date = !date ? this.time() : date;

    var month = date.getUTCMonth();
    var hour = date.getUTCHours();
    var day = date.getUTCDate();
    var dayOfWeek = date.getUTCDay();
    var weekday = dayOfWeek > 0 && dayOfWeek < 6 ? true : false;

    // Hotline is available 6–22 August 2024
    // Scottish results day: 6 Aug
    // A-Level results day: 15 Aug

    // :: DATE HANDLING ::

    if (2024 != date.getUTCFullYear()) return false; // ignore any dates not in 2023
    if (7 != month) return false; // ignore any dates not in August
    if (day <= 5) return false; // no calls at all before 6 August
    if (day <= 14 && !sqa) return false; // Aug 6–14 only allowed for Scotland region (SQA results)
    if (day >= 31) return false; // no calls after 30 August

    // :: TIME OF DAY HANDLING ::

    // Default opening hours Mon-Fri, 9am–5pm (8.00–16.00 UTC)
    // i.e. if the date is a weekday 9–5 (and we've passed the rules above) no
    // further rules are needed, we can return TRUE now.
    if (weekday && hour >= 8 && hour < 16) return true;

    // ::  E X T E N D E D   H O U R S  ::
    // i.e. Weekends, or other times outwith 9–5…

    // [SQA Results day] August 6: 9am–7pm (8.00–18.00 UTC)
    if (6==day && hour>=8 && hour<18) {
		return true;
    }

	  // [A-Levels Results day] August 15: 8am–7pm (7.00–18.00 UTC)
    if (15==day && hour>=7 && hour<18) {
      return true;
    }

    // [Results Boxing Days] August 7 & 16: 9am-6pm (8.00–17.00 UTC)
    if ((7 == day || 16 == day) && hour >= 8 && hour < 17) {
      return true;
    }
    // [Saturday] August 17: 10am-2pm (9.00–13.00 UTC)
    if (17 == day && hour >= 9 && hour < 13) {
      return true;
    }

    // any other time, lines are closed:
    return false;
  };

  var ClearingClock = function (timezone, locale) {
    // Call the superclass (UoS_Clock) constructor:
    UoS_Clock.call(this, timezone, locale);
  };

  ClearingClock.prototype = proto;

  return ClearingClock;
})();
