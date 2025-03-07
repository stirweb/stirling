!function(){const s=e=>{e=new Date(e);return e.getDate()+` ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][e.getMonth()]} `+e.getFullYear()},l=e=>e?` <div class="cell small-12 medium-4">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">Events</h2></div>
                    ${e}
                </div>
            </div>`:"",i=e=>`<div class="cell small-12 ">
              <div class="u-aspect-ratio-16-9 ">
                <img class="show-for-medium u-object-cover" src="${e.metaData.image}" alt="Image for event: ${e.title}" loading="lazy" />
              </div>
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
                <div class="u-aspect-ratio-16-9 ">
                  <img class="show-for-medium u-object-cover" src="${t.metaData.thumbnail}" alt="Image for article: ${t.title}" loading="lazy" />
                </div>
                <time class="u-block u-my-1 u-grey--dark">${s(t.date)}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${t.url}" class=" u-inline text-sm">${t.title.split(" | ")[0]}</a>
                </p>
                <p class="text-sm">${t.summary}</p>
            </div>`),a=e=>e.toISOString().split(".")[0].replaceAll(/[-:T]/g,"").slice(0,-2),o=()=>Number(a(new Date)),m=s=>e=>{return{...e,isupcoming:(t=s,(e=>Number(a(new Date(e.metaData.d)))>t)(e))};var t},d=e=>e.isupcoming,u=e=>e.slice(0,1),p=stir.curry((e,t)=>t.slice(0,e)),e=e=>fetch(e).then(e=>e.ok?e.json():Promise.reject("Network response was not ok")).catch(e=>(console.error("There was a problem fetching the data:",e),[]));{var t="prod"===UoS_env.name||"dev"===UoS_env.name?"https://search.stir.ac.uk":"https://stage-shared-15-24-search.clients.uk.funnelback.com";const g=stir.node("#newsEventListing");var r=g?.dataset.eventtag,v=g?.dataset.newstag;g&&(r=t+"/s/search.json?collection=stir-events&SF=[d,startDate,type,tags,page,image]&query=!null&sort=date&fmo=true&meta_tags="+r,t=t+"/s/search.json?collection=stir-main&SF=[d,type,tags,facult,thumbnail]&query=&sort=date&fmo=true&meta_type=news&meta_tags="+v,Promise.all([e(r),e(t)]).then(([e,t])=>{var s,a,r,e=e.response.resultPacket.results,t=t.response.resultPacket.results,e=(console.log("Events:",e),console.log("News:",t),e=e,t=t,s=o(),s=stir.pipe(stir.map(m(s)),stir.filter(d),u,stir.map(i))(e),e=1===s.length?2:3,a=2==e?6:4,r=2==e?8:12,a=stir.pipe(stir.map(c(a)),p(e))(t),{newsContent:n(r,a.join("")),eventsContent:l(s.join(""))});g.innerHTML=e.newsContent+e.eventsContent}).catch(e=>{console.error("Error fetching data:",e)}))}}();