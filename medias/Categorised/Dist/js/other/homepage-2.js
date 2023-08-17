!function(){var i;if((i=document.querySelector("[data-videoId]"))&&i.addEventListener("ended",function(e){var a,t;i.parentNode&&!(fallback=i.getAttribute("data-fallback-html"))&&(fallback=i.getAttribute("data-fallback-image"))&&(a=new Image,t=i,a.addEventListener("load",function(e){t.insertAdjacentElement("beforebegin",a),t.parentNode.removeChild(t)}),a.src=fallback)}),AOS){function e(e,a){this.setAttribute&&(this.setAttribute("data-aos",e),this.setAttribute("data-aos-duration",a))}for(var a=1e3,t="fade-right",r="fade-left",s="fade-up",n=[{element:".c-promo-area--homepage .c-promo-area__content",action:t,duration:a},{element:".c-promo-area--homepage .c-promo-area__image",action:r,duration:a},{element:".c-research-promo__wrapper",action:s,duration:2e3},{element:".c-international-section .c-bleed-feature__text-container",action:r,duration:a},{element:".c-international-section .c-bleed-feature__image",action:t,duration:a},{element:".c-homepage-news-events",action:s,duration:2e3}],l=0;l<n.length;l++){var o=document.querySelector(n[l].element),d=n[l].action||r,c=n[l].duration||a;o&&e.call(o,d,c)}AOS.init({once:!0,disable:"phone"})}}();var stir=stir||{};!function(l){if(!l)return;const o=stir.filter(e=>{if(e.id&&0!==e.id)return e}),i=(e,a,t)=>{if(t.id!==e&&t.id!==a)return t},d=(e,a,t)=>{if(t<e)return a},c=(e,a,t)=>stir.filter(e=>i(a,t,e),e),u=stir.curry(e=>`
      <!-- All Events -->
      <div class="cell large-4 medium-6 small-12">
          <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small">
              <h2 class="header-stripped u-header--margin-stripped">Events</h2>
              <span class="flex-container u-gap-16 align-middle"><span class="uos-calendar u-icon h5 show-for-small-only"></span><a href="/events/" class="c-link">See all events</a></span>
          </div>
          <div class="grid-x grid-padding-x" >${e}</div>
      </div>`),m=stir.curry((e,a,t)=>`
        <!-- All News -->
        <div class="cell small-12 ${a}" >
            <div class="flex-container flex-dir-column medium-flex-dir-row align-middle u-gap u-mb-2 u-items-start-small">
                <h2 class="header-stripped u-header--margin-stripped">News</h2>
                <span class="u-flex1 flex-container u-gap-16 align-middle"><span class="uos-radio-waves u-icon h5 show-for-small-only"></span><a href="/news/" class="c-link">See all articles</a></span>
                ${3===e?'<span class="flex-container u-gap-16 align-middle"><span class="uos-calendar u-icon h5"></span><a href="/events/" class="c-link">See our events</a></span>':""}
            </div>
            <div class="grid-x grid-padding-x " >${t}</div>
        </div>`),p=stir.curry((e,a,t)=>`
      <${a} class="small-12 cell ${e}">
        <div class="u-aspect-ratio-4-3 "><a href="${t.url}"><img class="show-for-medium u-object-cover" src="${t.image}" alt="${t.imagealt}" loading="lazy"></a></div>
        <h3 class="header-stripped u-my-1 u-font-normal u-compress-line-height">
        <a href="${t.url}" class="c-link u-inline">${t.title}</a>
      </h3>
        ${t._uos.location?`<strong>${t._uos.location}</strong>`:""}
        ${r(t._uos)} 
        <p class="text-sm">${t.summary}</p>
      </${a} >`),r=e=>{var a;return e.startDate?(a=e.endDate===e.startDate?"":" until "+e.endDate,`<time class="u-block u-my-1 u-grey--dark">${e.startDate}${a}</time>`):""},g=stir.curry((e,a)=>(stir.setHTML(e,a),!0));var e,a="?v="+(new Date).getTime(),t=(t=window.location.hostname,a=a,e=stir.t4Globals,"localhost"===t||"stirweb.github.io"===t?"homepage.json"+a:e?"stiracuk-cms01-production.terminalfour.net"===t||"stiracuk-cms01-test.terminalfour.net"===t?e.preview&&e.preview.homepagefeed?e.preview.homepagefeed:null:e.homepagefeed?e.homepagefeed+a:null:null);t&&stir.getJSON(t,function(e){var t,a,i,r,s,n;void 0!==e&&e.news&&(t=1,a=e,r=stir.filter((e,a)=>d(t,e,a)),s=p("","div"),s=(a=(r=stir.compose(r,o)(a.events)).length?stir.compose(u,stir.join(""),stir.map(s))(r):"").length?2:3,i=s,r=e,s=o(r.news.primary),r=o(r.news.secondary),e=s[0]||{id:0},n=r[0]||{id:0},s=[e,n,...c(s,e.id,n.id),...c(r,e.id,n.id)],r=3===i?"medium-12 ":"large-8 medium-6 ",e=3===i?"large-4 medium-6":"large-6 medium-12",n=stir.map(p(e,"article")),e=stir.filter((e,a)=>d(i,e,a)),r=stir.compose(m(i,r),stir.join(""),n,e,o)(s),g(l,`<div class="grid-x grid-padding-x c-news-event__news">${r}${a}</div>`))})}(stir.node(".c-news-event")),function(){const a=document.querySelector("[data-placeholder-mobile]");var e;a&&(a.setAttribute("data-placeholder",a.placeholder),(e=e=>{"small"===stir.MediaQuery.current?a.placeholder=a.getAttribute("data-placeholder-mobile"):a.placeholder=a.getAttribute("data-placeholder")})(),window.addEventListener("MediaQueryChange",e))}();