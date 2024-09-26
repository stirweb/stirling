!function(){const s=e=>{var s,t;return"string"==typeof e&&e.trim().length?([e,s,t]=e.split(" "),`${e} ${s.slice(0,3)} `+t):""},l=(e,s)=>` <div class="cell small-12 medium-${e}">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">News</h2></div>
                    ${s}
                </div>
            </div>`,a=e=>e?` <div class="cell small-12 medium-4">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">Events</h2></div>
                    ${e}
                </div>
            </div>`:"",n=e=>`<div class="cell small-12 ">
                <img class="show-for-medium" src="${e.image}" alt="Image for event: ${e.title}" loading="lazy" />
                <time class="u-block u-my-1 u-grey--dark">${s(e.stirStart)} - ${s(e.stirEnd)}</time>
                <h3 class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${e.url}" class="c-link u-inline">${e.title}</a>
                </h3>
                <p class="text-sm">${e.summary}</p>
            </div>`,c=stir.curry((e,s)=>{return`<div class="cell small-12 medium-${e}">
                <img class="show-for-medium" src="${s.thumbnail}" alt="Image for article: ${s.title}" loading="lazy" />
                <time class="u-block u-my-1 u-grey--dark">${e=s.date,"string"==typeof e&&e.trim().length?([t,e,i,r]=e.split(" "),`${e} ${i.slice(0,3)} `+r):""}</time>
                <h3 class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${s.url}" class="c-link u-inline">${s.title}</a>
                </h3>
                <p class="text-sm">${s.summary}</p>
            </div>`;var t,i,r}),m=()=>Number((new Date).toISOString().split(".")[0].replaceAll(/[-:T]/g,"").slice(0,-2)),o=(e,s)=>parseInt(e.startInt)-parseInt(s.startInt),d=t=>e=>{return{...e,isupcoming:(s=t,(e=>Number(e.endInt)>s)(e))};var s},u=e=>e.id,p=e=>e.isupcoming,h=s=>e=>e.tags.includes(s),v=e=>e.slice(0,1),g=stir.curry((e,s)=>s.slice(0,e));var e,t;{const $=stir.node("#newsEventListing"),f=$?.dataset.tags;$&&f&&(e=UoS_env.name,t={dev:"../index.json",preview:'<t4 type="navigation" id="5214" />',default:'<t4 type="navigation" id="5214" />index.json'},fetch(t[e]||t.default).then(e=>e.ok?e.json():Promise.reject("Network response was not ok")).catch(e=>(console.error("There was a problem fetching the data:",e),[])).then(e=>{e=e,s=newsList,t=f,i=m(),t=stir.compose(stir.map(n),v,stir.sort(o),stir.filter(h(t)),stir.filter(p),stir.map(d(i)),stir.filter(u))(e),i=1===t.length?2:3,e=2==i?6:4,r=2==i?8:12,i=stir.compose(g(i),stir.map(c(e)))(s);var s,t,i,r,e={newsContent:l(r,i.join("")),eventsContent:a(t.join(""))};$.innerHTML=e.newsContent+e.eventsContent}))}}();