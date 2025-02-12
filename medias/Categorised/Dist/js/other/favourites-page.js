const FavouritesArea=(t,e,a)=>{if(t){var r=t.querySelector("[data-activity]");console.log(r);const u={allowedCookieTypes:["accom","course"],cookieType:e,urlToFavs:r.dataset.favsurl||"",activity:r.dataset.activity||"",view:stir.templates?.view||""};e={resultsArea:r,favBtnsNode:t.querySelector("[data-area=favActionBtns]")};const p=t=>t=>`<div class="cell large-3 text-sm u-bg-grey u-p-1 u-mb-1">
                     <p class="u-text-regular  "><strong><a href="${t.url}">${t.title}</a></strong></p>
            </div>`,m=(t,e,a)=>e.length?stir.favourites.renderRemoveBtn(a,e[0].date,t):stir.favourites.renderAddBtn(a,t),g=s=>t=>{var e,a,r;return t?(e=stir.favourites.getFav(t.id,s.cookieType),`
        <div class="cell" id="fav-${t.id}">
          <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
            <div class="grid-x grid-padding-x u-p-2 ">
              <div class="cell u-pt-2">
                <p class="u-text-regular u-mb-2 "><strong><a href="${t.url}">${t.title}</a></strong></p>
              </div>
              <div class="cell ${t.img?"large-9":"large-12"} text-sm">
                <p><strong>Content</strong></p> 
                ${t.content}
              </div>
              ${a=t.img,r=t.title,a?`<div class="cell large-3">
                <div><img src="${a}" width="760" height="470" alt="Image of ${r}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
             </div>`:""}
              <div class="cell text-sm u-pt-2" id="favbtns${t.id}">
                ${m(s.urlToFavs,e,t.id)}
              </div>
            </div>
          </div>
        </div>`):""},f=t=>t.id?`
        <div class="cell small-6">
          <div class="u-green-line-top u-margin-bottom">
            <p class="u-text-regular u-py-1"><strong><a href="${t.url}">${t.title}</a></strong></p>
            <div class="u-mb-1">${t.location} accommodation.</div>
            <div>${stir.favourites.isFavourite(t.id)?'<p class="text-sm u-heritage-green">Already in my favourites</p>':stir.favourites.renderAddBtn(t.id,"")}</div>
          </div>
        </div>`:"",y=t=>t?`
        <p><strong>Share link</strong></p>  
        ${navigator.clipboard?'<p class="text-xsm">The following share link has been copied to your clipboard:</p>':""}   
        <p class="text-xsm">${t}</p>`:"",h=t=>t.id?`<p class="text-sm"><strong><a href="${t.url}">${t.title}</a></strong></p>`:"",b=()=>stir.templates.renderNoFavs,A=()=>stir.templates.renderLinkToFavs,F=()=>stir.templates.renderNoShared,T=stir.curry((t,e)=>(stir.setHTML(t,e),!0)),$=t=>"string"!=typeof t?"":t.replace(/[^a-zA-Z0-9-_]/g,""),k={get:t=>$(QueryParams.get(t)),set:(t,e)=>QueryParams.set(t,$(e)),remove:QueryParams.remove},x=()=>stir.favourites.getFavsList(u.cookieType),w=t=>{return t.reduce((t,e)=>{var a=stir.favourites.getFavsList(e).map(t=>({...t,type:e}));return[...t,...a]},[]).sort((t,e)=>e.date-t.date).slice(0,4)},N=t=>{var e=k.get("a")||"";if(!e)return null;try{return atob(e).split(",").map(e=>({...t.find(t=>e===t.id),id:e}))}catch(t){return null}},B=t=>{var e=x();return e.length<1?null:e.sort((t,e)=>e.date-t.date).map(e=>({...t.find(t=>e.id===t.id),id:e.id,dateSaved:e.date}))},L=t=>t&&t.title;var s,i,o,d,l,n,r=a?.filter(t=>t.id&&t.id.length)||[];function v(t,a,e){const r=stir.favourites.getFavsList(t.cookieType).map(e=>a.find(t=>Number(t.id)===Number(e.id))).filter(L);var s=("micro"===(e.resultsArea.dataset.view||"")?p:g)(t);if("latestfavs"===e.resultsArea.dataset.activity){const r=w(t.allowedCookieTypes).map(e=>({...a.find(t=>Number(t.id)===Number(e.id)),type:e.type,dateSaved:e.date})).filter(L),i=r.map(s).join("");return T(e.resultsArea)(i||stir.templates.renderNoFavs)}const i=r.map(s).join("");T(e.resultsArea)(i||stir.templates.renderNoFavs)}function c(t,e,a){var r;t&&((r=N(a))?T(t,r.map(f).join("")):T(t,F())),e&&((r=B(a))?T(e,r.map(h).join("")+A()):T(e,b()))}t=r,a=u,r=e,"managefavs"!==a.activity&&"latestfavs"!==a.activity||v(a,t,r),"shared"===a.activity&&c(r.sharedArea,r.sharedfavArea,t),r.favBtnsNode&&stir.node("main").addEventListener("click",(s=a,i=t,o=r,t=>{var e,t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");if(t&&t.dataset&&t.dataset.action){if("clearallfavs"===t.dataset.action){if(t.dataset.fav!==s.cookieType)return;stir.favourites.removeType(s.cookieType),v(s,i,o)}"copysharelink"===t.dataset.action&&(t=x(),t="https://www.stir.ac.uk/sharefavs/"+btoa(t.map(t=>t.id).join(",")),navigator.clipboard&&navigator.clipboard.writeText(t),e=stir.t4Globals.dialogs.find(t=>"shareDialog"===t.getId()))&&(e.open(),e.setContent(y(t)))}})),r.resultsArea.addEventListener("click",(d=a,l=r,n=t,t=>{var e,t=t.target.closest("button");t&&t.dataset&&t.dataset.action&&(e=t=>{var e=stir.favourites.getFav(t,d.cookieType),a=stir.node("#favbtns"+t);a&&T(a)(m(d.urlToFavs,e,t)),l.sharedArea&&c(l.sharedArea,l.sharedfavArea,n)},"addtofavs"===t.dataset.action&&(stir.favourites.addToFavs(t.dataset.id,d.cookieType),e(t.dataset.id)),"removefav"===t.dataset.action)&&(stir.favourites.removeFromFavs(t.dataset.id),e(t.dataset.id),"managefavs"===d.activity)&&(e=stir.node("#fav-"+t.dataset.id))&&T(e)("")}))}};FavouritesArea(stir.node("#acccomArea"),"accom",accommodationData),FavouritesArea(stir.node("#courseArea"),"course",courseData),FavouritesArea(stir.node("#latestFavs"),"all",[...courseData,...accommodationData]);