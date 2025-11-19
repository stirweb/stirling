!function(){const m=e=>{var t=e.get("studylevel"),a=e.get("region"),e=e.get("category"),n={and:[]};return t&&n.and.push({"custom_fields.level":t}),a&&n.and.push({or:(e=>{switch(e){case"Scotland":return[{"custom_fields.country":"Scotland"},{"custom_fields.country":"United Kingdom"},{"custom_fields.country":"All nationalities"}];case"RUK":return[{"custom_fields.country":"RUK"},{"custom_fields.country":"United Kingdom"},{"custom_fields.country":"All nationalities"}];case"All international":return[{"custom_fields.country":"All Europe"},{"custom_fields.country":"All EU"},{"custom_fields.country":"All international"},{"custom_fields.country":"All nationalities"}];default:return[]}})(a)}),e&&n.and.push({"custom_fields.tag":e}),n};var e=()=>(new Date).toISOString();const d=e=>"string"==typeof e?JSON.parse(decodeURIComponent(e)):"object"==typeof e?Object.assign({},...e.map(e=>JSON.parse(decodeURIComponent(e)))):{},c=(e,t,a)=>t.length?stir.favourites.renderRemoveBtn(a,t[0].date,e):stir.favourites.renderAddBtn(a,e),f=e=>{var t=e.custom_fields,a=d(t.data),n=new Date(t.e)>new Date?"Live event":"Watch on-demand",r="Watch on-demand"==n?"berry":"green",s=Array.isArray(t.level)?t.level:[t.level],i=stir.favourites&&stir.favourites.getFav(t.sid,"webinar"),o=t.sid;return`
            <div class="cell small-12 large-4 medium-6 u-mb-3">
                <div class="u-border-width-4 u-heritage-${r}-line-left u-p-2 u-relative u-bg-white u-h-full">
                    <div class="u-absolute u-top--16"><span class="u-bg-heritage-${r} u-white u-px-tiny u-py-xtiny text-xxsm">${n}</span></div>
                    <h3 class="u-header--secondary-font u-text-regular u-black header-stripped u-m-0 u-py-2">
                    <a href="${a.register}" class="u-border-bottom-hover u-border-width-2">${e.custom_fields.h1_custom}</a>
                    </h3>
                    <p class="text-sm">
                        <strong>${new Date(e.custom_fields.d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}, 
                            ${new Date(e.custom_fields.d).toLocaleTimeString("en-GB",{hour:"numeric",minute:"numeric",hour12:!1})} to 
                            ${new Date(e.custom_fields.e).toLocaleTimeString("en-GB",{hour:"numeric",minute:"numeric",hour12:!1,timeZoneName:"short"})}
                        </strong>
                    </p>
                    <p class="text-sm">${e.custom_fields.snippet}</p>
                    <p class="text-sm"><b>Audience:</b> <br/>${s.join("<br/>")}<br/>
                     ${t.country||""}</p>
                   
                     <div id="favbtns${o}">${i&&c(!1,i,o)}</div>
                </div>
            </div>
          `},v=(e,t,a)=>{return t<Math.ceil(e/a)?`<div class="text-center cell"><button class="button tiny" data-loadmore="${t+1}">Load more results</button></div>`:""},g=a=>{const n=stir.favourites.getFav(a,"webinar");document.querySelectorAll(`[id*="favbtns${a}"]`).forEach(e=>{var t=c(!1,n,a);e.innerHTML=t})};function n(e,a,t,n){t=`&filter=${encodeURIComponent(JSON.stringify(t))}&sort=custom_fields.e&order=${n}&limit=12&`;fetch(e+t+"page=1").then(e=>e.json()).then(e=>{var t;0<e.total_hits?(t=e.hits.map(f).join(""),a.innerHTML=`
            <div class="grid-x">
                <div class="cell u-mb-3">Results based on filters - ${e.total_hits} webinars</div>
                ${t||""}
                ${v(e.total_hits,e.page,12)}
            </div>
            `):a.innerHTML='<div class="cell">No results found.</div>'}).catch(e=>console.error("Error fetching data:",e))}function t(c,l,u){c.addEventListener("click",function(e){n=c,a=l,t=u;var n,t,a,r,s=e;if("BUTTON"===s.target.tagName&&s.target.hasAttribute("data-loadmore")){const d=s.target.getAttribute("data-loadmore");var i=new FormData(h),i=m(i),o={...a},i=(o.and=[...a.and,...i.and],`&filter=${encodeURIComponent(JSON.stringify(o))}&sort=custom_fields.e&order=${t}&limit=12&`),o=p+"?term=*&customField=type%3Dwebinar&";fetch(o+i+"page="+d).then(e=>e.json()).then(e=>{var t=n.querySelector(".grid-x"),a=e.hits.map(f).join(""),e=(s.target.parentNode.remove(),v(e.total_hits,Number(d),12));t.insertAdjacentHTML("beforeend",a+e)}).catch(e=>console.error("Error fetching data:",e))}(a=(a=e).target.closest("button"))&&a.dataset&&a.dataset.action&&("addtofavs"===a.dataset.action&&(r=a.dataset.id.split("|")[0],stir.favourites.addToFavs(r,"webinar"),g(r)),"removefav"===a.dataset.action)&&(r=a.dataset.id.split("|")[0],stir.favourites.removeFromFavs(r),g(r))})}const h=document.getElementById("webinarfilters"),r=document.getElementById("webinarsUpcoming"),s=document.getElementById("webinarsOnDemand"),p="https://api.addsearch.com/v1/search/dbe6bc5995c4296d93d74b99ab0ad7de",i=p+"?term=*&customField=type%3Dwebinar&",o=(h.reset(),{and:[{range:{"custom_fields.e":{gt:e(),lt:"2099-12-31"}}}]}),l={and:[{"custom_fields.tag":"OnDemand"},{range:{"custom_fields.e":{gt:"2019-12-31",lt:e()}}}]};n(i,r,o,"asc"),n(i,s,l,"desc"),t(r,o,"asc"),t(s,l,"desc"),h.addEventListener("change",e=>{e.preventDefault();var e=new FormData(h),t={...o},a=(t.and=[...o.and,...m(e).and],{...l});a.and=[...l.and,...m(e).and],n(i,r,t,"asc"),n(i,s,a,"desc")})}();