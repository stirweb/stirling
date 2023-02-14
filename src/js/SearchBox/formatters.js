/**
 * we have a couple of formatters that will convert csv to arrays
 * so this just DRYs the code up a bit
 */
var SearchBoxFormatters = (function() {

    /**
     * convert csv to array
     * this process is called every time the filters are applied
     * so we need to check type (as it may already have been converted)
     */
    var _csvToArray = function(value) {
        if (typeof value === "string") {
            if (value !== "") {
                value = value.split(", ");
            } else {
                value = [];
            }
        }
        return value;
    };

    return {
        csvToArray: _csvToArray,
    };
})();
