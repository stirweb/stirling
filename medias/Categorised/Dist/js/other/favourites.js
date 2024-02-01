var stir=stir||{};stir.favourites=(()=>{const a="favs=",r=(e,t)=>`
        <div class="flex-container align-middle u-gap-8 u-mt-1">
            <button id="removefavbtn-${e}" class="u-heritage-green  u-cursor-pointer flex-container u-gap-8 align-middle" aria-label="Remove from favourites" data-action="removefav" data-id="${e}">
            <svg version="1.1" data-stiricon="heart-inactive"  fill="currentColor" 
             viewBox="0 0 50 50" style="width:22px;height:22px;" >
            <path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2h-0.1c-3,0-5.8,1.2-7.9,3.4 c-4.3,4.5-4.2,11.7,0.2,16L24,44.4c0.5,0.5,1.6,0.5,2.1,0L44,26.5c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
        C47.5,15,46.3,12.2,44.1,10.1z"/>
           </svg> 
          </button>
          <span>Favourited ${(e=>{const t=new Date,a=24*60*60*1e3,r=(e.setHours(0,0,0,0),t.setHours(0,0,0,0),Math.floor((+t-+e)/a)),i=r>1?`days`:`day`;return r===0?`today`:`${r} ${i} ago`})(new Date(t))}</span>
        </div>`,i=e=>{var t=new Date;return t.setTime(t.getTime()+24*e*60*60*1e3),";expires="+t.toUTCString()},n=e=>o(a).map(e=>Number(e.id)).includes(e),o=t=>{var e=document.cookie.split(";").filter(e=>e.includes(t)).map(e=>e.replace(t,""));return e.length?JSON.parse(e):[]};return{getFavsList:e=>{return t=e,!(e=o(a).filter(e=>e.type===t)).length||e.length<1?[]:e.sort((e,t)=>t.date-e.date);var t},renderAddBtn:e=>{return`
        <div class="flex-container align-middle u-gap-8" >
            <button
              class="u-heritage-green u-cursor-pointer u-line-height-default flex-container u-gap-8 align-middle"
              data-action="addtofavs" aria-label="Add to your favourites" data-id="${e}" id="addfavbtn-${e}">
              <svg version="1.1" data-stiricon="heart-active" fill="currentColor"
              viewBox="0 0 50 50" style="width:22px;height:22px;" >
              <path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2c0,0-0.1,0-0.1,0c-3,0-5.8,1.2-7.9,3.4
               c-4.3,4.5-4.2,11.7,0.2,16l18.1,18.1c0.5,0.5,1.6,0.5,2.1,0l17.9-17.9c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
               C47.5,15,46.3,12.2,44.1,10.1z M42,24.2l-17,17l-17-17c-3.3-3.3-3.3-8.6,0-11.8c1.6-1.6,3.7-2.4,5.9-2.4c2.2-0.1,4.4,0.8,6,2.5
               l4.1,4.1c0.6,0.6,1.5,0.6,2.1,0l4.2-4.2c3.4-3.2,8.5-3.2,11.8,0C45.3,15.6,45.3,20.9,42,24.2z"/>
            </svg>
              <span class="u-heritage-green u-underline u-inline-block u-pb-1">Add to your favourites</span>
            </button>
            <span class="u-border-bottom-solid u-inline-block u-mx-1"><a href="#">View favourites</a></span>
        </div>`},renderRemoveBtn:(e,t)=>r(e,t),addToFavs:(e,t)=>{return e=e,t=t,!n(Number(e))&&(e=[...o(a),{id:e,date:Date.now(),type:t}],document.cookie=a+JSON.stringify(e)+i(365)+";path=/",!0)},removeFromFavs:e=>{return!(!(t=e)||!t.length||(e=JSON.stringify(o(a).filter(e=>Number(e.id)!==Number(t))),document.cookie=a+e+i(365)+";path=/",0));var t},isFavourite:e=>n(e)}})();