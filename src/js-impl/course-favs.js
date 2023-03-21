(function () {
  if (!stir.node("#favsarea") || !stir.node("#sharedarea")) return;

  // NODES
  const NODES = {
    favsArea: stir.node("#favsarea"),
    sharedArea: stir.node("#sharedarea"),
  };

  // VARS
  const cookieId = "favs=";

  const host = "https://search.stir.ac.uk";
  const sf = ["c", "award", "code", "delivery", "faculty", "image", "level", "modes", "pathways", "sid", "start", "subject", "ucas"];
  const url = host + "/s/search.json?collection=stir-courses&query=!nullpadre&fmo=true&num_ranks=2000&SF=[" + sf.join(",") + "]&";

  /*

        RENDERERS

    */

  /* renderFavs : Returns a String of HTML */
  const renderFavs = stir.curry((item) => {
    return !item.metaData
      ? ``
      : `
        <div class="c-search-result" data-rank="" data-sid="${item.metaData.sid}" data-result-type="course">
            <div class=" c-search-result__tags">
                <span class="c-search-tag">${item.metaData.level}</span>
            </div>

            <div class="flex-container flex-dir-column u-gap u-mt-1">
                <p class="u-text-regular u-m-0">
                    <strong><a href="${item.liveUrl}" title="${item.metaData.award ? item.metaData.award : ""} ${item.title}">${item.metaData.award ? item.metaData.award : ""} ${item.title} ${item.metaData.ucas ? " - " + item.metaData.ucas : ""}</a></strong>
                </p>
                <p class="u-m-0">${item.metaData.c}</p>
                
                <div class="c-search-result__meta grid-x">
                    <div class="cell medium-4"><strong class="u-heritage-green">Start dates</strong><p>${item.metaData.start}</p></div>
                    <div class="cell medium-4"><strong class="u-heritage-green">Study modes</strong><p class="u-text-sentence-case">${item.metaData.modes}</p></div>
                    <div class="cell medium-4"><strong class="u-heritage-green">Delivery</strong><p class="u-text-sentence-case">${item.metaData.delivery}</p></div>
                </div>
            </div>
            <div class="flex-container align-middle u-gap u-mt-1">
                <button class="u-border-solid u-p-1 u-cursor-pointer" data-action="removefav" data-id="${item.metaData.sid}">Remove from shortlist</button>
                <span>Shortlisted on ${stir.Date.newsDate(new Date(item.dateSaved))}</span>
            </div>
        </div>`;
  });

  const renderShared = (item) => {
    return !item.metaData
      ? ``
      : `<div class="cell small-6 medium-4 large-3">
            <div class=" u-green-line-top">
                <p class="u-text-regular u-py-1">
                  <strong><a href="${item.liveUrl}" title="${item.metaData.award ? item.metaData.award : ""} ${item.title}">${item.metaData.award ? item.metaData.award : ""} ${item.title}</a></strong>
                </p>
                <div class="u-mb-1">${item.metaData.c}</div>
                <button class="u-border-solid u-p-1 u-cursor-pointer u-w-full" data-action="addtofavs" data-id="${item.metaData.sid}">Add to shortlist</button>
            </div>
        </div>`;
  };

  const renderSharedIntro = (items) => {
    return !items.length
      ? ``
      : `<div class="cell">
          <p class=" u-mb-2">Someone has shared the following courses with you from their shortlist. <button class="u-border-solid u-cursor-pointer u-p-tiny" data-action="clearshortlist">Clear all</button></p>
        </div>`;
  };

  /*

        HELPERS

    */

  /* setDOMContent : Returns a Boolean  */
  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /* getExpiryDate: Returns a String (cookie expiry date)  */
  const getExpiryDate = (days) => {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    return ";expires=" + d.toUTCString();
  };

  /* */
  const getfavsCookie = (cookieId) => {
    const cookies = document.cookie.split(";");

    const favCookie = cookies.filter((item) => item.includes(cookieId));
    const favCookie2 = favCookie.length && favCookie[0].replace(cookieId, "");

    return JSON.parse(favCookie2) || [];
  };

  /*

        CONTROLLERS

    */

  /* doFavs : Returns null */
  const doFavs = (favsArea, data, cookieId) => {
    const favsCookie = getfavsCookie(cookieId);

    if (!favsCookie.length || favsCookie.length < 1) {
      setDOMContent(favsArea, "<p>No favourites stored</p>");
      return;
    }

    const favsCookieSorted = favsCookie.sort((a, b) => b.date - a.date);

    // Maintain ordering by merging FB result into cookie object
    const dataOrdered = favsCookieSorted.map((item) => {
      return {
        ...data.filter((element) => {
          if (item.id === element.metaData.sid) return element;
        })[0],
        ...{ id: item.id, dateSaved: item.date },
      };
    });
    // const shareLink = 'http://www.stir.ac.uk/'+dataOrdered;
    setDOMContent(favsArea, dataOrdered.map(renderFavs).join(""));
    return;
  };

  /* doShared : Returns null */
  const doShared = (sharedArea, data) => {
    const sharedList = QueryParams.get("shared") || "";

    sharedList.length ? sharedArea.classList.remove("hide") : sharedArea.classList.add("hide");

    // Maintain ordering by merging FB result into cookie object
    const sharedOrdered = sharedList.split(",").map((item) => {
      return {
        ...data.filter((element) => {
          if (item === element.metaData.sid) return element;
        })[0],
        ...{ id: item },
      };
    });

    setDOMContent(sharedArea, renderSharedIntro(sharedOrdered.map(renderShared).join("")) + sharedOrdered.map(renderShared).join(""));
    return;
  };

  /* fetchData : Returns null */
  const fetchData = (nodes, url, cookieId) => {
    stir.getJSON(url, (initialData) => {
      const data = initialData.response.resultPacket.results || []; // Full list of courses

      // On Load
      doShared(nodes.sharedArea, data);
      doFavs(nodes.favsArea, data, cookieId);

      /* EVENT LISTENERS */
      stir.node("main").addEventListener("click", (event) => {
        /* ACTION: ADD a fav */
        if (event.target.dataset && event.target.dataset.action === "addtofavs") {
          const favsCookie = getfavsCookie(cookieId);

          // check if its already in the cookie - if not add it
          const inCookie = favsCookie.map((item) => item.id === event.target.dataset.id);
          if (!stir.any((item) => item, inCookie)) {
            const favsCookie2 = [...favsCookie, { id: event.target.dataset.id, date: Date.now() }];
            document.cookie = cookieId + JSON.stringify(favsCookie2) + getExpiryDate(30) + ";path=/";
          }

          const shortlist = QueryParams.get("shared") || "";
          const sharedListFiltered = shortlist
            .split(",")
            .filter((item) => item !== event.target.dataset.id)
            .join(",");

          QueryParams.set("shared", sharedListFiltered);

          doShared(nodes.sharedArea, data);
          doFavs(nodes.favsArea, data, cookieId);
        }

        /* ACTION: REMOVE a fav */
        if (event.target.dataset && event.target.dataset.action === "removefav") {
          const id = event.target.dataset.id;

          if (id && id.length) {
            const favsCookie = getfavsCookie(cookieId);
            const favsCookie2 = favsCookie.filter((item) => item.id !== id);
            document.cookie = cookieId + JSON.stringify(favsCookie2) + getExpiryDate(30) + ";path=/";
            doFavs(nodes.favsArea, data, cookieId);
          }
        }

        /* ACTION: REMOVE ALL favs */
        if (event.target.dataset && event.target.dataset.action === "clearallfavs") {
          document.cookie = cookieId + JSON.stringify([]) + getExpiryDate(0) + ";path=/";
          doFavs(nodes.favsArea, data, cookieId);
        }

        if (event.target.dataset && event.target.dataset.action === "clearshortlist") {
          QueryParams.remove("shared");
          doShared(nodes.sharedArea, data);
        }

        if (event.target.dataset && event.target.dataset.action === "copysharelink") {
          const favsCookie = getfavsCookie(cookieId);

          //console.log(favsCookie.map((item) => item.id).join(","));
          const link = "https://www.stir.ac.uk/courses/favs/?shared=" + favsCookie.map((item) => item.id).join(",");
          navigator.clipboard.writeText(link);

          alert("The following share link has been copied to your clipboard: \n\n" + link);
        }

        document.documentElement.addEventListener("mouseleave", () => console.log("out"));
      });
    });
  };

  /* ON LOAD */
  fetchData(NODES, url, cookieId);
})();
