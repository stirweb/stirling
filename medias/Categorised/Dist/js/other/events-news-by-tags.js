!function(){const n=Object.freeze({items:Object.freeze({small:3,large:10}),sizes:Object.freeze({third:4,half:6,twoThirds:8,full:12}),months:Object.freeze(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])}),r=e=>{var s=new Date(e);return isNaN(s.getTime())?(console.error("Invalid date provided: "+e),""):s.getDate()+` ${n.months[s.getMonth()]} `+s.getFullYear()};const o=stir.curry(e=>{var s=e.custom_fields;return`<div class="cell small-12 u-grid-medium-up u-gap-24 u-grid-cols-2_1 u-mb-2 u-bg-white">
              <div class="u-border-width-5 u-heritage-line-left u-p-2 ">
               <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                  <a href="${e.url}" class=" u-inline text-sm">${s.h1_custom}</a>
                </p>
                <time class="u-block u-my-1 u-grey--dark">${r(s.d)}</time>
                <p class="text-sm">${s.snippet}</p>
              </div>
              
            </div>`}),c=stir.curry((e,s)=>{var t=s.custom_fields;return`<div class="cell small-12 medium-${e}">
                
                <time class="u-block u-my-1 u-grey--dark">${r(t.d)}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${s.url}" class=" u-inline text-sm">${t.h1_custom}</a>
                </p>
                <p class="text-sm">${s.highlight}</p>
            </div>`}),d=stir.curry(e=>{var s=e.custom_fields;return`<div class="cell small-12 u-grid-medium-up u-gap-24 u-grid-cols-2_1 u-mb-2 u-bg-white">
              <div class="u-border-width-5 u-heritage-line-left u-p-2">  
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                  <a href="${e.url}" class=" u-inline text-sm">${s.name}</a>
                </p>
                 <time class="u-block u-my-1 u-grey--dark">${r(s.d.split("T")[0])} ${""}</time>
                <p class="text-sm">${s.snippet}</p>
              </div>
             
            </div>`}),m=stir.curry(e=>{var s=e.custom_fields;return`<div class="cell small-12" data-type="compactevent">
              
                <time class="u-block u-my-1 u-grey--dark">${r(s.d.split("T")[0])} ${""}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${e.url}" class=" u-inline text-sm">${s.name}</a>
                </p>
                <p class="text-sm">${s.snippet}</p>
            </div>`}),u=(e,s,t)=>t?`<div class="cell small-12 medium-${e} u-mt-3">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">${s}</h2></div>
                    ${t}
                </div>
            </div>`:"";const p=stir.curry((e,s,t)=>t.slice(e,s)),e=e=>{return e?fetch(e).then(e=>e.ok?e.json():Promise.reject("Network response was not ok")).catch(e=>(console.error("There was a problem fetching the data:",e),[])):Promise.resolve({response:{resultPacket:{results:[]}}})},l=(e,s,t)=>{var r="small"===t?1:10,l="small"===t?4:12,i=("small"===t?m:d)(),r=stir.pipe(p(0,r),stir.map(i))(e),{noOfNews:e,newsCellWidth:i,newsWrapperWidth:a}=(i=t,e=r.length,"small"===i?{noOfNews:i=1===e?2:3,newsCellWidth:2==i?n.sizes.half:n.sizes.third,newsWrapperWidth:2==i?n.sizes.twoThirds:n.sizes.full}:{noOfNews:n.items.large,newsCellWidth:n.sizes.full,newsWrapperWidth:n.sizes.full}),i="small"===t?c(i):o(),t="small"===t?0:1===stir.nodes('[data-type="compactevent"]').length?2:3,i=stir.pipe(stir.map(i),p(t,e))(s);return{newsContent:u(a,"News",i.join("")),eventsContent:u(l,"Events",r.join(""))}},i=(e,s)=>{e.insertAdjacentHTML("beforeend",s.newsContent+s.eventsContent)};var t,a,s,h,g,v,f;const w=()=>(new Date).toISOString();v=stir.node("#newsEventListing"),f=stir.node("#newsEventListing-10"),v&&(v=(t=v)?.dataset.eventtag,h=t?.dataset.newstag,g={and:[{range:{"custom_fields.e":{gt:w(),lt:"2090-12-31"}}}]},v=(s="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de")+`?term=*&customField=type%3Devent&customField=tag%3D${v}&resultType=organic&`+`&limit=15&order=asc&filter=${encodeURIComponent(JSON.stringify(g))}&sort=custom_fields.sort&`,g=s+`?term=*&customField=type%3Dnews&customField=tag%3D${h}&resultType=organic&`,Promise.all([e(v),e(g)]).then(([e,s])=>{e=e.hits,s=s.hits,e=l(e,s,"small");i(t,e)}).catch(e=>{console.error("Error fetching data:",e)})),f&&(s=(a=f)?.dataset.eventtag,h=a?.dataset.newstag,v={and:[{range:{"custom_fields.e":{gt:w(),lt:"2090-12-31"}}}]},s=(g="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de")+`?term=*&customField=type%3Devent&customField=tag%3D${s}&resultType=organic&`+`&limit=15&order=asc&filter=${encodeURIComponent(JSON.stringify(v))}&sort=custom_fields.sort&`,v=g+`?term=*&customField=type%3Dnews&customField=tag%3D${h}&resultType=organic&`,Promise.all([e(s),e(v)]).then(([e,s])=>{console.log("events"),console.log(e.hits),console.log("news"),console.log(s.hits);var e=e.hits,s=s.hits,t=l(e,s,"small"),e=l(e,s,"large");s.length&&i(a,t),i(a,e)}).catch(e=>{console.error("Error fetching data:",e)}))}();