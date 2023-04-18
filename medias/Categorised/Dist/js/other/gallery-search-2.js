!function(e){if(!e)return;const t={collection:"stir-www",query:"!padre",num_ranks:"1000",meta_type_and:"gallery",sort:"dmetad",SF:"[tags|custom]",fmo:"true"};var r=stir.map(e=>e+"="+encodeURIComponent(t[e]),Object.keys(t)).join("&");const a={funnelbackServer:"https://search.stir.ac.uk",resultsArea:e,searchForm:stir.node("#gallery-search__form"),searchInputs:stir.nodes("#gallery-search__form select"),postsPerPage:12,noOfPageLinks:9,jsonUrl:"https://search.stir.ac.uk/s/search.json?"+r},s=(Object.freeze(a),(e,t,r)=>{if(r.error)return g(t.resultsArea,stir.getMaintenanceMsg());if(null===(a=r).response.resultPacket||!a.response.resultPacket.results.length)return g(t.resultsArea,m());var a=n(e),a=stir.filter(a,r.response.resultPacket.results);if(!a.length)return l(m());const s=((e,t,r)=>{const a=stir.filter(e=>e.name==="page",t),s=a.length?a[0].value:1,l=stir.isNumeric(s)?s:1,n=(l-1)*e.postsPerPage,i=l*e.postsPerPage-1,c=i>r?r:i;return{...{page:l,start:n,end:i,total:r,last:c},...e}})(t,e,a.length),l=("1"===s.page?g:p)(t.resultsArea);r=i(s),e=stir.filter((e,t)=>t>=s.start&&t<=s.last);return stir.compose(l,r,e)(a)}),n=stir.curry((e,t)=>{if(!t)return!1;e=stir.filter(e=>e.name&&"page"!==e.name,e);const r={meta_dyear:new Date(t.date).getFullYear(),meta_tags:t.metaData.tags};t=stir.map(e=>String(r[e.name]).includes(e.value),e);return stir.all(e=>e,t)}),i=stir.curry((e,t)=>{const r=l(e);return`
        ${u(e)}
        ${t.map(e=>r(e)).join("")}
        `+o(e)}),l=stir.curry((e,t)=>`
        <div class="cell small-12 medium-6 large-4 u-mb-2">
          <a href="${e.funnelbackServer}${t.clickTrackingUrl}">
            <div>
              <div class="c-photo-gallery__thumb">
                <img src="${c(t.metaData.custom)}" loading="lazy" alt="${t.title.split("|")[0].trim()}">
              </div>
            </div>
            <div class="cell small-12 u-bg-grey u-p-2">
              <p><strong>${t.title.split("|")[0].trim()}</strong></p>
              <p class="text-sm u-black">${stir.Date.galleryDate(new Date(t.date))}</p>
            </div>
          </a>
        </div>`),c=e=>{return e&&(e=e.split("|").filter(e=>JSON.parse(e).hasOwnProperty("farm"))).length?`https://farm${(e=JSON.parse(e[0])).farm}.staticflickr.com/${e.server}/${e.id}_${e.secret}_z.jpg`:""},u=e=>`
        <div class="cell u-mb-1 text-center">
          <p>Showing ${e.start+1} -
            ${parseInt(e.end)>=parseInt(e.total)?e.total:e.end+1} 
            of ${e.total} results</p>
        </div>`,o=({last:e,total:t,page:r})=>t<=e?"":`<div class="cell text-center" id="pagination-box">
            <button class="button hollow tiny" data-page="${Number(r)+1}">Load more results</button>
        </div>`,m=()=>'<div class="cell"><p>No galleries found </p></div>',g=stir.curry((e,t)=>(stir.setHTML(e,t),e)),p=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e)),d=QueryParams.getAll();stir.each(e=>d[e.name]&&(e.value=d[e.name]),a.searchInputs),stir.getJSON(a.jsonUrl,t=>{s(QueryParams.getAllArray(),a,t),a.searchForm&&a.searchForm.addEventListener("submit",e=>{QueryParams.set("page",1),a.searchInputs.forEach(e=>QueryParams.set(e.name,e.value)),s(QueryParams.getAllArray(),a,t),e.preventDefault()},!1),a.resultsArea.addEventListener("click",e=>{e.target.matches("#pagination-box button")&&(e.target.classList.add("hide"),QueryParams.set("page",e.target.getAttribute("data-page")),s(QueryParams.getAllArray(),a,t))})})}(stir.node("#gallery-search__results"));