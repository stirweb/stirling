/**
 * Each search landing page makes a call to Funnelback API and renders the results
 * Although each results page and the like is quite bespoke in how it renders, and
 * which params it passes to the API, there are some features that can be shared in
 * this lib:
 * - caching - reduce the same requests sent to the server
 * - filters - add filters and let the library loop results and make comparisons
 * - events - custom code at various stages of the request/response lifecycle
 * @author Martyn Bissett <martyn.bissett1@stir.ac.uk>

 */
var SearchBox = (function(window, undefined) {

    // this is our searchbox object that is set to global
    var SearchBox = function(options) {

        // Set default options
        options = $.extend(true, {
            datasets: {},
        }, options);

        // once we get into the jquery functions below, "this" will no longer
        // be this :)
        var _this = this;


        // ======================================
        // Instance properties

        /**
         * @var {Object} Store response in cache so we don't need to keep making calls
         */
        this.dataCache = {};

        /**
         * @var {Object} This is the container for the events that may be triggered
         */
        this.events = {};

        /**
         * @var {Object} Options
         */
        this.options = options;

        /**
         * we have two different container objects for filters. One (filters) is
         * a multi-dimensional array where available filters are organized in
         * groups (e.g. level, method). The other doesn't really care about the
         * groups and just stores them in order they were selected. The ordered
         * array is just so we can display filters below the search bar.
         * this is a closure for managing those objects. it just keeps
         * things encapsulated while we are adding and removing and ensures that
         * both arrays are kept in sync.
         * @var {Object}
         */
        this.active_filters = (function() {

            // this is our filter object that is passed to search(), it is a
            // multi-dimensional array that may contain multiple values for
            // each filter
            var filters = {
                // e.g. "level": {
                //     "Postgraduate": "Postgraduate",
                // }
            };

            // this is simple a single level array that allows us to just put
            // filters in the order that the user selects them. It just let's us
            // populate an active filters div when the user selects them.
            // note: using [] as it has length and can be checked
            var ordered_filters = [
                // e.g. {name: "level": value: "Campus based"}, {name: "method": value: "Full-time"}, ...
            ];

            // methods

            // add a filter to internal filters and ordered_filters
            var _add = function(f, value, options) {

                // we allow an object to be passed in here, so we'll convert the
                // single f and value into {f: value}
                // so that the rest of the method can assume an object
                var newFilters = {};
                if (typeof f === "object") {
                    newFilters = f;
                } else {
                    newFilters[f] = value;
                }

                // TODO this is broken coz we can't do {"level": "UG", "level": "PG", ...}
                var filterValue, orderedFilterObj;
                for (var filterName in newFilters) {

                    filterValue = newFilters[filterName];

                    // add value
                    if (typeof filters[filterName] === "undefined") {
                        filters[filterName] = {};
                    }

                    // if the filter hasn't been added, add it .. also, update
                    // ordered filters. This condition really just exists for
                    // ordered filters so we can assume it doesn't exist and just
                    // simply add it without having to check that array for duplicates
                    if (filters[filterName][filterValue] === undefined) {

                        // add to filters
                        filters[filterName][filterValue] =  filterValue;

                        // put value into ordered_filters
                        ordered_filters.push({
                            name: filterName,
                            value: filterValue
                        });
                    }

                }

                // ** fire off any "filters:updated" **
                _this.trigger("filters:updated", [filters]);

            };

            // remove a filter to internal filters and ordered_filters
            var _remove = function(filterName, filterValue) {

                // if filterValue is not given, assume we wanna remove all filter
                // values of this filterName - otherwise, just remove the single
                // filterValue
                var orderedFilter;
                if (typeof filterValue !== "undefined") {

                    // remove the single value from filters, if it exists
                    if (filters[filterName] && filters[filterName][filterValue]) {
                        delete filters[filterName][filterValue];
                    }

                    // This is a safe way to loop through an array whilst deleting. Iterate in reverse way
                    // the re-indexing doesn't affect the next item in the iteration, since
                    // the indexing affects only the items from the current point to the end
                    // of the Array, and the next item in the iteration is lower than the current
                    // point.
                    var i = ordered_filters.length; while (i--) {
                        orderedFilter = ordered_filters[i]
                        if (orderedFilter["name"] === filterName && orderedFilter["value"] === filterValue) {
                            ordered_filters.splice(i, 1);
                        }
                    }

                    // if filterName no longer has any keys, remove the key
                    if (typeof filters[filterName] !== "undefined" && Object.keys( filters[filterName] ).length <= 0) {
                        delete filters[filterName];
                    }

                } else {

                    // remove the single value from filters, if it exists
                    if (filters[filterName]) {
                        delete filters[filterName];
                    }

                    // remove the all filter values from ordered_filters
                    // see note above on looping and removing from an array
                    var i = ordered_filters.length; while (i--) {
                        orderedFilter = ordered_filters[i]
                        if (orderedFilter["name"] === filterName) {
                            ordered_filters.splice(i, 1);
                        }
                    }

                }

                // ** fire off any "filters:updated" **
                _this.trigger("filters:updated", [filters]);

            };

            // reset filters
            var _reset = function(filterName, filterValue) {

                // reset the arrays
                filters = {};
                ordered_filters = [];

                // ** fire off any "filters:updated" **
                _this.trigger("filters:updated", [filters]);

            };

            var _has = function(filterName, filterValue) {

                // if filterValue not given, we'll just check that it has the
                // filterName
                if (typeof filterValue !== "undefined") {
                    return !!(filters[filterName] && filters[filterName][filterValue]);
                } else {
                    return !!(filters[filterName]);
                }


            }

            return {
                add: _add,
                remove: _remove,
                reset: _reset,
                has: _has,
                getFilters: function() { return filters },
                getOrderedFilters: function() { return ordered_filters }
            };

        })();
    }


    // Instance methods

    /**
     * The main search method TODO rename to request
     * @param {Object} query The query object passed with the request e.g. {query: "history"}
     */
    SearchBox.prototype.request = function(query) {

        // we may have multiple pending ajax calls on the go as this supports
        // multiple datasets (individual objects containing urls, renderers, etc).
        // we'll build up an object to store boolean flags for each request as we
        // need to know the status of each one before we can run all renderers, fire
        // a single event, etc
        var pending = {};
        for (var name in this.options.datasets) pending[name] = true;

        // store query so it's available to the renderers
        this.options.query = query;

        // generate cache_id for cache for this request query so that we can
        // store it in cache for next time
        var cache_id = this.generateQueryChecksum(query);
        if (typeof this.dataCache[cache_id] === "undefined") this.dataCache[cache_id] = {};

        // ** fire off any "search:requesting" **
        this.trigger("search:requesting", [this.options]);

        // this is the function that will run when we have all of our data
        // back (rather than things loading in front of the user)
        var renderAll = function() {

            // this will loop through pending to see if we have any calls still
            // not back yet. the last call to return only will pass this step and
            // the rendering will begin for all.
            for (var name in this.options.datasets) {
                if (pending[name]) {
                    return false;
                }
            }

            // ** fire off any "search:rendering" **
            this.trigger("search:rendering", [this.options]);

            // loop through each dataset and call it's renderer
            var data;
            for(var name in this.options.datasets) {

                data = this.dataCache[cache_id][name];

                // mapData allows us to locate where our data or results are in the
                // response. For example, from fb we get data.response.resultPacket.results
                var _data = data;
                if (this.options.datasets[name].mapData instanceof Function) {
                    data = this.options.datasets[name].mapData(data);
                }

                // data is only passed encase it's required (e.g. meta data), we most likely will use
                // the mapped data arg in our renderer function.
                this.options.datasets[name].renderer(data, this.options, _data);

            }

            // ** fire off any "search:rendered" **
            this.trigger("search:rendered", [this.options]);

        }.bind(this);

        // fetch each data individually

        _this = this;

        // loop through each url
        var dataset;
        for (var name in this.options.datasets) {

            dataset = this.options.datasets[name];

            // if request.__searchBox_response has been populated already then we can put it
            // straight into cache and let the library process it as if it was a
            // previous http call that we don't need to make. useful for qTesting too.
            if (typeof dataset.request.__searchBox_response !== "undefined") {
                _this.dataCache[cache_id][name] = dataset.request.__searchBox_response;
            }

            // if data found in cache, use it
            if (_this.dataCache[cache_id] !== undefined && _this.dataCache[cache_id][name] !== undefined) {
                pending[name] = false;
                renderAll();
            } else {

                // we don't require that the developer adds response to cache, etc, and
                // we want to no let them set their own success as we need control over it
                // so we decorate the success function here and let renderAll
                // call the renderer function using the response .. thus overwriting anything
                // they pass in (coz it would probably break us)
                dataset.request.success = (function(name) {
                    return function(response) {
                        _this.dataCache[cache_id][name] = response;
                        pending[name] = false;
                        renderAll();
                    };
                })(name);

                $.ajax( $.extend(true, {

                    data: query,

                }, dataset.request) );
            }
        }

        // fire off any "search:requested"
        this.trigger("search:requested", [this.options]);

    };

    /**
     * Use to set event handlers
     * @param string eventName
     * @param function eventHandler
     */
    SearchBox.prototype.on = function(eventName, eventHandler) {

        // create empty array for this event
        this.events[eventName] = this.events[eventName] || [];

        // push eventHandler so that it is triggered when this event happens
        this.events[eventName].push(eventHandler);
    };

    /**
     * Clear event handlers
     * @param string eventName
     */
    SearchBox.prototype.off = function(eventName) {

        if (typeof this.events[eventName] !== "undefined") {
            delete this.events[eventName];
        }
    };

    /**
     * Will trigger an event
     * @param {Array} data Array of property objects e.g. [{p1: ...}, {p1: ...}, etc]
     * @return {Array} Array of (formatted/filtered/etc) property objects
     */
     SearchBox.prototype.trigger = function(eventName, argsArray) {

         // fire off any "search:requested"
         if (this.events[eventName] && this.events[eventName].length) {
             this.events[eventName].forEach(function(eventHandler) {
                 eventHandler.apply(this, argsArray);
             }.bind(this));
         }
     };

    /**
     * This let's us sort the query obeject keys
     * @param Object obj e.g. {b: 1, c: 2, a: 9}
     * @return Object ->{a: 9, b: 1, c: 2}
     */
    SearchBox.prototype.sortObjectKeys = function(unsorted) {

        var keys = Object.keys(unsorted);
        var sorted = {};

        keys.sort();

        for (var i = 0; i < keys.length; i++) {
            k = keys[i];
            if (unsorted[k] !== null && typeof unsorted[k] === "object") {
                sorted[k] = this.sortObjectKeys(unsorted[k]);
            } else {
                sorted[k] = unsorted[k];
            }
        }

        return sorted;
    };

    /**
     * will convert query object to a string checksum. We'll use this for cache id
     * @param Object query e.g. {query: "history"}
     * @return string e.g. "{query: \"history\"}"
     */
    SearchBox.prototype.generateQueryChecksum = function(query) {

        // instead of trying to produce a complex string, a key sorted JSON string ought to do it
        return JSON.stringify( this.sortObjectKeys(query || {}) );
    };

    /**
     * result should be a single result and will return a boolean depending if passes filters
     * @param {Object} result A single result object e.g. {"title": "History", ...}
     * @param {Object} formatters Formatters to apply from the dataset
     */
    SearchBox.prototype.format = function(result, formatters) {

        if (formatters) {
            for(var name in formatters) {
                if (typeof formatters[name] === "function") {
                    result[name] = formatters[name](result[name], result);
                } else {
                    result[name] = formatters[name];
                }
            }
        }
    };

    /**
     * result should be a single result and will return a boolean depending if
     * passes filters
     * @param {Object} result A property object (e.g. result.title, result.url, etc)
     * @param {Object} filters These are the datasets.name.filters
     * @return {Object} filters Filters to be applied to the results (e.g. {method: {ug: function() {...}, ...}})
     */
    SearchBox.prototype.validate = function(result, dataset_filters, operator) {

        var active_filters = this.active_filters.getFilters();

        if (typeof operator === "undefined") operator = "AND";

        // to acheive and/or we'll set is_valid either true or false
        // for AND conditions, start true, we'll set to false and break out is any active_filters are false
        // for OR conditions, start false, until we find something
        var is_valid = (operator === "AND") ? true : false;

        // loop through each dataset..filter
        var handler, resp;
        if (dataset_filters) {
            outer_loop: for(var name in dataset_filters) {

                // loop through each active_filter that is in dataset..filter
                if (typeof active_filters[name] !== "undefined") {
                    for (var filterValue in active_filters[name]) {

                        //
                        handler = dataset_filters[name];

                        //
                        resp = handler(result[name], filterValue, result);

                        if (operator === "AND" && !resp) {
                            is_valid = false;
                            break outer_loop;
                        } else if (operator === "OR" && resp) { // OR
                            if (resp) is_valid = true;
                            break outer_loop;
                        }

                    }
                }
            }
        }

        return is_valid;
    };

    /**
     * Will return formatted and filtered results in accordance with the config
     * @param {Array} data Array of property objects e.g. [{p1: ...}, {p1: ...}, etc]
     * @return {Array} Array of (formatted/filtered/etc) property objects
     */
    SearchBox.prototype.getResults = function(data, filters, formatters, options) {

        options = $.extend({
            filters__operator: "AND"
        }, options);

        var results = [];

        var result;
        if (data && data.length) {

            result_loop:
            for(var i=0; i<data.length; i++) {

                result = data[i];

                // this will format the result properties as
                // defined in options.formatters object
                // should come before validate so that any dynamic properties
                // can be validated against too
                if (formatters) this.format(result, formatters);

                // check against filters
                // result is expected to be as {name: value, ...}

                if (filters && !this.validate(result, filters, options.filters__operator)) continue result_loop;

                // add valid(?) result
                results.push(result);
            }
        }

        return results;
    };

    /**
     * Will return formatted and filtered results in accordance with the config
     * @param {Array} data Array of property objects e.g. [{p1: ...}, {p1: ...}, etc]
     * @return {Array} Array of (formatted/filtered/etc) property objects
     */
    SearchBox.prototype.getAvailableFilters = function(results, filters) {

        // we'll first build a filters_data containing a count
        // of results per filter to aid usability
        var filters_data = {};
        for (var name in filters) {
            filters_data[name] = {};
        }

        // set filter counters on ALL
        for (var i=0; i<results.length; i++) {

            result = results[i];

            // loop through filters and depending on the data
            // type extract filter names and values
            for (var name in filters) {
                if (result[name] !== undefined) {
                    if (Array.isArray(result[name])) {

                        for (var j=0; j<result[name].length; j++) {
                            if (typeof filters_data[name][result[name][j]] === "undefined") {
                                filters_data[name][result[name][j]] = 0;
                            }
                            filters_data[name][result[name][j]]++;
                        }

                    } else {

                        if (typeof filters_data[name][result[name]] === "undefined") {
                            filters_data[name][result[name]] = 0;
                        }
                        filters_data[name][result[name]]++;

                    }
                }
            };
        }

        var filters_data__sorted = {};
        Object.keys(filters_data).forEach(function(name) {

            // sorted filters is the order we'll output
            filters_data__sorted[name] = {};

            //
            Object.keys(filters_data[name]).sort().forEach(function(key) {
                filters_data__sorted[name][key] = filters_data[name][key];
            });
        });

        return filters_data__sorted;
    };

    return SearchBox;

})(window);
