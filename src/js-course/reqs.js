((scope)=>{


	const debuglink = `onclick="alert('This link will need a T4 Nav Object')"`;

	const template = {
		wp: "Widening access students may be eligible for an adjusted offer of entry. To find out if this applies to you go to our widening access pages. Care-experienced applicants will be guaranteed an offer of a place if they meet the minimum entry requirements.",
		es: "<p>Essential subjects must have been taken within the last five years to ensure your required subject knowledge is current.<br>Recent work experience can be taken into consideration in place of a formal qualification.</p>",
	};
	
	const structure = {
		
		UG: {
			sections: [
				{
					id: "SY1",
					title: "Year 1 entry - Four-year honours",
					codes: [
						{id: "SY1SH", title: "SQA Highers"},
						{id: "SY1AL", title: "GCE A-levels"},
						{id: "SY1IB", title: "IB Diploma"},
						{id: "RY1BT", title: "BTEC (Level 3)"},
						{id: "SY1SUBJ", title: "Essential subjects", body: template.es},
						{id: "", title:"Widening access students", body: template.wp}
					]
				},{
					id: "SY2",
					title: "Year 2 entry - Three-year honours",
					codes: [
						{id: "SY2AH", title: "SQA Advanced Highers"},
						{id: "SY2AL", title: "GCE A-levels"},
						{id: "SY2IB", title: "IB Diploma"},
						{id: "SY2SUBJ", title: "Essential subjects", body: template.es}
					]
				},
				{
					id: "SY1",
					title: "Other Scottish qualifications",
					codes: [
						{id: "SY1HN", title:"Scottish HNC/HND", prenote: "Year one minimum entry - ",},
						{id: "SY1ACC50%", title:"Access courses", prenote: "::NOTE OVERRIDE::"},
						{id: "SY1SWAPB", postnote: " - for mature students only"},
						{id: "", body:'Email our <a href="mailto:admissions@stir.ac.uk">Admissions Team</a> for advice about other access courses.'}
					]
				},
				{
					id: "SY2",
					title: "Other qualifications",
					codes: [
						{id: "RY1HNMD", title: "English, Welsh and Northern Irish HNC/HND"},
						{id: "", title: "Essential subjects"}
					]
				},
				{
					id: "AG",
					title: "Advanced entry",
					codes: [
						{id: "AGAE"}
					]
				},
				{
					id: "",
					title: "English language requirements",
					body: `<p>If English is not your first language you must have one of the following qualifications as evidence of your English language skills:</p>
					<ul>
						<li>IELTS Academic or UKVI [INTELI1.note]</li>
						<li>Pearson Test of English (Academic) [INTELP1.note]</li>
						<li>IBT TOEFL [INTELT1.note]</li>
					</ul>
					<p>See our information on English language requirements for more details on the language tests we accept and options to waive these requirements.</p>
					<p>Pre-sessional English language courses</p>
					<p>If you need to improve your English language skills before you enter this course, our partner INTO University of Stirling offers a range of English language courses. These intensive and flexible courses are designed to improve your English ability for entry to this degree.</p>
					<p>Find out more about our pre-sessional English language courses</p>`
				}
			]
		},
		PG: {
			sections: []
		}
	};

	console.info('[Entry requirements] begin:');
	const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
    const reqapi = "dev"===UoS_env.name?'../reqs.json':'<t4 type="media" id="181797" formatter="path/*" />'

	const el = document.querySelector('[data-modules-route-code]');
	const type = el && el.getAttribute('data-modules-course-type');
	const routes = (()=>{

		if(!el) return false;
		if(!el.hasAttribute('data-modules-route-code')) {
			debug && console.error('[Entry requirements] No routecode');
			return false;
		}
		if(el.getAttribute('data-modules-route-code').indexOf(',')!==-1) {
			debug && console.info('[Entry requirements] Multiple route codes');
		}
		return el.getAttribute('data-modules-route-code').split(',').map(item=>item.trim());

	})();

	

	function render (type,route) {
		const codes = route.entryRequirements.map(req => req.entryRequirementCode);
		console.info('route',route);
		console.info('structure',structure.UG);

		console.info('codes',codes);
		return structure[type].sections.map(section=>{
			if (section.id && codes.filter(code=>code.indexOf(section.id)===0).length) {

				const heading = `<small>[${section.codes && section.codes.filter(c=>c.id).map(c=>c.id).join(', ')}]</small><h3>${section.title}</h3>`;

				const body = section.codes ? section.codes.map(subsection => {
					if(subsection.id) {
						const matches = route.entryRequirements.filter(req=>req.entryRequirementCode.indexOf(subsection.id)===0);
						const title = subsection.title?`<strong>${subsection.title}</strong><br>`:"";
						return matches.length ? `<p>${title}${subsection.prenote||""}${matches.map(req=>req.note).join('')}${subsection.body||""}${subsection.postnote||""}</p>` : `<p><strong>${subsection.title}</strong><br>[no data]</p>`;
					}
					return "<p>"+(subsection.title?`<strong>${subsection.title}</strong><br>`:"") + (subsection.body||"") +"</p>";
				}).join('') : section.body;

				return heading + body;
			}

			return `<h3>${section.title}</h3>${section.body||''}`

		})
		.map(debug => `<div style="border:1px solid salmon; padding:1rem">${debug}</div><br>`)
		.join('');
		
	}

	const routecode = routes.shift().trim();
	console.info('[Entry requirements] route code',routecode);
    routecode && stir.getJSON(reqapi, data=>{
        if(data.entryRequirements) {
            const route = data.entryRequirements.filter(item=>item.rouCode===(routecode)).pop();
            if(!route) {
                return scope.insertAdjacentHTML("afterbegin",`<p><pre>💾 ${routecode}: no match for this route code found in the requirements data</pre></p>`);
            }
			if(!route.entryRequirements || route.entryRequirements.length===0) {
				return scope.insertAdjacentHTML("afterbegin",`<p><pre>💾 route code ${routecode}: matched but requirements data available</pre></p>`);
			}
            var feeccordion = document.createElement('div');
            feeccordion.setAttribute('data-behaviour','accordion');
            feeccordion.innerHTML = 
			`<div>
			${render(type,route)}
			<hr>
            <p>Route: <strong>${routecode}</strong><br>Entry requirments status: ${route.entryRequirmentsStatus}<br>Academic year: ${route.ayr}<br>Data updated: ${route.updatedDate}</p><hr>`+
            '<div style="column-count:3">'+
            route.entryRequirements.map(
                req => `<p style="font-size:.8rem;break-inside:avoid-column;"><strong>${req.entryRequirementCode}</strong> ${req.entryRequirementName}<br>${req.note}</p>`
            ).join('') +
            '</div><details style="margin:1rem;padding:1rem;border:2px dashed red"><summary>JSON data</summary><pre>' + JSON.stringify(
                (route),
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