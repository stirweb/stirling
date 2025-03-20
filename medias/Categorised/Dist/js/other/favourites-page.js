const FavouritesArea=(t,e)=>{if(t){var a=t.querySelector("[data-activity]");if(a){var r,s,i,o,e={allowedCookieTypes:["accom","course","schol","page"],cookieType:e,showUrlToFavs:a.dataset.favsurl||"",activity:a.dataset.activity||"",view:stir.templates?.view||"",fbhost:"prod"===UoS_env.name||"dev"===UoS_env.name?"https://search.stir.ac.uk":"https://stage-shared-15-24-search.clients.uk.funnelback.com"},a={resultsArea:a,sharedArea:t.querySelector("[data-activity=shared]"),favBtnsNode:t.querySelector("[data-area=favActionBtns]"),latestArea:stir.node("[data-activity=latestfavs]")};const n=t=>t=>`<div class="cell large-3 text-sm u-bg-white u-p-1 u-mb-1">
                <p class="u-text-regular  "><strong><a href="${t.url}">${t.title}</a></strong></p>
                 <p><strong>${t.type&&stir.capitaliseFirst(t.type)}</strong></p>
            </div>`,c=(t,e,a)=>e.length?stir.favourites.renderRemoveBtn(a,e[0].date,t):stir.favourites.renderAddBtn(a,t),v=s=>t=>{var e,a,r;return t?(e=stir.favourites.getFav(t.id,s.cookieType),`
          <div class="cell" id="fav-${t.id}">
            <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
              <div class="grid-x grid-padding-x u-p-2 ">
                <div class="cell u-pt-1">
                  <p class="u-text-regular u-mb-2 "><strong><a href="${t.url}">${t.title}</a></strong></p>
                </div>
                <div class="cell ${t.img?"large-9":"large-12"} text-sm">
                  ${t.content}
                </div>
                ${a=t.img,r=t.title,a?`<div class="cell large-3">
                <div><img src="${a}" width="760" height="470" alt="Image of ${r}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
            </div>`:""}
                <div class="cell text-sm u-pt-2" id="favbtns${t.id}" data-type="${t.type}">
                  ${c(s.showUrlToFavs,e,t.id)}
                </div>
              </div>
            </div>
          </div>`):""},u=t=>t.id?`
          <div class="cell medium-4">
            <div class="u-green-line-top u-margin-bottom">
                <p class="u-text-regular u-pt-1"><strong><a href="${t.url}">${t.title}</a></strong></p>
                <div class="u-mb-1"><strong>${stir.capitaliseFirst(t.type)}</strong></div>
                <div class="u-mb-1">${t.content}</div>
                <div data-type="${t.type}">${stir.favourites.isFavourite(t.id)?'<p class="text-sm u-heritage-green">Already in your favourites</p>':stir.favourites.renderAddBtn(t.id,"")}</div>
            </div>
          </div>`:"",p=t=>t?`
          <p><strong>Share link</strong></p>  
          ${navigator.clipboard?'<p class="text-xsm">The following share link has been copied to your clipboard:</p>':""}   
          <p class="text-xsm">${t}</p>`:"",m=()=>stir.templates.renderNoFavs,g=()=>stir.templates.renderNoShared,f=stir.curry((t,e)=>(stir.setHTML(t,e),!0)),h=t=>"string"!=typeof t?"":t.replace(/[^a-zA-Z0-9-_]/g,""),y={get:t=>h(QueryParams.get(t)),set:(t,e)=>QueryParams.set(t,h(e)),remove:QueryParams.remove};function l(r,s,i){const o=stir.favourites.getFavsListAll();if(o.length){const l=("micro"===(s.resultsArea.dataset.view||"")?n:v)(r),d=o.filter(t=>Number(t.id)).map(t=>t.id).join("+");var t=r.fbhost+"/s/search.json?collection=stir-main&num_ranks=50&SF=[sid,type,award,startDate,endDate,register,page]&query=&meta_sid_or="+d;stir.getJSON(t,t=>{const e=t?.response?.resultPacket?.results||[];var a;if(e.length)return t=d.split("+").map(a=>e.filter(t=>{if(Number(a)===Number(t.metaData.sid))return a}).map(t=>{return{id:a,date:o.filter(t=>t.id===a)[0].date,title:(t.metaData.award||"")+" "+t.title.split(" | ")[0],content:((e=t.metaData.startDate)?`<b>${new Date(e).toLocaleDateString("en-UK",{day:"numeric",month:"short",year:"numeric"}).replace(",","")}</b><br/>`:"")+t.summary,url:function(t){const e="?origin=favourites",{metaData:a,liveUrl:r}=t;return a?.type?({event:()=>a.page+e,webinar:()=>a.register+e}[a.type.toLowerCase()]||(()=>r+e))():r+e}(t),type:t.metaData.type||"page"};var e})),"latestfavs"===i?(a=stir.flatten(t).sort((t,e)=>e.date-t.date).slice(0,4).map(n(r)).join(""),f(s.latestArea)(a||"")):void((a=stir.flatten(t).filter(t=>t.type&&t.type.toLowerCase().includes(r.cookieType.toLowerCase())).sort((t,e)=>e.date-t.date)).length?f(s.resultsArea,a.map(l).join("")):f(s.resultsArea,m()))})}else f(s.resultsArea,`<div class="cell">${stir.templates.renderNoFavs}</div>`),f(s.latestArea,'<div class="cell">No favourites saved.</div>')}function d(e,t){const r=y.get("s")||"";if(!r)return f(e,g());try{var a=r.replaceAll("I","+"),s=t.fbhost+"/s/search.json?collection=stir-main&num_ranks=50&SF=[sid,type,award,startDate,endDate,register,page]&query=&meta_sid_or="+a;stir.getJSON(s,t=>{const a=t?.response?.resultPacket?.results||[];a.length&&((t=r.split("I").map(e=>a.filter(t=>{if(Number(e)===Number(t.metaData.sid))return e}).map(t=>({id:e,date:Date.now(),title:(t.metaData.award||"")+" "+t.title.split(" | ")[0],content:t.summary,url:t.liveUrl+"?orgin=shared",type:t.metaData.type||"page"}))))?f(e,stir.flatten(t).map(u).join("")):f(e,g()))})}catch(t){}}t=a,"managefavs"!==(a=e).activity&&"latestfavs"!==a.activity||l(a,t,a.activity),"shared"===a.activity&&d(t.sharedArea,a),t.favBtnsNode&&stir.node("main").addEventListener("click",(r=a,s=t,t=>{var e,t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");if(t&&t.dataset&&t.dataset.action){if("clearallfavs"===t.dataset.action){if(t.dataset.fav!==r.cookieType)return;stir.favourites.removeType(r.cookieType),l(r,s,t.dataset.action),l(r,s,"latestfavs")}"copysharelink"===t.dataset.action&&(t="https://www.stir.ac.uk/share/"+stir.favourites.getFavsListAll().map(t=>t.id).join("I"),navigator.clipboard&&navigator.clipboard.writeText(t),e=stir.t4Globals.dialogs.find(t=>"shareDialog"===t.getId()))&&(e.open(),e.setContent(p(t)))}})),t.resultsArea.addEventListener("click",(i=a,o=t,t=>{var e,t=t.target.closest("button");t&&t.dataset&&t.dataset.action&&(e=t=>{var e=stir.favourites.getFav(t,i.cookieType),a=stir.node("#favbtns"+t);a&&f(a)(c(i.showUrlToFavs,e,t)),o.sharedArea&&d(o.sharedArea,i)},"addtofavs"===t.dataset.action&&(stir.favourites.addToFavs(t.dataset.id,i.cookieType),e(t.dataset.id)),"removefav"===t.dataset.action)&&(stir.favourites.removeFromFavs(t.dataset.id),e(t.dataset.id),"managefavs"===i.activity)&&((e=stir.node("#fav-"+t.dataset.id))&&f(e)(""),l(i,o,"latestfavs"))}))}}},FavouritePromos=t=>{if(t&&t.length){const s=t=>`
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
      </div>`;var r;r=t,stir.nodes("[data-promos]").forEach(t=>{const e=t.getAttribute("data-promos");var a=r.filter(t=>t.type===e);promoHtml=a.map(s).join(""),stir.setHTML(t,promoHtml)})}};FavouritesArea(stir.node("#acccomArea"),"accommodation"),FavouritesArea(stir.node("#courseArea"),"course"),FavouritesArea(stir.node("#scholArea"),"scholarship"),FavouritesArea(stir.node("#pageArea"),"page"),FavouritesArea(stir.node("#eventArea"),"event"),FavouritesArea(stir.node("#webinarArea"),"webinar"),FavouritesArea(stir.node("#latestFavs"),"all"),stir.promosData=stir.promosData||[],FavouritePromos(stir.promosData);