const FavouritesArea=(e,t)=>{if(e){var a=e.querySelector("[data-activity]");if(a){var r,s,i,o,t={allowedCookieTypes:["accom","course","schol","page"],cookieType:t,showUrlToFavs:a.dataset.favsurl||"",activity:a.dataset.activity||"",view:stir.templates?.view||"",fbhost:"prod"===UoS_env.name||"dev2"===UoS_env.name?"https://search.stir.ac.uk":"https://stage-shared-15-24-search.clients.uk.funnelback.com"},a={resultsArea:a,sharedArea:e.querySelector("[data-activity=shared]"),favBtnsNode:e.querySelector("[data-area=favActionBtns]"),latestArea:stir.node("[data-activity=latestfavs]")};const n=e=>e=>`<div class="cell large-3 text-sm u-bg-white u-p-1 u-mb-1">
                <p class="u-text-regular  "><strong><a href="${e.url}">${e.title}</a></strong></p>
                 <p><strong>${e.type&&stir.capitaliseFirst(e.type)}</strong></p>
            </div>`,c=(e,t,a)=>t.length?stir.favourites.renderRemoveBtn(a,t[0].date,e):stir.favourites.renderAddBtn(a,e),v=s=>e=>{var t,a,r;return e?(t=stir.favourites.getFav(e.id,s.cookieType),`
          <div class="cell" id="fav-${e.id}">
            <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
              <div class="grid-x grid-padding-x u-p-2 ">
                <div class="cell u-pt-1">
                  <p class="u-text-regular u-mb-2 "><strong><a href="${e.url}">${e.title}</a></strong></p>
                </div>
                <div class="cell ${e.img?"large-9":"large-12"} text-sm">
                  ${e.content}
                </div>
                ${a=e.img,r=e.title,a?`<div class="cell large-3">
                <div><img src="${a}" width="760" height="470" alt="Image of ${r}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
            </div>`:""}
                <div class="cell text-sm u-pt-2" id="favbtns${e.id}" data-type="${e.type}">
                  ${c(s.showUrlToFavs,t,e.id)}
                </div>
              </div>
            </div>
          </div>`):""},u=e=>e.id?`
          <div class="cell medium-4">
            <div class="u-green-line-top u-margin-bottom">
                <p class="u-text-regular u-pt-1"><strong><a href="${e.url}">${e.title}</a></strong></p>
                <div class="u-mb-1"><strong>${stir.capitaliseFirst(e.type)}</strong></div>
                <div class="u-mb-1">${e.content}</div>
                <div data-type="${e.type}">${stir.favourites.isFavourite(e.id)?'<p class="text-sm u-heritage-green">Already in your favourites</p>':stir.favourites.renderAddBtn(e.id,"")}</div>
            </div>
          </div>`:"",p=e=>e?`
          <p><strong>Share link</strong></p>  
          ${navigator.clipboard?'<p class="text-xsm">The following share link has been copied to your clipboard:</p>':""}   
          <p class="text-xsm">${e}</p>`:"",m=()=>stir.templates.renderNoFavs,g=()=>stir.templates.renderNoShared,f=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),h=e=>"string"!=typeof e?"":e.replace(/[^a-zA-Z0-9-_]/g,""),y={get:e=>h(QueryParams.get(e)),set:(e,t)=>QueryParams.set(e,h(t)),remove:QueryParams.remove};function l(r,s,i){const o=stir.favourites.getFavsListAll();if(o.length){const l=("micro"===(s.resultsArea.dataset.view||"")?n:v)(r),d=o.filter(e=>Number(e.id)).map(e=>e.id).join("+");var e=r.fbhost+"/s/search.json?collection=stir-main&num_ranks=50&SF=[sid,type,award,startDate,endDate,register,page]&query=&meta_sid_or="+d;stir.getJSON(e,e=>{const t=e?.response?.resultPacket?.results||[];var a;if(t.length)return e=d.split("+").map(a=>t.filter(e=>{if(Number(a)===Number(e.metaData.sid))return a}).map(e=>{return{id:a,date:o.filter(e=>e.id===a)[0].date,title:(e.metaData.award||"")+" "+e.title.split(" | ")[0],content:((t=e.metaData.startDate)?`<b>${new Date(t).toLocaleDateString("en-UK",{day:"numeric",month:"short",year:"numeric"}).replace(",","")}</b><br/>`:"")+e.summary,url:function(e){const t="?origin=favourites",{metaData:a,liveUrl:r}=e;return a?.type?({event:()=>a.page+t,webinar:()=>a.register+t}[a.type.toLowerCase()]||(()=>r+t))():r+t}(e),type:e.metaData.type||"page"};var t})),"latestfavs"===i?(a=stir.flatten(e).sort((e,t)=>t.date-e.date).slice(0,4).map(n(r)).join(""),f(s.latestArea)(a||"")):void((a=stir.flatten(e).filter(e=>e.type&&e.type.toLowerCase().includes(r.cookieType.toLowerCase())).sort((e,t)=>t.date-e.date)).length?f(s.resultsArea,a.map(l).join("")):f(s.resultsArea,m()))})}else f(s.resultsArea,'<div class="cell">No favourites saved.</div>'),f(s.latestArea,'<div class="cell">No favourites saved.</div>')}function d(t,e){var a=y.get("s")||"";if(!a)return f(t,g());try{const i=atob(a);var r=i.replaceAll(",","+"),s=e.fbhost+"/s/search.json?collection=stir-main&num_ranks=50&SF=[sid,type,award,startDate,endDate,register,page]&query=&meta_sid_or="+r;stir.getJSON(s,e=>{const a=e?.response?.resultPacket?.results||[];a.length&&((e=i.split(",").map(t=>a.filter(e=>{if(Number(t)===Number(e.metaData.sid))return t}).map(e=>({id:t,date:Date.now(),title:(e.metaData.award||"")+" "+e.title.split(" | ")[0],content:e.summary,url:e.liveUrl+"?orgin=shared",type:e.metaData.type||"page"}))))?f(t,stir.flatten(e).map(u).join("")):f(t,g()))})}catch(e){}}e=a,"managefavs"!==(a=t).activity&&"latestfavs"!==a.activity||l(a,e,a.activity),"shared"===a.activity&&d(e.sharedArea,a),e.favBtnsNode&&stir.node("main").addEventListener("click",(r=a,s=e,e=>{var t,e="BUTTON"===e.target.nodeName?e.target:e.target.closest("button");if(e&&e.dataset&&e.dataset.action){if("clearallfavs"===e.dataset.action){if(e.dataset.fav!==r.cookieType)return;stir.favourites.removeType(r.cookieType),l(r,s,e.dataset.action),l(r,s,"latestfavs")}"copysharelink"===e.dataset.action&&(e=stir.favourites.getFavsListAll(),e="https://www.stir.ac.uk/sharefavs/"+btoa(e.map(e=>e.id).join(",")),navigator.clipboard&&navigator.clipboard.writeText(e),t=stir.t4Globals.dialogs.find(e=>"shareDialog"===e.getId()))&&(t.open(),t.setContent(p(e)))}})),e.resultsArea.addEventListener("click",(i=a,o=e,e=>{var t,e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&(t=e=>{var t=stir.favourites.getFav(e,i.cookieType),a=stir.node("#favbtns"+e);a&&f(a)(c(i.showUrlToFavs,t,e)),o.sharedArea&&d(o.sharedArea,i)},"addtofavs"===e.dataset.action&&(stir.favourites.addToFavs(e.dataset.id,i.cookieType),t(e.dataset.id)),"removefav"===e.dataset.action)&&(stir.favourites.removeFromFavs(e.dataset.id),t(e.dataset.id),"managefavs"===i.activity)&&((t=stir.node("#fav-"+e.dataset.id))&&f(t)(""),l(i,o,"latestfavs"))}))}}},FavouritePromos=()=>{const r=e=>`
      <div class="u-flex1-large-up u-bg-heritage-berry u-white--all u-flex-large-up flex-dir-column u-gap align-center u-mt-1">
          <div class="u-py-2 flex-container flex-dir-column u-gap">
              <div class="hook hook-skinny hook-right hook-energy-green u-mr-2">
                  <h2 class=" text-lg u-uppercase  u-pl-2 u-m-0 u-p-0">${e.head}</h2>
              </div>
              <div class="u-px-2">
                  <p class="text-sm u-mb-1">${e.body}</p>
                  <a class="button heritage-green u-cursor-pointer expanded text-sm " href="${e.link}" aria-label="Book your place">${e.button}</a>
              </div>
          </div>
      </div>`;var s;s=promosData,stir.nodes("[data-promos]").forEach(e=>{const t=e.getAttribute("data-promos");var a=s.filter(e=>e.type===t);promoHtml=a.map(r).join(""),stir.setHTML(e,promoHtml)})};FavouritesArea(stir.node("#acccomArea"),"accommodation"),FavouritesArea(stir.node("#courseArea"),"course"),FavouritesArea(stir.node("#scholArea"),"scholarship"),FavouritesArea(stir.node("#pageArea"),"page"),FavouritesArea(stir.node("#eventArea"),"event"),FavouritesArea(stir.node("#webinarArea"),"webinar"),FavouritesArea(stir.node("#latestFavs"),"all"),FavouritePromos();