((scope)=>{

    console.info('[Entry Requirements]');
    const reqapi = "dev"===UoS_env.name?'../reqs.json':'<t4 type="media" id="181797" formatter="path/*" />'
    //scope.innerHTML = 'ENT REQs';
 const el = document.querySelector('[data-modules-route-code]');
    const route = el && el.getAttribute('data-modules-route-code');
    route && stir.getJSON(reqapi, data=>{
        //console.info(data);
        if(data.entryRequirements) {
            const reqs = data.entryRequirements.filter(item=>item.rouCode===route).pop();
            var feeccordion = document.createElement('div');
            feeccordion.setAttribute('data-behaviour','accordion');
            feeccordion.innerHTML = 
            `<h3>API data</h3>
            <div>
            <p>Entry requirments status: ${reqs.entryRequirmentsStatus}<br>Academic year: ${reqs.ayr}</p><hr>`+
            '<div style="column-count:3">'+
            reqs.entryRequirements.map(
                req => `<p style="font-size:.8rem;break-inside:avoid-column;"><strong>${req.entryRequirementCode}</strong> ${req.entryRequirementName}<br>${req.note}</p>`
            ).join('') +
            '</div><details style="margin:1rem;padding:1rem;border:2px dashed red"><summary>JSON data</summary><pre>' + JSON.stringify(
                (reqs),
                null,
                "\t"
            ) + '</pre></details></div>';
            console.info(scope);
            //scope.appendChild(frag);
            scope.prepend(feeccordion);
            new stir.accord(feeccordion, false)
        }
    })

})(document.getElementById("content_1_2"));