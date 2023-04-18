!function(t){if(!t)return;const r={applyLink:"https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=",month:t.getAttribute("data-startmonth")};Object.freeze(r);var i=stir.curry((t,r)=>{const i=s(t);return`
        <table>
            <caption>Courses starting in ${t.month}</caption>
            <thead>
                <tr><td>Course</td><td>Application link</td><td>Year of entry</td></tr>
            </thead>
            <tbody>
                ${r.map(t=>i(t)).join("")}
            </tbody>
        </table>`});const s=stir.curry((t,r)=>{var i=a(t);return`
        <tr>
            <td>
              ${r.url?`<a href="${r.url}">`:""}
              ${r.award}  ${r.title}
              ${r.url?"</a>":""}
            </td>
            <td>${i(r)}</td>
            <td>${e(r,t.month)}</td>
        </tr>`}),a=stir.curry((r,i)=>{const s=t=>t.includes("UDX12")?" Apply for BA (Hons)":t.includes("UDX16")?" Apply for BSc (Hons)":"Apply";return i.portalapply&&""!==i.portalapply?i.portalapply.split(",").map(t=>'<a aria-label="'+s(t)+" "+i.title+'" href="'+r.applyLink+t.trim()+'">'+s(t)+"</a>").join(" / "):""}),e=(t,r)=>t.startdates?stir.compose(stir.join(", "),stir.map(t=>t.split(" ")[1]),stir.filter(t=>t.includes(r)))(t.startdates.split(", ")):"";var l,o,n,p=stir.curry((t,r)=>(t.innerHTML=r,t)),d=stir.t4Globals.ugstartdates||[];d.length&&(l=stir.filter(t=>t.startdates&&t.startdates.includes(r.month)),o=stir.filter(t=>t.portalapply),n=stir.sort((t,r)=>t.title<r.title?-1:t.title>r.title?1:0),p=p(t),t=i(r),stir.compose(p,t,n,o,l,stir.clone)(d))}(stir.node("#course-list"));