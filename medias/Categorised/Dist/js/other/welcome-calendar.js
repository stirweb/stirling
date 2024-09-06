!function(e){if(!e)return;e={filtersArea:stir.node("#welcomeeventfilters"),resultsArea:e,itemsPerPage:9};const t=e=>e?`
      <div class="flex-container u-gap-16 align-middle">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px; height: 20px; color: #006938 ">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <a href="${e}">More information</a>
        </div>`:"",c=e=>`
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
    </div>`;var r=(e,t)=>`<select id="${t.toLowerCase().replaceAll(" ","-")}"><option value="">${t}</option>${e}</select>`;const u=stir.curry((e,t)=>(stir.setHTML(e,t),!0)),d=stir.curry((e,t)=>(e.insertAdjacentHTML("beforeend",t),e)),m=stir.join(""),p=(e,t)=>e.startIntFull-t.startIntFull;var s=stir.curry((r,e)=>e.reduce((e,t)=>(e.some(e=>e[r]===t[r])||e.push(t),e),[]));const g=stir.curry((e,t)=>!e||t.startInt===Number(e)),v=stir.curry((e,t)=>!e||t.theme===e),i=()=>{var e=new Date;return parseInt(e.getFullYear()+("0"+(e.getMonth()+1)).slice(-2)+("0"+e.getDate()).slice(-2)+("0"+e.getHours()).slice(-2)+("0"+e.getMinutes()).slice(-2))},h=stir.curry((e,t)=>t.endIntFull>=e),a=e=>"string"!=typeof e?"":e.replace(/[^a-zA-Z0-9-_]/g,""),n={get:e=>a(QueryParams.get(e)),set:(e,t)=>QueryParams.set(e,a(t)),remove:QueryParams.remove};function l(e,t,r,s,i,a){var t=Number(t)||1,n=e.itemsPerPage*(t-1),l=n+e.itemsPerPage,t=(1===t?u:d)(e.resultsArea),e=stir.filter(h(r)),r=stir.filter(v(i)),i=stir.filter(g(s)),s=stir.sort(p),o=stir.map(c),r=stir.compose(r,i,s,e)(a),i=r.slice(n,l),s=stir.compose(m,o)(i),e=r.length;t(s.length?(a=l,o=e,((i=n)<2?"":`<div class="flex-container align-center u-mb-2">
           Showing ${i+1}-${Math.min(a,o)} of ${o} results
         </div>`)+s+(e<=l?"":`<div class="loadmorebtn flex-container align-center u-mb-2">
           <button class="button hollow tiny">Load more results</button>
         </div>`)):`<div class="grid-x u-bg-white u-mb-2  u-border-width-5">
      <div class="cell u-p-2 small-12  ">
        <p>No events have been found for the criteria selected</p>
      </div>
    </div>`)}const o=stir.feeds.events.filter(e=>e.id);var f,b=n.get("theme")||"",$=(n.set("page",String(1)),l(e,1,i(),"",b,o),stir.filter(h(i()))),w=stir.map(e=>`<option value="${e.startIntFull}">${e.stirStart}</option>`),y=stir.sort(p),x=stir.map(e=>({startIntFull:e.startInt,stirStart:e.stirStart})),w=stir.compose(m,w,s("startIntFull"),x,y,$)(o),x=stir.map(e=>({theme:e.theme})),y=stir.filter(e=>e.theme),$=stir.map((f=b,e=>`<option value="${e.theme}" ${f===e.theme?"selected":""}>${e.theme}</option>`)),b=stir.compose(m,$,s("theme"),y,x)(o);u(e.filtersArea)(r(w,"Filter by date")+r(b,"Filter by theme")+'<button id="clearfilters" class="button no-arrow tiny hollow expanded u-font-bold">Clear all filters</button>');{var A=e;const F=stir.node("#filter-by-date"),I=stir.node("#filter-by-theme");A.resultsArea.addEventListener("click",e=>{"submit"===e.target.type&&(u(e.target.closest(".loadmorebtn"),""),e=Number(n.get("page"))+1,n.set("page",String(e)),l(A,e,i(),F.value,I.value,o))}),A.filtersArea.addEventListener("click",e=>{"BUTTON"===e.target.nodeName&&(n.set("page",String(1)),n.remove("theme"),F.value="",I.value="",l(A,1,i(),"","",o),e.preventDefault())}),$=()=>{n.set("page",String(1)),n.set("theme",I.value),l(A,1,i(),F.value,I.value,o)},F.addEventListener("change",$),I.addEventListener("change",$)}}(stir.node("#welcomeevents"));