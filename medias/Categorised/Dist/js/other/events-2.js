!function(){const d=document.querySelector("#eventsstaff"),c=document.querySelector("#eventspublic"),u=document.querySelector("#eventsart"),p=document.querySelector("#eventsarchive"),m=document.querySelector("#eventspromo"),g=document.querySelector("#eventswebinars"),o=e=>"string"==typeof e?JSON.parse(decodeURIComponent(e)):"object"==typeof e?Object.assign({},...e.map(e=>JSON.parse(decodeURIComponent(e)))):{},l=e=>e.end===e.start?`<time datetime="${e.startISO}">${e.start}</time>`:`<time datetime="${e.startISO}">${e.start}</time> - <time datetime="${e.endISO}">${e.end}</time>`,v=(t,e)=>{return t?(e=e&&e.find(e=>e.title===t))?`<p class="text-sm">Part of the <a href="${e?e.url:"#"}">${t}</a> series.</p>`:`<p class="text-sm">Part of the <strong>${t}</strong> series.</p>`:""},f=(e,t,a)=>t.length?stir.favourites.renderRemoveBtn(a,t[0].date,e):stir.favourites.renderAddBtn(a,e),h=stir.curry((e,t)=>{var a="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},s=t.custom_fields,r=x(s.d,s.e);return`
          <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2 " data-result-type="event">
                  <div class="u-grid-medium-up u-gap-24  ">
                    <div class=" u-flex flex-dir-column u-gap u-mt-1 ">
                        <p class="u-text-regular u-m-0">
                            <strong><a href="${t.url}">${s.h1_custom}</a></strong>
                        </p>
                        <div class="u-flex flex-dir-column u-gap-8">
                            <div class="u-flex u-gap-16 align-middle">
                                  <span class="u-icon h5 uos-calendar"></span>
                                  <span>${l(r)}</span>
                            </div>
                        </div>
                        <p class="u-m-0">${s.snippet}</p>
                        ${v(a.isSeriesChild,e)}
                    </div>

                  </div>
            </div>`}),b=(e,t)=>`
      <div class="u-flex u-gap-16 align-middle">
        <span class="uos-clock u-icon h5"></span>
        <span><time>${e}</time> – <time>${t}</time></span>
      </div>`,y=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${e}</span>`:"",n=stir.curry((e,t)=>{var a,s,r,i,n,o;return t.hide?"":(a="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},s=t.custom_fields,o=(n=x(t.start,t.end)).start===n.end,r=stir.favourites&&stir.favourites.getFav(s.sid,"event"),i=t.repeater?s.sid+"|"+new Date(t.start).getTime():s.sid,`
        <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" data-result-type="event"
          data-label-icon="${a.isSeries?"startdates":""}" data-perf="172580">
          ${a.isSeries?`
        <div class="u-absolute u-top--16">
            <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">Event series</span>
        </div>`:""}
         
            <div class="u-grid-medium-up u-gap-24 ${s.image?"u-grid-cols-3_1":""}">
                <div class=" u-flex flex-dir-column u-gap u-mt-1">
                    <p class="u-text-regular u-m-0">
                        ${y(a.cancelled)} ${y(a.rescheduled)} <strong><a href="${t.url}">${s.h1_custom}</a></strong>
                    </p>
                    <div class="u-flex flex-dir-column u-gap-8">
                    <div class="u-flex u-gap-16 align-middle">
                        <span class="u-icon h5 uos-calendar"></span>
                        <span>${l(n)}</span>
                    </div>
                    ${o?b(t.startTime,t.endTime):""}
                    <div class="u-flex u-gap-16 align-middle">
                        <span class="u-icon h5 uos-location "></span>
                        <span>${a.location||""}</span>
                    </div>
                    </div>
                    <p class="u-m-0">${s.snippet||""}</p>
                    ${v(a.isSeriesChild,e)}
                </div>
                ${n=s.image,o=s.h1_custom,n?`<div class="u-mt-1">
            <img src="${n}" width="275" height="275" alt="Image: ${o}"></div>
         </div>`:"<div></div>"}
                <div class="u-mt-2">
                    <div id="favbtns${i}">${r&&f("true",r,i)}</div>
                 </div>
            </div>
        </div>`)}),$=stir.curry((e,t)=>{var a=t.custom_fields,s=x(a.d,a.e),r="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},i=stir.favourites&&stir.favourites.getFav(a.sid,"event"),n=t.repeater?a.sid+"|"+new Date(t.start).getTime():a.sid,o=s.start===s.end;return`<div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell small-12 ${a.image?"medium-8":""} ">
                <div class="u-relative u-p-2 u-flex flex-dir-column u-gap-8 u-h-full">
                <div class="u-flex1">
                  ${t.isSeries?renderTab("Event series"):""}
                  <p class="u-text-regular u-mb-2">
                  ${y(r.cancelled)} ${y(r.rescheduled)} <strong><a href="${t.url}">${a.h1_custom}</a></strong>
                  </p>
                  <div class="u-flex flex-dir-column u-gap-8 u-mb-1">
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 uos-calendar"></span>
                          <span>${l(s)}</span>
                      </div>
                     ${o?b(s.start,s.end):""}
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"}"></span>
                          <span>${r.location}</span>
                      </div>
                  </div>
                  <p class="u-m-0 text-sm">${a.snippet}</p>
                  ${t.isSeriesChild?v(t.isSeriesChild,e):""}
                 </div>
                   <div id="favbtns${n}">${i&&f("true",i,n)}</div>
                </div>
            </div>
            ${a.image?`<div class="cell medium-4"><img src="${a.image}" class="u-object-cover" width="800" height="800" alt="Image: ${a.h1_custom}" /></div>`:""}  
        </div>`}),r=e=>{var e=e.custom_fields,t=o(e.data),a=stir.favourites&&stir.favourites.getFav(e.sid,"webinar"),s=e.sid,r=x(e.d,e.e),i=new Date(e.d).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),n=new Date(e.e).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",timeZoneName:"short"});return`<div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" 
              data-result-type="event" data-perf="${e.sid}">
                <div class="u-absolute u-top--16">
                  <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">Webinar</span>
                </div> 
                <div class="u-grid-medium-up u-gap-24  ">
                  <div class=" u-flex flex-dir-column u-gap u-mt-1">
                      <p class="u-text-regular u-m-0">
                          <strong> <a href="${t.register}">${e.h1_custom}</a> </strong>
                      </p>
                      <div class="u-flex flex-dir-column u-gap-8">
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-calendar"></span>
                              <span><time datetime="${e.d}">${r.start}</time> </span>
                          </div>
                          <div class="u-flex u-gap-16 align-middle">
                            <span class="uos-clock u-icon h5"></span>
                            <span><time>${i}</time> – <time>${n}</time></span>
                          </div>
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-computer"></span>
                              <span>Online</span>
                          </div>
                      </div>
                      <div class="u-m-0">${e.snippet}</div>
                      <div id="favbtns${s}">${a&&f("true",a,s)}</div>
                  </div>
                 </div>
            </div>`},S=e=>`<div class="loadmorebtn u-flex align-center u-mb-2"><button class="button hollow tiny" data-page="${e}">Load more results</button></div>
        `,w=e=>`<div id="eventsarchive" class="cell large-8 large-order-2 u-mt-3-small ">
            <div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No events found.</p></div>
          </div>`,x=(e,t)=>{var a={day:"numeric",month:"long",year:"numeric"},e=new Date(e),t=new Date(t);return{start:e.toLocaleDateString("en-GB",a),end:t.toLocaleDateString("en-GB",a),startISO:e.toISOString().slice(0,10),endISO:t.toISOString().slice(0,10)}},D=()=>(new Date).toISOString();function T(e,t,a){const s=[{"custom_fields.tag":"Archive"},{range:{"custom_fields.e":{gt:"2015-01-01",lt:D()}}}];a&&0<a.length&&a.forEach(e=>{s.push({"custom_fields.tag":e})}),"All"!==e&&s.push({"custom_fields.tag":e});a={and:s};return`&limit=${t}&order=desc&filter=${encodeURIComponent(JSON.stringify(a))}&sort=custom_fields.e&`}const a=(e,t,a,s)=>{const r={and:[{"custom_fields.tag":a},{not:{"custom_fields.tag":"Promo"}},{range:{"custom_fields.e":{gt:e,lt:t}}}]};return s&&0<s.length&&s.forEach(e=>{r.and.push({"custom_fields.tag":e})}),"Art Collection"!==a&&r.and.push({not:{"custom_fields.tag":"Art Collection"}}),r},_=(e,t)=>"staff"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(a(D(),"2099-12-31","StaffStudent",t)))}&sort=custom_fields.sort&`:"art"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(a(D(),"2099-12-31","Art Collection",t)))}&sort=custom_fields.sort&`:"public"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(a(D(),"2099-12-31","Public",t)))}&sort=custom_fields.sort&`:void 0;function L(e,t){e=new Date(e);return e.setFullYear(t.getFullYear()),e.setMonth(t.getMonth()),e.setDate(t.getDate()),e}function O(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,s=new Date(a.getFullYear(),a.getMonth()+1,1);return t<=new Date(a.getFullYear(),a.getMonth()+2,0)&&s<=e}function j(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,s=new Date(a.getFullYear(),a.getMonth(),1);return t<=new Date(a.getFullYear(),a.getMonth()+1,0)&&s<=e}function N(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,s=new Date(a.getFullYear(),a.getMonth(),a.getDate()-a.getDay());return t<=new Date(a.getFullYear(),a.getMonth(),a.getDate()+6-a.getDay())&&s<=e}function M(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,s=new Date(a.getFullYear(),a.getMonth(),a.getDate()+7-a.getDay());return t<=new Date(a.getFullYear(),a.getMonth(),a.getDate()+13-a.getDay())&&s<=e}const s=a=>{const s=stir.favourites.getFav(a,"event");document.querySelectorAll(`[id*="favbtns${a}"]`).forEach(e=>{var t=f("true",s,a);e.innerHTML=t})},E=()=>e=>{var t,e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&("addtofavs"===e.dataset.action&&(t=e.dataset.id.split("|")[0],stir.favourites.addToFavs(t,"event"),s(t)),"removefav"===e.dataset.action)&&(t=e.dataset.id.split("|")[0],stir.favourites.removeFromFavs(t),s(t))};function I(e,t,s,a,r){if(s){t=_(t,r);const i=n(a);fetch(e+t+"page=1").then(e=>e.json()).then(e=>{const o=[];const a=e.hits.map(r=>{const s=r.custom_fields,i=s.d.split("T")[1].split(":")[0]+":"+s.d.split("T")[1].split(":")[1],n=s.e.split("T")[1].split(":")[0]+":"+s.e.split("T")[1].split(":")[1];let e=!1;s.data&&Array.isArray(s.data)&&(0<(t=s.data.filter(e=>{e=JSON.parse(decodeURIComponent(e));if(e.type&&"perf"===e.type)return e}).map(e=>JSON.parse(decodeURIComponent(e))).filter(e=>new Date(e.end)>new Date)).length&&(t.forEach(e=>{var t=e.start.split("T")[1].split(":")[0]+":"+e.start.split("T")[1].split(":")[1],a=e.end.split("T")[1].split(":")[0]+":"+e.end.split("T")[1].split(":")[1],s=Number(String(e.pin).substring(0,10)),e={...r,...e,startTime:t,endTime:a,sort:s,repeater:!0};o.push(e)}),r.hide=!0),0<s.data.filter(e=>{e=JSON.parse(decodeURIComponent(e));if(e.repeat)return e}).map(e=>JSON.parse(decodeURIComponent(e))).length)&&(e=!0,function(e,t){for(var a=[],s=new Date(e),r=new Date;s<=new Date(t);)r<s&&a.push(new Date(s)),s.setDate(s.getDate()+7);return a}(s.d,s.e).slice(0,5).forEach(e=>{var t=L(s.d,e),e=L(s.e,e),a=Number(t.toISOString().replace(/\D/g,"").slice(0,10)),t={...r,start:t.toISOString(),startTime:i,end:e.toISOString(),endTime:n,sort:a,repeater:!1};o.push(t)}),r.hide=!0);var t={start:s.d,end:s.e,startTime:i,endTime:n,sort:s.sort,repeater:e};return{...r,...t}}).concat(o).sort((e,t)=>e.sort-t.sort);e=a.map(i).join(""),s.innerHTML=e||w(),e=s.parentNode.querySelectorAll("input[type='radio']");e&&e.forEach(e=>{e.checked=!1,"all"===e.value&&(e.checked=!0)}),e&&e.forEach(e=>{e.addEventListener("click",function(e){e.stopPropagation();var t,e=e.target.value;"thisweek"===e&&(t=a.filter(N).map(i).join(""),s.innerHTML=t||w()),"nextweek"===e&&(t=a.filter(M).map(i).join(""),s.innerHTML=t||w()),"thismonth"===e&&(t=a.filter(j).map(i).join(""),s.innerHTML=t||w()),"nextmonth"===e&&(t=a.filter(O).map(i).join(""),s.innerHTML=t||w()),"all"===e&&(t=a.map(i).join(""),s.innerHTML=t||w())})}),s.addEventListener("click",E())})}}function C(s,e){const t={and:[{range:{"custom_fields.e":{gt:D(),lt:"2099-12-31"}}}]};e&&0<e.length&&e.forEach(e=>{t.and.push({"custom_fields.tag":e})});e=`&limit=90&resultType=organic&order=asc&filter=${encodeURIComponent(JSON.stringify(t))}&sort=custom_fields.d&`;fetch("https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de?term=*&customField=type%3Dwebinar&"+e+"page=1").then(e=>e.json()).then(e=>{if(e&&0!==e.length){const a=e.hits.map(e=>{var t=e.custom_fields,t={start:t.d,end:t.e};return{...e,...t}});e=a.map(r).join(""),e=(s.innerHTML=e||w(),s.parentNode.querySelectorAll("input[type='radio']"));e&&e.forEach(e=>{e.checked=!1,"all"===e.value&&(e.checked=!0)}),e&&e.forEach(e=>{e.addEventListener("click",function(e){e.stopPropagation();var t,e=e.target.value;"thisweek"===e&&(t=a.filter(N).map(r).join(""),s.innerHTML=t||w()),"nextweek"===e&&(t=a.filter(M).map(r).join(""),s.innerHTML=t||w()),"thismonth"===e&&(t=a.filter(j).map(r).join(""),s.innerHTML=t||w()),"nextmonth"===e&&(t=a.filter(O).map(r).join(""),s.innerHTML=t||w()),"all"===e&&(t=a.map(r).join(""),s.innerHTML=t||w())})}),s.addEventListener("click",E())}else s.innerHTML=w()}).catch(e=>console.error("Error fetching data:",e))}function H(e,t,a,s){var r=t.querySelector("h2").innerText.toLowerCase().split(" ")[0];if("archive"===r){var i=e;var n=t.querySelector(".c-search-results-events ");var o=a;var l=s;var d=n.parentNode.querySelectorAll("input[type='radio']");const c=h(o);d&&d.forEach(e=>{e.checked=!1,"All"===e.value&&(e.checked=!0)}),o=T("All",10,l),fetch(i+o+"page=1").then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,e=e.hits.map(c).join(""),t=1<t?S(2):"";n.innerHTML=e+t}).catch(e=>console.error("Error fetching data:",e)),n.addEventListener("click",function(s){if("BUTTON"===s.target.tagName){const r=s.target.getAttribute("data-page");var e=T(n.parentNode.querySelector("input[type='radio']:checked").value,10,l);fetch(i+e+("page="+r)).then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,a=Number(r),e=e.hits.map(c).join(""),a=(s.target.parentNode.remove(),a<t?S(Number(r)+1):"");n.insertAdjacentHTML("beforeend",e+a)}).catch(e=>console.error("Error fetching data:",e))}}),d&&d.forEach(e=>{e.addEventListener("click",function(e){e.stopPropagation();e=T(e.target.value,10,l);fetch(i+e+"page=1").then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,e=0===Number(e.total_hits)?w():e.hits.map(c).join(""),t=1<t?S(2):"";n.innerHTML=e+t}).catch(e=>console.error("Error fetching data:",e))})})}else{if("webinars"===r)return C(t.querySelector(".c-search-results-events "),s);I(e,r,t.querySelector(".c-search-results-events "),a,s)}}(async()=>{const t=document.querySelector("#eventsrevamp").dataset.tags.split(",").map(e=>e.trim()).filter(Boolean);const a="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de?term=*&customField=type%3Devent&resultType=organic&",s=await async function(e){e+=`&limit=50&order=asc&filter=${encodeURIComponent(JSON.stringify({and:[{"custom_fields.tag":"Series"}]}))}&sort=custom_fields.sort`;try{return(await(await fetch(e)).json()).hits.map(e=>{return{title:("object"==typeof e.custom_fields.data?Object.assign({},...e.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{}).isSeries,url:e.url}})}catch(e){throw console.error("Error fetching data:",e),e}}(a);if(m){var e=a,r=m,i=s,n=t;const l={and:[{"custom_fields.tag":"Promo"},{range:{"custom_fields.e":{gt:D(),lt:"2099-12-31"}}}]};n&&0<n.length&&n.forEach(e=>{l.and.push({"custom_fields.tag":e})}),n=`&limit=1&order=asc&filter=${encodeURIComponent(JSON.stringify(l))}&sort=custom_fields.sort&`,fetch(e+n+"page=1").then(e=>e.json()).then(e=>{0<e.total_hits&&(e=$(i,e.hits[0]),r.innerHTML=e||""),r.addEventListener("click",E())}).catch(e=>console.error("Error fetching data:",e))}c&&(c.innerHTML=""),d&&(d.innerHTML=""),u&&(u.innerHTML=""),p&&(p.innerHTML=""),g&&(g.innerHTML=""),g&&C(g,t);var o,e=document.querySelectorAll('[data-behaviour="tabs"] button'),n=document.querySelector('[data-behaviour="tabs"] [role="tab"][aria-selected="true"]')?document.querySelector('[data-behaviour="tabs"] [role="tab"][aria-selected="true"]'):document.querySelector('.pseudotab[aria-expanded="true"]');n&&(o=n.getAttribute("aria-controls"),o=document.getElementById(o),H(a,o,s,t)),e.forEach(e=>{e.addEventListener("click",async e=>{e=e.target.getAttribute("aria-controls");H(a,document.getElementById(e),s,t)})})})()}();