(function() {

    const el = document.querySelector('[data-action="datazone"]');
    const results = document.createElement('div');
    el.appendChild(results);
    const RSS_URL = "https://stage-shared-15-24-search.clients.uk.funnelback.com/s/search.json?collection=stir-www&query=!padrenullquery"

    console.info("[News tagging report]");

    const tagsTable = data => {
        console.info(data);
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');
        tbody.insertAdjacentHTML("afterbegin",data.allValues.map(value => `<tr><td data-tag="${value.label}" data-count="${value.count}">${value.label}</td><td>${value.count}</td></tr>`).join(''));
        table.insertAdjacentHTML("afterbegin",'<thead><tr><td scope=column>Tag</th><th scope=column>Usage</th></tr></thead>');
        table.appendChild(tbody);
        el.insertAdjacentElement("afterbegin",table);

        table.addEventListener('click', clickHandler);
    };

    const resultTemplate = result => `
    <div class=x-tag-report-result>
        <h3 class="header-stripped u-header--margin-stripped"><small>${result.rank}</small> ${result.title.split("|")[0]}</h3>
        <time><span class="u-icon h5 uos-calendar"></span> ${result.metaData.d ? stir.Date.newsDate(new Date(result.metaData.d)) : ""}</time>
        <p>${result.metaData["c"]?.split("|")[0]}</p>
        <p>${result?.listMetadata?.tag?.map(tag=>`<span class=tag>${tag}</span>`)?.join('')}</p>
    </div>
    `;

    const pagesTable = data => {
        console.info(data);
        results.innerHTML = data.map(resultTemplate).join('');
    }

    const getPages = (tag,ranks) => {
        const fb = `https://stage-shared-15-24-search.clients.uk.funnelback.com/s/search.json?collection=stir-www&meta_tag=${tag}&num_ranks=${ranks||255}&SF=[c,d,tag]&sort=date`;
        fetch(fb)
            .then(response => response.text())
            .then(str => JSON.parse(str))
            .then(data => pagesTable(data.response.resultPacket.results));
    };

    const clickHandler = event => {
        if(!event) return;
        if(!event.target.hasAttribute('data-tag')) return;
        console.info(event.target.textContent);
        getPages(event.target.getAttribute('data-tag'), event.target.getAttribute('data-count'));
    };

    fetch(RSS_URL)
        .then(response => response.text())
        .then(str => JSON.parse(str))
        .then(data => tagsTable(data.response.facets[0]));

})();
