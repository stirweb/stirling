(function () {
  if (!stir.node("#coursefavsarea") && !stir.node("#coursesharedarea")) return;

  // NODES
  const NODES = {
    favsArea: stir.node("#coursefavsarea"),
    sharedArea: stir.node("#coursesharedarea"),
    sharedfavArea: stir.node("#coursesharedfavsarea"),
  };

  // VARS
  const cookieId = "favs=";

  const host = "https://search.stir.ac.uk";
  const sf = ["c", "award", "code", "delivery", "faculty", "image", "level", "modes", "pathways", "sid", "start", "subject", "ucas"];
  const url = host + "/s/search.json?collection=stir-courses&query=!nullpadre&fmo=true&num_ranks=2000&SF=[" + sf.join(",") + "]&";

  /*

        RENDERERS

  */

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

  const renderNoFavs = () => {
    return `<p>No favourites stored</p>`;
  };

  const renderShared = (item) => {
    return !item.metaData
      ? ``
      : `<div class="cell small-6 ">
            <div class=" u-green-line-top">
                <p class="u-text-regular u-py-1">
                  <strong><a href="${item.liveUrl}" title="${item.metaData.award ? item.metaData.award : ""} ${item.title}">${item.metaData.award ? item.metaData.award : ""} ${item.title}</a></strong>
                </p>
                <div class="u-mb-1">${item.metaData.c}</div>
                <button class="u-border-solid u-p-1 u-cursor-pointer u-w-full" data-action="addtofavs" data-id="${item.metaData.sid}">${isInCookie(item.metaData.sid) ? `Shortlisted` : `Add to my shortlist`}</button>
            </div>
        </div>`;
  };

  const renderSharedIntro = (items) => {
    return !items.length
      ? ``
      : `<div class="cell">
          <p class=" u-mb-2">Someone has shared the following courses with you from their shortlist.</p>
        </div>`;
  };

  /*

        HELPERS

    */

  /* 
    setDOMContent : Returns a Boolean  
  */
  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /* 
    getExpiryDate: Returns a String (cookie expiry date)  
  */
  const getExpiryDate = (days) => {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    return ";expires=" + d.toUTCString();
  };

  /* 
    getfavsCookie
  */
  const getfavsCookie = (cookieId) => {
    const cookies = document.cookie.split(";");

    const favCookie = cookies.filter((item) => item.includes(cookieId));
    const favCookie2 = favCookie.length && favCookie[0].replace(cookieId, "");

    return JSON.parse(favCookie2) || [];
  };

  /* */
  const isInCookie = (courseId) => {
    const favsCookie = getfavsCookie(cookieId);
    const inCookie = favsCookie.map((item) => item.id === courseId);

    if (!stir.any((item) => item, inCookie)) return false;

    return true;
  };

  /*
    Returns an array of course objects 
  */
  const getFavsList = (data, cookieId) => {
    const favsCookie = getfavsCookie(cookieId);

    if (!favsCookie.length || favsCookie.length < 1) {
      return null;
    }

    const favsCookieSorted = favsCookie.sort((a, b) => b.date - a.date);

    // Maintain ordering by merging FB result into cookie object
    return favsCookieSorted.map((item) => {
      return {
        ...data.filter((element) => {
          if (item.id === element.metaData.sid) return element;
        })[0],
        ...{ id: item.id, dateSaved: item.date },
      };
    });
  };

  /* 
    Returns an array of course objects 
  */
  const getShareList = (data) => {
    const sharedList = QueryParams.get("shared") || "";

    if (!sharedList.length) return null;

    // Maintain ordering by merging FB result into cookie object
    return sharedList.split(",").map((item) => {
      return {
        ...data.filter((element) => {
          if (item === element.metaData.sid) return element;
        })[0],
        ...{ id: item },
      };
    });
  };

  /*

        CONTROLLERS

    */

  /* 
    doFavs : Returns null 
  */
  const doFavs = (favsArea, data, cookieId) => {
    const list = getFavsList(data, cookieId);

    if (!list) {
      setDOMContent(favsArea, renderNoFavs());
      return;
    }

    setDOMContent(favsArea, list.map(renderFavs).join(""));
    return;
  };

  /* 
    doShared : Returns null 
  */
  const doShared = (nodes, data, cookieId) => {
    const shareList = getShareList(data);

    if (!shareList) {
      //setDOMContent(favsArea, renderNoFavs());
    } else {
      setDOMContent(nodes.sharedArea, renderSharedIntro(shareList.map(renderShared).join("")) + shareList.map(renderShared).join(""));
    }

    const list = getFavsList(data, cookieId);

    if (!list) {
      setDOMContent(nodes.sharedfavArea, renderNoFavs());
      return;
    }

    setDOMContent(nodes.sharedfavArea, list.map(renderFavs).join(""));
    return;
  };

  /* fetchData : Returns null */
  const fetchData = (nodes, url, cookieId) => {
    stir.getJSON(url, (initialData) => {
      const data = initialData.response.resultPacket.results || []; // Full list of courses

      // On Load
      nodes.sharedArea && doShared(nodes, data, cookieId);
      nodes.favsArea && doFavs(nodes.favsArea, data, cookieId);

      /* EVENT LISTENERS */
      stir.node("main").addEventListener("click", (event) => {
        /* ACTION: ADD a FAV */
        if (event.target.dataset && event.target.dataset.action === "addtofavs") {
          if (!isInCookie(event.target.dataset.id)) {
            const favsCookie2 = [...getfavsCookie(cookieId), { id: event.target.dataset.id, date: Date.now() }];
            document.cookie = cookieId + JSON.stringify(favsCookie2) + getExpiryDate(30) + ";path=/";
          }

          nodes.sharedArea && doShared(nodes, data, cookieId);
          nodes.favsArea && doFavs(nodes.favsArea, data, cookieId);
        }

        /* ACTION: REMOVE a FAV */
        if (event.target.dataset && event.target.dataset.action === "removefav") {
          const id = event.target.dataset.id;

          if (id && id.length) {
            const favsCookie = getfavsCookie(cookieId);
            const favsCookie2 = favsCookie.filter((item) => item.id !== id);
            document.cookie = cookieId + JSON.stringify(favsCookie2) + getExpiryDate(30) + ";path=/";
            nodes.favsArea && doFavs(nodes.favsArea, data, cookieId);
          }
        }

        /* ACTION: REMOVE ALL FAVS */
        if (event.target.dataset && event.target.dataset.action === "clearallfavs") {
          document.cookie = cookieId + JSON.stringify([]) + getExpiryDate(0) + ";path=/";
          nodes.favsArea && doFavs(nodes.favsArea, data, cookieId);
        }

        // if (event.target.dataset && event.target.dataset.action === "clearshortlist") {
        //   QueryParams.remove("shared");
        //   nodes.sharedArea && doShared(nodes, data, cookieId);
        // }

        /* ACTION: COPY SHARE LINK */
        if (event.target.dataset && event.target.dataset.action === "copysharelink") {
          const favsCookie = getfavsCookie(cookieId);

          const link = "https://www.stir.ac.uk/courses/favs/?shared=" + favsCookie.map((item) => item.id).join(",");
          navigator.clipboard.writeText(link);

          alert("The following share link has been copied to your clipboard: \n\n" + link);
        }
      });
    });
  };

  /* ON LOAD */
  fetchData(NODES, url, cookieId);
})();
