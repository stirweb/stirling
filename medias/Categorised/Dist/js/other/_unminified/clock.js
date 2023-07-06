/**
 * Internally the clock uses UTC as it's the most widely supported,
 * but the convert() function can take any valid timezone.
 */
var UoS_Clock = (function () {

	var StirClock = function (timezone, locale) {
		this.timezone = timezone || 'Europe/London';
		this.locale = locale || 'en-GB';
		this.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		this.timeZoneOffsetHours = this.time().getTimezoneOffset() / 60;
	}

	StirClock.prototype.time = function () {
		return new Date();
	}

	StirClock.prototype.convert = function (timezone, locale) {
		timezone = typeof (timezone) == "undefined" ? this.timezone : timezone;
		locale = typeof (locale) == "undefined" ? this.locale : locale;
		return this.time().toLocaleString(locale, { timeZone: timezone });
	}

	StirClock.prototype.getCurrentDay = function getCurrentDay() {
		return this.time().getDay();
	}

	StirClock.prototype.getDayName = function getCurrentDay(day) {
		var day = typeof (day) == "undefined" ? this.getCurrentDay() : day;
		return this.daysOfWeek[day];
	}

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

		// Clearing is 7–22 August 2023
		// Scottish results: 8 Aug
		// A-Level results: 17 Aug

		// :: DATE HANDLING ::

		if (2023 != date.getUTCFullYear()) return false;	// ignore any dates not in 2023
		if (7 != month) return false						// ignore any dates not in August
		if (day <= 7) return false;							// no calls at all before 8 August
															// (Hotline is actually open from 7th but no web promo until 8th) [2023-07-06]
		if (day <= 16 && !sqa) return false;				// Aug 8–16 only allowed for Scotland region (SQA results)
															// …Aug 17–22 Clearing is open…
		if (day >= 23) return false; 						// no calls after 22 August (this got extended in 2022 to Aug 31)
		
		// :: TIME OF DAY HANDLING ::

		// Default opening hours Mon-Fri, 9am–5pm (8.00–16.00 UTC)
		// i.e. if the date is a weekday 9–5 (and we've passed the rules above) no
		// further rules are needed, we can return TRUE now.
		if (weekday && hour >= 8 && hour < 16) return true;

		// Extended hours (August only)
		// i.e. Weekends, or other times outwith 9–5…

		// [Results day] August 8 & 17: 8am–7pm (7.00–18.00 UTC)
		if ((8 == day || 17 == day) && hour >= 7 && hour < 18) {
			return true;
		}
		// [Results Boxing Day]August 9 & 18: 9am-6pm (8.00–17.00 UTC)
		if ((9 == day || 18 == day) && hour >= 8 && hour < 17) {
			return true;
		}
		// [Saturday] August 19: 9am-4pm (8.00–15.00 UTC) 
		if (19 == day && hour >= 8 && hour < 15) {
			return true;
		}

		// any other time, lines are closed:
		return false;
	}

	var ClearingClock = function (timezone, locale) {
		// Call the superclass (UoS_Clock) constructor:
		UoS_Clock.call(this, timezone, locale);
	}


	ClearingClock.prototype = proto;

	return ClearingClock;

})();