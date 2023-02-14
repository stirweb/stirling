# Utils

These are just some utility functions that don't quite have enough going for them
to be their own vendor/ library, so they just get lumped together here. For example,
a function to whitelist object keys, or the kinda of thing you'd find in underscore.js

## Objects

### Whitelist keys

```javascript
var myObj = {
	"red": "wine",
	"black": "ink",
	"green": "leaves"
}
var newObj = UoS_Utils.whitelistObjectKeys(myObj, ["red", "green"]);
console.log(newObj); // {"red":.., "green":..}
```

### Blacklist keys 

```javascript
var myObj = {
	"red": "wine",
	"black": "ink",
	"green": "leaves"
}
var newObj = UoS_Utils.whitelistObjectKeys(myObj, ["red"]);
console.log(newObj); // {"black":.., "green":..}
```
