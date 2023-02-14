# Search box

Provides results loading from a data source primarily designed for loading search
results. Can be displayed in a variety of ways such as as a popup widget or as a
page of results.

Note: use this library if you want to query multiple APIs (e.g. news, events, suggest) and/or
you want to apply filters/formatters. If it's just to query a single API and nothing else, you
could use it for consistency with other search API calls, or just use a jQuery Ajax function.

TODO
- formatters should pass in the result, not value .. how can we create properties? e.g. result.availability
- pull out pagination info from helpers, it's only one line

## Usage

### Single dataset

Datasets each consist of a URL to fetch the data (e.g. XML, JSON, whatever) and
a function to handle that data, whatever it may be, when it's returned.

Below shows a basic example of the search box with a single div for showing search
suggestions.

```html
<form method="get" action="/search">
    <input type="text" name="search" autocomplete="off">

    <a href="#"><i class="fa fa-close"></i></a>

    <div class="search-box" id="search_box">
        <div id="results">
            <div id="suggestions"></div>
        </div>

        <div id="loading">
            Loading...
        </div>
    </div>
</form>
```

```javascript
var searchBox = new SearchBox({
    datasets: {
        suggestions: {

            // jquery ajax options
            request: {
                url: "data/search.json",

                // The name of the callback parameter, as specified by the api
                jsonp: "callback",

                // Tell jQuery we're expecting JSONP
                dataType: "jsonp"
            },

            renderer: function(data, options) {
                var html = [];
                if (data.length) {
                    html.push('<ul>');
                    for (var i=0; i<data.length; i++) {
                        html.push('<li><a href="search.json?query='+data[i].key+'">'+data[i].disp.replace(options.query.search_query, '<span style="font-weight: bold;">'+options.query.search_query+'</span>')+'</li>');
                    }
                    html.push('</ul>');
                } else {
                    html.push('<p>No suggestions found.</p>')
                }
                $("#search_results__suggestions").html( html.join("") );
            }
        }
    }
});

// this can be assigned to an event such as a form onsubmit, or button onclick, etc
searchBox.request({
    search_query: "test"
});
```

### Testing and/or non-HTTP data

AJAX calls can be a little tricky to test so there is functionality to kinda fake
the HTTP response so it doesn't get made but the library will run as though it did.
Also useful if we are working with local variables (non-HTTP) that don't require an
HTTP request.

```javascript
var data = {
    "results": [
        {name: "James", job: "Techie", hobbies: ["Cycling","Movies"]},
        {name: "Robert", job: "Techie", hobbies: ["Cycling","Running"]},
        {name: "Mick", job: "Sales", hobbies: ["Reading","Running"]},
    ]
};

// options just needs to be empty, so we can get searchBox.active_filters
var searchBox = new SearchBox({
    datasets: {
        results: {
            request: {
                __searchBox_response: data,
            },
            renderer: function(data) {
                assert.ok( data.length === 3, "Results is correct length" );
            }
        }
    }
});
```

Note: I've used searchBox_ namespace name as the request object is used by jquery
and don't want to risk coliding with their property names.

### Multiple datasets

Multiple datasets can be used to fetch data from multiple sources if required.
By having multiple datasets within the same search box instance, renderers are
only run when all urls have responded so we can, for example, hide loading divs.
This can be seen in the homepage search where we are calling suggest, news, events
and course APIs.

Below gives an example of two datasets being configured:

```javascript
var searchBox = new SearchBox({
    datasets: {
        news: {
            request: {
                url: "...",
            },
            renderer: function(data, options) {
                //...
            }
        },
        events: {
            request: {
                url: "...",
            },
            renderer: function(data, options) {
                //...
            }
        }
    }
});
```

## Events

Search box has some events that can have event handlers attached:

| ID               | Desc          |
|------------------|---------------|
| search:requesting    | Fires before the search begins   |
| search:requested     | Fires after search function ends (ajax request may still be pending)  |
| search:rendering | Fires before the renderer functions       |
| search:rendered  | Fires after the renderer functions have been called  |
| filters:updated  | Fires when filters are added/removed/reset  |

```javascript
searchBox.on("search:requesting", function(options) {
    //...
    history.pushState(null, null, url);
});

searchBox.on("search:rendered", function(options) {
    //...
    hideLoading(); // custom function to hide loading div when results have been rendered
});
```

Remove event handlers

```javascript
searchBox.off("event_name");
```

## mapData

Sometimes we get a complex response object. For example, the following is returned
from Funnelback API:

```javascript
{
    ...
    response: {
        ...
        resultPacket: {
            results: [...]
        }
    }

}
```

To make life easier, we can define a mapData function that will tell the library
where results is. That way, when we are working with our renderer functions we'll
be passed just results:


```javascript
dataset: {
    scholarships: {
        ...
        mapData: function(data) {
            return data.response.resultsPacket.results; // map to this object in data
        },
        renderer: function(results, options, original_data) {

        }
    }
}
```

In the example above, results is the mapped results, whereas original_data is the
full response. The full response is given so you can still access meta data, etc
contained within in the response object.

## Formatters

If we have data that needs to be formatter prior to filtering, etc, we can add these
to the config. Below gives an example of converting a CSV property to an array as this
will be more suited to generating our filters:

```javascript
var searchBox = new SearchBox({
    datasets: {
        events: {

            //...

            formatters: {

                tags: function(value, result) {

                    if (typeof value === "string" && value !== "") {
                        value = value.split(", ");
                    } else {
                        value = [];
                    }

                    return value;
                },

                // examples of dynamic property that doesn't exist in the api
                // this can be subject to validation now if required
                net_pay: function(value, result) {
                    return result.gross_pay - result.deductions; // e.g. 2017-06-02 -> 2nd June 2017
                },

                // or simply, set a fixed value
                clearing: 1
            },

            //...

});
```

## Filters

Filters allow users to narrow down results so they can find what they're looking for.

### Validation

```javascript
var searchBox = new SearchBox({
    //...

    datasets: {
        results: {
            request: {
                url: "...",
            },

            filters: {

                // use the result.[property] name as key
                // here, we are defining filters for both "level" and "method"
                level: function(resultValue, filterValue) {
                    return (resultValue === filterValue);
                },
                method: function(resultValue, filterValue) {
                    return ($.inArray(filterValue, resultValue) !== -1);
                }
            }

            renderer: function(results, options) {

                var filters = options.datasets.results.filters;
                var formatters = options.datasets.results.formatters;

                var filtered_results = searchBox.getResults(results, filters, formatters);

                //...
});
```

### Active filters container

There is an object of each instance that stores two arrays for filters - one is
a multi-dimensional array where available filters are organized in
groups (e.g. level, method). The other doesn't really care about the
groups and just stores them in order they were selected. The ordered
array is just so we can display filters e.g. below the search bar in their order.
This container object just keeps things encapsulated while we are adding
and removing and ensures that both arrays are kept in sync.

Below shows registering and accessing filters:

```javascript
// get filters arranged by filter group e.g. {level: {"ug": "ug", "pg": "pg", ...}, method: ...}
var filters = resultsBox.active_filters.getFilters();

// add filter to container
resultsBox.active_filters.add("level", "ug");

// check filters has filter
resultsBox.active_filters.has("level", "ug"); // return boolean

// remove filter (and all values) from container
resultsBox.active_filters.remove("level", "ug");

// remove filter value from container
resultsBox.active_filters.remove("level", "ug");
```

An additional array can be obtained which stored active filters in the order they
were added. This is useful when you want to display, for example, filter links in
the order the user selected them rather than the order searchBox stores them:

```javascript
var ordered_filters = resultsBox.active_filters.getOrderedFilters();
```
