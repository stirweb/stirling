!function(e){if(!e)return;const i=e;var e=stir.node("#filters-menu"),t=stir.node("#filters_panel__type"),r=stir.node("#filters_panel__room");const l=stir.nodes(".c-search-filters-panel__filter input"),c=(e,t,r)=>{var a=stir.filter(o),s=stir.filter(n(t)),t=u(t),e=h(e);stir.compose(e,t,s,a,stir.clone)(r)},n=stir.curry((e,t)=>{if("Yes"===t.hidefromlist)return!1;const a=stir.all(e=>!0===e);var r=stir.curry((t,r)=>{var e=stir.map(e=>!!t[r.name].trim().includes(e),r.value.split(","));return a(e)}),r=stir.map(r(t));return stir.compose(a,r)(e)}),o=stir.curry(e=>{if(e.title)return e.room=Object.keys(e.prices).join(", "),e.accessible&&(e.room=e.room.concat(", ",e.accessible)),e}),d=e=>{const t={};return stir.each(e=>{!0===e.checked&&(t[e.parentNode.dataset.filterName]?t[e.parentNode.dataset.filterName]=t[e.parentNode.dataset.filterName]+","+e.labels[0].dataset.filterValue:t[e.parentNode.dataset.filterName]=e.labels[0].dataset.filterValue)},e),t};const u=stir.curry((e,t)=>`
        <div class="cell c-search-ordered-filters u-margin-bottom" id="search-ordered-filters">
          ${s(e)}
        </div>
        <div class="cell small-12">
            <p>${t.length} results found</p>
        </div>
        `+stir.map(e=>a(e),t).join("")),a=e=>`
        <div class="cell small-12 medium-6 large-4 u-mb-2">
          <div class="u-bg-grey flex-container flex-dir-column u-h-full">
              <img src="${e.image}" loading="lazy" width="578" height="358" alt="${e.title}" />
              <div class="u-p-3">  
                  <p class="u-heritage-green text-lg u-margin-bottom u-header-line u-relative">
                      <strong><a href="${e.url}" class="u-border-none">${e.title}</a></strong>
                  </p>
                  <ul class="no-bullet flex-container flex-dir-column u-gap-8">
                      <li class="flex-container align-middle u-gap-16">
                          <span class="uos-home h3 u-icon"></span>${e.location} </li>

                  </ul>
              </div>
            </div>
        </div>`,s=e=>{return stir.map(e=>{var t=e.value.split(",");const r=e.name;return stir.map(e=>m(e,r),t).join(" ")},e).join("")},m=(e,t)=>e&&t?`<button class="is-active" data-filter-name="${t}" data-filter-value="${e}">${e} ×</button>`:"";const f=(e,t)=>{for(var r in stir.each(e=>{QueryParams.remove(e.parentNode.dataset.filterName)},t),e)QueryParams.set(r,e[r]);return QueryParams.getAllArray()},v=e=>{stir.each(e=>{var t=e.value.split(",");const r=e.name;stir.each(e=>{e=stir.node('[data-filter-name="'+r+'"][data-filter-value="'+e+'"]');e&&(e.childNodes[0].checked=!0)},t)},e)},h=stir.curry((e,t)=>(e.innerHTML=t,e)),p=(i.addEventListener("click",e=>{var t,r,a,s;e.target.matches(".is-active")&&(t=e.target,r=l,a=t.dataset.filterName,s=t.dataset.filterValue,(a=stir.node('[data-filter-name="'+a+'"][data-filter-value="'+s+'"]'))&&(a.childNodes[0].checked=!1),t&&t.remove(),s=d(r),a=f(s,r),v(a),c(i,a,p),e.preventDefault())},!1),e&&(e.onclick=e=>{var t,r,a,s;return"A"===e.target.nodeName&&(t=e.target,r=stir.nodes(".c-search-filters-panel"),a=stir.node("#"+t.dataset.menuId),s=stir.nodes(".c-search-filters-menu li a"),stir.each(e=>{e.classList.add("hide")},r),a.classList.remove("hide"),stir.each(e=>{e.classList.remove("is-active")},s),t.classList.add("is-active")),e.preventDefault(),!1}),l&&l.forEach(e=>{var r;e=e,r=l,e.onclick=e=>{var t=d(r),t=f(t,r);c(i,t,p)}}),stir.accom.accoms);e=QueryParams.getAllArray();p.length&&(t.classList.add("hide"),r.classList.add("hide"),v(e),c(i,e,p))}(stir.node("#accommodation-search__results"));