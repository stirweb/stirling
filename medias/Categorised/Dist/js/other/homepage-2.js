var stir=stir||{};!function(n){if(!n)return;const d=stir.filter(e=>{if(e.id&&0!==e.id)return e}),a=(e,i,t)=>{if(t.id!==e&&t.id!==i)return t},o=(e,i,t)=>{if(t<e)return i},c=(e,i,t)=>stir.filter(e=>a(i,t,e),e),s=(e,i)=>`<div class="u-flex u-gap-4 cta-link u-mb-tiny">
              <span class="cta-link-icon"></span>
              <span>
                <a href="${e}">${i}</a>
              </span>
          </div>`,u=stir.curry(e=>`
      <!-- All Events -->
      <div class="cell large-4 medium-6 small-12">
          <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small">
              <h2>Events</h2>
              <span class="flex-container u-gap-16 align-middle">${s("/events/","See all events")}</span>
          </div>
          <div class="grid-x">${e}</div>
      </div>`),m=stir.curry((e,i,t)=>`
        <!-- All News -->
        <div class="cell small-12 ${i}">
            <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-1 u-items-start-small">
                <h2>News</h2>
                <span class="u-flex1 flex-container u-gap-16 align-middle">${s("/news/","See all articles")}</span>
                ${3===e?s("/events/","See our events"):""}
            </div>
            <div class="grid-x">${t}</div>
        </div>`),p=stir.curry((e,i,t)=>{return`
      <${i} class="small-12 cell ${e}">
        <div class="u-aspect-ratio-16-9">
          <a href="${t.url}"><img class=" u-object-cover" src="${t.image||'<t4 type="media" id="207798" formatter="path/*" />'}" alt="${""|t.imagealt}" loading="lazy"></a></div>
        <div class="u-flex u-gap-8 cta-link u-my-1">
            <span>
              <strong><a href="${t.url}">${t.title}</a></strong>
            </span>
        </div>
        ${t._uos.location?`<strong>${t._uos.location}</strong>`:""}
        ${r(t._uos)} 
        <p class="text-sm">${t.summary}</p>
      </${i} >`}),r=e=>{var i;return e.startDate?(i=e.endDate===e.startDate?"":" until "+e.endDate,`<time class="u-block u-my-1 u-dark-grey">${e.startDate}${i}</time>`):""},v=stir.curry((e,i)=>(stir.setHTML(e,i),!0));var e,i="?v="+(new Date).getTime(),t=(t=window.location.hostname,i=i,e=stir.t4Globals,"localhost"===t||"stirweb.github.io"===t?"homepage.json"+i:e?"stiracuk-cms01-production.terminalfour.net"===t||"stiracuk-cms01-test.terminalfour.net"===t?e.preview&&e.preview.homepagefeed?e.preview.homepagefeed:null:e.homepagefeed?e.homepagefeed+i:null:null);t&&stir.getJSON(t,function(e){var t,i,a,s,r,l;void 0!==e&&e.news&&(t=1,i=e,s=stir.filter((e,i)=>o(t,e,i)),r=p("","div"),r=(i=(s=stir.compose(s,d)(i.events)).length?stir.compose(u,stir.join(""),stir.map(r))(s):"").length?2:3,a=r,s=e,r=d(s.news.primary),s=d(s.news.secondary),e=r[0]||{id:0},l=s[0]||{id:0},r=[e,l,...c(r,e.id,l.id),...c(s,e.id,l.id)],s=3===a?"medium-12 ":"large-8 medium-6 ",e=3===a?"large-4 medium-6":"large-6 medium-12",l=stir.map(p(e,"article")),e=stir.filter((e,i)=>o(a,e,i)),s=stir.compose(m(a,s),stir.join(""),l,e,d)(r),v(n,`<div class="grid-x  c-news-event__news">${s}${i}</div>`))})}(stir.node(".c-news-event")),function(){const i=document.querySelector("[data-placeholder-mobile]");var e;i&&(i.setAttribute("data-placeholder",i.placeholder),(e=e=>{"small"===stir.MediaQuery.current?i.placeholder=i.getAttribute("data-placeholder-mobile"):i.placeholder=i.getAttribute("data-placeholder")})(),window.addEventListener("MediaQueryChange",e))}();