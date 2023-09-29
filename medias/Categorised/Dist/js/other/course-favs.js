var stir=stir||{};stir.favs=(()=>{var a={coursefavsbtns:stir.nodes('[data-nodeid="coursefavsbtn"]'),favsArea:stir.node("#coursefavsarea"),favBtns:stir.node("#coursefavbtns"),sharedArea:stir.node("#coursesharedarea"),sharedfavArea:stir.node("#coursesharedfavsarea")};const s="favs=",r=365;const e="https://search.stir.ac.uk/s/search.json?collection=stir-courses&query=!nullpadre&fmo=true&num_ranks=2000&SF=["+["c","award","code","delivery","faculty","image","level","modes","pathways","sid","start","subject","ucas"].join(",")+"]&",i=a=>a.metaData?`<p class="text-sm">
            <strong><a href="${a.liveUrl}" title="${a.metaData.award||""} ${a.title}">${a.metaData.award||""} ${a.title} ${a.metaData.ucas?" - "+a.metaData.ucas:""}</a></strong>
           </p>`:"",t=(a,e,t)=>e?`<div class="cell medium-4"><strong class="u-heritage-green">${a}</strong><p class="${t}">${e.split("|").join(", ")}</p></div>`:"",o=stir.curry(a=>a.metaData?`
          <div class="u-border-width-5 u-heritage-line-left c-search-result" data-rank="" data-sid="${a.metaData.sid}" data-result-type="course">
            <div class=" c-search-result__tags">
              <span class="c-search-tag">${a.metaData.level.replace("module","CPD and short courses")}</span>
            </div>
      
            <div class="flex-container flex-dir-column u-gap u-mt-1">
              <p class="u-text-regular u-m-0">
                <strong><a href="${a.liveUrl}" title="${a.metaData.award||""} ${a.title}">${a.metaData.award||""} ${a.title} ${a.metaData.ucas?" - "+a.metaData.ucas:""}</a></strong>
              </p>
              <p class="u-m-0">${a.metaData.c}</p>
              
              <div class="c-search-result__meta grid-x u-mt-1">
                ${t("Start dates",a.metaData.start,"")}
                ${t("Study modes",a.metaData.modes,"u-sentence-case")}
                ${t("Delivery",a.metaData.delivery,"u-sentence-case")}
             </div>
            </div>
      
            <div class="flex-container align-middle u-gap-8 u-mt-1">
             ${n(a.metaData.sid,a.dateSaved)}
            </div>
          </div>`:""),n=(a,e)=>` 
          <button id="removefavbtn-${a}" class="u-heritage-green  u-cursor-pointer flex-container u-gap-8 align-middle" aria-label="Remove from favourites" data-action="removefav" data-id="${a}">
            ${c()}
          </button>
          <span>Favourited ${m(new Date(e))}</span>`,d=()=>`
            <p><strong>Nothing saved here yet</strong></p>
            <p>This might be because:</p>
            <ul>
                <li>you haven't selected any favourite <a href="/courses/">courses</a> yet,</li>
                <li>you cleared all your favourites from the list,</li>
                <li>or your web browser is automatically clearing the cookie which remembers your list of favourites.</li>
            </ul>`,l=()=>`<svg version="1.1" data-stiricon="heart-active" fill="currentColor"
              viewBox="0 0 50 50" style="width:22px;height:22px;" >
              <path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2c0,0-0.1,0-0.1,0c-3,0-5.8,1.2-7.9,3.4
               c-4.3,4.5-4.2,11.7,0.2,16l18.1,18.1c0.5,0.5,1.6,0.5,2.1,0l17.9-17.9c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
               C47.5,15,46.3,12.2,44.1,10.1z M42,24.2l-17,17l-17-17c-3.3-3.3-3.3-8.6,0-11.8c1.6-1.6,3.7-2.4,5.9-2.4c2.2-0.1,4.4,0.8,6,2.5
               l4.1,4.1c0.6,0.6,1.5,0.6,2.1,0l4.2-4.2c3.4-3.2,8.5-3.2,11.8,0C45.3,15.6,45.3,20.9,42,24.2z"/>
            </svg>`,c=()=>`<svg version="1.1" data-stiricon="heart-inactive"  fill="currentColor" 
             viewBox="0 0 50 50" style="width:22px;height:22px;" >
            <path d="M44.1,10.1c-4.5-4.3-11.7-4.2-16,0.2L25,13.4l-3.3-3.3c-2.2-2.1-5-3.2-8-3.2h-0.1c-3,0-5.8,1.2-7.9,3.4
        c-4.3,4.5-4.2,11.7,0.2,16L24,44.4c0.5,0.5,1.6,0.5,2.1,0L44,26.5c0.1-0.2,0.3-0.4,0.5-0.5c2-2.2,3.1-5,3.1-7.9
        C47.5,15,46.3,12.2,44.1,10.1z"/>
           </svg> `,u=a=>a.metaData?`<div class="cell small-6">
            <div class="u-green-line-top u-margin-bottom">
              <p class="u-text-regular u-py-1">
              <strong><a href="${a.liveUrl}" title="${a.metaData.award||""} ${a.title}">${a.metaData.award||""} ${a.title}</a></strong>
              </p>
              <div class="u-mb-1">${a.metaData.c}</div>
              <${b(a.metaData.sid)?"div":"button"}  class="u-w-full u-heritage-green ${b(a.metaData.sid)?"":"u-heritage-green u-cursor-pointer "}u-mt-1 flex-container u-gap-8 align-middle" data-action="${b(a.metaData.sid)?"":"addtofavs"}" data-id="${a.metaData.sid}">
              ${(b(a.metaData.sid)?c:l)()}
              <span class="u-heritage-green${b(a.metaData.sid)?"":" u-underline u-line-height-default"}">
              ${b(a.metaData.sid)?"Already in my favourites":"Add to my favourites"}
              </span>
              </${b(a.metaData.sid)?"div":"button"}>
            </div>
          </div>`:"",v=a=>a?` <p><strong>Share link</strong></p>  
          ${navigator.clipboard?'<p class="text-xsm">The following share link has been copied to your clipboard:</p>':""}   
          <p class="text-xsm">${a}</p>`:"",m=a=>{var e=new Date,e=(a.setHours(0,0,0,0),e.setHours(0,0,0,0),Math.floor((+e-+a)/864e5));return 0===e?"today":e+` ${1<e?"days":"day"} ago`},h=stir.curry((a,e)=>(stir.setHTML(a,e),!0)),p=a=>{var e=new Date;return e.setTime(e.getTime()+24*a*60*60*1e3),";expires="+e.toUTCString()},g=e=>{var a=document.cookie.split(";").filter(a=>a.includes(e)).map(a=>a.replace(e,""));return a.length?JSON.parse(a):[]},f=()=>g(s),b=a=>f().map(a=>a.id).includes(a),$=a=>{var e=f();return!e.length||e.length<1?null:e.sort((a,e)=>e.date-a.date).map(e=>({...a.filter(a=>{if(e.id===a.metaData.sid)return a})[0],id:e.id,dateSaved:e.date}))},y=stir.curry((a,e)=>{if(a&&a.favsArea)return(e=$(e))?(a.favBtns&&h(a.favBtns,`
          <button class="button no-arrow button--left-align  expanded u-m-0 text-left  u-white--all u-mt-1" data-opendialog="shareDialog" aria-label="Generate share link" data-action="copysharelink" >
              <div class="flex-container align-middle u-gap-16">
                  <span class="u-flex1 text-sm">Generate share link</span>
                  <span class="uos-chevron-right u-icon"></span>
              </div>
          </button>

          <button class="button no-arrow button--left-align  expanded u-m-0 text-left u-bg-black u-white--all u-mt-1" aria-label="Clear favourites"  data-action="clearallfavs" >
              <div class="flex-container align-middle u-gap-16">
                  <span class="u-flex1 text-sm">Clear favourites</span>
                  <span class="uos-chevron-right u-icon"></span>
              </div>
          </button>`),h(a.favsArea,e.map(o).join(""))):!h(a.favsArea,d())})(a),D=stir.curry((a,e)=>{var t;a&&(a.sharedArea&&((t=(a=>{var e=QueryParams.get("c")||"";try{return atob(e).split(",").map(e=>({...a.filter(a=>{if(e===a.metaData.sid)return a})[0],id:e}))}catch(a){}})(e))?h(a.sharedArea,t.map(u).join("")):h(a.sharedArea,'<div class="cell"><p>No courses have been shared with you.</p><p><a href="/courses/">Main course search</a></p></div>')),a.sharedfavArea)&&((t=$(e))?h(a.sharedfavArea,t.map(i).join("")+'<hr><p class="text-sm u-arrow"><a href="/courses/favourites/">Manage my favourites</a></p>'):h(a.sharedfavArea,d()))})(a),x=e=>{var a;e&&e.dataset&&e.dataset.id&&((a=f().filter(a=>a.id===e.dataset.id)).length?h(e,n(a[0].id,a[0].date)):h(e,` 
          <button
              class="u-heritage-green u-cursor-pointer u-line-height-default flex-container u-gap-8 align-middle"
              data-action="addtofavs" aria-label="Add to your favourites" data-id="${a=e.dataset.id}" id="addfavbtn-${a}">
              ${l()}
              <span class="u-heritage-green u-underline u-inline-block u-pb-1">Add
                  to your favourites</span>
          </button>`))};const w={},k=()=>{var a;a=e,stir.getJSON(a,a=>{w.doFavs=()=>{y(a.response.resultPacket.results||[])},w.doShared=()=>{D(a.response.resultPacket.results||[])},w.doShared(),w.doFavs(),S()})};function A(a){var e,a="BUTTON"===a.target.nodeName?a.target:a.target.closest("button");if(a&&a.dataset&&a.dataset.action){if("addtofavs"===a.dataset.action&&(b(a.dataset.id)||(e=[...f(),{id:a.dataset.id,date:Date.now()}],document.cookie=s+JSON.stringify(e)+p(r)+";path=/"),w.doShared&&w.doShared(),w.doFavs&&w.doFavs(),x(a.parentElement)),"removefav"===a.dataset.action){const t=a.dataset.id||null;t&&t.length&&(e=JSON.stringify(f().filter(a=>a.id!==t)),document.cookie=s+e+p(r)+";path=/",w.doFavs&&w.doFavs(),x(a.parentElement))}"clearallfavs"===a.dataset.action&&(document.cookie=s+JSON.stringify([])+p(0)+";path=/",w.doFavs)&&w.doFavs(),"copysharelink"===a.dataset.action&&(e=f(),a="https://www.stir.ac.uk/share/"+btoa(e.map(a=>a.id).join(",")),navigator.clipboard&&navigator.clipboard.writeText(a),(e=stir.t4Globals.dialogs.filter(a=>"shareDialog"===a.getId())).length)&&(e[0].open(),e[0].setContent(v(a)))}}function S(){stir.node("main").addEventListener("click",A)}return{auto:()=>k(),isFavourite:b,doCourseBtn:x,createCourseBtnHTML:a=>{var e=document.createElement("div");return e.setAttribute("data-id",a),x(e),e.innerHTML},attachEventHandlers:S}})(),(stir.node("#coursefavsarea")||stir.node("#coursesharedarea")||stir.nodes("#coursefavsbtn").length)&&stir.favs.auto();