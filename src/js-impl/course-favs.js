stir.Favs = function Favs() {
  if (!stir.node("#coursefavsarea") && !stir.node("#coursesharedarea") && !stir.nodes("#coursefavsbtn")) return;

  // NODES
  const NODES = {
    coursefavsbtns: stir.nodes('[data-nodeid="coursefavsbtn"]'),
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

            <div class="flex-container align-middle u-gap-8 u-mt-1">
               ${renderRemoveBtn(item.metaData.sid, item.dateSaved)}
            </div>
        </div>`;
  });

  //<button class="u-energy-green  u-cursor-pointer flex-container u-gap-8 align-middle" data-action="removefav" data-id="${sid}">
  //      <span class="u-heritage-green u-underline u-line-height-default">Remove from my favourites</span>
  //</button>
  const renderRemoveBtn = (sid, dateSaved) => {
    return ` 
        <button class="u-heritage-green  u-cursor-pointer flex-container u-gap-8 align-middle" data-action="removefav" data-id="${sid}">
            ${renderActiveIcon()}
        </button>
        <span>Favourited ${getDaysAgo(new Date(dateSaved))}</span>`;
  };

  const renderAddBtn = (sid) => {
    return ` 
          <button
              class="u-heritage-green u-cursor-pointer u-line-height-default flex-container u-gap align-middle"
              data-action="addtofavs" data-id="${sid}">
              ${renderInactiveIcon()}
              <span class="u-heritage-green u-underline u-inline-block u-pb-1">Add
                  to your favourites</span>
          </button>`;
  };

  const renderNoFavs = () => `<p>Nothing saved here yet. <a href="/courses/">View courses</a> and add them to your favourites. </p>`;
  const renderNoShared = () => `<div class="cell"><p>No courses shared</p></div>`;
  const renderLinkToFavs = () => `<hr><p class="text-sm u-arrow"><a href="/courses/favourites/">Manage my favourites</a></p>`;

  const renderFavActionBtns = () => {
    return `
        <div class="u-mb-3 ">
          <button class="u-border-solid u-p-1  u-cursor-pointer u-mt-1 " data-action="clearallfavs">Clear favourites</button>
          <button class="u-border-solid u-p-1 u-cursor-pointer u-mt-1 " data-action="copysharelink">Generate share link</button>
        </div>`;
  };

  const renderInactiveIcon = () => {
    return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
              xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                  viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;width:22px;height:22px;" xml:space="preserve">
               <g id="Layer_1_00000157273399641228684280000005207056774539682203_">
                 <g id="icons">
                 </g>
               </g>
               <path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2c0,0-0.1,0-0.1,0c-3,0-5.8,1.2-7.9,3.4
                 c-4.3,4.5-4.2,11.7,0.2,16l18.1,18.1c0.5,0.5,1.6,0.5,2.1,0l17.9-17.9c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
                 C47.5,15,46.3,12.2,44.1,10.1z M42,24.2l-17,17l-17-17c-3.3-3.3-3.3-8.6,0-11.8c1.6-1.6,3.7-2.4,5.9-2.4c2.2-0.1,4.4,0.8,6,2.5
                 l4.1,4.1c0.6,0.6,1.5,0.6,2.1,0l4.2-4.2c3.4-3.2,8.5-3.2,11.8,0C45.3,15.6,45.3,20.9,42,24.2z"/>
               </svg>`;
  };

  const renderActiveIcon = () => {
    return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" 
              xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50"
              style="enable-background:new 0 0 50 50;width:22px;height:22px;" xml:space="preserve">
           <g id="Layer_1_00000157273399641228684280000005207056774539682203_">
             <g id="icons">
             </g>
           </g>
           <path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2h-0.1c-3,0-5.8,1.2-7.9,3.4
	c-4.3,4.5-4.2,11.7,0.2,16L24,44.4c0.5,0.5,1.6,0.5,2.1,0L44,26.5c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
	C47.5,15,46.3,12.2,44.1,10.1z"/>
           </svg> `;
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
                <${isInCookie(item.metaData.sid) ? `div` : `button`}  class="u-w-full u-heritage-green ${isInCookie(item.metaData.sid) ? `` : `u-heritage-green u-cursor-pointer`}   u-mt-1 flex-container u-gap-8 align-middle " data-action="${isInCookie(item.metaData.sid) ? `` : `addtofavs`}" data-id="${item.metaData.sid}">
                  ${isInCookie(item.metaData.sid) ? renderActiveIcon() : renderInactiveIcon()}
                <span class="u-heritage-green ${isInCookie(item.metaData.sid) ? "" : "u-underline u-line-height-default"}">
                  ${isInCookie(item.metaData.sid) ? `Already in my favourites` : `Add to my favourites`}
                </span>
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
    const msInDay = 24 * 60 * 60 * 1000;

    createdOn.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diff = Math.floor((+today - +createdOn) / msInDay);
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
    return getfavsCookie(cookieId)
      .map((item) => item.id)
      .includes(courseId);
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

    //setQueryParam(list);
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
    doCourseBtn : Returns null 
  */
  const doCourseBtn = (el, cookieId) => {
    if (!el || !el.dataset || !el.dataset.id) return;

    const fav = getfavsCookie(cookieId).filter((item) => item.id === el.dataset.id);

    if (fav.length) {
      setDOMContent(el, renderRemoveBtn(fav[0].id, fav[0].date));
      return;
    }

    setDOMContent(el, renderAddBtn(el.dataset.id));
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

      nodes.coursefavsbtns.forEach((element) => {
        doCourseBtn(element, cookieId);
      });

      /* EVENT LISTENERS */
      stir.node("main").addEventListener("click", (event) => {
        const target = event.target.nodeName === "BUTTON" ? event.target : event.target.closest("button");

        if (!target) return;

        /* ACTION: ADD a FAV */
        if (target.dataset && target.dataset.action && target.dataset.action === "addtofavs") {
          if (!isInCookie(target.dataset.id)) {
            const favsCookie2 = [...getfavsCookie(cookieId), { id: target.dataset.id, date: Date.now() }];
            document.cookie = cookieId + JSON.stringify(favsCookie2) + getExpiryDate(300) + ";path=/";
          }
          //console.log(target);
          nodes.sharedArea && doShared(nodes, data, cookieId);
          nodes.favsArea && doFavs(nodes.favsArea, data, cookieId);
          nodes.coursefavsbtns && doCourseBtn(target.parentElement, cookieId);
        }

        /* ACTION: REMOVE a FAV */
        if (target.dataset && target.dataset.action && target.dataset.action === "removefav") {
          const id = target.dataset.id ? target.dataset.id : null;

          if (id && id.length) {
            const favsCookie = getfavsCookie(cookieId);
            const favsCookie2 = favsCookie.filter((item) => item.id !== id);
            document.cookie = cookieId + JSON.stringify(favsCookie2) + getExpiryDate(30) + ";path=/";
            nodes.favsArea && doFavs(nodes.favsArea, data, cookieId);
            nodes.coursefavsbtns && doCourseBtn(target.parentElement, cookieId);
          }
        }

        /* ACTION: REMOVE ALL FAVS */
        if (target.dataset && target.dataset.action && target.dataset.action === "clearallfavs") {
          document.cookie = cookieId + JSON.stringify([]) + getExpiryDate(0) + ";path=/";
          nodes.favsArea && doFavs(nodes.favsArea, data, cookieId);
        }

        // if (event.target.dataset && event.target.dataset.action === "clearshortlist") {
        //   QueryParams.remove("shared");
        //   nodes.sharedArea && doShared(nodes, data, cookieId);
        // }

        /* ACTION: COPY SHARE LINK */
        if (target.dataset && target.dataset.action && target.dataset.action === "copysharelink") {
          const favsCookie = getfavsCookie(cookieId);
          const link = "https://" + window.location.hostname + "/courses/favourites/shared/?shared=" + favsCookie.map((item) => item.id).join(",");
          navigator.clipboard.writeText(link);

          alert("The following share link has been copied to your clipboard: \n\n" + link);
        }
      });
    });
  };

  // ON LOAD
  fetchData(NODES, url, cookieId);
};

(function () {
  new stir.Favs();
})();
