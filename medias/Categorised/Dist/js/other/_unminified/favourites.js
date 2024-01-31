var stir = stir || {};

stir.favourites = (() => {
  /*

    Renderers

  */

  /* renderRemoveBtn */
  const renderRemoveBtn = (sid, dateSaved) => {
    return ` 
          <button id="removefavbtn-${sid}" class="u-heritage-green  u-cursor-pointer flex-container u-gap-8 align-middle" aria-label="Remove from favourites" data-action="removefav" data-id="${sid}">
            ${renderActiveIcon()}
          </button>
          <span>Favourited ${getDaysAgo(new Date(dateSaved))}</span>`;
  };

  /* renderRemoveBtn */
  const renderAddBtn = (sid) => {
    return ` 
          <button
              class="u-heritage-green u-cursor-pointer u-line-height-default flex-container u-gap-8 align-middle"
              data-action="addtofavs" aria-label="Add to your favourites" data-id="${sid}" id="addfavbtn-${sid}">
              ${renderInactiveIcon()}
              <span class="u-heritage-green u-underline u-inline-block u-pb-1">Add
                  to your favourites</span>
          </button>`;
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
            <path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2h-0.1c-3,0-5.8,1.2-7.9,3.4
        c-4.3,4.5-4.2,11.7,0.2,16L24,44.4c0.5,0.5,1.6,0.5,2.1,0L44,26.5c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
        C47.5,15,46.3,12.2,44.1,10.1z"/>
           </svg> `;
  };

  const renderSearchBtnHTML = (sid) => {
    const el = document.createElement("div"); // temporary element
    el.setAttribute("data-id", sid); // attribute needed for doCourseBtn() validation
    doCourseBtn(el); // generate the button

    return el.innerHTML; // pass back to course template
  };

  /*

    Cookie Processing
  
*/

  /*

    PUBLIC METHODS

 */

  return {
    //auto: () => fetchData(),
    //isFavourite: isInCookie,
    //doCourseBtn: doCourseBtn,
    renderAddBtn: renderAddBtn(),
    renderRemoveBtn: renderRemoveBtn(),
    //attachEventHandlers: attachEventHandlers,
  };
})();
