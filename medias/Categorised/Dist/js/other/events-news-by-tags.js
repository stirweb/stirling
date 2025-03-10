!function(){const n=Object.freeze({items:Object.freeze({small:3,large:10}),sizes:Object.freeze({third:4,half:6,twoThirds:8,full:12}),months:Object.freeze(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])}),s=e=>{e=new Date(e);return e.getDate()+` ${n.months[e.getMonth()]} `+e.getFullYear()},a=(e,t)=>e?` <div class="u-aspect-ratio-3-2 ">
                <img class="show-for-medium u-object-cover" src="${e}" alt="Image for: ${t}" loading="lazy" />
              </div>`:"",m=stir.curry(e=>`<div class="cell small-12 u-grid-medium-up u-gap-24 u-grid-cols-2_1 u-mb-2 u-bg-white">
              <div class="u-border-width-5 u-heritage-line-left u-p-2 ">
               <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                  <a href="${e.displayUrl}" class=" u-inline text-sm">${e.title.split(" | ")[0]}</a>
                </p>
                <time class="u-block u-my-1 u-grey--dark">${s(e.date)}</time>
                <p class="text-sm">${e.summary}</p>
              </div>
               ${a(e.metaData.thumbnail,e.title)}
            </div>`),u=stir.curry(e=>{var t=e.metaData.startDate.split("T")[0]===e.metaData.d.split("T")[0]?"":" - "+s(e.metaData.d.split("T")[0]);return`<div class="cell small-12 u-grid-medium-up u-gap-24 u-grid-cols-2_1 u-mb-2 u-bg-white">
              <div class="u-border-width-5 u-heritage-line-left u-p-2">  
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                  <a href="${e.metaData.page}" class=" u-inline text-sm">${e.title}</a>
                </p>
                 <time class="u-block u-my-1 u-grey--dark">${s(e.metaData.startDate.split("T")[0])} ${t}</time>
                <p class="text-sm">${e.summary}</p>
              </div>
              ${a(e.metaData.image,e.title)}
            </div>`}),c=stir.curry(e=>{var t=e.metaData.startDate.split("T")[0]===e.metaData.d.split("T")[0]?"":" - "+s(e.metaData.d.split("T")[0]);return`<div class="cell small-12" data-type="compactevent">
              ${a(e.metaData.image,e.title)}
                <time class="u-block u-my-1 u-grey--dark">${s(e.metaData.startDate.split("T")[0])} ${t}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${e.metaData.page}" class=" u-inline text-sm">${e.title}</a>
                </p>
                <p class="text-sm">${e.summary}</p>
            </div>`}),o=stir.curry((e,t)=>`<div class="cell small-12 medium-${e}">
                 ${a(t.metaData.thumbnail,t.title)}
                <time class="u-block u-my-1 u-grey--dark">${s(t.date)}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${t.displayUrl}" class=" u-inline text-sm">${t.title.split(" | ")[0]}</a>
                </p>
                <p class="text-sm">${t.summary}</p>
            </div>`),d=(e,t,s)=>s?`<div class="cell small-12 medium-${e} u-mt-3">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">${t}</h2></div>
                    ${s}
                </div>
            </div>`:"",p=e=>e.toISOString().split(".")[0].replaceAll(/[-:T]/g,"").slice(0,-2),h=s=>e=>{return{...e,isupcoming:(t=s,(e=>Number(p(new Date(e.metaData.d)))>t)(e))};var t},g=e=>e.isupcoming,v=stir.curry((e,t,s)=>s.slice(e,t)),e=e=>{return e?fetch(e).then(e=>e.ok?e.json():Promise.reject("Network response was not ok")).catch(e=>(console.error("There was a problem fetching the data:",e),[])):Promise.resolve({response:{resultPacket:{results:[]}}})},l=(e,t,s)=>{var a=Number(p(new Date)),l="small"===s?1:10,r="small"===s?4:12,i=("small"===s?c:u)(),a=stir.pipe(stir.map(h(a)),stir.filter(g),v(0,l),stir.map(i))(e),{noOfNews:e,newsCellWidth:i,newsWrapperWidth:l}=(l=s,i=a.length,"small"===l?{noOfNews:l=1===i?2:3,newsCellWidth:2==l?n.sizes.half:n.sizes.third,newsWrapperWidth:2==l?n.sizes.twoThirds:n.sizes.full}:{noOfNews:n.items.large,newsCellWidth:n.sizes.full,newsWrapperWidth:n.sizes.full}),i="small"===s?o(i):m(),s="small"===s?0:1===stir.nodes('[data-type="compactevent"]').length?2:3,i=stir.pipe(stir.map(i),v(s,e))(t);return{newsContent:d(l,"News",i.join("")),eventsContent:d(r,"Events",a.join(""))}},r=(e,t)=>{e.insertAdjacentHTML("beforeend",t.newsContent+t.eventsContent)},t=e=>e.includes("Faculty of")||e.includes("Management School")||e.includes("Business School")?"meta_faculty="+e:"meta_tags="+e;var i,f,y,w,$,b;$=stir.node("#newsEventListing"),b=stir.node("#newsEventListing-10"),$&&(i=$,$="https://"+UoS_env.search,w=i?.dataset.eventtag,y=i?.dataset.newstag,w=w?$+"/s/search.json?collection=stir-events&SF=[d,startDate,type,tags,page,image]&query=!null&num_ranks=20&sort=date&fmo=true&meta_tags="+w:"",$=y?$+"/s/search.json?collection=stir-main&SF=[d,type,tags,faculty,thumbnail]&query=!null&num_ranks=20&sort=date&fmo=true&meta_type=news&"+t(y):"",Promise.all([e(w),e($)]).then(([e,t])=>{e=e.response.resultPacket.results,t=t.response.resultPacket.results,e=l(e,t,"small");r(i,e)}).catch(e=>{console.error("Error fetching data:",e)})),b&&(f=b,y="https://"+UoS_env.search,w=f?.dataset.eventtag,$=f?.dataset.newstag,w=w?y+"/s/search.json?collection=stir-events&SF=[d,startDate,type,tags,page,image]&query=!null&num_ranks=20&sort=date&fmo=true&meta_tags="+w:"",y=$?y+"/s/search.json?collection=stir-main&SF=[d,type,tags,faculty,thumbnail]&query=!null&num_ranks=20&sort=date&fmo=true&meta_type=news&"+t($):"",Promise.all([e(w),e(y)]).then(([e,t])=>{var e=e.response.resultPacket.results,t=t.response.resultPacket.results,s=l(e,t,"small"),e=l(e,t,"large");r(f,s),r(f,e)}).catch(e=>{console.error("Error fetching data:",e)}))}();