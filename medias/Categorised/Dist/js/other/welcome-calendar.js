!function(e){if(!e)return;e={filtersArea:stir.node("#welcomeeventfilters"),resultsArea:e,itemsPerPage:9};const t=e=>e?`
      <div class="flex-container u-gap-16 align-middle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px; height: 20px; color: #006938 ">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <a href="${e}">More information</a>
        </div>`:"",u=e=>`
    <div class="grid-x u-bg-white u-mb-2 u-energy-line-left u-border-width-5">
      <div class="cell u-p-2 small-12">
        <p class="u-text-regular u-mb-2">
          <strong>${e.title}</strong>
        </p>
        <div class="flex-container flex-dir-column u-gap-8 u-mb-1">
          <div class="flex-container u-gap-16 align-middle">
            <span class="u-icon h5 uos-calendar"></span>
            <span><time>${e.stirStart}</time></span>
          </div>
          <div class="flex-container u-gap-16 align-middle">
            <span class="uos-clock u-icon h5"></span>
            <span><time>${e.startTime}</time> – <time>${e.endTime}</time></span>
          </div>
          <div class="flex-container u-gap-16 align-middle">
            <span class="u-icon h5 uos-location"></span>
            <span>${e.location}</span>
          </div>
          ${t(e.link)}
        </div>
        <p class="text-sm">${e.description}</p>
        <p class="u-m-0 text-sm"><strong>Theme:</strong> ${e.theme} <br /><strong>Attendance:</strong> ${e.attendance}</p>
      </div>
    </div>`;var r=(e,t)=>`<select id="${t.toLowerCase().replaceAll(" ","-")}"><option value="">${t}</option>${e}</select>`;const c=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),d=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e)),m=stir.join(""),p=(e,t)=>e.startIntFull-t.startIntFull;var s=stir.curry((r,e)=>e.reduce((e,t)=>(e.some(e=>e[r]===t[r])||e.push(t),e),[]));const v=stir.curry((e,t)=>!e||t.startInt===Number(e)),g=stir.curry((e,t)=>!e||t.theme===e),a=()=>{var e=new Date;return parseInt(e.getFullYear()+("0"+(e.getMonth()+1)).slice(-2)+("0"+e.getDate()).slice(-2)+("0"+e.getHours()).slice(-2)+("0"+e.getMinutes()).slice(-2))},h=stir.curry((e,t)=>t.endIntFull>=e);function i(e,t,r,s,a,i){var t=Number(t)||1,l=e.itemsPerPage*(t-1),n=l+e.itemsPerPage,t=(1===t?c:d)(e.resultsArea),e=stir.filter(h(r)),r=stir.filter(g(a)),a=stir.filter(v(s)),s=stir.sort(p),o=stir.map(u),r=stir.compose(r,a,s,e)(i),a=r.slice(l,n),s=stir.compose(m,o)(a),e=r.length;t(s.length?(i=n,o=e,((a=l)<2?"":`<div class="flex-container align-center u-mb-2">
           Showing ${a+1}-${Math.min(i,o)} of ${o} results
         </div>`)+s+(e<=n?"":`<div class="loadmorebtn flex-container align-center u-mb-2">
           <button class="button hollow tiny">Load more results</button>
         </div>`)):`<div class="grid-x u-bg-white u-mb-2  u-border-width-5">
      <div class="cell u-p-2 small-12  ">
        <p>No events have been found for the criteria selected</p>
      </div>
    </div>`)}const l=stir.feeds.events.filter(e=>e.id);var n,o=QueryParams.get("theme")||"",f=(QueryParams.set("page",1),i(e,1,a(),"",o,l),stir.filter(h(a()))),b=stir.map(e=>`<option value="${e.startIntFull}">${e.stirStart}</option>`),y=stir.sort(p),$=stir.map(e=>({startIntFull:e.startInt,stirStart:e.stirStart})),b=stir.compose(m,b,s("startIntFull"),$,y,f)(l),$=stir.map(e=>({theme:e.theme})),y=stir.filter(e=>e.theme),f=stir.map((n=o,e=>`<option value="${e.theme}" ${n===e.theme?"selected":""}>${e.theme}</option>`)),o=stir.compose(m,f,s("theme"),y,$)(l);c(e.filtersArea)(r(b,"Filter by date")+r(o,"Filter by theme")+'<button id="clearfilters" class="button no-arrow tiny hollow expanded u-font-bold">Clear all filters</button>');{var w=e;const x=stir.node("#filter-by-date"),P=stir.node("#filter-by-theme");w.resultsArea.addEventListener("click",e=>{"submit"===e.target.type&&(c(e.target.closest(".loadmorebtn"),""),e=Number(QueryParams.get("page"))+1,QueryParams.set("page",e),i(w,e,a(),x.value,P.value,l))}),w.filtersArea.addEventListener("click",e=>{"BUTTON"===e.target.nodeName&&(QueryParams.set("page",1),QueryParams.remove("theme"),x.value="",P.value="",i(w,1,a(),"","",l),e.preventDefault())}),f=()=>{QueryParams.set("page",1),QueryParams.set("theme",P.value),i(w,1,a(),x.value,P.value,l)},x.addEventListener("change",f),P.addEventListener("change",f)}}(stir.node("#welcomeevents"));