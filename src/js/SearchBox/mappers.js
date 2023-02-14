/**
 * we have a couple of formatters that will convert csv to arrays
 * so this just DRYs the code up a bit
 */
var SearchBoxMappers = (function() {

    /**
     * will map to funnelback data and include best bets
     * @deprecated we can get rid of this coz we wanna use _buildMapDataHandler instead as
     *   it lets us include best bets as an option (e.g. courses doesn't require best bets)
     */
    var _fbApiResponse = function(data) {

        // to avoid the huge array fb returns, we'll just combine the bestBets and results here
        var combined = [];

        // only concat if bestBets is an array (so skip if null or undefined)
        if (data.response.resultPacket.bestBets) {
            combined = combined.concat(data.response.resultPacket.bestBets);
        }

        // only concat if bestBets is an array (so skip if null or undefined)
        if (data.response.resultPacket.results) {
            combined = combined.concat(data.response.resultPacket.results);
        }

        return combined;

    };

    /**
     * Will decorate a closure for the data mapper
     */
    var _buildMapDataHandler = function(options) {

        // set defaults
        options = $.extend({
            include_results: true,
            include_best_bets: true,
        }, options);
        
        // return the closure
        return function(data) {
            // to avoid the huge array fb returns, we'll just combine the bestBets and results here
            var combined = [];
            // object to store Best Bets (curators)
			var obj = [];
			
			// what collection are we using - this will define the object schema
			var mycollection = "";
			if( data.response.resultPacket.results.length > 0 )
    			mycollection = data.response.resultPacket.results[0].collection;
			
			// Best Bets are now stored under curators in a totally unrelated object schema
			// check that best bets in set to true in the options
			if(options.include_best_bets){
	    	    $.each( data.response.curator.exhibits, function( key, value ) {
                    // check its a best bet
                    if(value.category == "BEST_BETS"){
    			    	// map the object to a resultPacket.results object
    		    		obj =   { rank:0, 
    			    			  score:0, 
                                  title: value.titleHtml, 
                                  liveUrl: value.displayUrl, 
                                  summary: value.descriptionHtml,
                                  clickTrackingUrl: value.linkUrl, 
                                  starts_with: "",
                                  indexUrl: value.linkUrl 
    			    	        };
    			    	
    			    	// Collection specific stuff (metadata)	
    			    	var metaData ;
    			    	if(mycollection == 'stir-courses')
        			    	metaData = { c:value.descriptionHtml, L:'BEST_BETS' }; 
    			    	
                        obj.metaData = metaData; 
                        
                        // add to the final object
    					combined = combined.concat(obj);
    				}
    			});
            }
            
            // add general search results to the result object
            // only concat if bestBets is an array (so skip if null or undefined)
            if (options.include_results && data.response.resultPacket.results) {
                combined = combined.concat(data.response.resultPacket.results);
            }
            
            return combined;
        }

    };

    return {
        fbApiResponse: _fbApiResponse, // TODO deprecated
        buildMapDataHandler: _buildMapDataHandler
    };
})();
