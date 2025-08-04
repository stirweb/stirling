!function(e){if(!e)return;e={filtersArea:stir.node("#welcomeeventfilters"),resultsArea:e,itemsPerPage:9};const t=e=>e?`
      <div class="flex-container u-gap-16 align-middle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px; height: 20px; color: #006938 ">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <a href="${e}">More information</a>
        </div>`:"",d=e=>`
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
    </div>`;var s=(e,t)=>{var s=t.toLowerCase().replaceAll(" ","-"),r=t.replace("Filter by","All");return`<label for="${s}" class="u-show-for-sr">${t}</label><select id="${s}"><option value="">${r}s</option>${e}</select>`};const c=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),m=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e)),p=stir.join(""),v=(e,t)=>e.startIntFull-t.startIntFull;var r=stir.curry((s,e)=>e.reduce((e,t)=>(e.some(e=>e[s]===t[s])||e.push(t),e),[]));const g=stir.curry((e,t)=>!e||t.startInt===Number(e)),f=stir.curry((e,t)=>!e||t.theme===e),h=stir.curry((e,t)=>!e||"students"===e||t.audience&&t.audience.toLowerCase().includes(e)),i=()=>Number((new Date).toISOString().split(".")[0].replaceAll(/[-:T]/g,"").slice(0,-2)),b=stir.curry((e,t)=>t.endIntFull>=e),a=e=>"string"!=typeof e?"":e.replace(/[^a-zA-Z0-9-_]/g,""),l={get:e=>a(QueryParams.get(e)),set:(e,t)=>QueryParams.set(e,a(t)),remove:QueryParams.remove};function n(e,t,s,r,i,a,l){var t=Number(t)||1,n=e.itemsPerPage*(t-1),o=n+e.itemsPerPage,t=(1===t?c:m)(e.resultsArea),e=stir.filter(b(s)),s=stir.filter(f(i)),i=stir.filter(g(r)),r=stir.filter(h(a)),a=stir.sort(v),u=stir.map(d),r=stir.compose(r,s,i,a,e)(l),s=r.slice(n,o),i=stir.compose(p,u)(s),a=r.length;t(i.length?(e=o,l=a,((u=n)<2?"":`<div class="flex-container align-center u-mb-2">
           Showing ${u+1}-${Math.min(e,l)} of ${l} results
         </div>`)+i+(a<=o?"":`<div class="loadmorebtn flex-container align-center u-mb-2">
           <button class="button hollow tiny">Load more results</button>
         </div>`)):`<div class="grid-x u-bg-white u-mb-2  u-border-width-5">
      <div class="cell u-p-2 small-12  ">
        <p>No events have been found for the criteria selected</p>
      </div>
    </div>`)}const o=stir.feeds.events.filter(e=>e.id);var u,$=l.get("theme")||"",y=l.get("audience")||"students",w=(l.set("page",String(1)),n(e,1,i(),"",$,y,o),stir.filter(b(i()))),x=stir.map(e=>`<option value="${e.startIntFull}">${e.stirStart}</option>`),A=stir.sort(v),S=stir.map(e=>({startIntFull:e.startInt,stirStart:e.stirStart})),x=stir.compose(p,x,r("startIntFull"),S,A,w)(o),S=stir.map(e=>({theme:e.theme})),A=stir.filter(e=>e.theme),w=stir.map((u=$,e=>`<option value="${e.theme}" ${u===e.theme?"selected":""}>${e.theme}</option>`)),$=stir.compose(p,w,r("theme"),A,S)(o);c(e.filtersArea)(`<label for="${w="filter-by-audience"}" class="u-show-for-sr">Filter by audience</label>
            <select id="${w}">
              <option value="students" ${"students"===y?"selected":""}>All Students</option>
              <option value="ug" ${"ug"===y?"selected":""}>Undergraduate</option>
              <option value="pg" ${"pg"===y?"selected":""}>Postgraduate</option>
          </select>`+s(x,"Filter by date")+s($,"Filter by theme")+'<button id="clearfilters" class="button no-arrow tiny hollow expanded u-font-bold">Clear all filters</button>');{var F=e;const L=stir.node("#filter-by-date"),P=stir.node("#filter-by-theme"),I=stir.node("#filter-by-audience");F.resultsArea.addEventListener("click",e=>{"submit"===e.target.type&&(c(e.target.closest(".loadmorebtn"),""),e=Number(l.get("page"))+1,l.set("page",String(e)),n(F,e,i(),L.value,P.value,I.value,o))}),F.filtersArea.addEventListener("click",e=>{"BUTTON"===e.target.nodeName&&(l.set("page",String(1)),l.remove("theme"),l.remove("audience"),L.value="",P.value="",I.value="students",n(F,1,i(),"","","students",o),e.preventDefault())}),r=()=>{l.set("page",String(1)),l.set("theme",P.value),l.set("audience",I.value),n(F,1,i(),L.value,P.value,I.value,o)},L.addEventListener("change",r),P.addEventListener("change",r),I.addEventListener("change",r)}}(stir.node("#welcomeevents"));