# AWD

Will run a handler if the page meets the desired breakpoint. Will also run on resize
if required. For example, could be used to load a mobile menu when in small view. If
the user shrinks their window down to small later, it will run then. By default, handlers
only run (initialise) once.

## Basic usage

```javascript
var uos_awd = new UoS_AWD({

    // as defined in scss
    breakpoints: ["small", "medium", "large", "xlarge", "xxlarge"],

    // method to get current breakpoint
    getCurrent: function() {
        return Foundation.MediaQuery.current;
    }

});

$(function() {

	// load mobile menu in small only
    uos_awd.adaptTo("small only", function() {
		// ...
	});

    // load mega menu in large up
    uos_awd.adaptTo("large up", function() {
		// ...
	});

});
```
