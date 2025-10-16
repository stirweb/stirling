!function(){const l=(e,t,r)=>{console.log(e);var a,s,i=e.custom_fields,n=i.image&&(n=i.image).length?Array.isArray(n)?1===n.length?n[0]:n[n.length-1]:n:"",l=i.data?JSON.parse(decodeURIComponent(i.data)):{};return`
          <!-- Start testimonial result -->
            <div class="u-mb-2 u-bg-grey ">
              ${o(t,n)?o(t,n):(a=n,s=t,a?`<img src="https://www.stir.ac.uk${a}" alt="${s}" class="u-object-cover u-aspect-ratio-1-1" loading="lazy" width=500 height=500  />`:"")}
                <div class="u-p-2">
                  <p class="u-font-bold ">${t}</p>
                  ${i.country||l.degree?"<cite>":""}
                  ${i.country?`<span class="info">${i.country} </span><br />`:""}
                  ${l.degree?`<span class="info">${l.degree}</span>`:""}
                  ${i.country||l.degree?"</cite>":""}
                  ${i.snippet?`<blockquote class="u-border-none u-my-2 u-black u-p-0 u-quote u-text-regular">${i.snippet}</blockquote>`:""}
                  <a href="${e.url}" class="c-link">View ${a=t.trim(),"s"===a.slice(-1)?a+"’":a+"’s"} story</a>
                </div> 
            </div> 
          <!-- End testimonial result -->`},u=(e,t,r,a)=>{n=a,s=r.mediaquery;var s,i,n=(i=t)/d(n,s)%1==0||0===i;return`
        ${n&&0!==t?"</div>":""}
        ${n||1===a?'<div class="cell small-12 medium-6 large-4 u-padding-bottom">':""}
        ${l(e,e.title.split(" | ")[0].trim(),(r.urlBase,e.clickTrackingUrl))} `},o=(e,t)=>t&&t.includes("a_vid")?`
        <div class="u-bg-grey">
            <div id="vimeoVideo-${t.split("-")[1]}" class="responsive-embed widescreen " 
                data-videoembedid=" myvid " data-vimeo-initialized="true">
                <iframe src="https://player.vimeo.com/video/${t.split("-")[1]}?app_id=122963" 
                    allow="autoplay; fullscreen" allowfullscreen="" title="Testimonial of 
                    ${e} " data-ready="true" width="426" height="240" frameborder="0">
                </iframe>
            </div>
        </div>`:"",c=(t,e)=>e.map(e=>`customField=${t}%3D`+e).join("&"),d=(e,t)=>Math.round(e/(e=>{switch(e){case"medium":return 2;case"small":return 1;case"large":return 3;default:return 3}})(t)),t=(e,t)=>{var r;return e&&(e=e.replaceAll("|[","").replaceAll("]","")).includes(":")&&([e,r]=e.split(":"),e===t)?r:""},m=e=>t(e,"subject"),g=e=>{e=t(e,"faculty");return e?"Business"===e?"Stirling Business School":"Faculty of "+e:""},p=(e,t)=>{e=e||"";return"United Kingdom"===e?t.macroUK:e},v=stir.curry((e,t,r)=>1!==t?e.resultsArea.insertAdjacentHTML("beforeend",r):(stir.setHTML(e.resultsArea,r),stir.scrollToElement(e.searchForm,-50),!0)),y=(e,t,r)=>{var a,s,i,n;return e.error?v(t,1,stir.getprocessDatatenanceMsg()):0<e.total_hits?({start:n,end:i}=(n=e.page,i=r.postsPerPage,isNaN(n)||isNaN(i)?{start:1,end:9}:{start:n=1===Number(n)?1:(Number(n)-1)*Number(i)+1,end:n+Number(i)-1}),n={...{page:e.page,currStart:n,currEnd:i,total:e.total_hits},...r},v(t,e.page,(a=n,s=e.hits,`
          <div class="cell text-center u-pb-2">
            ${(e=>{const t=e.currEnd>e.total?e.total:e.currEnd;return`<p>Showing ${e.currStart}-${t} of <strong>${e.total} results</strong></p>`})(a)}
          </div>
          <div class="cell">
            <div class="grid-x grid-padding-x">
              ${stir.map((e,t)=>u(e,t,a,s.length),s).join("")}
              </div>
          </div>
          <div class="cell">
            <div class="grid-x grid-padding-x" id="pagination-box">
              ${i=a.page+1,r=a.total,n=a.currEnd,r<=n?"":`<div class="cell text-center">
                <button class="button hollow tiny" data-page="${i}">Load more results</button>
          </div>`}
            <div>
          </div>`))):v(t,1,`
          <div class="cell">
              <p class="text-center">We don't have any student stories that match those filters.</p> 
              <p class="text-center"><button class="resetBtn button">Start a new search</button</p>
          </div>`)},r=(e,t)=>{e.inputRegion.value=QueryParams.get("region")?QueryParams.get("region"):"",e.inputLevel.value=QueryParams.get("level")?QueryParams.get("level"):"",e.inputSubject.value=QueryParams.get("subject")?QueryParams.get("subject"):"!padrenullquery",e.inputOnline.checked="online"===QueryParams.get("mode");var r,a,s,i,n=QueryParams.get("page")?Number(QueryParams.get("page")):1;s=t.searchUrl,i=t,i={country:p(QueryParams.get("region"),i),level:QueryParams.get("level")?QueryParams.get("level"):"",delivery:"online"===QueryParams.get("mode")?"online":"",subject:m(QueryParams.get("subject")),faculty:g(QueryParams.get("subject"))},s=s+`&page=${n}&`+Object.entries(i).map(([e,t])=>c(e,t.split("|")).replace(/&$/,"")).join("&"),r=e,a=t,stir.getJSON(s,t=>{y(t,r,{...a,mediaquery:stir.MediaQuery.current}),window.addEventListener("MediaQueryChange",e=>{y(t,r,{...a,mediaquery:stir.MediaQuery.current})})})};const a={postsPerPage:9,macroUK:"United Kingdom|Wales|England|Scotland|Northern Ireland",urlBase:"https://www.stir.ac.uk/",searchUrl:`https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de?term=*&limit=9&customField=type%3Dstudentstory&sort=custom_fields.sort&${c("tag",["alum","student"])}&`,onlineText:""},s=(Object.freeze(a),{resultsArea:stir.node("#testimonials-search__results"),searchForm:stir.node("#testimonials-search__form"),searchLoading:stir.node(".c-search-loading-fixed"),inputLevel:stir.node("#testimonials-search__level"),inputSubject:stir.node("#testimonials-search__subject"),inputRegion:stir.node("#testimonials-search__nationality"),inputOnline:stir.node("#testimonials-search__online")});s.resultsArea&&s.searchForm&&(r(s,a),s.resultsArea.addEventListener("click",e=>{e.target.matches("button.resetBtn")?(stir.each(e=>QueryParams.remove(e.name),QueryParams.getAllArray()),r(s,a),e.preventDefault()):e.target.matches("#pagination-box button")&&(e.target.classList.add("hide"),QueryParams.set("page",e.target.getAttribute("data-page")),r(s,a))},!1),s.searchForm.addEventListener("submit",e=>{QueryParams.set("page",1),QueryParams.set("region",s.inputRegion.value),QueryParams.set("subject",s.inputSubject.value),QueryParams.set("level",s.inputLevel.value),s.inputOnline.checked?QueryParams.set("mode","online"):QueryParams.set("mode",""),r(s,a),e.preventDefault()},!1))}();