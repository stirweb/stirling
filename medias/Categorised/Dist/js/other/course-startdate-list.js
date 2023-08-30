!function(t){if(!t)return;const r={applyLink:"https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=",month:t.getAttribute("data-startmonth")};Object.freeze(r);stir.curry((r,s)=>{const i=t=>t.includes("UDX12")?" Apply for BA (Hons)":t.includes("UDX16")?" Apply for BSc (Hons)":"Apply";return s.portalapply&&""!==s.portalapply?s.portalapply.split(",").map(t=>'<a aria-label="'+i(t)+" "+s.title+'" href="'+r.applyLink+t.trim()+'">'+i(t)+"</a>").join(" / "):""});const i=stir.curry((t,r)=>`
        <tr>
            <td>
              ${r.url?`<a href="${r.url}">`:""}
              ${r.prefix} ${r.title} 
              ${r.url?"</a>":""}
            </td>
            <td>${e(r,t.month)}</td>
        </tr>`);var s=stir.curry((t,r)=>{const s=i(t);return`
          <table>
              <caption>Courses starting in ${t.month}</caption>
              <thead>
                  <tr><td>Course</td><td>Year of entry</td></tr>
              </thead>
              <tbody>
                  ${r.map(t=>s(t)).join("")}
              </tbody>
          </table>`});const e=(t,r)=>t.starts?stir.compose(stir.join(", "),stir.map(t=>t.split(" ")[1]),stir.filter(t=>t.includes(r)))(t.starts.split(", ")):"";var a,l,o=stir.curry((t,r)=>(t.innerHTML=r,t)),p=stir.feeds.data||[];p.length&&(a=stir.filter(t=>t.starts&&t.starts.includes(r.month)),stir.filter(t=>t.portalapply),l=stir.sort((t,r)=>t.title<r.title?-1:t.title>r.title?1:0),o=o(t),t=s(r),stir.compose(o,t,l,l,a,stir.clone)(p))}(stir.node("#course-list"));