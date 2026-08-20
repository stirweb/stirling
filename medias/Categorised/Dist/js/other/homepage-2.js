!function(){var i;(i=document.querySelector("[data-videoId]"))&&i.addEventListener("ended",function(e){var t,a;i.parentNode&&!(fallback=i.getAttribute("data-fallback-html"))&&(fallback=i.getAttribute("data-fallback-image"))&&(t=new Image,a=i,t.addEventListener("load",function(e){a.insertAdjacentElement("beforebegin",t),a.parentNode.removeChild(a)}),t.src=fallback)})}();var stir=stir||{};!function(n){if(!n)return;const d=stir.filter(e=>{if(e.id&&0!==e.id)return e}),i=(e,t,a)=>{if(a.id!==e&&a.id!==t)return a},c=(e,t,a)=>{if(a<e)return t},o=(e,t,a)=>stir.filter(e=>i(t,a,e),e),l=(e,t)=>`<div class="u-flex u-gap-4 cta-link u-mb-tiny">
              <span class="cta-link-icon"></span>
              <span>
                <a href="${e}">${t}</a>
              </span>
          </div>`,u=stir.curry(e=>`
      <!-- All Events -->
      <div class="cell large-4 medium-6 small-12">
          <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small">
              <h2>Events</h2>
              <span class="flex-container u-gap-16 align-middle">${l("/events/","See all events")}</span>
          </div>
          <div class="grid-x " >${e}</div>
      </div>`),m=stir.curry((e,t,a)=>`
        <!-- All News -->
        <div class="cell small-12 ${t}" >
            <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-1 u-items-start-small">
                <h2>News</h2>
                <span class="u-flex1 flex-container u-gap-16 align-middle">${l("/news/","See all articles")}</span>
                ${3===e?l("/events/","See our events"):""}
            </div>
            <div class="grid-x" >${a}</div>
        </div>`),v=stir.curry((e,t,a)=>`
      <${t} class="small-12 cell ${e}">
        <div class="u-aspect-ratio-16-9 "><a href="${a.url}"><img class=" u-object-cover" src="${a.image}" alt="${a.imagealt}" loading="lazy"></a></div>
        <div class="u-flex u-gap-8 cta-link u-my-1">
            <span>
              <strong><a href="${a.url}">${a.title}</a></strong>
            </span>
        </div>
        ${a._uos.location?`<strong>${a._uos.location}</strong>`:""}
        ${r(a._uos)} 
        <p class="text-sm">${a.summary}</p>
      </${t} >`),r=e=>{var t;return e.startDate?(t=e.endDate===e.startDate?"":" until "+e.endDate,`<time class="u-block u-my-1 u-dark-grey">${e.startDate}${t}</time>`):""},g=stir.curry((e,t)=>(stir.setHTML(e,t),!0));var e,t="?v="+(new Date).getTime(),a=(a=window.location.hostname,t=t,e=stir.t4Globals,"localhost"===a||"stirweb.github.io"===a?"homepage.json"+t:e?"stiracuk-cms01-production.terminalfour.net"===a||"stiracuk-cms01-test.terminalfour.net"===a?e.preview&&e.preview.homepagefeed?e.preview.homepagefeed:null:e.homepagefeed?e.homepagefeed+t:null:null);a&&stir.getJSON(a,function(e){var a,t,i,l,r,s;void 0!==e&&e.news&&(a=1,t=e,l=stir.filter((e,t)=>c(a,e,t)),r=v("","div"),r=(t=(l=stir.compose(l,d)(t.events)).length?stir.compose(u,stir.join(""),stir.map(r))(l):"").length?2:3,i=r,l=e,r=d(l.news.primary),l=d(l.news.secondary),e=r[0]||{id:0},s=l[0]||{id:0},r=[e,s,...o(r,e.id,s.id),...o(l,e.id,s.id)],l=3===i?"medium-12 ":"large-8 medium-6 ",e=3===i?"large-4 medium-6":"large-6 medium-12",s=stir.map(v(e,"article")),e=stir.filter((e,t)=>c(i,e,t)),l=stir.compose(m(i,l),stir.join(""),s,e,d)(r),g(n,`<div class="grid-x  c-news-event__news">${l}${t}</div>`))})}(stir.node(".c-news-event")),function(){const t=document.querySelector("[data-placeholder-mobile]");var e;t&&(t.setAttribute("data-placeholder",t.placeholder),(e=e=>{"small"===stir.MediaQuery.current?t.placeholder=t.getAttribute("data-placeholder-mobile"):t.placeholder=t.getAttribute("data-placeholder")})(),window.addEventListener("MediaQueryChange",e))}();