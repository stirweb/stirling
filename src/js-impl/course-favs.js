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

  const renderMiniFav = (item) => {
    return !item.metaData
      ? ``
      : `<p class="text-sm">
            <strong><a href="${item.liveUrl}" title="${item.metaData.award ? item.metaData.award : ""} ${item.title}">${item.metaData.award ? item.metaData.award : ""} ${item.title} ${item.metaData.ucas ? " - " + item.metaData.ucas : ""}</a></strong>
         </p>`;
  };

  const renderFav = stir.curry((item) => {
    console.log(getDaysAgo(new Date(item.dateSaved)));
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
                
                <div class="c-search-result__meta grid-x u-mt-1">
                    <div class="cell medium-4"><strong class="u-heritage-green">Start dates</strong><p>${item.metaData.start}</p></div>
                    <div class="cell medium-4"><strong class="u-heritage-green">Study modes</strong><p class="u-text-sentence-case">${item.metaData.modes}</p></div>
                    <div class="cell medium-4"><strong class="u-heritage-green">Delivery</strong><p class="u-text-sentence-case">${item.metaData.delivery}</p></div>
                </div>
            </div>
            <div class="flex-container align-middle u-gap u-mt-1">
                <button class="u-energy-teal u-border-solid u-p-1 u-cursor-pointer flex-container u-gap-8 align-middle" data-action="removefav" data-id="${item.metaData.sid}">
                <svg version="1.1" id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg" stroke="currentColorz" stroke-width="1.5"
                                fill="#008996" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                viewBox="0 0 50 50" style="enable-background:new 0 0 50 50; width:24px; height: 24px;"
                                xml:space="preserve">
                                <path d="M9.7,20.4c0.2,0.4,0.3,0.8,0.1,1.2l-0.6,1.9c-0.3,1-0.7,2.1-0.9,3.2c-0.6,2.5-0.4,5.4,0.6,8.3c1.1,3.3,3.2,6.2,6.3,9
                        c0.6,0.5,2.4,2,3,2.4c0.7,0,3.1-0.1,3.8-0.1c3.7-0.5,6.8-1.4,9.4-3c3.1-1.9,5.4-4.6,6.6-8l1.4-4.3c0.1-0.3,0.3-0.6,0.6-0.8
                        c2.3-1.6,3.9-4.1,4-6.9c0.3-2.8-0.9-5.6-3-7.5c-1.1-0.9-2.1-1.5-3.5-2l-6.7-2.2l0.2-0.5c0.8-2.5,0.5-4.7-0.9-6.8
                        c-0.7-1.2-1.6-1.9-2.8-2.4l-0.9,2.7c0.9,0.5,1.6,1.2,2,2.2c0.5,1.2,0.4,2.3-0.1,3.5L28.1,11l-7.1-2.3c-2.1-0.6-4.3-0.4-6.2,0.4
                        c-2,0.9-3.5,2.4-4.4,4.3C9.2,15.8,9,18.2,9.7,20.4z M12.3,22.7l24.2,7.8l-1.2,3.8c-1,3-3,5.4-5.8,6.9c-2.9,1.7-6.4,2.5-10.3,2.6
                        l-0.4-0.1l-0.1,0c-2.7-2-4.8-4.4-6.3-7c-1.5-2.8-2.1-5.8-1.5-8.7l0,0c0.1-0.6,0.4-1.6,0.7-2.5c0.3-0.9,0.5-2,0.6-2.2L12.3,22.7z
                         M13,14.3c1.6-2.6,4.5-3.8,7.5-2.8l16.7,5.4c2.2,1,3.5,2.7,3.9,5.1c0.3,2.4-0.5,4.4-2.3,5.9c-0.2,0.2-0.6,0.4-1.2,0.2l-24.5-7.9
                        c-0.3-0.1-0.5-0.3-0.7-0.7l0,0C11.8,17.6,12,15.8,13,14.3z" /></svg>
                <span class="u-energy-teal--darker">Remove from my favourites</span></button>
                <span>Favourited ${getDaysAgo(new Date(item.dateSaved))}</span>
            </div>
        </div>`;
  });

  const renderNoFavs = () => `<p>Nothing saved here yet. <a href="https://www.stir.ac.uk/courses/">View courses</a> and add them to your favourites. </p>`;
  const renderNoShared = () => `<div class="cell"><p>No courses shared</p></div>`;
  const renderLinkToFavs = () => `<hr><p class="text-sm u-arrow"><a href="https://www.stir.ac.uk/courses/favs/">View and manage my favourites</a></p>`;

  const renderFavActionBtns = () => {
    return `
        <div class=" u-mb-3 ">
          <button class="u-border-solid u-p-1  u-cursor-pointer u-mt-1 " data-action="clearallfavs">Clear favourites</button>
          <button class="u-border-solid u-p-1 u-cursor-pointer u-mt-1 " data-action="copysharelink">Generate share link</button>
        </div>`;
  };

  const renderShared = (item) => {
    return !item.metaData
      ? ``
      : `<div class="cell small-6 ">
            <div class=" u-green-line-top u-margin-bottom">
                <p class="u-text-regular u-py-1">
                  <strong><a href="${item.liveUrl}" title="${item.metaData.award ? item.metaData.award : ""} ${item.title}">${item.metaData.award ? item.metaData.award : ""} ${item.title}</a></strong>
                </p>
                <div class="u-mb-1">${item.metaData.c}</div>
                <${isInCookie(item.metaData.sid) ? `div` : `button`}  class="u-w-full ${isInCookie(item.metaData.sid) ? `u-energy-teal--light` : `u-energy-teal u-cursor-pointer`}  u-border-solid u-p-1  u-mt-1 flex-container u-gap-8 align-middle align-center" data-action="${isInCookie(item.metaData.sid) ? `` : `addtofavs`}" data-id="${item.metaData.sid}">
                <svg version="1.1" id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg" stroke="currentColorz" stroke-width="1.5"
                                fill=" ${isInCookie(item.metaData.sid) ? `#b3dce0` : `#008996`}" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                viewBox="0 0 50 50" style="enable-background:new 0 0 50 50; width:24px; height: 24px;"
                                xml:space="preserve">
                                <path d="M9.7,20.4c0.2,0.4,0.3,0.8,0.1,1.2l-0.6,1.9c-0.3,1-0.7,2.1-0.9,3.2c-0.6,2.5-0.4,5.4,0.6,8.3c1.1,3.3,3.2,6.2,6.3,9
                        c0.6,0.5,2.4,2,3,2.4c0.7,0,3.1-0.1,3.8-0.1c3.7-0.5,6.8-1.4,9.4-3c3.1-1.9,5.4-4.6,6.6-8l1.4-4.3c0.1-0.3,0.3-0.6,0.6-0.8
                        c2.3-1.6,3.9-4.1,4-6.9c0.3-2.8-0.9-5.6-3-7.5c-1.1-0.9-2.1-1.5-3.5-2l-6.7-2.2l0.2-0.5c0.8-2.5,0.5-4.7-0.9-6.8
                        c-0.7-1.2-1.6-1.9-2.8-2.4l-0.9,2.7c0.9,0.5,1.6,1.2,2,2.2c0.5,1.2,0.4,2.3-0.1,3.5L28.1,11l-7.1-2.3c-2.1-0.6-4.3-0.4-6.2,0.4
                        c-2,0.9-3.5,2.4-4.4,4.3C9.2,15.8,9,18.2,9.7,20.4z M12.3,22.7l24.2,7.8l-1.2,3.8c-1,3-3,5.4-5.8,6.9c-2.9,1.7-6.4,2.5-10.3,2.6
                        l-0.4-0.1l-0.1,0c-2.7-2-4.8-4.4-6.3-7c-1.5-2.8-2.1-5.8-1.5-8.7l0,0c0.1-0.6,0.4-1.6,0.7-2.5c0.3-0.9,0.5-2,0.6-2.2L12.3,22.7z
                         M13,14.3c1.6-2.6,4.5-3.8,7.5-2.8l16.7,5.4c2.2,1,3.5,2.7,3.9,5.1c0.3,2.4-0.5,4.4-2.3,5.9c-0.2,0.2-0.6,0.4-1.2,0.2l-24.5-7.9
                        c-0.3-0.1-0.5-0.3-0.7-0.7l0,0C11.8,17.6,12,15.8,13,14.3z" /></svg>
                <span class="u-energy-teal--darker">${isInCookie(item.metaData.sid) ? `Already in my favourites` : `Add to my favourites`}</span>
                </${isInCookie(item.metaData.sid) ? `div` : `button`}>
            </div>
        </div>`;
  };

  const renderSharedIntro = (items) => {
    return !items.length ? `` : ``;
  };

  const renderHeader = (size, content) => `<${size} class="header-stripped h3 u-mb-2">${content}</${size}>`;

  /*

        HELPERS

    */

  /* 
    getDaysAgo : Returns a String  
  */
  const getDaysAgo = (createdOn) => {
    const today = new Date();
    //const createdOn = new Date(date);
    const msInDay = 24 * 60 * 60 * 1000;

    createdOn.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diff = (+today - +createdOn) / msInDay;
    const dayText = diff > 1 ? `days` : `day`;

    return diff === 0 ? `today` : `${diff} ${dayText} ago`;
  };

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
    getfavsCookie: Returns an array of course objects
  */
  const getfavsCookie = (cookieId) => {
    const cookies = document.cookie.split(";");

    const favCookie = cookies.filter((item) => item.includes(cookieId));
    const favCookie2 = favCookie.length && favCookie[0].replace(cookieId, "");

    return JSON.parse(favCookie2) || [];
  };

  /* 
      isInCookie: Returns a boolean
  */
  const isInCookie = (courseId) => {
    const favsCookie = getfavsCookie(cookieId);
    const inCookie = favsCookie.map((item) => item.id === courseId);

    if (!stir.any((item) => item, inCookie)) return false;

    return true;
  };

  /*
    getFavsList: Returns an array of course objects 
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

  const setQueryParam = (data) => QueryParams.set("shared", encodeURI(data.map((item) => item.id).join(",")));

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

    setQueryParam(list);
    setDOMContent(favsArea, renderFavActionBtns() + list.map(renderFav).join(""));
    return;
  };

  /* 
    doShared : Returns null 
  */
  const doShared = (nodes, data, cookieId) => {
    const shareList = getShareList(data);

    if (!shareList) {
      setDOMContent(nodes.sharedArea, renderNoShared());
    } else {
      setDOMContent(nodes.sharedArea, renderSharedIntro(shareList.map(renderShared).join("")) + shareList.map(renderShared).join(""));
    }

    const list = getFavsList(data, cookieId);

    if (!list) {
      setDOMContent(nodes.sharedfavArea, renderNoFavs());
      return;
    }

    setDOMContent(nodes.sharedfavArea, renderHeader("h2", "My favourites") + list.map(renderMiniFav).join("") + renderLinkToFavs());
    return;
  };

  /* 
    fetchData : Returns null 
  */
  const fetchData = (nodes, url, cookieId) => {
    stir.getJSON(url, (initialData) => {
      const data = initialData.response.resultPacket.results || []; // Full list of courses

      // On Load
      nodes.sharedArea && doShared(nodes, data, cookieId);
      nodes.favsArea && doFavs(nodes.favsArea, data, cookieId);

      /* EVENT LISTENERS */
      stir.node("main").addEventListener("click", (event) => {
        const target = event.target.nodeName === "BUTTON" ? event.target : event.target.parentElement;

        /* ACTION: ADD a FAV */
        if (target.dataset && target.dataset.action === "addtofavs") {
          console.log(target);
          if (!isInCookie(event.target.dataset.id)) {
            const favsCookie2 = [...getfavsCookie(cookieId), { id: target.dataset.id, date: Date.now() }];
            document.cookie = cookieId + JSON.stringify(favsCookie2) + getExpiryDate(30) + ";path=/";
          }

          nodes.sharedArea && doShared(nodes, data, cookieId);
          nodes.favsArea && doFavs(nodes.favsArea, data, cookieId);
        }

        /* ACTION: REMOVE a FAV */
        if (target.dataset && target.dataset.action === "removefav") {
          const id = target.dataset.id;

          if (id && id.length) {
            const favsCookie = getfavsCookie(cookieId);
            const favsCookie2 = favsCookie.filter((item) => item.id !== id);
            document.cookie = cookieId + JSON.stringify(favsCookie2) + getExpiryDate(30) + ";path=/";
            nodes.favsArea && doFavs(nodes.favsArea, data, cookieId);
          }
        }

        /* ACTION: REMOVE ALL FAVS */
        if (target.dataset && target.dataset.action === "clearallfavs") {
          document.cookie = cookieId + JSON.stringify([]) + getExpiryDate(0) + ";path=/";
          nodes.favsArea && doFavs(nodes.favsArea, data, cookieId);
        }

        // if (event.target.dataset && event.target.dataset.action === "clearshortlist") {
        //   QueryParams.remove("shared");
        //   nodes.sharedArea && doShared(nodes, data, cookieId);
        // }

        /* ACTION: COPY SHARE LINK */
        if (target.dataset && target.dataset.action === "copysharelink") {
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
