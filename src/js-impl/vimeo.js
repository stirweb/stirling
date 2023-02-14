/**
 *  Vimeo API background masthead embeds
 */
(function () {
  var autoplay = true;
  var pausedEvent = document.createEvent("Event");
  var endedEvent = document.createEvent("Event");
  pausedEvent.initEvent("paused", true, true);
  endedEvent.initEvent("ended", true, true);

  var insertBackgroundVideo = function (autoplay) {
    // only when not small
    //if (window.Foundation && "small" == Foundation.MediaQuery.current) return;
    if (stir.MediaQuery.current === "small") return;

    var elements = document.querySelectorAll(".vimeo-bg-video");
    elements &&
      Array.prototype.forEach.call(elements, function (el, i) {
        var video = el.querySelector("div[data-videoId]"); // the container element
        var loops = video.getAttribute("data-noOfLoops"); // the number of times to loop the video
        var id = video.getAttribute("data-videoId"); // the Vimeo ID of the video
        var videoPlayer;

        var options = {
          id: id,
          background: true, // if true will ignore 'autoplay' setting and force autoplay
          loop: true,
          autoplay: autoplay,
          controls: false,
          transparent: true,
        };
		/* dnt: true, */

        videoPlayer = new Vimeo.Player(video, options);

        videoPlayer.on("play", function (data) {
          if (!autoplay) {
            videoPlayer.pause();
            video.setAttribute("data-playback", "paused");
          } else {
            video.setAttribute("data-playback", "playing");
          }
        });

        if (autoplay) {
          /* var videoTimeout = setTimeout(function() {
                    console.info('timeout!');
                    video.setAttribute("data-playback", "timeout");
                }, 2000); */

          videoPlayer
            .getDuration()
            .then(function (duration) {
              //clearTimeout(videoTimeout);
              // stop playing after n loops
              (function (video, duration, loops) {
                setTimeout(function () {
                  video.setAttribute("data-playback", "ended");
                  videoPlayer.pause();
                  video.dispatchEvent(endedEvent);
                }, duration * loops * 1000);
              })(video, duration, loops);
            })
            .catch(function (error) {
              console.error(error.name);
              video.style.display = "none";
            });
        }
      });
  };

  //if ("connection" in navigator && navigator.connection.saveData) {
  //console.info("Data saving is enabled. Video background will not be enabled.");
  //TODO: trigger fallback function
  //return;
  //}

  /* if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        autoplay = false;
        console.info('User Agent prefers reduced motion. Video banners will not auto-play.');
    } */

  if (document.querySelector("div[data-videoId]")) insertBackgroundVideo(autoplay);
})();

/**
 * Vimeo API general embeds
 */
(function () {
  /**
   * Function: Embed the video on the page
   **/
  function insertEmbeddedVideo() {
    var id,
      thumb,
      date,
      title,
      elements = document.querySelectorAll("div[data-videoEmbedId]");
    elements &&
      Array.prototype.forEach.call(elements, function (el, i) {
        id = el.getAttribute("data-videoEmbedId");
        id &&
          new Vimeo.Player(el.id, {
            id: id,
            loop: false,
		});
		/* dnt: true, */ // tracking enabled 2022-11-09 to improve analytics
      });
  }

  /**
   * Function: Build the Schema  Object
   **/
  function buildSchema() {
    var schemaData = [];
    var i = 0;

    if (stir.vimeo) {
      for (var index in stir.vimeo) {
        schemaData.push({
          "@type": "VideoObject",
          position: i + 1,
          name: stir.vimeo[index].name,
          description: stir.vimeo[index].description,
          thumbnailUrl: "https://www.stir.ac.uk/data/video/?content=thumbnail&id=" + stir.vimeo[index].id,
          embedUrl: "https://www.stir.ac.uk/data/video/?content=video&id=" + stir.vimeo[index].id,
          url: "https://www.stir.ac.uk/data/video/?content=video&id=" + stir.vimeo[index].id,
          uploadDate: stir.vimeo[index].uploadDate,
        });
        i++;
      }

      var schema = document.createElement("script");
      schema.type = "application/ld+json";
      schema.textContent = JSON.stringify({
        "@context": "http://schema.org",
        "@type": "ItemList",
        itemListElement: schemaData,
      });

      document.body.insertAdjacentElement("afterbegin", schema);
    }
  }

  /**
   * ON LOAD
   * Loop through all the vided-embed elements on the page and activate
   * the Vimeo Player API for each one.
   */
  if (document.querySelector("div[data-videoEmbedId]")) {
    insertEmbeddedVideo();
  }

  if (document.querySelector("div[data-videoschema]")) {
    buildSchema();
  }
})();
