var stir = stir || {};

stir.favourites = (() => {
  // VARS
  const cookieId = "favs=";
  const cookieExpiryDays = 365;

  /*

    Renderers

  */

  /* renderRemoveBtn */
  const renderRemoveBtn = (sid, dateSaved) => {
    return `
        <div class="flex-container align-middle u-gap-8 u-mt-1">
            <button id="removefavbtn-${sid}" class="u-heritage-green  u-cursor-pointer flex-container u-gap-8 align-middle" aria-label="Remove from favourites" data-action="removefav" data-id="${sid}">
            ${renderActiveIcon()}
          </button>
          <span>Favourited ${calcDaysAgo(new Date(dateSaved))}</span>
        </div>`;
  };

  /* renderAddBtn */
  const renderAddBtn = (sid) => {
    return `
        <div class="flex-container align-middle u-gap-8" >
            <button
              class="u-heritage-green u-cursor-pointer u-line-height-default flex-container u-gap-8 align-middle"
              data-action="addtofavs" aria-label="Add to your favourites" data-id="${sid}" id="addfavbtn-${sid}">
              ${renderInactiveIcon()}
              <span class="u-heritage-green u-underline u-inline-block u-pb-1">Add to your favourites</span>
            </button>
            <span class="u-border-bottom-solid u-inline-block u-mx-1"><a href="#">View favourites</a></span>
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
    return getfavsCookie(cookieId)
      .map((item) => Number(item.id))
      .includes(id);
  };

  /* getfavsCookie: Returns an array of objects */
  const getfavsCookie = (cookieId) => {
    const favCookie = document.cookie
      .split(";")
      .filter((i) => i.includes(cookieId))
      .map((i) => i.replace(cookieId, ""));

    return favCookie.length ? JSON.parse(favCookie) : [];
  };

  /* getFavsList: Returns an array of objects */
  const getFavsList = (cookieType) => {
    const favsCookieAll = getfavsCookie(cookieId);
    const favsCookie = favsCookieAll.filter((item) => item.type === cookieType); // filter by type - eg accomm, course (default)

    if (!favsCookie.length || favsCookie.length < 1) return [];

    const favsCookieSorted = favsCookie.sort((a, b) => b.date - a.date);
    return favsCookieSorted;
  };

  /* addToFavs */
  const addToFavs = (id, type) => {
    if (!isFavourite(Number(id))) {
      const favsCookie2 = [...getfavsCookie(cookieId), { id: id, date: Date.now(), type: type }];
      document.cookie = cookieId + JSON.stringify(favsCookie2) + calcExpiryDate(cookieExpiryDays) + ";path=/";
      return true;
    }
    return false;
  };

  /* removeFromFavs */
  const removeFromFavs = (id) => {
    if (id && id.length) {
      const favsCookie = JSON.stringify(getfavsCookie(cookieId).filter((item) => Number(item.id) !== Number(id)));
      document.cookie = cookieId + favsCookie + calcExpiryDate(cookieExpiryDays) + ";path=/";
      return true;
    }
    return false;
  };

  /*

    PUBLIC METHODS

    */

  return {
    getFavsList: (type) => getFavsList(type),
    renderAddBtn: (sid) => renderAddBtn(sid),
    renderRemoveBtn: (sid, dateSaved) => renderRemoveBtn(sid, dateSaved),
    addToFavs: (id, type) => addToFavs(id, type),
    removeFromFavs: (id) => removeFromFavs(id),
    isFavourite: (id) => isFavourite(id),
    //attachEventHandlers: attachEventHandlers,
    //auto: () => fetchData(),
    //isFavourite: isFavourite,
    //doCourseBtn: doCourseBtn,
    //getFavsList: getFavsList(),
  };
})();
