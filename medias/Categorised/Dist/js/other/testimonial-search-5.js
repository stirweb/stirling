!function(){var e="search.stir.ac.uk",r="https://"+e;const t=stir.curry((e,r)=>`https://${e}/s/scale?url=${encodeURIComponent(r)}&width=500&height=500&format=jpeg&type=crop_center`)(e);const s={postsPerPage:9,noOfPageLinks:9,macroUK:'["United Kingdom" "Wales" "England" "Scotland" "Northern Ireland"]',urlBase:r,jsonUrl:"https://search.stir.ac.uk/s/search.json?collection=stir-www&query=!padre&meta_profileTags=[[student alum]]&sort=metaprofileImage&fmo=true&num_ranks=9&SF=[profileDegreeTitle,profileCountry,profileCourse,profileCourse1,profileCourse1Url,profileCourse1Modes,profilecourse1Delivery,profileCourse2,profileCourse2Url,profilecourse2Delivery,profileCourse2Modes,profileFaculty,profileSubject,profileYearGraduated,profileLevel,profileTags,profileSnippet,profileImage,profileMedia]&meta_v=/student-stories/&",onlineText:"online&meta_profilecourse1Delivery_or=hybrid"},a=(Object.freeze(s),{resultsArea:stir.node("#testimonials-search__results"),searchForm:stir.node("#testimonials-search__form"),searchLoading:stir.node(".c-search-loading-fixed"),inputLevel:stir.node("#testimonials-search__level"),inputSubject:stir.node("#testimonials-search__subject"),inputRegion:stir.node("#testimonials-search__nationality"),inputOnline:stir.node("#testimonials-search__online")});if(!a.resultsArea||!a.searchForm)return;const l=(e,r,t)=>{var s,a,i;return e.error?b(r,1,stir.getMaintenanceMsg()):null!==(s=e).response.resultPacket&&0<s.response.resultPacket.results.length?(s={...e.response.resultPacket.resultsSummary,...t},b(r,p(s.currStart,s.numRanks),(a=s,i=e.response.resultPacket.results,`
          <div class="cell text-center u-pb-2">
            ${u(a)}
          </div>
          <div class="cell">
            <div class="grid-x grid-padding-x">
              ${stir.map((e,r)=>n(e,r,a,i.length),i).join("")}
              </div>
          </div>
          <div class="cell">
            <div class="grid-x grid-padding-x" id="pagination-box">
              ${o(p(a.currStart,a.numRanks)+1,a.fullyMatching,a.currEnd)}
            <div>
          </div>`))):b(r,1,`
          <div class="cell">
              <p class="text-center">We don't have any student stories that match those filters.</p> 
              <p class="text-center"><button class="resetBtn button">Start a new search</button</p>
          </div>`)},o=(e,r,t)=>r<=t?"":`<div class="cell text-center">
                <button class="button hollow tiny" data-page="${e}">Load more results</button>
          </div>`,n=(e,r,t,s)=>{l=s,a=t.mediaquery;var a,i,l=(i=r)/m(l,a)%1==0||0===i;return`
        ${l&&0!==r?"</div>":""}
        ${l||1===s?'<div class="cell small-12 medium-6 large-4 u-padding-bottom">':""}
        ${a=e.metaData,i=e.title.split(" | ")[0].trim(),r=t.urlBase+e.clickTrackingUrl,`
          <!-- Start testimonial result -->
            <div class="u-mb-2 u-bg-grey ">
              ${c(a,i,a.profileMedia)?c(a,i,a.profileMedia):d(a.profileImage,i)}
                <div class="u-p-2">
                  <p class="u-font-bold ">${i}</p>
                  ${a.profileCountry||a.profileDegreeTitle?"<cite>":""}
                  ${a.profileCountry?`<span class="info">${a.profileCountry} </span><br />`:""}
                  ${a.profileDegreeTitle?`<span class="info">${a.profileDegreeTitle}</span>`:""}
                  ${a.profileCountry||a.degreeTitle?"</cite>":""}
                  ${a.profileSnippet?`<blockquote class="u-border-none u-my-2 u-black u-p-0 u-quote u-text-regular">${a.profileSnippet}</blockquote>`:""}
                  
                  <a href="${r}" class="c-link">View ${g(i.trim())} story</a>
                </div> 
            </div> 
          <!-- End testimonial result -->`} `},u=e=>`<p>Showing ${e.currStart}-${e.currEnd} of <strong>${e.fullyMatching} results</strong></p>`,c=(e,r,t)=>t&&t.includes("a_vid")?`
        <div class="u-bg-grey">
            <div id="vimeoVideo-${e.profileMedia.split("-")[1]}" class="responsive-embed widescreen " 
                data-videoembedid=" myvid " data-vimeo-initialized="true">
                <iframe src="https://player.vimeo.com/video/${e.profileMedia.split("-")[1]}?app_id=122963" 
                    allow="autoplay; fullscreen" allowfullscreen="" title="Testimonial of 
                    ${r} " data-ready="true" width="426" height="240" frameborder="0">
                </iframe>
            </div>
        </div>`:"",d=(e,r)=>{return e?(e="https://www.stir.ac.uk"+e,`<img src="${t(e)}" alt="${r}"  loading="lazy" width=500 height=500 onerror="this.onerror='';this.src='${e}'" />`):""},p=(e,r)=>Math.floor(e/r+1),m=(e,r)=>Math.round(e/(e=>{switch(e){case"medium":return 2;case"small":return 1;case"large":return 3;default:return 3}})(r)),g=e=>"s"===e.slice(-1)?e+"’":e+"’s",f=(e,r)=>stir.isNumeric(e)?(e-1)*r+1:1,v=e=>e&&!(e.split(":").length<2)&&"|[subject"===e.split(":")[0]?e.split(":")[1]:"",y=e=>e&&!(e.split(":").length<2)&&"|[faculty"===e.split(":")[0]?e.split(":")[1]:"",h=(e,r)=>{e=e||"";return"United Kingdom"===e?r.macroUK:e},b=stir.curry((e,r,t)=>1!==r?e.resultsArea.insertAdjacentHTML("beforeend",t):(stir.setHTML(e.resultsArea,t),stir.scrollToElement(e.searchForm,-50),!0)),i=(e,r)=>{var t,s,a,i;e.inputRegion.value=QueryParams.get("region")?QueryParams.get("region"):"",e.inputLevel.value=QueryParams.get("level")?QueryParams.get("level"):"",e.inputSubject.value=QueryParams.get("subject")?QueryParams.get("subject"):"!padrenullquery",e.inputOnline.checked="online"===QueryParams.get("mode"),a=r.jsonUrl,i=r,i={meta_profileCountry:h(QueryParams.get("region"),i),meta_profileLevel:QueryParams.get("level")?QueryParams.get("level"):"",meta_profilecourse1Delivery_or:"online"===QueryParams.get("mode")?i.onlineText:"",meta_profileSubject:v(QueryParams.get("subject")),meta_profileFaculty:y(QueryParams.get("subject")),start_rank:f(QueryParams.get("page"),i.postsPerPage)},a=a+stir.map(([e,r])=>e+"="+r,Object.entries(i)).join("&"),t=e,s=r,stir.getJSON(a,r=>{l(r,t,{...s,mediaquery:stir.MediaQuery.current}),window.addEventListener("MediaQueryChange",e=>{l(r,t,{...s,mediaquery:stir.MediaQuery.current})})})};a.resultsArea.addEventListener("click",e=>{e.target.matches("button.resetBtn")?(stir.each(e=>QueryParams.remove(e.name),QueryParams.getAllArray()),i(a,s),e.preventDefault()):e.target.matches("#pagination-box button")&&(e.target.classList.add("hide"),QueryParams.set("page",e.target.getAttribute("data-page")),i(a,s))},!1),a.searchForm.addEventListener("submit",e=>{QueryParams.set("page",1),QueryParams.set("region",a.inputRegion.value),QueryParams.set("subject",a.inputSubject.value),QueryParams.set("level",a.inputLevel.value),a.inputOnline.checked?QueryParams.set("mode","online"):QueryParams.set("mode",""),i(a,s),e.preventDefault()},!1),i(a,s)}();