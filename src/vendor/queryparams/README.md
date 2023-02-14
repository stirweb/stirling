# QueryParams

Used to read and write params (push state) to the URL query string.

## Usage

```javascript
// read a single value
var param = QueryParams.get("sortby"); // e.g. "name"

// read all values
var params = QueryParams.getAll(); // e.g. {sortby: "name", ...}

// push a single value
QueryParams.set("sortby", "age");
QueryParams.set("sortby", "age");

// push a value then reload the page
QueryParams.set("sortby", "age", true);

// push multiple values
QueryParams.set({
	"sortby": "age",
	"page": "2"
});

// push multiple values then reload the page
QueryParams.set({
	"sortby": "age",
	"page": "2"
}, null, true);
```
