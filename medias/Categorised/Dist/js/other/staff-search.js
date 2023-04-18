!function(e){if(!e)return;const s={resultsArea:e,searchForm:stir.node("#staff-search__form"),searchInput:stir.node("#staff-search__query"),searchLoading:stir.node(".c-search-loading-fixed"),postsPerPage:20,noPageLinks:9,searchUrl:"https://www.stir.ac.uk/s/search.json?collection=stir-research-hub&meta_T_and=profile&fmo=true&SF=[c,I,faculty,role,firstname,lastname]&num_ranks=20"},i=(Object.freeze(s),stir.curry((e,r)=>`
          ${n(r.resultsSummary)}
          ${stir.join("",stir.map(a,r.results))}
          `+t(r.resultsSummary,e))),a=e=>`
          <div class="cell medium-10 c-search-result u-small-margin-top ">
            <p class="c-search-result__link">
              <a href="${e.clickTrackingUrl}">${e.title.split(" | ")[0]}</a>
            </p>
            <p class="c-search-result__summary">${e.summary}</p>
          </div>`,t=(e,r)=>`
          <div class="cell ">
            <div class="grid-container u-margin-y">
              <div class="grid-x grid-padding-x" id="pagination-box">
                ${StirSearchHelpers.formPaginationHTML(e.fullyMatching,e.numRanks,Math.floor(e.currStart/e.numRanks+1),r.noPageLinks)}
              </div>
            </div>
          </div>`,n=e=>`
          <div class="cell medium-10">
            <p>Showing ${e.currStart}-${e.currEnd} of <strong>${e.fullyMatching} results</strong></p>
          </div>`,c=e=>`
          <div class="cell medium-10">
            <p>No results found for search "${e}".</p>
          </div>`,l=stir.curry((e,r)=>(e.searchLoading&&(e.searchLoading.style.display="none"),e.resultsArea.innerHTML=r,stir.scrollToElement(e.resultsArea,30),e.resultsArea)),u=(e,r,t)=>{t.searchLoading&&(t.searchLoading.style.display="flex"),QueryParams.set("page",e),QueryParams.set("query",r);const n={page:e,query:t.searchInput.value=r,noPageLinks:t.noPageLinks,postsPerPage:t.postsPerPage,start:(e-1)*t.postsPerPage+1};stir.getJSON((r=n,t.searchUrl+"&start_rank="+r.start+"&query="+encodeURIComponent(r.query)),e=>{return r=n,s=t,e=e,s=l(s),a=e=>e.response.resultPacket&&e.response.resultPacket.results.length,e.error?s(stir.getMaintenanceMsg()):a(e)?a(e)?(a=i(r),stir.compose(s,a,stir.clone)(e.response.resultPacket)):void 0:s(c(r.query));var r,s,a})};s.resultsArea.addEventListener("click",e=>{var r=QueryParams.get("query")||"";e.target.matches("#pagination-box a")&&(u(e.target.getAttribute("data-page"),r,s),e.preventDefault()),e.target.matches("#pagination-box a span")&&(u(e.target.parentNode.getAttribute("data-page"),r,s),e.preventDefault())},!1),s.searchForm&&s.searchForm.addEventListener("submit",e=>{e.preventDefault();e=s.searchInput.value||"";u(1,e,s)},!1);var e=QueryParams.get("query")||"",r=stir.isNumeric(QueryParams.get("page"))?parseInt(QueryParams.get("page")):1;u(r,e,s)}(stir.node("#staff-search__results"));