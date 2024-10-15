!function(){var e=document.getElementById("news-related-list");if(window.relatedArticles&&e){var t=document.head.querySelector('meta[name="stir.news.article.id"]');const r=t&&t.getAttribute("content")?t.getAttribute("content"):0;e&&(t=relatedArticles.filter(e=>{if(e.id&&e.id!==r)return e}).filter((e,t)=>{if(t<3)return e}),e.insertAdjacentHTML("beforeend",t.map(e=>`<article class="cell large-4 medium-6 small-12" aria-label="${e.title}">
                <!--  a href="${e.url}" ><img class="show-for-medium" src="${e.image}" alt="${e.title}"></ -->
                <time class="u-block u-my-1 u-dark-grey">${stir.formatStirDate(new Date(e.date_published))}</time>
                <h3 class="header-stripped u-header--margin-stripped u-mt-1 u-font-normal u-compress-line-height"><a href="${e.url}" class="c-link u-inline" >${e.title}</a></h3>
                <p class="text-sm">${e.summary}</p>
            </article>`).join("")))}}();