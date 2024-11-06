!function(){var e=s=>e=>"string"==typeof e&&e.trim().length?s(e.split(" ")):"";const t=e(([,e,s,t])=>`${e} ${s.slice(0,3)} `+t),s=e(([e,s,t])=>`${e} ${s.slice(0,3)} `+t),l=(e,s)=>` <div class="cell small-12 medium-${e}">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">News</h2></div>
                    ${s}
                </div>
            </div>`,r=e=>e?` <div class="cell small-12 medium-4">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">Events</h2></div>
                    ${e}
                </div>
            </div>`:"",n=e=>`<div class="cell small-12 ">
              <div class="u-aspect-ratio-16-9 ">
                <img class="show-for-medium u-object-cover" src="${e.image}" alt="Image for event: ${e.title}" loading="lazy" />
              </div>
                <time class="u-block u-my-1 u-grey--dark">${s(e.stirStart)} - ${s(e.stirEnd)}</time>
                <h3 class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${e.url}" class="c-link u-inline">${e.title}</a>
                </h3>
                <p class="text-sm">${e.summary}</p>
            </div>`,c=stir.curry((e,s)=>`<div class="cell small-12 medium-${e}">
                <div class="u-aspect-ratio-16-9 ">
                  <img class="show-for-medium u-object-cover" src="${s.thumbnail}" alt="Image for article: ${s.title}" loading="lazy" />
                </div>
                <time class="u-block u-my-1 u-grey--dark">${t(s.date)}</time>
                <h3 class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${s.url}" class="c-link u-inline">${s.title}</a>
                </h3>
                <p class="text-sm">${s.summary}</p>
            </div>`),d=()=>Number((new Date).toISOString().split(".")[0].replaceAll(/[-:T]/g,"").slice(0,-2)),o=(e,s)=>parseInt(e.startInt)-parseInt(s.startInt),m=t=>e=>{return{...e,isupcoming:(s=t,(e=>Number(e.endInt)>s)(e))};var s},u=e=>e.id,p=e=>e.isupcoming,v=s=>e=>e.tags.includes(s),h=e=>e.slice(0,1),g=stir.curry((e,s)=>s.slice(0,e));var i;{const $=stir.node("#newsEventListing"),f=$?.dataset.tags;$&&f&&(e=UoS_env.name,i={dev:"../index.json",preview:'<t4 type="navigation" id="5214" />',default:'<t4 type="navigation" id="5214" />index.json'},fetch(i[e]||i.default).then(e=>e.ok?e.json():Promise.reject("Network response was not ok")).catch(e=>(console.error("There was a problem fetching the data:",e),[])).then(e=>{e=e,s=newsList,a=f,t=d(),t=stir.pipe(stir.filter(u),stir.map(m(t)),stir.filter(p),stir.filter(v(a)),stir.sort(o),h,stir.map(n))(e),a=1===t.length?2:3,e=2==a?6:4,i=2==a?8:12,e=stir.pipe(stir.map(c(e)),g(a))(s);var s,t,i,a={newsContent:l(i,e.join("")),eventsContent:r(t.join(""))};$.innerHTML=a.newsContent+a.eventsContent}))}}();