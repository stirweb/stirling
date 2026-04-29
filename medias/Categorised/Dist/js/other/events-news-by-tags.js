!function(){const n=Object.freeze({items:Object.freeze({small:3,large:10}),sizes:Object.freeze({third:4,half:6,twoThirds:8,full:12}),months:Object.freeze(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])}),s=e=>{var t=new Date(e);return isNaN(t.getTime())?(console.error("Invalid date provided: "+e),""):t.getDate()+` ${n.months[t.getMonth()]} `+t.getFullYear()},a=(e,t)=>e?` <div class="u-aspect-ratio-3-2 ">
                <img class="show-for-medium u-object-cover" src="${e}" alt="Image for: ${t}" loading="lazy" />
              </div>`:"",m=stir.curry(e=>`<div class="cell small-12 u-grid-medium-up u-gap-24 u-grid-cols-2_1 u-mb-2 u-bg-white">
              <div class="u-border-width-5 u-heritage-line-left u-p-2 ">
               <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                  <a href="${e.displayUrl}" class=" u-inline text-sm">${e.title.split(" | ")[0]}</a>
                </p>
                <time class="u-block u-my-1 u-grey--dark">${s(e.date)}</time>
                <p class="text-sm">${e.summary}</p>
              </div>
<<<<<<< HEAD
               ${a(e.metaData.thumbnail,e.title)}
            </div>`),u=stir.curry(e=>{var t=e.metaData.startDate.split("T")[0]===e.metaData.d.split("T")[0]?"":" - "+s(e.metaData.d.split("T")[0]);return`<div class="cell small-12 u-grid-medium-up u-gap-24 u-grid-cols-2_1 u-mb-2 u-bg-white">
=======
               ${a(s.thumbnail,t.h1_custom)}
            </div>`}),o=stir.curry((e,t)=>{var s=t.custom_fields,r=l(s.data);return`<div class="cell small-12 medium-${e}">
                ${a(r.thumbnail,s.h1_custom)}
                <time class="u-block u-my-1 u-grey--dark">${i(s.d)}</time>
                <p class="header-stripped u-mb-1 u-font-normal u-compress-line-height">
                    <a href="${t.url}" class=" u-inline text-sm">${s.h1_custom}</a>
                </p>
                <p class="text-sm">${t.highlight}</p>
            </div>`}),c=stir.curry(e=>{var t=e.custom_fields,s=i(t.d.split("T")[0]),r=i(t.e.split("T")[0]);return`<div class="cell small-12 u-grid-medium-up u-gap-24 u-grid-cols-2_1 u-mb-2 u-bg-white">
>>>>>>> brand-2025
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
<<<<<<< HEAD
            </div>`:"",p=e=>e.toISOString().split(".")[0].replaceAll(/[-:T]/g,"").slice(0,-2),h=s=>e=>{return{...e,isupcoming:(t=s,(e=>Number(p(new Date(e.metaData.d)))>t)(e))};var t},g=e=>e.isupcoming,v=stir.curry((e,t,s)=>s.slice(e,t)),e=e=>{return e?fetch(e).then(e=>e.ok?e.json():Promise.reject("Network response was not ok")).catch(e=>(console.error("There was a problem fetching the data:",e),[])):Promise.resolve({response:{resultPacket:{results:[]}}})},r=(e,t,s)=>{var a=Number(p(new Date)),r="small"===s?1:10,l="small"===s?4:12,i=("small"===s?c:u)(),a=stir.pipe(stir.map(h(a)),stir.filter(g),v(0,r),stir.map(i))(e),{noOfNews:e,newsCellWidth:i,newsWrapperWidth:r}=(r=s,i=a.length,"small"===r?{noOfNews:r=1===i?2:3,newsCellWidth:2==r?n.sizes.half:n.sizes.third,newsWrapperWidth:2==r?n.sizes.twoThirds:n.sizes.full}:{noOfNews:n.items.large,newsCellWidth:n.sizes.full,newsWrapperWidth:n.sizes.full}),i="small"===s?o(i):m(),s="small"===s?0:1===stir.nodes('[data-type="compactevent"]').length?2:3,i=stir.pipe(stir.map(i),v(s,e))(t);return{newsContent:d(r,"News",i.join("")),eventsContent:d(l,"Events",a.join(""))}},l=(e,t)=>{e.insertAdjacentHTML("beforeend",t.newsContent+t.eventsContent)},t=e=>e.includes("Faculty of")||e.includes("Management School")||e.includes("Business School")?"meta_faculty="+e:"meta_tags="+e;var i,f,y,w,$,b;$=stir.node("#newsEventListing"),b=stir.node("#newsEventListing-10"),$&&(i=$,$="https://"+UoS_env.search,w=i?.dataset.eventtag,y=i?.dataset.newstag,w=w?$+"/s/search.json?collection=stir-events&SF=[d,startDate,type,tags,page,image]&query=!null&num_ranks=20&sort=date&fmo=true&meta_tags="+w:"",$=y?$+"/s/search.json?collection=stir-main&SF=[d,type,tags,faculty,thumbnail]&query=!null&num_ranks=20&sort=date&fmo=true&meta_type=news&"+t(y):"",Promise.all([e(w),e($)]).then(([e,t])=>{e=e.response.resultPacket.results,t=t.response.resultPacket.results,e=r(e,t,"small");l(i,e)}).catch(e=>{console.error("Error fetching data:",e)})),b&&(f=b,y="https://"+UoS_env.search,w=f?.dataset.eventtag,$=f?.dataset.newstag,w=w?y+"/s/search.json?collection=stir-events&SF=[d,startDate,type,tags,page,image]&query=!null&num_ranks=20&sort=date&fmo=true&meta_tags="+w:"",y=$?y+"/s/search.json?collection=stir-main&SF=[d,type,tags,faculty,thumbnail]&query=!null&num_ranks=20&sort=date&fmo=true&meta_type=news&"+t($):"",Promise.all([e(w),e(y)]).then(([e,t])=>{var e=e.response.resultPacket.results,t=t.response.resultPacket.results,s=r(e,t,"small"),e=r(e,t,"large");t.length&&l(f,s),l(f,e)}).catch(e=>{console.error("Error fetching data:",e)}))}();
=======
            </div>`:"",l=e=>"string"==typeof e?JSON.parse(decodeURIComponent(e)):"object"==typeof e?Object.assign({},...e.map(e=>JSON.parse(decodeURIComponent(e)))):{},p=stir.curry((e,t,s)=>s.slice(e,t)),e=e=>{return e?fetch(e).then(e=>e.ok?e.json():Promise.reject("Network response was not ok")).catch(e=>(console.error("There was a problem fetching the data:",e),[])):Promise.resolve({response:{resultPacket:{results:[]}}})},r=(e,t,s)=>{var r="small"===s?1:10,i="small"===s?4:12,a=("small"===s?m:c)(),r=stir.pipe(p(0,r),stir.map(a))(e),{noOfNews:e,newsCellWidth:a,newsWrapperWidth:l}=(a=s,e=r.length,"small"===a?{noOfNews:a=1===e?2:3,newsCellWidth:2==a?n.sizes.half:n.sizes.third,newsWrapperWidth:2==a?n.sizes.twoThirds:n.sizes.full}:{noOfNews:n.items.large,newsCellWidth:n.sizes.full,newsWrapperWidth:n.sizes.full}),a="small"===s?o(a):d(),s="small"===s?0:1===stir.nodes('[data-type="compactevent"]').length?2:3,a=stir.pipe(stir.map(a),p(s,e))(t);return{newsContent:u(l,"News",a.join("")),eventsContent:u(i,"Events",r.join(""))}},h=(e,t)=>{e.insertAdjacentHTML("beforeend",t.newsContent+t.eventsContent)},t=()=>(new Date).toISOString();var s,g,f,v,$,b,w;b=stir.node("#newsEventListing"),w=stir.node("#newsEventListing-10"),b&&(b=(s=b)?.dataset.eventtag,v=s?.dataset.newstag,$={and:[{range:{"custom_fields.e":{gt:t(),lt:"2090-12-31"}}}]},b=(f="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de")+`?term=*&customField=type%3Devent&customField=tag%3D${b}&resultType=organic&`+`&limit=15&order=asc&filter=${encodeURIComponent(JSON.stringify($))}&sort=custom_fields.d&`,$=f+`?term=*&customField=type%3Dnews&customField=tag%3D${v}&resultType=organic&sort=custom_fields.d&`,Promise.all([e(b),e($)]).then(([e,t])=>{e=e.hits,t=t.hits,e=r(e,t,"small");h(s,e)}).catch(e=>{console.error("Error fetching data:",e)})),w&&(f=(g=w)?.dataset.eventtag,v=g?.dataset.newstag,b={and:[{range:{"custom_fields.e":{gt:t(),lt:"2090-12-31"}}}]},f=($="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de")+`?term=*&customField=type%3Devent&customField=tag%3D${f}&resultType=organic&${`&limit=15&order=asc&filter=${encodeURIComponent(JSON.stringify(b))}&`}&sort=custom_fields.d&`,b=$+`?term=*&customField=type%3Dnews&customField=tag%3D${v}&resultType=organic&sort=custom_fields.d&`,Promise.all([e(f),e(b)]).then(([e,t])=>{var s=r(e.hits,t.hits,"small"),e=r(e.hits,t.hits,"large");t.hits.length&&h(g,s),h(g,e)}).catch(e=>{console.error("Error fetching data:",e)}))}();
>>>>>>> brand-2025
