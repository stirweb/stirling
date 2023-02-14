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
	proto.clearingHotlineOpen = function clearingHotlineOpen(date, early) {
		var date = !date ? this.time() : date;

		var month = date.getUTCMonth();
		var hour = date.getUTCHours();
		var day = date.getUTCDate();
		var dayOfWeek = date.getUTCDay();
		var weekday = dayOfWeek > 0 && dayOfWeek < 6 ? true : false;

		// Clearing is 8–24 August 2022
		// Scottish results: 9 Aug
		// A-Level results: 18 Aug
		// No early opening this year as such BUT Scottish pages will use the 'early' tag.

		// In 2021 lines were open early for some regions (from 5 July to 8 August)
		// Set the `early` parameter TRUE to check the date against the early period AS WELL AS the normal period.
		// Set the `early` parameter FALSE to check the date against ONLY the normal period.


		// :: DATE HANDLING ::

		if (2022 != date.getUTCFullYear()) return false;	// ignore any dates not in 2022
		if (7 != month) return false						// ignore any dates not in August
		if (day <= 7) return false;							// no calls at all before 8 August
		if (day <= 17 && !early) return false;				// Aug 8–17 only allowed for `early` region (Scot)
															// …Aug 18–24 Clearing is open…
		//if (day >= 25) return false; 						// no calls after 31 August (revised 2022-08-25)
		
		// :: TIME OF DAY HANDLING ::

		// Default opening hours Mon-Fri, 9am–5pm (8.00–16.00 UTC)
		// i.e. if the date is a weekday 9–5 (and we've passed the rules above) no
		// further rules are needed, we can return TRUE now.
		if (weekday && hour >= 8 && hour < 16) return true;

		// Extended hours (August only)
		// i.e. Weekends, or other times outwith 9–5
		//if(7 == month) {
		// August 9 & 18: 8am–7pm (7.00–18.00 UTC)
		if ((9 == day || 18 == day) && hour >= 7 && hour < 18) {
			return true;
		}
		// August 10 & 19: 9am-6pm (8.00–17.00 UTC)
		if ((10 == day || 19 == day) && hour >= 8 && hour < 17) {
			return true;
		}
		// August 20: 9am-4pm (8.00–15.00 UTC)
		if (20 == day && hour >= 8 && hour < 15) {
			return true;
		}
		//}

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