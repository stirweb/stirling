!function(r){if(!r||!r.dataset.subject)return;const s=(t,e)=>e.length?`
        <table>
            <caption>${t} courses</caption>
            <thead>
                <tr>
                    <th>Course</th>
                    <th style="width: 30%">Start date</th>
                </tr>
            </thead>
            <tbody>
                ${stir.map(a,e).join("")}
            </tbody>
        </table>`:"",a=t=>`
        <tr>
            <td>
                <a href="${t.displayUrl}" data-mode="${t.metaData.M}">
                  ${t.metaData.B||""} ${t.metaData.t}
                </a>
            </td>
            <td> 
                ${t.metaData.sdt} 
            </td>
        </tr>`;const n=stir.curry((t,e)=>(t.innerHTML=e,t));n(r,"<p>Loading courses...</p>");e="https://www.stir.ac.uk/s/search.json?collection=stir-courses&sort=title&query=!padrenullquery&start_rank=1&num_ranks=300&",t={meta_S_and:r.dataset.subject};var t,e=e+stir.map(([t,e])=>t+"="+e,Object.entries(t)).join("&");stir.getJSON(e,t=>{var e=t=>null!==t.response.resultPacket&&0<t.response.resultPacket.results.length;return t.error?n(r,stir.getMaintenanceMsg()):e(t)?e(t)?n(r,(t=>{const e=stir.clone(t.response.resultPacket.results),r=stir.filter(t=>t.metaData.L.includes("Undergraduate"),e),a=stir.filter(t=>t.metaData.L.includes("Postgraduate"),e);return s("Undergraduate",r).concat(s("Postgraduate",a))})(t)):void 0:n(r,"<p>No courses found</p>")})}(stir.node("#course-subject-listing"));