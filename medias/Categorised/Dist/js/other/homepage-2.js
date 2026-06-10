!function(){var i;(i=document.querySelector("[data-videoId]"))&&i.addEventListener("ended",function(e){var t,a;i.parentNode&&!(fallback=i.getAttribute("data-fallback-html"))&&(fallback=i.getAttribute("data-fallback-image"))&&(t=new Image,a=i,t.addEventListener("load",function(e){a.insertAdjacentElement("beforebegin",t),a.parentNode.removeChild(a)}),t.src=fallback)})}();var stir=stir||{};!function(n){if(!n)return;const o=stir.filter(e=>{if(e.id&&0!==e.id)return e}),i=(e,t,a)=>{if(a.id!==e&&a.id!==t)return a},d=(e,t,a)=>{if(a<e)return t},c=(e,t,a)=>stir.filter(e=>i(t,a,e),e),r=(e,t)=>`<div class="u-flex u-gap-8 cta-link u-mb-tiny">
              <span class="u-svg-24 u-heritage-green">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" class="svg-icon">
                  <path d="M13.833,16.333,17.167,13m0,0L13.833,9.667M17.167,13H8.833M23,13A10,10,0,1,1,13,3,10,10,0,0,1,23,13Z" transform="translate(-1 -1)" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
              <span>
                <a href="${e}">${t}</a>
              </span>
          </div>`,u=stir.curry(e=>`
      <!-- All Events -->
      <div class="cell large-4 medium-6 small-12">
          <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small">
              <h2>Events</h2>
              <span class="flex-container u-gap-16 align-middle">${r("/events/","See all events")}</span>
          </div>
          <div class="grid-x " >${e}</div>
      </div>`),m=stir.curry((e,t,a)=>`
        <!-- All News -->
        <div class="cell small-12 ${t}" >
            <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small">
                <h2>News</h2>
                <span class="u-flex1 flex-container u-gap-16 align-middle">${r("/news/","See all articles")}</span>
                ${3===e?r("/events/","See our events"):""}
            </div>
            <div class="grid-x" >${a}</div>
        </div>`),g=stir.curry((e,t,a)=>`
      <${t} class="small-12 cell ${e}">
        <div class="u-aspect-ratio-16-9 "><a href="${a.url}"><img class=" u-object-cover" src="${a.image}" alt="${a.imagealt}" loading="lazy"></a></div>
        <div class="u-flex u-gap-8 cta-link u-my-1">
            <span class="u-svg-24 u-heritage-green">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" class="svg-icon">
                <path d="M13.833,16.333,17.167,13m0,0L13.833,9.667M17.167,13H8.833M23,13A10,10,0,1,1,13,3,10,10,0,0,1,23,13Z" transform="translate(-1 -1)" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span>
              <a href="${a.url}">${a.title}</a>
            </span>
        </div>
        ${a._uos.location?`<strong>${a._uos.location}</strong>`:""}
        ${s(a._uos)} 
        <p class="text-sm">${a.summary}</p>
      </${t} >`),s=e=>{var t;return e.startDate?(t=e.endDate===e.startDate?"":" until "+e.endDate,`<time class="u-block u-my-1 u-dark-grey">${e.startDate}${t}</time>`):""},v=stir.curry((e,t)=>(stir.setHTML(e,t),!0));var e,t="?v="+(new Date).getTime(),a=(a=window.location.hostname,t=t,e=stir.t4Globals,"localhost"===a||"stirweb.github.io"===a?"homepage.json"+t:e?"stiracuk-cms01-production.terminalfour.net"===a||"stiracuk-cms01-test.terminalfour.net"===a?e.preview&&e.preview.homepagefeed?e.preview.homepagefeed:null:e.homepagefeed?e.homepagefeed+t:null:null);a&&stir.getJSON(a,function(e){var a,t,i,r,s,l;void 0!==e&&e.news&&(a=1,t=e,r=stir.filter((e,t)=>d(a,e,t)),s=g("","div"),s=(t=(r=stir.compose(r,o)(t.events)).length?stir.compose(u,stir.join(""),stir.map(s))(r):"").length?2:3,i=s,r=e,s=o(r.news.primary),r=o(r.news.secondary),e=s[0]||{id:0},l=r[0]||{id:0},s=[e,l,...c(s,e.id,l.id),...c(r,e.id,l.id)],r=3===i?"medium-12 ":"large-8 medium-6 ",e=3===i?"large-4 medium-6":"large-6 medium-12",l=stir.map(g(e,"article")),e=stir.filter((e,t)=>d(i,e,t)),r=stir.compose(m(i,r),stir.join(""),l,e,o)(s),v(n,`<div class="grid-x  c-news-event__news">${r}${t}</div>`))})}(stir.node(".c-news-event")),function(){const t=document.querySelector("[data-placeholder-mobile]");var e;t&&(t.setAttribute("data-placeholder",t.placeholder),(e=e=>{"small"===stir.MediaQuery.current?t.placeholder=t.getAttribute("data-placeholder-mobile"):t.placeholder=t.getAttribute("data-placeholder")})(),window.addEventListener("MediaQueryChange",e))}();