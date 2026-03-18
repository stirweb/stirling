!function(){var t=document.querySelector("[data-activity]");if(!t)return;var e={showUrlToFavs:t.dataset.favsurl||"",activity:t.dataset.activity||"",view:stir.templates?.view||""},t={resultsArea:t,sharedArea:document.querySelector("[data-activity=shared]"),favBtnsNode:document.querySelector("[data-area=favActionBtns]"),latestArea:stir.node("[data-activity=latestfavs]")};const s=t=>t&&t.id?`<div class="cell large-3 text-sm u-bg-white u-p-1 u-mb-1" id="microfav-${t.custom_fields.sid}" data-type="${t.custom_fields.type}">
                <p class="u-text-regular  "><strong><a href="${t.url}">${t.custom_fields.h1_custom}</a></strong></p>
                 <p><strong>${t.custom_fields.type&&stir.capitaliseFirst(t.custom_fields.type)||""}</strong></p>
            </div>`:"",o=(t,e)=>t?`<div class="cell large-3">
                <div><img src="${t}" width="760" height="470" alt="Image of ${e}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
            </div>`:"",c=(t,e,a)=>e.length?stir.favourites.renderRemoveBtn(a,e[0].date,t):stir.favourites.renderAddBtn(a,t),d=t=>"string"==typeof t?JSON.parse(decodeURIComponent(t)):"object"==typeof t?Object.assign({},...t.map(t=>JSON.parse(decodeURIComponent(t)))):{},l=i=>t=>{var e,a,s,r;return t&&t.id?(e=t.custom_fields||{},a=d(e.data).register||t.url,s=e.snippet||t.meta_description,r=stir.favourites.getFav(e.sid,i.cookieType),`
          <div class="cell" id="fav-${e.sid}">
            <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
              <div class="grid-x grid-padding-x u-p-2 ">
                <div class="cell u-pt-1">
                  <p class="u-text-regular u-mb-2 "><strong><a href="${a}?origin=favourites">${e.h1_custom}</a></strong></p>
                </div>
                <div class="cell ${t.img?"large-9":"large-12"} text-sm">
                  ${s}
                </div>
                ${o(t.img,t.title)}
                <div class="cell text-sm u-pt-2" id="favbtns${e.sid}" data-type="${e.type}">
                  ${c(i.showUrlToFavs,r,e.sid)}
                </div>
              </div>
            </div>
          </div>`):""},r=t=>{var e,a;return t.id?(e=t.custom_fields||{},a=d(e.data).register||t.url,t=e.snippet||t.meta_description,`
          <div class="cell medium-4">
            <div class="u-green-line-top u-margin-bottom">
                <p class="u-text-regular u-pt-1"><strong><a href="${a}?origin=shared">${e.h1_custom}</a></strong></p>
                <div class="u-mb-1"><strong>${e.type&&stir.capitaliseFirst(e.type)}</strong></div>
                <div class="u-mb-1">${t}</div>
    <div data-type="${e.type}">${stir.favourites.isFavourite(e.sid)?'<p class="text-sm u-heritage-green">Already in your favourites</p>':stir.favourites.renderAddBtn(e.sid,"")}</div>
            </div>
          </div>`):""},i=t=>t?`<p><strong>Share link</strong></p>  
              ${navigator.clipboard?'<p class="text-xsm">The following share link has been copied to your clipboard:</p>':""}  
            <p class="text-xsm">${t}</p>`:"",n=()=>stir.templates.renderNoFavs,v=()=>stir.templates.renderNoShared,u=stir.curry((t,e)=>(stir.setHTML(t,e),!0)),a=t=>"string"!=typeof t?"":t.replace(/[^a-zA-Z0-9-_]/g,""),p={get:t=>a(QueryParams.get(t)),set:(t,e)=>QueryParams.set(t,a(e)),remove:QueryParams.remove},m=t=>{const e={and:[{or:[]}]};return t.forEach(t=>{e.and[0].or.push({"custom_fields.sid":t})}),e};const f=t=>{t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");if(t&&t.dataset&&t.dataset.action){if("clearallfavs"===t.dataset.action){if(!t.dataset.fav)return;var e=t.dataset.fav,a="accommodation"===e?"accom":e;stir.favourites.removeType(e),document.querySelector(`[data-favtype="${a}"]`).innerHTML=n(),document.querySelectorAll(`[data-type="${a}"]`).forEach(t=>{t.remove()})}"copysharelink"===t.dataset.action&&(e="https://www.stir.ac.uk/share/"+stir.favourites.getFavsListAll().map(t=>t.id).join("I"),navigator.clipboard&&navigator.clipboard.writeText(e),a=stir.t4Globals.dialogs.find(t=>"shareDialog"===t.getId()))&&(a.open(),a.setContent(i(e)))}},g=(o,d)=>t=>{const e="shared"===d.dataset.activity,a=t.target.closest("button");if(a&&a.dataset&&a.dataset.action){var s;if("addtofavs"===a.dataset.action){stir.favourites.addToFavs(a.dataset.id,o.cookieType);{var t=a.dataset.id;var r=stir.favourites.getFav(t,o.cookieType);const i=stir.node("#favbtns"+t);if(i&&u(i)(c(o.showUrlToFavs,r,t)),e){const i=a.parentNode;i&&u(i)(c(o.showUrlToFavs,r,t))}}}"removefav"===a.dataset.action&&(stir.favourites.removeFromFavs(a.dataset.id),r=document.querySelector("#fav-"+a.dataset.id),(t=document.querySelector("#microfav-"+a.dataset.id))&&t.remove(),r&&r.remove(),e)&&(t=a.parentNode,s=stir.favourites.getFav(a.dataset.id,o.cookieType),t)&&u(t)(c(o.showUrlToFavs,s,a.dataset.id))}};function h(o,e){const a=stir.favourites.getFavsListAll().sort((t,e)=>e.date-t.date),d=Array.from(document.querySelectorAll("[data-favtype]"));var t;a&&a.length?(t=m(a.map(t=>t.id)),t=`https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de?term=*&resultType=organic&limit=100&filter=${encodeURIComponent(JSON.stringify(t))}&`,fetch(t).then(t=>t.json()).then(i=>{d.map(t=>t.dataset.favtype||"").forEach(e=>{var t,a,s=d.find(t=>t.dataset.favtype===e),r=i.hits.filter(t=>t.custom_fields&&t.custom_fields.type&&t.custom_fields.type.includes(e));s=s,r=r,t={...t=o,cookieType:s.dataset.favtype||""},a=l(t),r=r.map(a).join(""),u(s,r||""+stir.templates.renderNoFavs),s.addEventListener("click",g(t,s))});var t=a.slice(0,4).map(e=>i.hits.find(t=>Number(t.custom_fields.sid)===Number(e.id))).map(s).join("");u(e.latestArea,t||'<div class="cell">No favourites saved.</div>')}).catch(t=>console.error("Error fetching data:",t))):d.forEach(t=>{console.log(t),u(t,n()),u(e.latestArea,'<div class="cell">No favourites saved.</div>')})}e=e,(t=t).favBtnsNode&&stir.node("main").addEventListener("click",f),"managefavs"!==e.activity&&"latestfavs"!==e.activity||h(e,t),"shared"===e.activity&&(function(e,a){var t=p.get("s")||"";if(!t)return u(e,v());t=t.split("I"),t=m(t),t=`https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de?term=*&limit=100&filter=${encodeURIComponent(JSON.stringify(t))}&`,fetch(t).then(t=>t.json()).then(t=>{var t=t?.hits||[];t.length&&(t=t.map(r).join(""),u(e,t||v()),e.addEventListener("click",g(a,e)))}).catch(t=>console.error("Error fetching data:",t))}(t.sharedArea,e),stir.node("main").addEventListener("click",f))}();const FavouritePromos=t=>{if(t&&t.length){const r=t=>`
      <div class="u-flex1-large-up u-bg-heritage-berry u-white--all u-flex-large-up flex-dir-column u-gap align-center u-mt-1">
          <div class="u-py-2 flex-container flex-dir-column u-gap">
              <div class="hook hook-skinny hook-right hook-energy-green u-mr-2">
                  <h2 class="header-stripped text-lg u-uppercase  u-pl-2 u-m-0 u-p-0">${t.head}</h2>
              </div>
              <div class="u-px-2">
                  <p class="text-sm u-mb-1">${t.body}</p>
                  <a class="button heritage-green u-cursor-pointer expanded text-sm " href="${t.link}" aria-label="Book your place">${t.button}</a>
              </div>
          </div>
      </div>`;var s;s=t,stir.nodes("[data-promos]").forEach(t=>{const e=t.getAttribute("data-promos");var a=s.filter(t=>t.type===e);promoHtml=a.map(r).join(""),stir.setHTML(t,promoHtml)})}};stir.promosData=stir.promosData||[],FavouritePromos(stir.promosData);