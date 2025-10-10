!function(){const n=(e,t,r,a)=>{l=a,s=r.mediaquery;var s,i,l=(i=t)/c(l,s)%1==0||0===i;return`
        ${l&&0!==t?"</div>":""}
        ${l||1===a?'<div class="cell small-12 medium-6 large-4 u-padding-bottom">':""}
        ${s=e,i=e.title.split(" | ")[0].trim(),r.urlBase,e.clickTrackingUrl,t=s.custom_fields,`
          <!-- Start testimonial result -->
            <div class="u-mb-2 u-bg-grey ">
              ${u(i,t.profileMedia)?u(i,t.profileMedia):((e,t)=>{if(!e)return``;const r=`https://www.stir.ac.uk${e}`;return`<img src="${r}" alt="${t}" class="u-object-cover u-aspect-ratio-1-1" loading="lazy" width=500 height=500  />`})(t.profileImage,i)}
                <div class="u-p-2">
                  <p class="u-font-bold ">${i}</p>
                  ${t.profileCountry||t.profileDegreeTitle?"<cite>":""}
                  ${t.profileCountry?`<span class="info">${t.profileCountry} </span><br />`:""}
                  ${t.profileDegreeTitle?`<span class="info">${t.profileDegreeTitle}</span>`:""}
                  ${t.profileCountry||t.degreeTitle?"</cite>":""}
                  ${t.profileSnippet?`<blockquote class="u-border-none u-my-2 u-black u-p-0 u-quote u-text-regular">${t.profileSnippet}</blockquote>`:""}
                  <a href="${s.url}" class="c-link">View ${t=i.trim(),"s"===t.slice(-1)?t+"’":t+"’s"} story</a>
                </div> 
            </div> 
          <!-- End testimonial result -->`} `},u=(e,t)=>t&&t.includes("a_vid")?`
        <div class="u-bg-grey">
            <div id="vimeoVideo-${t.split("-")[1]}" class="responsive-embed widescreen " 
                data-videoembedid=" myvid " data-vimeo-initialized="true">
                <iframe src="https://player.vimeo.com/video/${t.split("-")[1]}?app_id=122963" 
                    allow="autoplay; fullscreen" allowfullscreen="" title="Testimonial of 
                    ${e} " data-ready="true" width="426" height="240" frameborder="0">
                </iframe>
            </div>
        </div>`:"",o=(t,e)=>e.map(e=>`customField=${t}%3D`+e).join("&"),c=(e,t)=>Math.round(e/(e=>{switch(e){case"medium":return 2;case"small":return 1;case"large":return 3;default:return 3}})(t)),t=(e,t)=>{var r;return e&&(e=e.replaceAll("|[","").replaceAll("]","")).includes(":")&&([e,r]=e.split(":"),e===t)?r:""},d=e=>t(e,"subject"),m=e=>{e=t(e,"faculty");return e?"Management"===e?"Stirling Business School":"Faculty of "+e:""},p=(e,t)=>{e=e||"";return"United Kingdom"===e?t.macroUK:e},g=stir.curry((e,t,r)=>1!==t?e.resultsArea.insertAdjacentHTML("beforeend",r):(stir.setHTML(e.resultsArea,r),stir.scrollToElement(e.searchForm,-50),!0)),v=(e,t,r)=>{var a,s,i,l;return e.error?g(t,1,stir.getprocessDatatenanceMsg()):0<e.total_hits?({start:l,end:i}=(l=e.page,i=r.postsPerPage,isNaN(l)||isNaN(i)?{start:1,end:9}:{start:l=1===Number(l)?1:(Number(l)-1)*Number(i)+1,end:l+Number(i)-1}),l={...{page:e.page,currStart:l,currEnd:i,total:e.total_hits},...r},g(t,e.page,(a=l,s=e.hits,`
          <div class="cell text-center u-pb-2">
            ${(e=>{const t=e.currEnd>e.total?e.total:e.currEnd;return`<p>Showing ${e.currStart}-${t} of <strong>${e.total} results</strong></p>`})(a)}
          </div>
          <div class="cell">
            <div class="grid-x grid-padding-x">
              ${stir.map((e,t)=>n(e,t,a,s.length),s).join("")}
              </div>
          </div>
          <div class="cell">
            <div class="grid-x grid-padding-x" id="pagination-box">
              ${i=a.page+1,r=a.total,l=a.currEnd,r<=l?"":`<div class="cell text-center">
                <button class="button hollow tiny" data-page="${i}">Load more results</button>
          </div>`}
            <div>
          </div>`))):g(t,1,`
          <div class="cell">
              <p class="text-center">We don't have any student stories that match those filters.</p> 
              <p class="text-center"><button class="resetBtn button">Start a new search</button</p>
          </div>`)},r=(e,t)=>{e.inputRegion.value=QueryParams.get("region")?QueryParams.get("region"):"",e.inputLevel.value=QueryParams.get("level")?QueryParams.get("level"):"",e.inputSubject.value=QueryParams.get("subject")?QueryParams.get("subject"):"!padrenullquery",e.inputOnline.checked="online"===QueryParams.get("mode");var r,a,s,i,l=QueryParams.get("page")?Number(QueryParams.get("page")):1;s=t.searchUrl,i=t,i={profileCountry:p(QueryParams.get("region"),i),profileLevel:QueryParams.get("level")?QueryParams.get("level"):"",profileOnliner:"online"===QueryParams.get("mode")?"online":"",profileSubject:d(QueryParams.get("subject")),profileFaculty:m(QueryParams.get("subject"))},s=s+`&page=${l}&`+Object.entries(i).map(([e,t])=>o(e,t.split("|")).replace(/&$/,"")).join("&"),r=e,a=t,stir.getJSON(s,t=>{v(t,r,{...a,mediaquery:stir.MediaQuery.current}),window.addEventListener("MediaQueryChange",e=>{v(t,r,{...a,mediaquery:stir.MediaQuery.current})})})};const a={postsPerPage:9,macroUK:"United Kingdom|Wales|England|Scotland|Northern Ireland",urlBase:"https://www.stir.ac.uk/",searchUrl:`https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de?term=*&limit=9&customField=stirType%3Dstudentstory&sort=custom_fields.profileSort&${o("profileTags",["alum","student"])}&`,onlineText:""},s=(Object.freeze(a),{resultsArea:stir.node("#testimonials-search__results"),searchForm:stir.node("#testimonials-search__form"),searchLoading:stir.node(".c-search-loading-fixed"),inputLevel:stir.node("#testimonials-search__level"),inputSubject:stir.node("#testimonials-search__subject"),inputRegion:stir.node("#testimonials-search__nationality"),inputOnline:stir.node("#testimonials-search__online")});s.resultsArea&&s.searchForm&&(r(s,a),s.resultsArea.addEventListener("click",e=>{e.target.matches("button.resetBtn")?(stir.each(e=>QueryParams.remove(e.name),QueryParams.getAllArray()),r(s,a),e.preventDefault()):e.target.matches("#pagination-box button")&&(e.target.classList.add("hide"),QueryParams.set("page",e.target.getAttribute("data-page")),r(s,a))},!1),s.searchForm.addEventListener("submit",e=>{QueryParams.set("page",1),QueryParams.set("region",s.inputRegion.value),QueryParams.set("subject",s.inputSubject.value),QueryParams.set("level",s.inputLevel.value),s.inputOnline.checked?QueryParams.set("mode","online"):QueryParams.set("mode",""),r(s,a),e.preventDefault()},!1))}();