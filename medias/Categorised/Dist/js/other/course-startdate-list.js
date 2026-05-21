!function(t){if(t)if(stir.feeds&&stir.feeds.data){const e=stir.curry(t=>{return`
               <tr>
                   <td>
                   ${t.portalapply?`<a href="https://portal.stir.ac.uk/student/course-application/ugd/application.jsp?crsCode=${t.portalapply}">`:""}
                   ${t.prefix} ${t.title}
                   ${t.portalapply?"</a>":""}
                   </td>
                   <td>${t.janfull}</td>
               </tr>`});var r=stir.curry(t=>`
             <table>
                 <caption>Full time courses starting in January</caption>
                 <thead>
                     <tr><th>Course</th><th>Year of entry</th></tr>
                 </thead>
                 <tbody>
                     ${t.map(t=>e(t)).join("")}
                 </tbody>
             </table>`)(stir.feeds.data.filter(t=>t.janfull&&0<Object.keys(t.janfull).length).sort((t,r)=>t.title.localeCompare(r.title)));t&&(t.innerHTML=r)}else console.error("Course data feed not found")}(stir.node("#course-list"));