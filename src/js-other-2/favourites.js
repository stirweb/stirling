var stir = stir || {};

stir.favourites = (() => {
  // GLOBAL VARS
  const COOKIE_ID = "favs=";
  const COOKIE_EXPIRY_DAYS = 365;

  /*

    Renderers

  */

  const renderUrlToFavs = (urlToFavs) => {
    return !urlToFavs
      ? ``
      : `<a href="${urlToFavs}"  class="u-heritage-green u-mt-1 u-cursor-pointer flex-container u-gap-8 align-middle u-border-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" style="width:22px;height:22px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          
            <span class="u-border-bottom-solid">View favourites</span>
          </a>`;
  };

  /* renderRemoveBtn */
  const renderRemoveBtn = (sid, dateSaved, urlToFavs) => {
    return `<div class="u-flex-medium-up  align-middle u-gap">
              <button id="removefavbtn-${sid}" class="u-heritage-green u-mt-1 u-cursor-pointer flex-container u-gap-8 align-middle" aria-label="Remove from favourites" data-action="removefav" data-id="${sid}">
                ${renderActiveIcon()}
                <span class="u-heritage-green u-underline u-block u-pb-tiny">Favourited ${calcDaysAgo(new Date(dateSaved))}</span>
            </button>${renderUrlToFavs(urlToFavs)}
          </div>`;
  };

  /* renderAddBtn */
  const renderAddBtn = (sid, urlToFavs) => {
    return `<div class="u-flex-medium-up  align-middle u-gap" >
            <button class="u-heritage-green u-mt-1 u-cursor-pointer u-line-height-default  flex-container u-gap-8 align-middle"
              data-action="addtofavs" aria-label="Add to your favourites" data-id="${sid}" id="addfavbtn-${sid}">
              ${renderInactiveIcon()}
              <span class="u-heritage-green u-underline u-block ">Add to your favourites</span>
            </button>${renderUrlToFavs(urlToFavs)}
        </div>`;
  };

  /* renderInactiveIcon */
  const renderInactiveIcon = () => {
    return `<svg version="1.1" data-stiricon="heart-active" fill="currentColor"
              viewBox="0 0 50 50" style="width:22px;height:22px;" >
              <path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2c0,0-0.1,0-0.1,0c-3,0-5.8,1.2-7.9,3.4
               c-4.3,4.5-4.2,11.7,0.2,16l18.1,18.1c0.5,0.5,1.6,0.5,2.1,0l17.9-17.9c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
               C47.5,15,46.3,12.2,44.1,10.1z M42,24.2l-17,17l-17-17c-3.3-3.3-3.3-8.6,0-11.8c1.6-1.6,3.7-2.4,5.9-2.4c2.2-0.1,4.4,0.8,6,2.5
               l4.1,4.1c0.6,0.6,1.5,0.6,2.1,0l4.2-4.2c3.4-3.2,8.5-3.2,11.8,0C45.3,15.6,45.3,20.9,42,24.2z"/>
            </svg>`;
  };

  /* renderActiveIcon */
  const renderActiveIcon = () => {
    return `<svg version="1.1" data-stiricon="heart-inactive"  fill="currentColor" 
             viewBox="0 0 50 50" style="width:22px;height:22px;" >
            <path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2h-0.1c-3,0-5.8,1.2-7.9,3.4 c-4.3,4.5-4.2,11.7,0.2,16L24,44.4c0.5,0.5,1.6,0.5,2.1,0L44,26.5c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
        C47.5,15,46.3,12.2,44.1,10.1z"/>
           </svg> `;
  };

  /*

    Cookie Processing
  
*/

  /*  calcDaysAgo: Returns a String  */
  const calcDaysAgo = (createdOn) => {
    const today = new Date();
    const msInDay = 24 * 60 * 60 * 1000;

    createdOn.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diff = Math.floor((+today - +createdOn) / msInDay);
    const dayText = diff > 1 ? `days` : `day`;

    return diff === 0 ? `today` : `${diff} ${dayText} ago`;
  };

  /*  calcExpiryDate: Returns a String (cookie expiry date)  */
  const calcExpiryDate = (days) => {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);

    return ";expires=" + d.toUTCString();
  };

  /* isFavourite: Returns a boolean */
  const isFavourite = (id) => {
    return getfavsCookie(COOKIE_ID)
      .map((item) => Number(item.id))
      .includes(Number(id));
  };

  /* getfavsCookie: Returns an array of objects */
  const getfavsCookie = (cookieId) => {
    const favCookie = document.cookie
      .split(";")
      .filter((i) => i.includes(cookieId))
      .map((i) => i.replace(cookieId, ""));

    return favCookie.length ? JSON.parse(favCookie) : [];
  };

  /* getFavsList: Returns an array of objects. PARAM: cookieType = accomm, course etc */
  const getFavsList = (cookieType) => {
    const favsCookieAll2 = getfavsCookie(COOKIE_ID);

    // Work around for courses which dont have type defined
    const favsCookieAll = favsCookieAll2.map((item) => {
      if (!item.type) item.type = "course";
      return item;
    });

    const favsCookie = favsCookieAll.filter((item) => item.type === cookieType);

    if (!favsCookie.length || favsCookie.length < 1) return [];

    const favsCookieSorted = favsCookie.sort((a, b) => b.date - a.date);
    return favsCookieSorted;
  };

  const getFav = (id, cookieType) => {
    const cookies = stir.favourites.getFavsList(cookieType);
    return cookies.filter((entry) => Number(entry.id) === Number(id));
  };

  /* addToFavs */
  const addToFavs = (id, type) => {
    if (!isFavourite(Number(id))) {
      const favsCookie2 = [...getfavsCookie(COOKIE_ID), { id: id, date: Date.now(), type: type }];
      document.cookie = COOKIE_ID + JSON.stringify(favsCookie2) + calcExpiryDate(COOKIE_EXPIRY_DAYS) + ";path=/";
      return true;
    }
    return false;
  };

  /* removeFromFavs */
  const removeFromFavs = (id) => {
    if (id && id.length) {
      const favsCookie = JSON.stringify(getfavsCookie(COOKIE_ID).filter((item) => Number(item.id) !== Number(id)));
      document.cookie = COOKIE_ID + favsCookie + calcExpiryDate(COOKIE_EXPIRY_DAYS) + ";path=/";
      return true;
    }
    return false;
  };

  /* removeAll */
  const removeType = (type) => {
    const favsCookie = JSON.stringify(getfavsCookie(COOKIE_ID).filter((item) => item.type !== type));
    document.cookie = COOKIE_ID + favsCookie + calcExpiryDate(COOKIE_EXPIRY_DAYS) + ";path=/";
    return true;
  };

  /*

    PUBLIC METHODS

    */

  return {
    getFav: (id, cookieType) => getFav(id, cookieType),
    getFavsList: (type) => getFavsList(type),
    renderAddBtn: (sid, urlToFavs) => renderAddBtn(sid, urlToFavs),
    renderRemoveBtn: (sid, dateSaved, urlToFavs) => renderRemoveBtn(sid, dateSaved, urlToFavs),
    addToFavs: (id, type) => addToFavs(id, type),
    removeFromFavs: (id) => removeFromFavs(id),
    removeType: (type) => removeType(type),
    isFavourite: (id) => isFavourite(id),
  };
})();
