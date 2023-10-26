!function(){var s;(s=document.querySelector("[data-videoId]"))&&s.addEventListener("ended",function(e){var a,i;s.parentNode&&!(fallback=s.getAttribute("data-fallback-html"))&&(fallback=s.getAttribute("data-fallback-image"))&&(a=new Image,i=s,a.addEventListener("load",function(e){i.insertAdjacentElement("beforebegin",a),i.parentNode.removeChild(i)}),a.src=fallback)})}();var stir=stir||{};!function(n){if(!n)return;const d=stir.filter(e=>{if(e.id&&0!==e.id)return e}),s=(e,a,i)=>{if(i.id!==e&&i.id!==a)return i},c=(e,a,i)=>{if(i<e)return a},o=(e,a,i)=>stir.filter(e=>s(a,i,e),e),u=stir.curry(e=>`
      <!-- All Events -->
      <div class="cell large-4 medium-6 small-12">
          <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small">
              <h2 class="header-stripped u-header--margin-stripped">Events</h2>
              <span class="flex-container u-gap-16 align-middle"><span class="uos-calendar u-icon h5 show-for-small-only"></span><a href="/events/" class="c-link">See all events</a></span>
          </div>
          <div class="grid-x grid-padding-x" >${e}</div>
      </div>`),m=stir.curry((e,a,i)=>`
        <!-- All News -->
        <div class="cell small-12 ${a}" >
            <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small">
                <h2 class="header-stripped u-header--margin-stripped">News</h2>
                <span class="u-flex1 flex-container u-gap-16 align-middle"><span class="uos-radio-waves u-icon h5 show-for-small-only"></span><a href="/news/" class="c-link">See all articles</a></span>
                ${3===e?'<span class="flex-container u-gap-16 align-middle"><span class="uos-calendar u-icon h5"></span><a href="/events/" class="c-link">See our events</a></span>':""}
            </div>
            <div class="grid-x grid-padding-x " >${i}</div>
        </div>`),p=stir.curry((e,a,i)=>`
      <${a} class="small-12 cell ${e}">
        <div class="u-aspect-ratio-4-3 "><a href="${i.url}"><img class=" u-object-cover" src="${i.image}" alt="${i.imagealt}" loading="lazy"></a></div>
        <h3 class="header-stripped u-my-1 u-font-normal u-compress-line-height">
        <a href="${i.url}" class="c-link u-inline">${i.title}</a>
      </h3>
        ${i._uos.location?`<strong>${i._uos.location}</strong>`:""}
        ${t(i._uos)} 
        <p class="text-sm">${i.summary}</p>
      </${a} >`),t=e=>{var a;return e.startDate?(a=e.endDate===e.startDate?"":" until "+e.endDate,`<time class="u-block u-my-1 u-grey--dark">${e.startDate}${a}</time>`):""},g=stir.curry((e,a)=>(stir.setHTML(e,a),!0));var e,a="?v="+(new Date).getTime(),i=(i=window.location.hostname,a=a,e=stir.t4Globals,"localhost"===i||"stirweb.github.io"===i?"homepage.json"+a:e?"stiracuk-cms01-production.terminalfour.net"===i||"stiracuk-cms01-test.terminalfour.net"===i?e.preview&&e.preview.homepagefeed?e.preview.homepagefeed:null:e.homepagefeed?e.homepagefeed+a:null:null);i&&stir.getJSON(i,function(e){var i,a,s,t,r,l;void 0!==e&&e.news&&(i=1,a=e,t=stir.filter((e,a)=>c(i,e,a)),r=p("","div"),r=(a=(t=stir.compose(t,d)(a.events)).length?stir.compose(u,stir.join(""),stir.map(r))(t):"").length?2:3,s=r,t=e,r=d(t.news.primary),t=d(t.news.secondary),e=r[0]||{id:0},l=t[0]||{id:0},r=[e,l,...o(r,e.id,l.id),...o(t,e.id,l.id)],t=3===s?"medium-12 ":"large-8 medium-6 ",e=3===s?"large-4 medium-6":"large-6 medium-12",l=stir.map(p(e,"article")),e=stir.filter((e,a)=>c(s,e,a)),t=stir.compose(m(s,t),stir.join(""),l,e,d)(r),g(n,`<div class="grid-x grid-padding-x c-news-event__news">${t}${a}</div>`))})}(stir.node(".c-news-event")),function(){const a=document.querySelector("[data-placeholder-mobile]");var e;a&&(a.setAttribute("data-placeholder",a.placeholder),(e=e=>{"small"===stir.MediaQuery.current?a.placeholder=a.getAttribute("data-placeholder-mobile"):a.placeholder=a.getAttribute("data-placeholder")})(),window.addEventListener("MediaQueryChange",e))}();