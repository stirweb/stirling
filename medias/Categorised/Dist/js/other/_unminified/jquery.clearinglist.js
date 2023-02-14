/**
 * List of Clearing courses drawn from Funnelback via JSON
 * Provide a `region` option to choose from Scot EU, rUK or International.
 */
(function ($) {
  $.fn.clearinglist = function (options) {
    // This extra data is common to all regions. The courses listed here don't have normal/individual
    // course pages (which means they are not in the XML feed and they don't show in the normal course
    // finder feed) so we're just hard-coding them here so we can merge them into the Clearing course list.
    var extraDataAllRegions = [{
      title: "Professional Education (Secondary) with Chemistry",
      metaData: {
        "B": "BSc (Hons)",
        "U": "F1X3"
      },
      liveUrl: "https://www.stir.ac.uk/courses/ug/university-of-stirling-and-heriot-watt-joint-degrees/"
    }, {
      title: "Professional Education (Secondary) with Physics",
      metaData: {
        "B": "BSc (Hons)",
        "U": "F3X3"
      },
      liveUrl: "https://www.stir.ac.uk/courses/ug/university-of-stirling-and-heriot-watt-joint-degrees/"
    }, {
      title: "Professional Education (Secondary) with Engineering Technologies",
      metaData: {
        "B": "BSc (Hons)",
        "U": "F5X3"
      },
      liveUrl: "https://www.stir.ac.uk/courses/ug/university-of-stirling-and-heriot-watt-joint-degrees/"
    }, {
      title: "Social Work Studies (Graduate Entry)",
      metaData: {
        "B": "MSc",
        "U": "L508"
      },
      liveUrl: "https://www.stir.ac.uk/courses/pg-taught/social-sciences/social-work-studies/"
    }];
    var extraDataRegionOne = [{
      title: '<a href="https://www.stir.ac.uk/courses/ug/stirling-management-school/accountancy/"> Accountancy</a> and <a href="https://www.stir.ac.uk/courses/ug/arts-humanities/law-ba-programmes/">Business Law</a>',
      metaData: {
        "B": "BAcc",
        "U": "MN24"
      },
      liveUrl: ""
    }, {
      title: '<a href="https://www.stir.ac.uk/courses/ug/stirling-management-school/accountancy/">Accountancy</a> and <a href="https://www.stir.ac.uk/courses/ug/stirling-management-school/business-studies/">Business Studies</a>',
      metaData: {
        "B": "BAcc",
        "U": "NNF4"
      },
      liveUrl: ""
    }, {
      title: '<a href="https://www.stir.ac.uk/courses/ug/stirling-management-school/accountancy/">Accountancy</a> and <a href="https://www.stir.ac.uk/courses/ug/stirling-management-school/economics/">Economics</a>',
      metaData: {
        "B": "BAcc",
        "U": "LN14"
      },
      liveUrl: ""
    }, {
      title: '<a href="https://www.stir.ac.uk/courses/ug/stirling-management-school/accountancy/">Accountancy</a> and <a href="https://www.stir.ac.uk/courses/ug/natural-sciences/mathematics/">Mathematics</a>',
      metaData: {
        "B": "BAcc",
        "U": "GN14"
      },
      liveUrl: ""
    }, {
      title: '<a href="https://www.stir.ac.uk/courses/ug/stirling-management-school/accountancy/">Accountancy</a> and <a href="https://www.stir.ac.uk/courses/ug/stirling-management-school/marketing/">Marketing</a>',
      metaData: {
        "B": "BAcc",
        "U": "NN45"
      },
      liveUrl: ""
    }, {
      title: '<a href="https://www.stir.ac.uk/courses/ug/stirling-management-school/accountancy/">Accountancy</a> and <a href="https://www.stir.ac.uk/courses/ug/arts-humanities/spanish-latin-american-studies/">Spanish</a>',
      metaData: {
        "B": "BAcc",
        "U": "NR44"
      },
      liveUrl: ""
    }, {
      title: 'Accounting',
      metaData: {
        "B": "BA (Hons)",
        "U": "N401"
      },
      liveUrl: ""
    }, {
      title: '<a href="https://www.stir.ac.uk/courses/ug/stirling-management-school/economics/">Economics</a> and <a href="https://www.stir.ac.uk/courses/ug/natural-sciences/environmental-science-bsc/">Environmental Science</a>',
      metaData: {
        "B": "BA",
        "U": "FL91"
      },
      liveUrl: ""
    }, {
      title: '<a href="https://www.stir.ac.uk/courses/ug/natural-sciences/environmental-science-bsc/">Environmental Science</a> and <a href="https://www.stir.ac.uk/courses/ug/natural-sciences/mathematics/">Mathematics</a>',
      metaData: {
        "B": "BSc",
        "U": "F9G1"
      },
      liveUrl: ""
    }, {
      title: '<a href="https://www.stir.ac.uk/courses/ug/natural-sciences/environmental-science-bsc/">Environmental Science</a> and <a href="https://www.stir.ac.uk/courses/ug/arts-humanities/politics/">Politics</a>',
      metaData: {
        "B": "BSc",
        "U": "FL92"
      },
      liveUrl: ""
    }];
    var extraDataByRegion = {
      region1: extraDataAllRegions.concat(extraDataRegionOne),
      region2: extraDataAllRegions,
      region3: extraDataAllRegions,
      region4: extraDataAllRegions
    }; // region 1 Scot EU
    // region 2 rUK
    // region 3 International
    // region 4 SIMD

    var settings = $.extend({
      region: 1,
      errorMessage: "The course list could not be displayed. Please call our Clearing Team on +44 (0)1786 466166"
    }, options);
    var that = this;
    var FBQueryParameter = '';
    var HTMLfallback = '<p class="error">' + settings.errorMessage + '</p>';
    /**
     * Fallback function for use in the case of an error.
     */

    var fallback = function fallback() {
      this.append(HTMLfallback);
    };

    switch (settings.region) {
      case 1:
        FBQueryParameter = "meta_j_=Yes"; //clearing_places_scoteu

        break;

      case 2:
      case 4:
        FBQueryParameter = "meta_k_=Yes"; //clearing_places_ruk

        break;

      case 3:
        FBQueryParameter = "meta_m_=Yes"; //clearing_places_overseas

        break;

      default:
        fallback.call(this);
        return this;
      //if region is invalid, we just fire the callback and return early.
    }

    $.ajax({
      url: "https://www.stir.ac.uk/s/search.json?collection=stir-courses&num_ranks=250&sort=title&" + FBQueryParameter,
      dataType: "jsonp",
      callback: "callback"
    }).done(function (data) {
      $('.c-loading').hide();
      var html = ['<tr><th>Course title</th><th>UCAS code</th></tr>'];

      if (data && data.response && data.response.resultPacket && data.response.resultPacket.results) {
        // concatenate the extra data (hard coded above) to the
        //  results returned in JSON; and then sort them all by title:
        var results = data.response.resultPacket.results;
        results = results.concat(extraDataByRegion["region" + settings.region]);
        results.sort(function (a, b) {
          a = a.title.replace(/(<([^>]+)>)/ig, "").trim();
          b = b.title.replace(/(<([^>]+)>)/ig, "").trim();

          if (a < b) {
            return -1;
          }

          if (a > b) {
            return 1;
          }

          return 0;
        }); // loop to format each result to be displayed

        var skip = false; // flag - skip this course (i.e. it's not in clearing)

        var tAppend = ""; // extra note about a course, appended after the title 

        for (var i = 0; i < results.length; i++) {
          // Hack to hide secondary education becuase it isn't fully in clearing (so it might be confusing to have it in the list).
          //if(((settings.region === 1)) && results[i].title === "Education (Secondary)") {
          //skip = true;
          //}
          if (settings.region === 4 && results[i].title === "Nursing - Adult") {
            skip = true; // Adult Nursing not available in SIMD Clearing
          } // hack to append note to Secondary Education where it appears, all combinations available except one                                    


          if (results[i].title === "Education (Secondary)") {
            tAppend = "<br/><span>All course combinations are available for Clearing except for the option BSc (Hons) Education (Secondary) with Physical Education CX61</span>";
          }

          if (!skip) {
            var prefix = results[i]["metaData"]["B"] ? results[i]["metaData"]["B"] : '';
            var ucas = results[i]["metaData"]["U"] ? results[i]["metaData"]["U"] : '';
            html.push('<tr>');
            if (results[i]["liveUrl"]) html.push('<td><a href="' + results[i]["liveUrl"] + '">' + prefix + ' ' + results[i].title + '</a>' + tAppend + '</td>');else html.push('<td>' + prefix + ' ' + results[i].title + '' + tAppend + '</td>');
            html.push('<td>' + ucas + "</td>");
            html.push('</tr>');
          }

          skip = false;
          tAppend = '';
        }
      }

      that.append("<table>" + html.join('') + "</table>");
    }).fail(function () {
      fallback.call(that);
    });
    return this;
  };
})(jQuery);