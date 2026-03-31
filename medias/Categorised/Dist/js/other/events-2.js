!function(){const l=document.querySelector("#eventsstaff"),c=document.querySelector("#eventspublic"),u=document.querySelector("#eventsart"),m=document.querySelector("#eventsarchive"),p=document.querySelector("#eventspromo"),g=document.querySelector("#eventswebinars"),o=e=>"string"==typeof e?JSON.parse(decodeURIComponent(e)):"object"==typeof e?Object.assign({},...e.map(e=>JSON.parse(decodeURIComponent(e)))):{},v=e=>e.end===e.start?`<time datetime="${e.startISO}">${e.start}</time>`:`<time datetime="${e.startISO}">${e.start}</time> - <time datetime="${e.endISO}">${e.end}</time>`,f=(t,e)=>{return t?(e=e&&e.find(e=>e.title===t))?`<p class="text-sm">Part of the <a href="${e?e.url:"#"}">${t}</a> series.</p>`:`<p class="text-sm">Part of the <strong>${t}</strong> series.</p>`:""},h=(e,t,a)=>t.length?stir.favourites.renderRemoveBtn(a,t[0].date,e):stir.favourites.renderAddBtn(a,e),b=stir.curry((e,t)=>{var a="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},i=t.custom_fields,s=T(i.d,i.e);return`
          <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2 " data-result-type="event">
                  <div class="u-grid-medium-up u-gap-24  ">
                    <div class=" u-flex flex-dir-column u-gap u-mt-1 ">
                        <p class="u-text-regular u-m-0">
                            <strong><a href="${t.url}">${i.h1_custom}</a></strong>
                        </p>
                        <div class="u-flex flex-dir-column u-gap-8">
                            <div class="u-flex u-gap-16 align-middle">
                                  <span class="u-icon h5 uos-calendar"></span>
                                  <span>${v(s)}</span>
                            </div>
                        </div>
                        <p class="u-m-0">${i.snippet}</p>
                        ${f(a.isSeriesChild,e)}
                    </div>

                  </div>
            </div>`}),S=(e,t)=>`
      <div class="u-flex u-gap-16 align-middle">
        <span class="uos-clock u-icon h5"></span>
        <span><time>${e}</time> – <time>${t}</time></span>
      </div>`,y=e=>e?`<span class="u-bg-heritage-berry u-white text-xxsm u-p-tiny u-mr-1">${e}</span>`:"",$=e=>e?"data-label-icon="+e:"",n=stir.curry((e,t)=>{var a,i,s,r,n,o,d,l,c,u;return t.hide?"":(a="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},i=t.custom_fields,r=(s=T(t.start,t.end)).start===s.end,n=stir.favourites&&stir.favourites.getFav(i.sid,"event"),o=t.repeater?i.sid+"|"+new Date(t.start).getTime():i.sid,c=a.isSeries?"startdates":"",u="Yes"===a.pin?"pin":"",d=new Date(i.d).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),l=new Date(i.e).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),`
        <div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" data-result-type="event"
          ${$(c)} ${$(u)} data-perf="172580">
          ${a.isSeries?`
        <div class="u-absolute u-top--16">
            <span class="u-bg-heritage-green--10 u-px-tiny u-py-xtiny text-xxsm">Event series</span>
        </div>`:""}
         
            <div class="u-grid-medium-up u-gap-24 ${i.image?"u-grid-cols-3_1":""}">
                <div class=" u-flex flex-dir-column u-gap u-mt-1">
                    <p class="u-text-regular u-m-0">
                        ${y(a.cancelled)} ${y(a.rescheduled)} <strong><a href="${t.url}">${i.h1_custom}</a></strong>
                    </p>
                    <div class="u-flex flex-dir-column u-gap-8">
                    <div class="u-flex u-gap-16 align-middle">
                        <span class="u-icon h5 uos-calendar"></span>
                        <span>${v(s)}</span>
                    </div>
                    ${r?S(d,l):""}
                    <div class="u-flex u-gap-16 align-middle">
                        <span class="u-icon h5 uos-location "></span>
                        <span>${a.location||""}</span>
                    </div>
                    </div>
                    <p class="u-m-0">${i.snippet||""}</p>
                    ${f(a.isSeriesChild,e)}
                </div>
                ${c=i.image,u=i.h1_custom,c?`<div class="u-mt-1">
            <img src="${c}" width="275" height="275" alt="Image: ${u}"></div>
         </div>`:"<div></div>"}
                <div class="u-mt-2">
                    <div id="favbtns${o}">${n&&h("true",n,o)}</div>
                 </div>
            </div>
        </div>`)}),w=stir.curry((e,t)=>{var a=t.custom_fields,i=T(a.d,a.e),s="object"==typeof t.custom_fields.data?Object.assign({},...t.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{},r=stir.favourites&&stir.favourites.getFav(a.sid,"event"),n=t.repeater?a.sid+"|"+new Date(t.start).getTime():a.sid,o=i.start===i.end,d=new Date(a.d).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),l=new Date(a.e).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});return`<div class="grid-x u-bg-grey u-mb-2 ">
            <div class="cell small-12 ${a.image?"medium-8":""} ">
                <div class="u-relative u-p-2 u-flex flex-dir-column u-gap-8 u-h-full">
                <div class="u-flex1">
                  ${t.isSeries?$("Event series"):""}
                  <p class="u-text-regular u-mb-2">
                  ${y(s.cancelled)} ${y(s.rescheduled)} <strong><a href="${t.url}">${a.h1_custom}</a></strong>
                  </p>
                  <div class="u-flex flex-dir-column u-gap-8 u-mb-1">
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 uos-calendar"></span>
                          <span>${v(i)}</span>
                      </div>
                     ${o?S(d,l):""}
                      <div class="u-flex u-gap-16 align-middle">
                          <span class="u-icon h5 ${t.online?"uos-computer":"uos-location"}"></span>
                          <span>${s.location}</span>
                      </div>
                  </div>
                  <p class="u-m-0 text-sm">${a.snippet}</p>
                  ${t.isSeriesChild?f(t.isSeriesChild,e):""}
                 </div>
                   <div id="favbtns${n}">${r&&h("true",r,n)}</div>
                </div>
            </div>
            ${a.image?`<div class="cell medium-4"><img src="${a.image}" class="u-object-cover" width="800" height="800" alt="Image: ${a.h1_custom}" /></div>`:""}  
        </div>`}),s=e=>{var e=e.custom_fields,t=o(e.data),a=stir.favourites&&stir.favourites.getFav(e.sid,"webinar"),i=e.sid,s=T(e.d,e.e),r=new Date(e.d).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),n=new Date(e.e).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});return`<div class="u-border-width-5 u-heritage-line-left u-p-2 u-bg-white text-sm u-relative u-mb-2" 
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
                              <span><time datetime="${e.d}">${s.start}</time> </span>
                          </div>
                          <div class="u-flex u-gap-16 align-middle">
                            <span class="uos-clock u-icon h5"></span>
                            <span><time>${r}</time> – <time>${n}</time></span>
                          </div>
                          <div class="u-flex u-gap-16 align-middle">
                              <span class="u-icon h5 uos-computer"></span>
                              <span>Online</span>
                          </div>
                      </div>
                      <div class="u-m-0">${e.snippet}</div>
                      <div id="favbtns${i}">${a&&h("true",a,i)}</div>
                  </div>
                 </div>
            </div>`},x=e=>`<div class="loadmorebtn u-flex align-center u-mb-2"><button class="button hollow tiny" data-page="${e}">Load more results</button></div>
        `,D=e=>`<div id="eventsarchive" class="cell large-8 large-order-2 u-mt-3-small ">
            <div class="u-bg-white u-p-2 u-mb-2"><p class="u-m-0">No events found.</p></div>
          </div>`,T=(e,t)=>{var a={day:"numeric",month:"long",year:"numeric"},e=new Date(e),t=new Date(t);return{start:e.toLocaleDateString("en-GB",a),end:t.toLocaleDateString("en-GB",a),startISO:e.toISOString().slice(0,10),endISO:t.toISOString().slice(0,10)}},_=()=>(new Date).toISOString();function L(e,t,a){const i=[{"custom_fields.tag":"Archive"},{range:{"custom_fields.e":{gt:"2015-01-01",lt:_()}}}];a&&0<a.length&&a.forEach(e=>{i.push({"custom_fields.tag":e})}),"All"!==e&&i.push({"custom_fields.tag":e});a={and:i};return`&limit=${t}&order=desc&filter=${encodeURIComponent(JSON.stringify(a))}&sort=custom_fields.e&`}const a=(e,t,a,i)=>{const s={and:[{"custom_fields.tag":a},{not:{"custom_fields.tag":"Promo"}},{range:{"custom_fields.e":{gt:e,lt:t}}}]};return i&&0<i.length&&i.forEach(e=>{s.and.push({"custom_fields.tag":e})}),"Art Collection"!==a&&s.and.push({not:{"custom_fields.tag":"Art Collection"}}),s},d=(e,t)=>"staff"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(a(_(),"2099-12-31","StaffStudent",t)))}&sort=custom_fields.sort&`:"art"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(a(_(),"2099-12-31","Art Collection",t)))}&sort=custom_fields.sort&`:"public"===e?`&limit=190&order=asc&filter=${encodeURIComponent(JSON.stringify(a(_(),"2099-12-31","Public",t)))}&sort=custom_fields.sort&`:void 0;function O(e,t){e=new Date(e);return e.setFullYear(t.getFullYear()),e.setMonth(t.getMonth()),e.setDate(t.getDate()),e}function j(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,i=new Date(a.getFullYear(),a.getMonth()+1,1);return t<=new Date(a.getFullYear(),a.getMonth()+2,0)&&i<=e}function M(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,i=new Date(a.getFullYear(),a.getMonth(),1);return t<=new Date(a.getFullYear(),a.getMonth()+1,0)&&i<=e}function N(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,i=new Date(a.getFullYear(),a.getMonth(),a.getDate()-a.getDay());return t<=new Date(a.getFullYear(),a.getMonth(),a.getDate()+6-a.getDay())&&i<=e}function E(e){var t=new Date(e.start),e=new Date(e.end),a=new Date,i=new Date(a.getFullYear(),a.getMonth(),a.getDate()+7-a.getDay());return t<=new Date(a.getFullYear(),a.getMonth(),a.getDate()+13-a.getDay())&&i<=e}const i=a=>{const i=stir.favourites.getFav(a,"event");document.querySelectorAll(`[id*="favbtns${a}"]`).forEach(e=>{var t=h("true",i,a);e.innerHTML=t})},I=()=>e=>{var t,e=e.target.closest("button");e&&e.dataset&&e.dataset.action&&("addtofavs"===e.dataset.action&&(t=e.dataset.id.split("|")[0],stir.favourites.addToFavs(t,"event"),i(t)),"removefav"===e.dataset.action)&&(t=e.dataset.id.split("|")[0],stir.favourites.removeFromFavs(t),i(t))};function C(e,t,i,a,s){if(i){t=d(t,s);const r=n(a);fetch(e+t+"page=1").then(e=>e.json()).then(e=>{const o=[];const a=e.hits.map(s=>{const i=s.custom_fields,r=i.d.split("T")[1].split(":")[0]+":"+i.d.split("T")[1].split(":")[1],n=i.e.split("T")[1].split(":")[0]+":"+i.e.split("T")[1].split(":")[1];let e=!1;i.data&&Array.isArray(i.data)&&(0<(t=i.data.filter(e=>{e=JSON.parse(decodeURIComponent(e));if(e.type&&"perf"===e.type)return e}).map(e=>JSON.parse(decodeURIComponent(e))).filter(e=>new Date(e.end)>new Date)).length&&(t.forEach(e=>{var t=e.start.split("T")[1].split(":")[0]+":"+e.start.split("T")[1].split(":")[1],a=e.end.split("T")[1].split(":")[0]+":"+e.end.split("T")[1].split(":")[1],i=Number(String(e.pin).substring(0,10)),e={...s,...e,startTime:t,endTime:a,sort:i,repeater:!0};o.push(e)}),s.hide=!0),0<i.data.filter(e=>{e=JSON.parse(decodeURIComponent(e));if(e.repeat)return e}).map(e=>JSON.parse(decodeURIComponent(e))).length)&&(e=!0,function(e,t){for(var a=[],i=new Date(e),s=new Date;i<=new Date(t);)s<i&&a.push(new Date(i)),i.setDate(i.getDate()+7);return a}(i.d,i.e).slice(0,5).forEach(e=>{var t=O(i.d,e),e=O(i.e,e),a=Number(t.toISOString().replace(/\D/g,"").slice(0,10)),t={...s,start:t.toISOString(),startTime:r,end:e.toISOString(),endTime:n,sort:a,repeater:!1};o.push(t)}),s.hide=!0);var t={start:i.d,end:i.e,startTime:r,endTime:n,sort:i.sort,repeater:e};return{...s,...t}}).concat(o).sort((e,t)=>e.sort-t.sort);e=a.map(r).join(""),i.innerHTML=e||D(),e=i.parentNode.querySelectorAll("input[type='radio']");e&&e.forEach(e=>{e.checked=!1,"all"===e.value&&(e.checked=!0)}),e&&e.forEach(e=>{e.addEventListener("click",function(e){e.stopPropagation();var t,e=e.target.value;"thisweek"===e&&(t=a.filter(N).map(r).join(""),i.innerHTML=t||D()),"nextweek"===e&&(t=a.filter(E).map(r).join(""),i.innerHTML=t||D()),"thismonth"===e&&(t=a.filter(M).map(r).join(""),i.innerHTML=t||D()),"nextmonth"===e&&(t=a.filter(j).map(r).join(""),i.innerHTML=t||D()),"all"===e&&(t=a.map(r).join(""),i.innerHTML=t||D())})}),i.addEventListener("click",I())})}}function H(i,e){const t={and:[{range:{"custom_fields.e":{gt:_(),lt:"2099-12-31"}}}]};e&&0<e.length&&e.forEach(e=>{t.and.push({"custom_fields.tag":e})});e=`&limit=90&resultType=organic&order=asc&filter=${encodeURIComponent(JSON.stringify(t))}&sort=custom_fields.d&`;fetch("https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de?term=*&customField=type%3Dwebinar&"+e+"page=1").then(e=>e.json()).then(e=>{if(e&&0!==e.length){const a=e.hits.map(e=>{var t=e.custom_fields,t={start:t.d,end:t.e};return{...e,...t}});e=a.map(s).join(""),e=(i.innerHTML=e||D(),i.parentNode.querySelectorAll("input[type='radio']"));e&&e.forEach(e=>{e.checked=!1,"all"===e.value&&(e.checked=!0)}),e&&e.forEach(e=>{e.addEventListener("click",function(e){e.stopPropagation();var t,e=e.target.value;"thisweek"===e&&(t=a.filter(N).map(s).join(""),i.innerHTML=t||D()),"nextweek"===e&&(t=a.filter(E).map(s).join(""),i.innerHTML=t||D()),"thismonth"===e&&(t=a.filter(M).map(s).join(""),i.innerHTML=t||D()),"nextmonth"===e&&(t=a.filter(j).map(s).join(""),i.innerHTML=t||D()),"all"===e&&(t=a.map(s).join(""),i.innerHTML=t||D())})}),i.addEventListener("click",I())}else i.innerHTML=D()}).catch(e=>console.error("Error fetching data:",e))}function k(e,t,a,i){var s=t.querySelector("h2").innerText.toLowerCase().split(" ")[0];if("archive"===s){var r=e;var n=t.querySelector(".c-search-results-events ");var o=a;var d=i;var l=n.parentNode.querySelectorAll("input[type='radio']");const c=b(o);l&&l.forEach(e=>{e.checked=!1,"All"===e.value&&(e.checked=!0)}),o=L("All",10,d),fetch(r+o+"page=1").then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,e=e.hits.map(c).join(""),t=1<t?x(2):"";n.innerHTML=e+t}).catch(e=>console.error("Error fetching data:",e)),n.addEventListener("click",function(i){if("BUTTON"===i.target.tagName){const s=i.target.getAttribute("data-page");var e=L(n.parentNode.querySelector("input[type='radio']:checked").value,10,d);fetch(r+e+("page="+s)).then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,a=Number(s),e=e.hits.map(c).join(""),a=(i.target.parentNode.remove(),a<t?x(Number(s)+1):"");n.insertAdjacentHTML("beforeend",e+a)}).catch(e=>console.error("Error fetching data:",e))}}),l&&l.forEach(e=>{e.addEventListener("click",function(e){e.stopPropagation();e=L(e.target.value,10,d);fetch(r+e+"page=1").then(e=>e.json()).then(e=>{var t=Number(e.total_hits)/10,e=0===Number(e.total_hits)?D():e.hits.map(c).join(""),t=1<t?x(2):"";n.innerHTML=e+t}).catch(e=>console.error("Error fetching data:",e))})})}else{if("webinars"===s)return H(t.querySelector(".c-search-results-events "),i);C(e,s,t.querySelector(".c-search-results-events "),a,i)}}(async()=>{const t=document.querySelector("#eventsrevamp").dataset.tags.split(",").map(e=>e.trim()).filter(Boolean);const a="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de?term=*&customField=type%3Devent&resultType=organic&",i=await async function(e){e+=`&limit=50&order=asc&filter=${encodeURIComponent(JSON.stringify({and:[{"custom_fields.tag":"Series"}]}))}&sort=custom_fields.sort`;try{return(await(await fetch(e)).json()).hits.map(e=>{return{title:("object"==typeof e.custom_fields.data?Object.assign({},...e.custom_fields.data.map(e=>JSON.parse(decodeURIComponent(e)))):{}).isSeries,url:e.url}})}catch(e){throw console.error("Error fetching data:",e),e}}(a);if(p){var e=a,s=p,r=i,n=t;const d={and:[{"custom_fields.tag":"Promo"},{range:{"custom_fields.e":{gt:_(),lt:"2099-12-31"}}}]};n&&0<n.length&&n.forEach(e=>{d.and.push({"custom_fields.tag":e})}),n=`&limit=1&order=asc&filter=${encodeURIComponent(JSON.stringify(d))}&sort=custom_fields.sort&`,fetch(e+n+"page=1").then(e=>e.json()).then(e=>{0<e.total_hits&&(e=w(r,e.hits[0]),s.innerHTML=e||""),s.addEventListener("click",I())}).catch(e=>console.error("Error fetching data:",e))}c&&(c.innerHTML=""),l&&(l.innerHTML=""),u&&(u.innerHTML=""),m&&(m.innerHTML=""),g&&(g.innerHTML=""),g&&H(g,t);var o,e=document.querySelectorAll('[data-behaviour="tabs"] button'),n=document.querySelector('[data-behaviour="tabs"] [role="tab"][aria-selected="true"]')?document.querySelector('[data-behaviour="tabs"] [role="tab"][aria-selected="true"]'):document.querySelector('.pseudotab[aria-expanded="true"]');n&&(o=n.getAttribute("aria-controls"),o=document.getElementById(o),k(a,o,i,t)),e.forEach(e=>{e.addEventListener("click",async e=>{e=e.target.getAttribute("aria-controls");k(a,document.getElementById(e),i,t)})})})()}();