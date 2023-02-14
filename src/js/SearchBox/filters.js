/**
 * we have a couple of formatters that will convert csv to arrays
 * so this just DRYs the code up a bit
 */
var SearchBoxFilters = (function() {

    /**
     * simple string comparison
     */
    var _compareStrings = function(resultValue, filterValue) {
        return (resultValue === filterValue);
    };

    /**
     * will check if value exists in array
     */
    var _inArray = function(resultValue, filterValue) {
        return ($.inArray(filterValue, resultValue) !== -1);
    };

    return {
        compareStrings: _compareStrings,
        inArray: _inArray
    };
})();
