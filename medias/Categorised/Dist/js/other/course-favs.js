var stir=stir||{};stir.coursefavs=(()=>{var a={favsArea:stir.node("#coursefavsarea"),favBtns:stir.node("#coursefavbtns"),sharedArea:stir.node("#coursesharedarea"),sharedfavArea:stir.node("#coursesharedfavsarea")};const e="course";const t="https://search.stir.ac.uk/s/search.json?collection=stir-courses&query=!nullpadre&fmo=true&num_ranks=2000&SF=["+["c","award","code","delivery","faculty","image","level","modes","pathways","sid","start","subject","ucas"].join(",")+"]&",s=a=>a.metaData?`<p class="text-sm">
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
          </div>`:""),d=()=>stir.templates.renderNoFavs,o=a=>a.metaData?`<div class="cell small-6">
            <div class="u-green-line-top u-margin-bottom">
              <p class="u-text-regular u-py-1">
              <strong><a href="${a.liveUrl}" title="${a.metaData.award||""} ${a.title}">${a.metaData.award||""} ${a.title}</a></strong>
              </p>
              <div class="u-mb-1">${a.metaData.c}</div>
              <div>
                ${stir.favourites.isFavourite(a.metaData.sid)?'<p class="text-sm">Already in my favourites</p>':stir.favourites.renderAddBtn(a.metaData.sid,"")}
              </div>
            </div>
          </div>`:"",n=a=>a?` <p><strong>Share link</strong></p>  
          ${navigator.clipboard?'<p class="text-xsm">The following share link has been copied to your clipboard:</p>':""}   
          <p class="text-xsm">${a}</p>`:"";const l=stir.curry((a,t)=>(stir.setHTML(a,t),!0)),c=()=>stir.favourites.getFavsList(e),v=()=>c(),u=a=>stir.favourites.isFavourite(a),m=a=>{var t=v();return!t.length||t.length<1?null:t.sort((a,t)=>t.date-a.date).map(t=>({...a.filter(a=>{if(t.id===a.metaData.sid)return a})[0],id:t.id,dateSaved:t.date}))},f=stir.curry((a,t)=>{if(a&&a.favsArea)return(t=m(t))?(a.favBtns&&l(a.favBtns,stir.templates.renderFavActionBtns),l(a.favsArea,t.map(i).join(""))):!l(a.favsArea,d())})(a),p=stir.curry((a,t)=>{var e;a&&(a.sharedArea&&((e=(a=>{var t=QueryParams.get("c")||"";if(!t)return null;try{return atob(t).split(",").map(t=>({...a.filter(a=>{if(t===a.metaData.sid)return a})[0],id:t}))}catch(a){}})(t))?l(a.sharedArea,e.map(o).join("")):l(a.sharedArea,stir.templates.renderNoShared)),a.sharedfavArea)&&((e=m(t))?l(a.sharedfavArea,e.map(s).join("")+stir.templates.renderLinkToFavs):l(a.sharedfavArea,d()))})(a),h=t=>{var a,e,s=t.closest("[data-id]");s&&(a=v().filter(a=>a.id===t.dataset.id),e=s.dataset.favsurl||"",a.length?l(s,stir.favourites.renderRemoveBtn(a[0].id,a[0].date,e)):l(s,stir.favourites.renderAddBtn(t.dataset.id,e)))},g={},$=()=>{var a;a=t,stir.getJSON(a,a=>{g.doFavs=()=>{f(a.response.resultPacket.results||[])},g.doShared=()=>{p(a.response.resultPacket.results||[])},g.doShared(),g.doFavs(),y()})};function D(a){var t,a="BUTTON"===a.target.nodeName?a.target:a.target.closest("button");a&&a.dataset&&a.dataset.action&&("addtofavs"===a.dataset.action&&(u(a.dataset.id)||stir.favourites.addToFavs(a.dataset.id,e),g.doShared&&g.doShared(),g.doFavs&&g.doFavs(),h(a)),"removefav"===a.dataset.action&&(t=a.dataset.id||null)&&t.length&&(stir.favourites.removeFromFavs(t),g.doFavs&&g.doFavs(),h(a.parentElement)),"clearallfavs"===a.dataset.action&&(stir.favourites.removeType(e),g.doFavs)&&g.doFavs(),"copysharelink"===a.dataset.action)&&(t=v(),a="https://www.stir.ac.uk/share/"+btoa(t.map(a=>a.id).join(",")),navigator.clipboard&&navigator.clipboard.writeText(a),(t=stir.t4Globals.dialogs.filter(a=>"shareDialog"===a.getId())).length)&&(t[0].open(),t[0].setContent(n(a)))}function y(){stir.node("main").addEventListener("click",D)}return{auto:()=>$(),isFavourite:u,doCourseBtn:h,createCourseBtnHTML:a=>{var t=document.createElement("div");return t.setAttribute("data-id",a),h(t),t.innerHTML},attachEventHandlers:y}})(),stir.favs=stir.coursefavs,(stir.node("#coursefavsarea")||stir.node("#coursesharedarea")||stir.nodes("#coursefavsbtn").length)&&stir.coursefavs.auto();