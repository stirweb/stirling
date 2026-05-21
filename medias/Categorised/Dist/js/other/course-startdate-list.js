!function(t){if(t)if(stir.feeds&&stir.feeds.data){const r=stir.curry(t=>`
               <tr>
                   <td>
                   ${t.url?`<a href="${t.url}">`:""}
                   ${t.prefix} ${t.title}
                   ${t.url?"</a>":""}
                   </td>
                   <td>${t.janfull}</td>
               </tr>`);var e=stir.curry(t=>`
             <table>
                 <caption>Full time courses starting in January</caption>
                 <thead>
                     <tr><th>Course</th><th>Year of entry</th></tr>
                 </thead>
                 <tbody>
                     ${t.map(t=>r(t)).join("")}
                 </tbody>
             </table>`)(stir.feeds.data.filter(t=>t.janfull&&0<Object.keys(t.janfull).length).sort((t,e)=>t.title.localeCompare(e.title)));t&&(t.innerHTML=e)}else console.error("Course data feed not found")}(stir.node("#course-list"));