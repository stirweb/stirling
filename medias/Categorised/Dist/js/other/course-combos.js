!function(r){if(!r)return;var t=stir.curry((i,r)=>stir.map(r=>{var t={combinations:e(i,r)};return{...r,...t}},r));const e=(r,t)=>{const i=stir.map(r=>r.url);var e=stir.filter(r=>{if(i(r.courses).includes(t.url))return r});var l=stir.map(r=>({prefix:r.prefix,title:((r,t)=>{r=r.replace(t,"").replace(t+" and ","").replace(" and "+t,"");return(t+" and "+stir.filter(r=>""!==r,r.split(" and ")).join(" and ")).replace("and  with","with")})(r.title,t.title),applycode:r.codes.apply})),s=stir.sort((r,t)=>r.title<t.title?-1:r.title>t.title?1:0);return stir.compose(s,l,e)(r)},l=stir.curry((t,r)=>`
        <div data-behaviour=accordion>
            <h3>${r.prefix} ${r.title}</h3>
            <div>
                <ul>
                    <li>
                        <a href="${t.applyUrl}${r.applyCode.split(", ")[0]}">
                          ${r.prefix} ${r.title}
                        </a>
                    </li>
                    ${stir.map(r=>`<li>
                            <a href="${t.applyUrl}${r.applycode}">${r.prefix} ${r.title}</a>
                          </li>`,r.combinations).join("")} 
                </ul>
              </div>
          </div>`);var i=stir.curry((r,t)=>(r.innerHTML=t,r)),s=stir.t4globals.courses||[],a=stir.t4globals.combos||[];if(s.length&&a.length){var o=stir.reduce((r,t)=>r.includes(t)?r:[...r,t],[]),c=stir.map(r=>r.faculty),n=stir.filter(r=>r),n=stir.compose(stir.sort(null),n,o,c,stir.clone)(s);const p=stir.clone(s),u=t(stir.compose(stir.filter(r=>r.title),stir.clone)(a));i(r,stir.map(t=>{return r={applyUrl:"https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=",faculty:t,courses:u(stir.filter(r=>r.faculty===t,p))},i=l(r),`
        <h2 class="u-margin-top">${r.faculty}</h2>
        ${stir.map(i,r.courses).join("")} `;var r,i},n).join(""));Array.prototype.forEach.call(r.querySelectorAll('[data-behaviour="accordion"]'),function(r){new stir.accord(r,!1)})}}(stir.node(".courselisting"));