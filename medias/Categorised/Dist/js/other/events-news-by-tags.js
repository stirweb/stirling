!function(){const n=Object.freeze({items:Object.freeze({small:3,large:10}),sizes:Object.freeze({third:4,half:6,twoThirds:8,full:12}),months:Object.freeze(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])}),i=e=>{var t=new Date(e);return isNaN(t.getTime())?(console.error("Invalid date provided: "+e),""):t.getDate()+` ${n.months[t.getMonth()]} `+t.getFullYear()},a=(e,t)=>e?` <div class="u-aspect-ratio-3-2 ">
                <img class="show-for-medium u-object-cover" src="${e}" alt="Image for: ${t}" loading="lazy" />
              </div>`:"",d=stir.curry(e=>{var t=e.custom_fields,s=l(t.data);return`<div class="cell small-12 u-grid-medium-up u-gap-24 u-grid-cols-2_1 u-mb-2 u-bg-white">
              <div class="u-border-width-5 u-heritage-line-left u-p-2 ">
               <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                  <a href="${e.url}" class=" u-inline text-sm">${t.h1_custom}</a>
                </p>
                <time class="u-block u-my-1 u-grey--dark">${i(t.d)}</time>
                <p class="text-sm">${e.highlight}</p>
              </div>
               ${a(s.thumbnail,t.h1_custom)}
            </div>`}),c=stir.curry((e,t)=>{var s=t.custom_fields,r=l(s.data);return`<div class="cell small-12 medium-${e}">
                ${a(r.thumbnail,s.h1_custom)}
                <time class="u-block u-my-1 u-grey--dark">${i(s.d)}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${t.url}" class=" u-inline text-sm">${s.h1_custom}</a>
                </p>
                <p class="text-sm">${t.highlight}</p>
            </div>`}),o=stir.curry(e=>{var t=e.custom_fields,s=i(t.d.split("T")[0]),r=i(t.e.split("T")[0]);return`<div class="cell small-12 u-grid-medium-up u-gap-24 u-grid-cols-2_1 u-mb-2 u-bg-white">
              <div class="u-border-width-5 u-heritage-line-left u-p-2">  
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                  <a href="${e.url}" class=" u-inline text-sm">${t.name}</a>
                </p>
                 <time class="u-block u-my-1 u-grey--dark">${s} ${r===s?"":"-"+r}</time>
                <p class="text-sm">${t.snippet}</p>
              </div>
             ${a(t.image,t.name)}
            </div>`}),m=stir.curry(e=>{var t=e.custom_fields,s=i(t.d.split("T")[0]),r=i(t.e.split("T")[0]);return`<div class="cell small-12" data-type="compactevent">
              ${a(t.image,t.name)}
                <time class="u-block u-my-1 u-grey--dark">${s} ${r===s?"":"-"+r}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${e.url}" class=" u-inline text-sm">${t.name}</a>
                </p>
                <p class="text-sm">${t.snippet}</p>
            </div>`}),u=(e,t,s)=>s?`<div class="cell small-12 medium-${e} u-mt-3">
                <div class="grid-x">
                    <div class="cell"><h2 class="header-stripped">${t}</h2></div>
                    ${s}
                </div>
            </div>`:"",l=e=>"string"==typeof e?JSON.parse(decodeURIComponent(e)):"object"==typeof e?Object.assign({},...e.map(e=>JSON.parse(decodeURIComponent(e)))):{},p=stir.curry((e,t,s)=>s.slice(e,t)),e=e=>{return e?fetch(e).then(e=>e.ok?e.json():Promise.reject("Network response was not ok")).catch(e=>(console.error("There was a problem fetching the data:",e),[])):Promise.resolve({response:{resultPacket:{results:[]}}})},r=(e,t,s)=>{var r="small"===s?1:10,i="small"===s?4:12,a=("small"===s?m:o)(),r=stir.pipe(p(0,r),stir.map(a))(e),{noOfNews:e,newsCellWidth:a,newsWrapperWidth:l}=(a=s,e=r.length,"small"===a?{noOfNews:a=1===e?2:3,newsCellWidth:2==a?n.sizes.half:n.sizes.third,newsWrapperWidth:2==a?n.sizes.twoThirds:n.sizes.full}:{noOfNews:n.items.large,newsCellWidth:n.sizes.full,newsWrapperWidth:n.sizes.full}),a="small"===s?c(a):d(),s="small"===s?0:1===stir.nodes('[data-type="compactevent"]').length?2:3,a=stir.pipe(stir.map(a),p(s,e))(t);return{newsContent:u(l,"News",a.join("")),eventsContent:u(i,"Events",r.join(""))}},h=(e,t)=>{e.insertAdjacentHTML("beforeend",t.newsContent+t.eventsContent)},t=()=>(new Date).toISOString();var s,g,f,v,$,b,w;b=stir.node("#newsEventListing"),w=stir.node("#newsEventListing-10"),b&&(b=(s=b)?.dataset.eventtag,v=s?.dataset.newstag,$={and:[{range:{"custom_fields.e":{gt:t(),lt:"2090-12-31"}}}]},b=(f="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de")+`?term=*&customField=type%3Devent&customField=tag%3D${b}&resultType=organic&`+`&limit=15&order=asc&filter=${encodeURIComponent(JSON.stringify($))}&sort=custom_fields.d&`,$=f+`?term=*&customField=type%3Dnews&customField=tag%3D${v}&resultType=organic&`,Promise.all([e(b),e($)]).then(([e,t])=>{e=e.hits,t=t.hits,e=r(e,t,"small");h(s,e)}).catch(e=>{console.error("Error fetching data:",e)})),w&&(f=(g=w)?.dataset.eventtag,v=g?.dataset.newstag,b={and:[{range:{"custom_fields.e":{gt:t(),lt:"2090-12-31"}}}]},f=($="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de")+`?term=*&customField=type%3Devent&customField=tag%3D${f}&resultType=organic&${`&limit=15&order=asc&filter=${encodeURIComponent(JSON.stringify(b))}&`}&sort=custom_fields.d&`,b=$+`?term=*&customField=type%3Dnews&customField=tag%3D${v}&resultType=organic&sort=custom_fields.d&`,Promise.all([e(f),e(b)]).then(([e,t])=>{var s=r(e.hits,t.hits,"small"),e=r(e.hits,t.hits,"large");t.hits.length&&h(g,s),h(g,e)}).catch(e=>{console.error("Error fetching data:",e)}))}();