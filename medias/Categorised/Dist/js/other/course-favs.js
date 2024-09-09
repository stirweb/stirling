var stir=stir||{};stir.coursefavs=(()=>{if(!stir.favourites)return console.error("[Course Favourites] stir.favourites library not loaded");var a={favsArea:stir.node("#coursefavsarea"),favBtns:stir.node("#coursefavbtns"),sharedArea:stir.node("#coursesharedarea"),sharedfavArea:stir.node("#coursesharedfavsarea")};const e="course";const t="https://search.stir.ac.uk/s/search.json?collection=stir-courses&query=!nullpadre&fmo=true&num_ranks=2000&SF=["+["c","award","code","delivery","faculty","image","level","modes","pathways","sid","start","subject","ucas"].join(",")+"]&",s=a=>a.metaData?`<p class="text-sm">
            <strong><a href="${a.liveUrl}" title="${a.metaData.award||""} ${a.title}">${a.metaData.award||""} ${a.title} ${a.metaData.ucas?" - "+a.metaData.ucas:""}</a></strong>
        </p>`:"",r=(a,t,e)=>t?`<div class="cell medium-4"><strong class="u-heritage-green">${a}</strong><p class="${e}">${t.split("|").join(", ")}</p></div>`:"",i=stir.curry(a=>a.metaData?`<div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank="" data-sid="${a.metaData.sid}" data-result-type="course">
            <div class=" c-search-result__tags">
              <span class="c-search-tag">${a.metaData.level.replace("module","CPD and short courses")}</span>
            </div>
            <div class="flex-container flex-dir-column u-gap u-mt-1">
              <p class="u-text-regular u-m-0">
                <strong><a href="${a.liveUrl}" title="${a.metaData.award||""} ${a.title}">${a.metaData.award||""} ${a.title} ${a.metaData.ucas?" - "+a.metaData.ucas:""}</a></strong>
              </p>
              <p class="u-m-0">${a.metaData.c}</p>
              <div class="c-search-result__meta grid-x u-mt-1">
                ${r("Start dates",a.metaData.start,"")}
                ${r("Study modes",a.metaData.modes,"u-sentence-case")}
                ${r("Delivery",a.metaData.delivery,"u-sentence-case")}
             </div>
            </div>
            <div class="flex-container align-middle u-gap-8 u-mt-1">
             ${stir.favourites.renderRemoveBtn(a.metaData.sid,a.dateSaved,"")}
            </div>
          </div>`:""),d=stir.curry(a=>a.metaData?`<div class="cell large-4  "  data-sid="${a.metaData.sid}" > 
            <div class="u-green-line-top">
                  <div class="flex-container flex-dir-column u-gap u-mt-1">
                    <p class=" u-m-0">
                      <strong><a href="${a.liveUrl}" title="${a.metaData.award||""} ${a.title}">${a.metaData.award||""} ${a.title} ${a.metaData.ucas?" - "+a.metaData.ucas:""}</a></strong>
                    </p>
                    <p class="u-m-0 text-sm">${a.metaData.c}</p>
                  </div>
                  <div class="flex-container align-middle u-gap-8 u-mt-1">
                  ${stir.favourites.renderRemoveBtn(a.metaData.sid,a.dateSaved,"")}
                  </div>
            </div>
          </div>`:""),o=()=>stir.templates.renderNoFavs,n=a=>a.metaData?`<div class="cell small-6">
            <div class="u-green-line-top u-margin-bottom">
              <p class="u-text-regular u-py-1">
                <strong><a href="${a.liveUrl}" title="${a.metaData.award||""} ${a.title}">${a.metaData.award||""} ${a.title}</a></strong>
              </p>
              <div class="u-mb-1">${a.metaData.c}</div>
              <div>${stir.favourites.isFavourite(a.metaData.sid)?'<p class="text-sm u-heritage-green">Already in my favourites</p>':stir.favourites.renderAddBtn(a.metaData.sid,"")}</div>
            </div>
          </div>`:"",l=a=>a?` <p><strong>Share link</strong></p>  
          ${navigator.clipboard?'<p class="text-xsm">The following share link has been copied to your clipboard:</p>':""}   
          <p class="text-xsm">${a}</p>`:"",v=stir.curry((a,t)=>(stir.setHTML(a,t),!0)),u=a=>"string"!=typeof a?"":a.replace(/[^a-zA-Z0-9-_]/g,""),c={get:a=>u(QueryParams.get(a)),set:(a,t)=>QueryParams.set(a,u(t)),remove:QueryParams.remove},m=()=>stir.favourites.getFavsList(e),p=a=>stir.favourites.isFavourite(a),f=a=>{var t=m();return t.length?t.sort((a,t)=>t.date-a.date).map(t=>({...a.find(a=>a.metaData&&a.metaData.sid===t.id),id:t.id,dateSaved:t.date})):null},g=stir.curry((a,t)=>{var e;if(a&&a.favsArea)return t=f(t),e="micro"===(stir.templates&&stir.templates.view?stir.templates.view:"")?d:i,t?(a.favBtns&&v(a.favBtns,stir.templates.renderFavActionBtns),v(a.favsArea,t.map(e).join(""))):!v(a.favsArea,o())})(a),h=stir.curry((a,t)=>{var e;a&&(a.sharedArea&&(e=(a=>{var t=c.get("c")||"";if(!t)return null;try{return atob(t).split(",").map(t=>({...a.find(a=>a.metaData&&a.metaData.sid===t),id:t}))}catch(a){return null}})(t),v(a.sharedArea,e?e.map(n).join(""):stir.templates.renderNoShared)),a.sharedfavArea)&&(e=f(t),v(a.sharedfavArea,e?e.map(s).join("")+stir.templates.renderLinkToFavs:o()))})(a),$=t=>{var a,e,s=t.closest("[data-nodeid=coursefavsbtn]")||t;s&&(a=m().find(a=>a.id===t.dataset.id),e=s.dataset.favsurl||"",v(s,a?stir.favourites.renderRemoveBtn(a.id,a.date,e):stir.favourites.renderAddBtn(t.dataset.id,e)))},D={},y=a=>{const t="BUTTON"===a.target.nodeName?a.target:a.target.closest("button");t&&t.dataset&&t.dataset.action&&(a={addtofavs:()=>{p(t.dataset.id)||stir.favourites.addToFavs(t.dataset.id,e),D.doShared&&D.doShared(),D.doFavs&&D.doFavs(),$(t)},removefav:()=>{var a=t.dataset.id;a&&(stir.favourites.removeFromFavs(a),D.doFavs&&D.doFavs(),$(t.parentElement))},clearallfavs:()=>{stir.favourites.removeType(e),D.doFavs&&D.doFavs()},copysharelink:()=>{var a=m(),a="https://www.stir.ac.uk/share/"+btoa(a.map(a=>a.id).join(",")),t=(navigator.clipboard&&navigator.clipboard.writeText(a),stir.t4Globals.dialogs.find(a=>"shareDialog"===a.getId()));t&&(t.open(),t.setContent(l(a)))}}[t.dataset.action])&&a()};return{auto:()=>{var a;a=t,stir.getJSON(a,a=>{const t=a.response.resultPacket.results||[];D.doFavs=()=>g(t),D.doShared=()=>h(t),D.doShared(),D.doFavs(),stir.node("main").addEventListener("click",y)})},isFavourite:p,doCourseBtn:$,createCourseBtnHTML:(a,t)=>{var e=document.createElement("div");return e.setAttribute("data-id",a),e.setAttribute("data-favsurl",t),$(e),e.innerHTML},attachEventHandlers:()=>stir.node("main").addEventListener("click",y)}})();const shouldAutoInit=[()=>stir.node("#coursefavsarea"),()=>stir.node("#coursesharedarea"),()=>stir.nodes("#coursefavsbtn").length].some(a=>a());shouldAutoInit&&stir.coursefavs.auto();