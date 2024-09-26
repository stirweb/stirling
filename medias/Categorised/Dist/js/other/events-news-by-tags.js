!function(){const s=e=>{return"string"==typeof e&&e.trim().length?`${(e=e.split(" "))[0]} ${e[1].slice(0,3)} `+e[2]:""},a=(e,s)=>` <div class="cell small-12 medium-${e}">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped u-header--margin-stripped">News</h2></div>
                    ${s}
                </div>
            </div>`,n=e=>` <div class="cell small-12 medium-4">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped u-header--margin-stripped">Events</h2></div>
                    ${e}
                </div>
            </div>`,c=e=>`<div class="cell small-12 ">
                <img class="show-for-medium" src="${e.image}" alt="Image for event: ${e.title}" loading="lazy" />
                <time class="u-block u-my-1 u-grey--dark">${s(e.stirStart)} - ${s(e.stirEnd)}</time>
                <h3 class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${e.url}" class="c-link u-inline">${e.title}</a>
                </h3>
                <p class="text-sm">${e.summary}</p>
            </div>`,d=stir.curry((e,s)=>`<div class="cell small-12 medium-${e}">
                <img class="show-for-medium" src="${s.thumbnail}" alt="Image for article: ${s.title}" loading="lazy" />
                <time class="u-block u-my-1 u-grey--dark">${s.date}</time>
                <h3 class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${s.url}" class="c-link u-inline">${s.title}</a>
                </h3>
                <p class="text-sm">${s.summary}</p>
            </div>`),m=()=>Number((new Date).toISOString().split(".")[0].replaceAll(/[-:T]/g,"").slice(0,-2)),o=(e,s)=>parseInt(e.startInt)-parseInt(s.startInt),u=i=>e=>{return{...e,isupcoming:(s=i,(e=>Number(e.endInt)>s)(e))};var s},p=e=>e.id,h=e=>e.isupcoming,g=s=>e=>e.tags.includes(s),v=e=>e.filter((e,s)=>0===s);var e,i;{console.log(newsList);const $=stir.node("#newsEventListing"),f=$.dataset.tags;$&&f&&(e=UoS_env.name,i={dev:"../index.json",preview:'<t4 type="navigation" id="5214" />',default:'<t4 type="navigation" id="5214" />index.json'},fetch(i[e]||i.default).then(e=>e.ok?e.json():Promise.reject("Network response was not ok")).catch(e=>(console.error("There was a problem fetching the data:",e),[])).then(e=>{var s,i,t,l,r;e=e,s=newsList,i=f,t=$,l=m(),i=stir.compose(stir.map(c),v,stir.sort(o),stir.filter(g(i)),stir.filter(h),stir.map(u(l)),stir.filter(p))(e),l=1===i.length?2:3,e=2==l?6:4,r=2==l?8:12,e=d(e),e=stir.map(e,s).slice(0,l),t.innerHTML=a(r,e.join(""))+n(i.join(""))}))}}();