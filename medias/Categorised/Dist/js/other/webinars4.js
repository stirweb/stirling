!function(){var e=()=>(new Date).toISOString();const i=e=>"string"==typeof e?JSON.parse(decodeURIComponent(e)):"object"==typeof e?Object.assign({},...e.map(e=>JSON.parse(decodeURIComponent(e)))):{},t=e=>{var t=e.custom_fields,r=i(t.data),s=new Date(t.e)>new Date?"Live event":"Watch on-demand",n="Watch on-demand"==s?"berry":"green",o=Array.isArray(t.level)?t.level:[t.level];return`
            <div class="cell small-12 large-4 medium-6 u-mb-3">
                <div class="u-border-width-4 u-heritage-${n}-line-left u-p-2 u-relative u-bg-grey u-h-full">
                    <div class="u-absolute u-top--16"><span class="u-bg-heritage-${n} u-white u-px-tiny u-py-xtiny text-xxsm">${s}</span></div>
                    <h3 class="u-header--secondary-font u-text-regular u-black header-stripped u-m-0 u-py-2">
                    <a href="${r.register}" class="u-border-bottom-hover u-border-width-2">${e.custom_fields.h1_custom}</a>
                    </h3>
                    <p class="text-sm">
                        <strong>${new Date(e.custom_fields.d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})},
                            ${new Date(e.custom_fields.d).toLocaleTimeString("en-GB",{hour:"numeric",minute:"numeric",hour12:!1})} to
                            ${new Date(e.custom_fields.e).toLocaleTimeString("en-GB",{hour:"numeric",minute:"numeric",hour12:!1,timeZoneName:"short"})}
                        </strong>
                    </p>
                    <p class="text-sm">${e.custom_fields.snippet}</p>
                    <p class="text-sm"><b>Audience:</b> <br/>${o.join("<br/>")}<br/>
                     ${t.country||""}</p>
                </div>
            </div>
          `};const r=(e,t)=>{var t=(t?t.split(", ").map(e=>e.trim()):[]).map(e=>({"custom_fields.country":e})),r=[{"custom_fields.country":"All international"},{"custom_fields.country":"All nationalities"}];return"All Europe"!==e?[...t,...r]:[...t,{"custom_fields.country":"All EU"},...r]};var s,n=stir.t4Globals.regions,o=stir.t4Globals.countries,a=document.querySelector("[data-webinar]"),e=(a.innerHTML="loading webinars...",{and:[{or:[{and:[{"custom_fields.tag":"OnDemand"},{range:{"custom_fields.e":{gt:"2019-12-31",lt:e()}}}]},{range:{"custom_fields.e":{gt:e(),lt:"2099-12-31"}}}]}]}),e={...e},n=r(n,o);0<n.length&&e.and.push({or:n}),console.log(e),o="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de?term=*&customField=type%3Dwebinar&",s=a,n=e,a="desc",n=`&filter=${encodeURIComponent(JSON.stringify(e))}&sort=custom_fields.e&order=${a}&limit=3&`,fetch(o+n+"page=1").then(e=>e.json()).then(e=>{0<e.total_hits?(e=e.hits.map(t).join(""),s.innerHTML=`
                <div class="grid-x">
                    ${e||""}
                </div>
            `):s.innerHTML='<div class="cell">No results found.</div>'}).catch(e=>console.error("Error fetching data:",e))}();