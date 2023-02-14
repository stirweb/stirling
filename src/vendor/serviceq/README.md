# ServiceQ

Use to queue and cache api calls to the same URL. Helps to avoid throttling on
APIs where a usage limit is imposed

## Basic usage

Although multiple do() calls are made, callbacks are queued and only a single
call is made. Further do() calls will use the cached data.

```javascript
var serviceQ = new UoS_ServiceQ({
	request: {
		url: "https://ipinfo.io",
		dataType: "jsonp",
	}
});

serviceQ.do( function(data) {
	console.log("Service 1", data);
} );

serviceQ.do( function(data) {
	console.log("Service 2", data);
} );
```

## Persistence

The below example uses getData and setData to store data as a cookie so that the
data is kept for the entire browser session (or longer).

```javascript
var serviceQ = new UoS_ServiceQ({
	request: {
		url: "https://ipinfo.io",
		dataType: "jsonp",
	},
	getData: function(data) {
		return Cookies.getJSON('UoS_LocationService__data');
	},
	setData: function(data) {
		Cookies.set('UoS_LocationService__data', data);
	}
});

serviceQ.do( function(data) {
	console.log("Service 1", data);
} );

serviceQ.do( function(data) {
	console.log("Service 2", data);
} );
```
