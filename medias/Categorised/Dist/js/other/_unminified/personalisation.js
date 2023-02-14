/* var stir = stir || {};

(function() {

    stir.personalisation = function(personalisationDataURL, region) {
        if(!personalisationDataURL || !region) return;
        //console.info("Your region is " + region);

        var personalisationData = $("<div/>"),
            personalisationPlaceholders = Array.prototype.slice.call(document.querySelectorAll('[data-region]')),
            active = false;

        for (var i=0; i<personalisationPlaceholders.length; i++) {
            if(region == personalisationPlaceholders[i].getAttribute("data-region")) {
                active = true;
                personalisationData.load(personalisationDataURL, function() {
                    //console.info("Personalisation data was loaded 🎭")
                    doPersonalisations(region);
                });
                break;
            }
        }

        //!active && console.info("No personalisations for your region (" + region + ") were found. 😩");

        function doPersonalisations(region) {
            if(!region) return;

            //console.info("Personalising page for region: " + region);
            var personalisations = Array.prototype.slice.call(document.querySelectorAll('[data-region="' + region + '"]'));
            //console.info("Found " + personalisations.length + " personalisation elements.");

            for(var i = 0; i < personalisations.length; i++) {
                var removals = personalisations[i].getAttribute("data-remove").split(",");
                var imports  = personalisations[i].getAttribute("data-import").split(",");
                var callback = personalisations[i].getAttribute("data-callback");
                //console.info("Personalisation item #" + (i+1) + " requires " + (removals[0] ? removals.length : "no") + " removal(s) and " + (imports[0] ? imports.length : "no") + " addition(s), and " + (callback ? "a" : "no") + " callback.");
                for(var x=0; x<removals.length; x++){
                    var removable = document.querySelector('[id="d.en.'+removals[x]+'"]');
                    if(removable) {
                        removable.parentElement.removeChild(removable);
                        //console.info("\t→ Item " + '[id="d.en.'+removals[x]+'"]' + " was removed.")
                    }
                }
                for(var x=0; x<imports.length; x++){
                    var importable = personalisationData.find('[id="d.en.'+imports[x]+'"]').get(0);
                    if(importable) {
                        //console.info("\t→ Item " + '[id="d.en.'+imports[x]+'"] was imported.');
                        personalisations[i].parentNode.insertBefore(importable, personalisations[i]);
                    } else {
                        //console.error("\t→ Failed to import item " + '[id="d.en.'+imports[x]+'"].');
                    }
                }
                if(callback) {
                    if(typeof(window[callback]) == "function"){
                        //console.info("Attempting callback: " + callback + "()")
                        window[callback]();
                    } else {
                        //console.error("Requested callback \"" + callback + "()\" is not a function");
                    }
                }
            }
            //console.info("Personalisation done!!!!! 😅");
        }
    }

    //UoS_locationService.do( function(data) {
    //    if(!stir.t4Globals || !stir.t4Globals.personalisationDataURL || !stir.personalisation) return;
    //    stir.personalisation(stir.t4Globals.personalisationDataURL, data.country_code);
    //});

})(); */