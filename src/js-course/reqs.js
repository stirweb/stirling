((scope)=>{

    console.info('[Entry Requirements]');
    scope.innerHTML = 'ENT REQs';
 const el = document.querySelector('[data-modules-route-code]');
    const route = el && el.getAttribute('data-modules-route-code');
    route && stir.getJSON("../reqs.json", data=>{
        console.info(data);
        if(data.entryRequirements) {
            scope.innerHTML = '<pre>' + JSON.stringify(
                (data.entryRequirements.filter(item=>item.rouCode===route).pop()),
                null,
                "\t"
            ) + '</pre>';
        }
    })

})(document.getElementById("content_1_2"));