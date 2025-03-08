!function(){const s=e=>{e=new Date(e);return e.getDate()+` ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][e.getMonth()]} `+e.getFullYear()},a=(e,t)=>e?` <div class="u-aspect-ratio-16-9 ">
                <img class="show-for-medium u-object-cover" src="${e}" alt="Image for: ${t}" loading="lazy" />
              </div>`:"",i=e=>e?` <div class="cell small-12 medium-4">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">Events</h2></div>
                    ${e}
                </div>
            </div>`:"",r=e=>`<div class="cell small-12 ">
              ${a(e.metaData.image,e.title)}
                <time class="u-block u-my-1 u-grey--dark">${s(e.metaData.startDate.split("T")[0])} - ${s(e.metaData.d.split("T")[0])}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${e.metaData.page}" class=" u-inline text-sm">${e.title}</a>
                </p>
                <p class="text-sm">${e.summary}</p>
            </div>`,n=(e,t)=>` <div class="cell small-12 medium-${e}">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">News</h2></div>
                    ${t}
                </div>
            </div>`,c=stir.curry((e,t)=>`<div class="cell small-12 medium-${e}">
                 ${a(t.metaData.thumbnail,t.title)}
                <time class="u-block u-my-1 u-grey--dark">${s(t.date)}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${t.displayUrl}" class=" u-inline text-sm">${t.title.split(" | ")[0]}</a>
                </p>
                <p class="text-sm">${t.summary}</p>
            </div>`),l=e=>e.toISOString().split(".")[0].replaceAll(/[-:T]/g,"").slice(0,-2),o=()=>Number(l(new Date)),m=s=>e=>{return{...e,isupcoming:(t=s,(e=>Number(l(new Date(e.metaData.d)))>t)(e))};var t},u=e=>e.isupcoming,d=e=>e.slice(0,1),p=stir.curry((e,t)=>t.slice(0,e)),e=e=>fetch(e).then(e=>e.ok?e.json():Promise.reject("Network response was not ok")).catch(e=>(console.error("There was a problem fetching the data:",e),[]));{var t,h,g="https://"+UoS_env.search;const v=stir.node("#newsEventListing");v&&(t=v?.dataset.eventtag,h=v?.dataset.newstag,t=g+"/s/search.json?collection=stir-events&SF=[d,startDate,type,tags,page,image]&query=!null&sort=date&fmo=true&meta_tags="+t,h=g+"/s/search.json?collection=stir-main&SF=[d,type,tags,faculty,thumbnail]&query=&sort=date&fmo=true&meta_type=news&"+((g=h).includes("Faculty of")||g.includes("Management School")||g.includes("Business School")?"meta_faculty="+g:"meta_tags="+g),Promise.all([e(t),e(h)]).then(([e,t])=>{var s,a,l,e=e.response.resultPacket.results,t=t.response.resultPacket.results,e=(e=e,t=t,s=o(),s=stir.pipe(stir.map(m(s)),stir.filter(u),d,stir.map(r))(e),e=1===s.length?2:3,a=2==e?6:4,l=2==e?8:12,a=stir.pipe(stir.map(c(a)),p(e))(t),{newsContent:n(l,a.join("")),eventsContent:i(s.join(""))});v.innerHTML=e.newsContent+e.eventsContent}).catch(e=>{console.error("Error fetching data:",e)}))}}();