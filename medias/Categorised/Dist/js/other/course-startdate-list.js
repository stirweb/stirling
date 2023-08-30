!function(t){if(t){const o={applyLinkUG:"https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=",month:t.getAttribute("data-startmonth")},n=(Object.freeze(o),stir.curry((t,r)=>{return`
        <tr>
            <td>
              ${r.url?`<a href="${r.url}">`:""}
              ${r.prefix} ${r.title} 
              ${r.url?"</a>":""}
            </td>
            <td>${r=r,s=t.month,r.starts?stir.compose(stir.join(", "),stir.map(t=>t.split(" ")[1]),stir.filter(t=>t.includes(s)))(r.starts.split(", ")):""}</td>
        </tr>`;var s}));var r,s,i=stir.curry((t,r)=>{const s=n(t);return`
          <table>
              <caption>Courses starting in ${t.month}</caption>
              <thead>
                  <tr><td>Course</td><td>Year of entry</td></tr>
              </thead>
              <tbody>
                  ${r.map(t=>s(t)).join("")}
              </tbody>
          </table>`}),e=stir.curry((t,r)=>(t.innerHTML=r,t)),a=stir.feeds.data||[];a.length&&(r=stir.filter(t=>t.starts&&t.starts.includes(o.month)),s=stir.sort((t,r)=>t.title<r.title?-1:t.title>r.title?1:0),e=e(t),t=i(o),stir.compose(e,t,s,s,r,stir.clone)(a))}}(stir.node("#course-list"));