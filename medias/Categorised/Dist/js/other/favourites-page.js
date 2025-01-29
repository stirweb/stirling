const FavouritesArea=(t,e,a)=>{if(t){var r=t.querySelector('[data-activity="managefavs"]');const u={cookieType:e,urlToFavs:r.dataset.favsurl||"",activity:r.dataset.activity||"",view:stir.templates?.view||""};e={resultsArea:r,favBtnsNode:t.querySelector('[data-area="favActionBtns"]')};const g=(t,e,a)=>e.length?stir.favourites.renderRemoveBtn(a,e[0].date,t):stir.favourites.renderAddBtn(a,t),p=i=>t=>{var e,a,r;return t?(e=stir.favourites.getFav(t.id,i.cookieType),`
        <div class="cell" id="fav-${t.id}">
          <div class="u-bg-white u-heritage-line-left u-border-width-5 u-mb-3">
            <div class="grid-x grid-padding-x u-p-2 ">
              <div class="cell u-pt-2">
                <p class="u-text-regular u-mb-2 "><strong><a href="${t.url}">${t.title}</a></strong></p>
              </div>
              <div class="cell ${t.img?"large-9":"large-12"}  text-sm">
                <p><strong>Content</strong></p> 
                ${t.content}
              </div>
              ${a=t.img,r=t.title,a?`<div class="cell large-3">
                <div><img src="${a}" width="760" height="470" alt="Image of ${r}" class="u-aspect-ratio-1-1 u-object-cover" /></div>
            </div>`:""}
              <div class="cell text-sm u-pt-2" id="favbtns${t.id}">
                ${g(i.urlToFavs,e,t.id)}
              </div>
            </div>
          </div>
        </div>`):""},m=t=>t.id?`
        <div class="cell small-6">
          <div class="u-green-line-top u-margin-bottom">
            <p class="u-text-regular u-py-1"><strong><a href="${t.url}">${t.title}</a></strong></p>
            <div class="u-mb-1">${t.location} accommodation.</div>
            <div>${stir.favourites.isFavourite(t.id)?'<p class="text-sm u-heritage-green">Already in my favourites</p>':stir.favourites.renderAddBtn(t.id,"")}</div>
          </div>
        </div>`:"",f=t=>t?`
        <p><strong>Share link</strong></p>  
        ${navigator.clipboard?'<p class="text-xsm">The following share link has been copied to your clipboard:</p>':""}   
        <p class="text-xsm">${t}</p>`:"",h=t=>t.id?`<p class="text-sm"><strong><a href="${t.url}">${t.title}</a></strong></p>`:"";const y=()=>stir.templates.renderNoFavs,b=()=>stir.templates.renderLinkToFavs,T=()=>stir.templates.renderNoShared,A=stir.curry((t,e)=>(stir.setHTML(t,e),!0)),$=t=>"string"!=typeof t?"":t.replace(/[^a-zA-Z0-9-_]/g,""),F={get:t=>$(QueryParams.get(t)),set:(t,e)=>QueryParams.set(t,$(e)),remove:QueryParams.remove},k=()=>stir.favourites.getFavsList(u.cookieType),x=t=>{var e=F.get("a")||"";if(!e)return null;try{return atob(e).split(",").map(e=>({...t.find(t=>e===t.id),id:e}))}catch(t){return null}},w=t=>{var e=k();return e.length<1?null:e.sort((t,e)=>e.date-t.date).map(e=>({...t.find(t=>e.id===t.id),id:e.id,dateSaved:e.date}))},N=t=>t&&t.title;var i,s,o,d,n,v,r=a?.filter(t=>t.id&&t.id.length)||[];function l(t,a,e){var r=stir.favourites.getFavsList(t.cookieType).map(e=>a.find(t=>Number(t.id)===Number(e.id))).filter(N),t=("micro"===t.view?renderMicro:p)(t),r=r.map(t).join("");A(e.resultsArea)(r||stir.templates.renderNoFavs)}function c(t,e,a){var r;t&&((r=x(a))?A(t,r.map(m).join("")):A(t,T())),e&&((r=w(a))?A(e,r.map(h).join("")+b()):A(e,y()))}t=r,a=u,r=e,"managefavs"===a.activity&&l(a,t,r),"shared"===a.activity&&c(r.sharedArea,r.sharedfavArea,t),r.favBtnsNode&&stir.node("main").addEventListener("click",(i=a,s=t,o=r,t=>{var e,t="BUTTON"===t.target.nodeName?t.target:t.target.closest("button");if(t&&t.dataset&&t.dataset.action){if("clearallfavs"===t.dataset.action){if(console.log(i.cookieType),t.dataset.fav!==i.cookieType)return;stir.favourites.removeType(i.cookieType),l(i,s,o)}"copysharelink"===t.dataset.action&&(t=k(),t="https://www.stir.ac.uk/sharefavs/"+btoa(t.map(t=>t.id).join(",")),navigator.clipboard&&navigator.clipboard.writeText(t),e=stir.t4Globals.dialogs.find(t=>"shareDialog"===t.getId()))&&(e.open(),e.setContent(f(t)))}})),r.resultsArea.addEventListener("click",(d=a,n=r,v=t,t=>{var e,t=t.target.closest("button");t&&t.dataset&&t.dataset.action&&(e=t=>{var e=stir.favourites.getFav(t,d.cookieType),a=stir.node("#favbtns"+t);a&&A(a)(g(d.urlToFavs,e,t)),n.sharedArea&&c(n.sharedArea,n.sharedfavArea,v)},"addtofavs"===t.dataset.action&&(stir.favourites.addToFavs(t.dataset.id,d.cookieType),e(t.dataset.id)),"removefav"===t.dataset.action)&&(stir.favourites.removeFromFavs(t.dataset.id),e(t.dataset.id),"managefavs"===d.activity)&&(e=stir.node("#fav-"+t.dataset.id))&&A(e)("")}))}};FavouritesArea(stir.node("#acccomArea"),"accom",accommodationData),FavouritesArea(stir.node("#courseArea"),"course",courseData);