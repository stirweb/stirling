const FavouritesArea=(t,e)=>{if(t){var a,s,r,i,o=t.querySelector("[data-activity]"),e=(console.log(UoS_env.name),{allowedCookieTypes:["accom","course","schol","page"],cookieType:e,urlToFavs:o.dataset.favsurl||"",activity:o.dataset.activity||"",view:stir.templates?.view||"",fbhost:"prod"===UoS_env.name||"dev"===UoS_env.name?"https://search.stir.ac.uk":"https://stage-shared-15-24-admin.clients.uk.funnelback.com"}),o={resultsArea:o,sharedArea:t.querySelector("[data-activity=shared]"),favBtnsNode:t.querySelector("[data-area=favActionBtns]"),latestArea:stir.node("[data-activity=latestfavs]")};const n=t=>t=>`<div class="cell large-3 text-sm u-bg-white u-p-1 u-mb-1">
                <p class="u-text-regular  "><strong><a href="${t.url}">${t.title}</a></strong></p>
                 <p><strong>${stir.capitaliseFirst(t.type)}</strong></p>
            </div>`,c=(t,e,a)=>e.length?stir.favourites.renderRemoveBtn(a,e[0].date,t):stir.favourites.renderAddBtn(a,t),v=r=>t=>{var e,a,s;return t?(e=stir.favourites.getFav(t.id,r.cookieType),`
          <div class="cell" id="fav-${t.id}">
            <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
              <div class="grid-x grid-padding-x u-p-2 ">
                <div class="cell u-pt-2">
                  <p class="u-text-regular u-mb-2 "><strong><a href="${t.url}">${t.title}</a></strong></p>
                </div>
                <div class="cell ${t.img?"large-9":"large-12"} text-sm">
                  ${t.content}
                </div>
                ${a=t.img,s=t.title,a?`<div class="cell large-3">
                <div><img src="${a}" width="760" height="470" alt="Image of ${s}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
            </div>`:""}
                <div class="cell text-sm u-pt-2" id="favbtns${t.id}" data-type="${t.type}">
                  ${c(r.urlToFavs,e,t.id)}
                </div>
              </div>
            </div>
          </div>`):""},u=t=>t.id?`
          <div class="cell small-6">
            <div class="u-green-line-top u-margin-bottom">
                <p class="u-text-regular u-pt-1"><strong><a href="${t.url}">${t.title}</a></strong></p>
                <div class="u-mb-1"><strong>${stir.capitaliseFirst(t.type)}</strong></div>
                <div class="u-mb-1">${t.content}</div>
                <div data-type="${t.type}">${stir.favourites.isFavourite(t.id)?'<p class="text-sm u-heritage-green">Already in my favourites</p>':stir.favourites.renderAddBtn(t.id,"")}</div>
            </div>
          </div>`:"",p=t=>t?`
          <p><strong>Share link</strong></p>  
          ${navigator.clipboard?'<p class="text-xsm">The following share link has been copied to your clipboard:</p>':""}   
          <p class="text-xsm">${t}</p>`:"",m=()=>stir.templates.renderNoFavs,g=()=>stir.templates.renderNoShared,f=stir.curry((t,e)=>(stir.setHTML(t,e),!0)),y=t=>"string"!=typeof t?"":t.replace(/[^a-zA-Z0-9-_]/g,""),h={get:t=>y(QueryParams.get(t)),set:(t,e)=>QueryParams.set(t,y(e)),remove:QueryParams.remove};function l(s,r,i){const o=stir.favourites.getFavsListAll();if(o.length){const l=("micro"===(r.resultsArea.dataset.view||"")?n:v)(s),d=o.filter(t=>Number(t.id)).map(t=>t.id).join("+");var t=s.fbhost+"/s/search.json?collection=stir-main&SF=[sid,type]&query=&meta_sid_or="+d;stir.getJSON(t,t=>{const a=t.response.resultPacket.results;t=d.split("+").map(e=>a.filter(t=>{if(Number(e)===Number(t.metaData.sid))return e}).map(t=>({id:e,date:o.filter(t=>t.id===e)[0].date,title:t.title.split(" | ")[0],content:t.summary,url:t.clickTrackingUrl,type:t.metaData.type})));if("latestfavs"===i)return e=stir.flatten(t).sort((t,e)=>e.date-t.date).slice(0,4).map(n(s)).join(""),f(r.latestArea)(e||"");var e=stir.flatten(t).filter(t=>t.type.toLowerCase().includes(s.cookieType.toLowerCase())).sort((t,e)=>e.date-t.date);e.length?f(r.resultsArea,e.map(l).join("")):f(r.resultsArea,m())})}else f(r.resultsArea,'<div class="cell">No favourites saved.</div>')}function d(e){var t=h.get("s")||"";if(!t)return f(e,g());try{const r=atob(t);var a=r.replaceAll(",","+"),s=consts.fbhost+"/s/search.json?collection=stir-main&SF=[sid,type]&query=&meta_sid_or="+a;stir.getJSON(s,t=>{const a=t.response.resultPacket.results;t=r.split(",").map(e=>a.filter(t=>{if(Number(e)===Number(t.metaData.sid))return e}).map(t=>({id:e,date:Date.now(),title:t.title.split(" | ")[0],content:t.summary,url:t.clickTrackingUrl,type:t.metaData.type})));t?f(e,stir.flatten(t).map(u).join("")):f(e,g())})}catch(t){}}t=o,"managefavs"!==(o=e).activity&&"latestfavs"!==o.activity||l(o,t,o.activity),"shared"===o.activity&&d(t.sharedArea,t.sharedfavArea),t.favBtnsNode&&stir.node("main").addEventListener("click",(a=o,s=t,t=>{var e,t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");if(t&&t.dataset&&t.dataset.action){if("clearallfavs"===t.dataset.action){if(t.dataset.fav!==a.cookieType)return;stir.favourites.removeType(a.cookieType),l(a,s,t.dataset.action),l(a,s,"latestfavs")}"copysharelink"===t.dataset.action&&(t=stir.favourites.getFavsListAll(),t="https://www.stir.ac.uk/sharefavs/"+btoa(t.map(t=>t.id).join(",")),navigator.clipboard&&navigator.clipboard.writeText(t),e=stir.t4Globals.dialogs.find(t=>"shareDialog"===t.getId()))&&(e.open(),e.setContent(p(t)))}})),t.resultsArea.addEventListener("click",(r=o,i=t,t=>{var e,t=t.target.closest("button");t&&t.dataset&&t.dataset.action&&(e=t=>{var e=stir.favourites.getFav(t,r.cookieType),a=stir.node("#favbtns"+t);a&&f(a)(c(r.urlToFavs,e,t)),i.sharedArea&&d(i.sharedArea,i.sharedfavArea)},"addtofavs"===t.dataset.action&&(stir.favourites.addToFavs(t.dataset.id,r.cookieType),e(t.dataset.id)),"removefav"===t.dataset.action)&&(stir.favourites.removeFromFavs(t.dataset.id),e(t.dataset.id),"managefavs"===r.activity)&&(e=stir.node("#fav-"+t.dataset.id))&&f(e)("")}))}};FavouritesArea(stir.node("#acccomArea"),"accommodation"),FavouritesArea(stir.node("#courseArea"),"course"),FavouritesArea(stir.node("#scholArea"),"scholarship"),FavouritesArea(stir.node("#latestFavs"),"all");