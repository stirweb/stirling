const staffNode=document.querySelector("#eventsstaff"),publicNode=document.querySelector("#eventspublic"),artNode=document.querySelector("#eventsart"),archiveNode=document.querySelector("#eventsarchive"),promoNode=document.querySelector("#eventspromo"),searchAPI="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de",searchUrl=searchAPI+"?term=*&customField=type%3Devent&",renderDates=e=>e.end===e.start?`<time datetime="${e.startISO}">${e.start}</time>`:`<time datetime="${e.startISO}">${e.start}</time> - <time datetime="${e.endISO}">${e.end}</time>`,renderWeeTab=e=>`
        <div class="u-absolute u-top--16">
            <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">Event series</span>
        </div>`,renderSeriesInfo=(t,e)=>{return t?(e=e&&e.find(e=>e.title===t))?`<p class="text-sm">Part of the <a href="${e?e.url:"#"}">${t}</a> series.</p>`:`<p class="text-sm">Part of the ${t} series.</p>`:""},renderFavBtns=(e,t,r)=>t.length?stir.favourites.renderRemoveBtn(r,t[0].date,e):stir.favourites.renderAddBtn(r,e),renderArchiveEvent=stir.curry((e,t)=>{var r="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},a=t.custom_fields,n=getEventDateTimes(a.d,a.e);return`
          <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2 " data-result-type="event">
                  <div class="u-grid-medium-up u-gap-24  ">
                    <div class=" u-flex flex-dir-column u-gap u-mt-1 ">
                        <p class="u-text-regular u-m-0">
                            <strong><a href="${t.url}">${a.h1_custom}</a></strong>
                        </p>
                        <div class="u-flex flex-dir-column u-gap-8">
                            <div class="u-flex u-gap-16 align-middle">
                                  <span class="u-icon h5 uos-calendar"></span>
                                  <span>${renderDates(n)}</span>
                            </div>
                        </div>
                        <p class="u-m-0">${a.snippet}</p>
                        ${renderSeriesInfo(r.isSeriesChild,e)}
                    </div>

                  </div>
            </div>`}),renderImage=(e,t)=>e?`<div class="u-mt-1">
            <img src="${e}" width="275" height="275" alt="Image: ${t}"></div>
         </div>`:"<div></div>",renderTimes=(e,t)=>`
      <div class="u-flex u-gap-16 align-middle">
        <span class="uos-clock u-icon h5"></span>
        <span><time>${e}</time> – <time>${t}</time></span>
      </div>`,renderInfoTag=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${e}</span>`:"",renderEvent=stir.curry((e,t)=>{var r,a,n,i,s,o;return t.hide?"":(r="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},a=t.custom_fields,i=(n=getEventDateTimes(t.start,t.end)).start===n.end,s=stir.favourites&&stir.favourites.getFav(a.sid,"event"),o=t.repeater?a.sid+"|"+new Date(t.start).getTime():a.sid,`
        <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" data-result-type="event"
        data-label-icon="${r.isSeries?"startdates":""}" data-perf="172580">
        ${r.isSeries?renderWeeTab(t):""}
            <div class="u-grid-medium-up u-gap-24 ${a.image?"u-grid-cols-3_1":""}">
                <div class=" u-flex flex-dir-column u-gap u-mt-1">
                    <p class="u-text-regular u-m-0">
                        <strong> <a href="${t.url}">${a.h1_custom}</a> </strong>
                    </p>
                    <div class="u-flex flex-dir-column u-gap-8">
                    <div class="u-flex u-gap-16 align-middle">
                        <span class="u-icon h5 uos-calendar"></span>
                        <span>${renderDates(n)}</span>
                    </div>
                    ${i?renderTimes(t.startTime,t.endTime):""}
                    <div class="u-flex u-gap-16 align-middle">
                        <span class="u-icon h5 uos-location "></span>
                        <span>${r.location||""}</span>
                    </div>
                    </div>
                    <p class="u-m-0">${a.snippet||""}</p>
                    ${renderSeriesInfo(r.isSeriesChild,e)}
                </div>
                ${renderImage(a.image,a.h1_custom)}
                <div class="u-mt-2">
                    <div id="favbtns${o}">${s&&renderFavBtns("true",s,o)}</div>
                 </div>
            </div>
        </div>`)}),rendereventsPromo=stir.curry((e,t)=>{var r=t.custom_fields,a=getEventDateTimes(r.d,r.e),n="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},i=stir.favourites&&stir.favourites.getFav(r.sid,"event"),s=t.repeater?r.sid+"|"+new Date(t.start).getTime():r.sid,o=a.start===a.end;return`<div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell small-12 ${r.image?"medium-8":""} ">
                <div class="u-relative u-p-2 u-flex flex-dir-column u-gap-8 u-h-full">
                <div class="u-flex1">
                  ${t.isSeries?renderTab("Event series"):""}
                  <p class="u-text-regular u-mb-2">
                  ${renderInfoTag(n.cancelled)} ${renderInfoTag(n.rescheduled)} <strong><a href="${t.url}">${r.h1_custom}</a></strong>
                  </p>
                  <div class="u-flex flex-dir-column u-gap-8 u-mb-1">
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 uos-calendar"></span>
                          <span>${renderDates(a)}</span>
                      </div>
                     ${o?renderTimes(a.start,a.end):""}
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"}"></span>
                          <span>${n.location}</span>
                      </div>
                  </div>
                  <p class="u-m-0 text-sm">${r.snippet}</p>
                  ${t.isSeriesChild?renderSeriesInfo(t.isSeriesChild,e):""}
                 </div>
                   <div id="favbtns${s}">${i&&renderFavBtns("true",i,s)}</div>
                </div>
            </div>
            ${r.image?`<div class="cell medium-4"><img src="${r.image}" class="u-object-cover" width="800" height="800" alt="Image: ${r.h1_custom}" /></div>`:""}  
        </div>`}),renderMoreButton=e=>`<div class="loadmorebtn u-flex align-center u-mb-2"><button class="button hollow tiny" data-page="${e}">Load more results</button></div>
        `,renderNoEvents=e=>`<div id="eventsarchive" class="cell large-8 large-order-2 u-mt-3-small ">
            <div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No events found.</p></div>
          </div>`,getEventDateTimes=(e,t)=>{var r={day:"numeric",month:"long",year:"numeric"},a=new Date(e),n=new Date(t);return{start:a.toLocaleDateString("en-GB",r),end:n.toLocaleDateString("en-GB",r),startTime:e.split("T")[1].slice(0,5),endTime:t.split("T")[1].slice(0,5),startISO:a.toISOString().slice(0,10),endISO:n.toISOString().slice(0,10)}},getNow=()=>(new Date).toISOString();function getArchiveFilterString(e,t){var r=[{"custom_fields.tag":"Archive"},{range:{"custom_fields.e":{gt:"2015-01-01",lt:getNow()}}}],e=("All"!==e&&r.push({"custom_fields.tag":e}),{and:r});return`&limit=${t}&order=desc&filter=${encodeURIComponent(JSON.stringify(e))}&sort=custom_fields.e&`}const getUpcomingObject=(e,t,r)=>{e={and:[{"custom_fields.tag":r},{not:{"custom_fields.tag":"Promo"}},{range:{"custom_fields.e":{gt:e,lt:t}}}]};return"Art Collection"!==r&&e.and.push({not:{"custom_fields.tag":"Art Collection"}}),e},getFilterString=e=>"staff"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(getUpcomingObject(getNow(),"2099-12-31","StaffStudent")))}&sort=custom_fields.sort&`:"art"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(getUpcomingObject(getNow(),"2099-12-31","Art Collection")))}&sort=custom_fields.sort&`:"public"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(getUpcomingObject(getNow(),"2099-12-31","Public")))}&sort=custom_fields.sort&`:void 0;function getEvery7Days(e,t){for(var r=[],a=new Date(e),n=new Date;a<=new Date(t);)n<a&&r.push(new Date(a)),a.setDate(a.getDate()+7);return r}function combineDateAndTime(e,t){e=new Date(e);return e.setFullYear(t.getFullYear()),e.setMonth(t.getMonth()),e.setDate(t.getDate()),e}function isNextMonth(e){var t=new Date(e.start),e=new Date(e.end),r=new Date,a=new Date(r.getFullYear(),r.getMonth()+1,1);return t<=new Date(r.getFullYear(),r.getMonth()+2,0)&&a<=e}function isThisMonth(e){var t=new Date(e.start),e=new Date(e.end),r=new Date,a=new Date(r.getFullYear(),r.getMonth(),1);return t<=new Date(r.getFullYear(),r.getMonth()+1,0)&&a<=e}function isThisWeek(e){var t=new Date(e.start),e=new Date(e.end),r=new Date,a=new Date(r.getFullYear(),r.getMonth(),r.getDate()-r.getDay());return t<=new Date(r.getFullYear(),r.getMonth(),r.getDate()+6-r.getDay())&&a<=e}function isNextWeek(e){var t=new Date(e.start),e=new Date(e.end),r=new Date,a=new Date(r.getFullYear(),r.getMonth(),r.getDate()+7-r.getDay());return t<=new Date(r.getFullYear(),r.getMonth(),r.getDate()+13-r.getDay())&&a<=e}const updateFavouriteBtn=r=>{const a=stir.favourites.getFav(r,"event");document.querySelectorAll(`[id*="favbtns${r}"]`).forEach(e=>{var t=renderFavBtns("true",a,r);e.innerHTML=t})},handleFavouriteBtnClick=()=>e=>{var t,e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&("addtofavs"===e.dataset.action&&(t=e.dataset.id.split("|")[0],stir.favourites.addToFavs(t,"event"),updateFavouriteBtn(t)),"removefav"===e.dataset.action)&&(t=e.dataset.id.split("|")[0],stir.favourites.removeFromFavs(t),updateFavouriteBtn(t))};async function doSeriesSearch(){var e=searchUrl+`&limit=50&order=asc&filter=${encodeURIComponent(JSON.stringify({and:[{"custom_fields.tag":"Series"}]}))}&sort=custom_fields.sort`;try{return(await(await fetch(e)).json()).hits.map(e=>{return{title:e.custom_fields.h1_custom,url:e.url}})}catch(e){throw console.error("Error fetching data:",e),e}}function doArchiveSearch(t,i,e){var r=i.parentNode.querySelectorAll("input[type='radio']");const s=renderArchiveEvent(e);r&&r.forEach(e=>{e.checked=!1,"All"===e.value&&(e.checked=!0)});e=getArchiveFilterString("All",10);fetch(t+e+"page=1").then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,e=e.hits.map(s).join(""),t=1<t?renderMoreButton(2):"";i.innerHTML=e+t}).catch(e=>console.error("Error fetching data:",e)),i.addEventListener("click",function(a){if("BUTTON"===a.target.tagName){const n=a.target.getAttribute("data-page");var e=getArchiveFilterString(i.parentNode.querySelector("input[type='radio']:checked").value,10);fetch(t+e+("page="+n)).then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,r=Number(n),e=e.hits.map(s).join(""),r=(a.target.parentNode.remove(),r<t?renderMoreButton(Number(n)+1):"");i.insertAdjacentHTML("beforeend",e+r)}).catch(e=>console.error("Error fetching data:",e))}}),r&&r.forEach(e=>{e.addEventListener("click",function(e){e.stopPropagation();e=getArchiveFilterString(e.target.value,10);fetch(t+e+"page=1").then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,e=0===Number(e.total_hits)?renderNoEvents():e.hits.map(s).join(""),t=1<t?renderMoreButton(2):"";i.innerHTML=e+t}).catch(e=>console.error("Error fetching data:",e))})})}function doSearch(e,t,a,r){t=getFilterString(t);const n=renderEvent(r);fetch(e+t+"page=1").then(e=>e.json()).then(e=>{const o=[];const r=e.hits.map(n=>{const a=n.custom_fields,i=a.d.split("T")[1].split(":")[0]+":"+a.d.split("T")[1].split(":")[1],s=a.e.split("T")[1].split(":")[0]+":"+a.e.split("T")[1].split(":")[1];let e=!1;a.data&&Array.isArray(a.data)&&(a.data.filter(e=>{e=JSON.parse(decodeURIComponent(e));if(e.type&&"perf"===e.type)return e}).map(e=>JSON.parse(decodeURIComponent(e))).forEach(e=>{var t=e.start.split("T")[1].split(":")[0]+":"+e.start.split("T")[1].split(":")[1],r=e.end.split("T")[1].split(":")[0]+":"+e.end.split("T")[1].split(":")[1],a=Number(String(e.pin).substring(0,10)),e={...n,...e,startTime:t,endTime:r,sort:a,repeater:!0};o.push(e)}),0<a.data.filter(e=>{e=JSON.parse(decodeURIComponent(e));if(e.repeat)return e}).map(e=>JSON.parse(decodeURIComponent(e))).length)&&(e=!0,getEvery7Days(a.d,a.e).slice(0,5).forEach(e=>{var t=combineDateAndTime(a.d,e),e=combineDateAndTime(a.e,e),r=Number(t.toISOString().replace(/\D/g,"").slice(0,10)),t={...n,start:t.toISOString(),startTime:i,end:e.toISOString(),endTime:s,sort:r,repeater:!1};o.push(t)}),n.hide=!0);var t={start:a.d,end:a.e,startTime:i,endTime:s,sort:a.sort,repeater:e};return{...n,...t}}).concat(o).sort((e,t)=>e.sort-t.sort);e=r.map(n).join(""),a.innerHTML=e,e=a.parentNode.querySelectorAll("input[type='radio']");e&&e.forEach(e=>{e.checked=!1,"all"===e.value&&(e.checked=!0)}),e&&e.forEach(e=>{e.addEventListener("click",function(e){e.stopPropagation();var t,e=e.target.value;"thisweek"===e&&(t=r.filter(isThisWeek).map(n).join(""),a.innerHTML=t),"nextweek"===e&&(t=r.filter(isNextWeek).map(n).join(""),a.innerHTML=t),"thismonth"===e&&(t=r.filter(isThisMonth).map(n).join(""),a.innerHTML=t),"nextmonth"===e&&(t=r.filter(isNextMonth).map(n).join(""),a.innerHTML=t),"all"===e&&(t=r.map(n).join(""),a.innerHTML=t)})}),a.addEventListener("click",handleFavouriteBtnClick())})}function doPromoSearch(e,t,r){var a={and:[{"custom_fields.tag":"Promo"},{range:{"custom_fields.e":{gt:getNow(),lt:"2099-12-31"}}}]},a=`&limit=1&order=asc&filter=${encodeURIComponent(JSON.stringify(a))}&sort=custom_fields.sort&`;fetch(e+a+"page=1").then(e=>e.json()).then(e=>{0<e.total_hits&&(e=rendereventsPromo(r,e.hits[0]),t.innerHTML=e||""),t.addEventListener("click",handleFavouriteBtnClick())}).catch(e=>console.error("Error fetching data:",e))}function loadTab(t,e,r){e=e.find(e=>e.id===t.id);if(!e||""===e.node.innerHTML.trim())return"panel_1_5"===e.id?doArchiveSearch(searchUrl,e.node,r):void doSearch(searchUrl,e.type,e.node,r)}(async()=>{const t=await doSeriesSearch(),r=[{id:"panel_1_1",node:staffNode,type:"staff"},{id:"panel_1_2",node:publicNode,type:"public"},{id:"panel_1_3",node:artNode,type:"art"},{id:"panel_1_5",node:archiveNode,type:"archive"}];promoNode&&doPromoSearch(searchUrl,promoNode,t),publicNode&&(publicNode.innerHTML=""),staffNode&&(staffNode.innerHTML=""),artNode&&(artNode.innerHTML=""),archiveNode&&(archiveNode.innerHTML="");var e=document.querySelectorAll('[data-behaviour="tabs"] [role="tab"]'),a=document.querySelector('[data-behaviour="tabs"] [role="tab"][aria-selected="true"]');a&&(a=a.getAttribute("aria-controls"),loadTab(document.getElementById(a),r,t)),e.forEach(e=>{e.addEventListener("click",async e=>{e=e.target.getAttribute("aria-controls");loadTab(document.getElementById(e),r,t)})})})();