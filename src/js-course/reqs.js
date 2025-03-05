((scope)=>{

	//const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
	const debug = false;

	const debuglink = `javascript:alert('[Preview] This link uses a T4 Nav Object')`;

	const links = {
		wp: UoS_env.t4_tags ? '<t4 type="navigation" name="Path to: Widening Participation (School)" id="5286" />':debuglink,
		acc: UoS_env.t4_tags ? '<t4 type="navigation" name="Path to: Access courses" id="5287" />':debuglink,
		swap: UoS_env.t4_tags ? '<t4 type="navigation" name="Path to: SWAP access courses" id="5288" />':debuglink
	};

	const template = {
		wp: `Widening access students may be eligible for an adjusted offer of entry. To find out if this applies to you go to our <a href="${links.wp}">widening access pages</a>. Care-experienced applicants will be guaranteed an offer of a place if they meet the minimum entry requirements.`,
		es: "<p>Essential subjects must have been taken within the last five years to ensure your required subject knowledge is current.<br>Recent work experience can be taken into consideration in place of a formal qualification.</p>",
		acc: `<a href="${links.acc}">University of Stirling access course</a> &mdash; for mature students only. You must pass the course with 50% or above.`,
		swap: `<a href="${links.swap}">SWAP Access course</a> &mdash; for mature students only.`,
		elr: ""
	};
	const elr = {
		UG: ["INTELI1","INTELP1","INTELT1"],
		PG: ["PGELI1","PGELP1","PGELT1"]
	};
	const setELR = (ELI1,ELP1,ELT1) => {
		template.elr = `
			<p>If English is not your first language you must have one of the following qualifications as evidence of your English language skills:</p>
			<ul>
				<li>IELTS Academic or UKVI ${ELI1}.</li>
				<li>Pearson Test of English (Academic) ${ELP1}.</li>
				<li>IBT TOEFL ${ELT1}.</li>
			</ul>
			<p>See our <a href="${debuglink}">information on English language requirements</a> for more details on the language tests we accept and options to waive these requirements.</p>
			<p><strong>Pre-sessional English language courses</strong></p>
			<p>If you need to improve your English language skills before you enter this course, our partner INTO University of Stirling offers a range of English language courses. These intensive and flexible courses are designed to improve your English ability for entry to this degree.</p>
			<p>Find out more about our <a href="${debuglink}">pre-sessional English language courses</a></p>`;
	};

	const getELR = () => template.elr;
	const structure = {
		
		UG: {
			sections: [
				{
					id: "UG",
					title: "Academic requirements",
					codes: [
						{id: "UG2.2"}
					]
				},
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
						{id: "SY1HN", title:"Scottish HNC/HND", prenote: "Year one minimum entry &mdash; ",},
						{id: "SY1ACC50%", title:"Access courses", replace: template.acc},
						{id: "SY1SWAPB", replace: template.sw},
						{id: "", body:'Email our <a href="mailto:admissions@stir.ac.uk">Admissions Team</a> for advice about other access courses.'},
						{id: "", title: "Foundation Apprenticeships", body: "Considered to be equivalent to 1 Higher at Grade B."},
						{id: "SY1SUBJ", title: "Essential subjects", body: template.es}
					]
				},
				{
					id: "RY1",
					title: "Other qualifications",
					codes: [
						{id: "RY1HNMD", title: "English, Welsh and Northern Irish HNC/HND"},
						{id: "RY1ACC", title: "English, Welsh and Northern Irish access courses"},
						{id: "SY1SUBJ", title: "Essential subjects", body: template.es}
					]
				},
				{
					id: "",
					title: "International entry requirements",
					body: `<p><a href="${debuglink}">View the entry requirements for your country</a></p>`
				},
				{
					id: "AGAE",
					title: "Advanced entry",
					codes: [
						{id: "AGAE"}
					]
				},
				{
					id: "",
					title: "English language requirements",
					body: getELR
				}
			]
		},
		PG: {
			sections: [
				{
					id:"PG",
					title:"Academic requirements",
					codes: [
						{id:"PG2.2"},
						{id:"PG2.1"},
						{id:"PG2.2/2.1"},
						{id:"PGAPS"},
						{id:"AGREF", body: "One reference required as standard."}
					]
				},
				{
					id:"PG",
					title:"Essential Subjects",
					codes: [
						{id:"PGSUBJ"},
						{id:"PGOTH"}
					]
				},
				{
					id: "",
					title: "International entry requirements",
					body: `<p><a href="${debuglink}">View the entry requirements for your country</a></p>`
				},
				{
					id:"",
					title:"Other routes of entry",
					body: `<p>If you don't currently meet our academic requirements, INTO University of Stirling offers a variety of preparation programmes that can earn you the qualifications and skills you need to progress onto some of our courses. Explore INTO University of Stirling to see the pathway and pre-masters routes available.</p>`
				},
				{
					id:"",
					title:"English language requirements",
					body: getELR
				}
			]
		}
	};
	
	console.info('[Entry requirements] begin:');
    const reqapi = "dev"===UoS_env.name?'../reqs.json':'<t4 type="media" id="181797" formatter="path/*" />'
	
	const el = document.querySelector('[data-modules-route-code]');
	const type = el && el.getAttribute('data-modules-course-type');
	console.info('[Entry requirements] type', type);
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

	function render (el,type,route) {
		
		// a simple array of the requirement codes for the current route. 
		const codes = route.entryRequirements.map(req => req.entryRequirementCode);

		console.info('route',route); console.info('structure',structure.UG); console.info('codes',codes);

		// we need to prepare the ELR template before looping through the sections
		// this will embed the requirements notes into the ELR boilerplate text.
		setELR(
			route.entryRequirements.filter(req=>req.entryRequirementCode===elr[type][0]).map(req=>req.note),
			route.entryRequirements.filter(req=>req.entryRequirementCode===elr[type][1]).map(req=>req.note),
			route.entryRequirements.filter(req=>req.entryRequirementCode===elr[type][2]).map(req=>req.note)
		);

		// Now generate HTML using the JSON structure object
		structure[type].sections.map(section=>{
			console.info('[Entry requirements] sections…')

			// if a section has an ID it must match at least one 
			// requirement code otherwise it won't be shown.
			if (section.id) {
				if (codes.filter(code=>code.indexOf(section.id)===0).length) {
					const heading = `<h3>${section.title}</h3>`;
					// if the section has codes, map them to the route data
					const body = section.codes ? section.codes.map(subsection => {
						// if a subsection has an ID then it must match at least one requirement code
						if(subsection.id) {
							const matches = route.entryRequirements.filter(req=>req.entryRequirementCode.indexOf(subsection.id)===0);
							const title = subsection.title?`<strong>${subsection.title}</strong><br>`:"";
							const body = `<p>${title}${subsection.prenote||""}${matches.map(req=>subsection.replace?subsection.replace:req.note).join('')}${subsection.body||""}${subsection.postnote||""}</p>`;
							return matches.length ? body : '';
						}
						// if a subsection has NO ID then it's just shown unconditionally.
						// (title and body are both optional so in practice it must have one or other)
						return "<p>"+(subsection.title?`<strong>${subsection.title}</strong><br>`:"") + (subsection.body||"") +"</p>";
					}).join('') : section.body;

					return heading + `<div>${body}</div>`;
				}
				// we get here if the section ID does not match
				return (debug?`<h3>${section.title}</h3><p>No matches</p>`:'');
			}

			// if a section has no ID then it will be shown unconditionally
			return `<h3>${section.title}</h3><div>${("function"===typeof section.body?section.body():section.body)||''}</div>`

		})
		.map(html => {
			const accordion = document.createElement('div');
			accordion.setAttribute("data-behaviour","accordion");
			accordion.innerHTML = html;
			el.append(accordion)
			new stir.accord(accordion,false);
			return accordion;
		});
		
	}

	const routecode = routes.shift().trim(); // take only the FIRST route code
	console.info('[Entry requirements] route code',routecode);
    routecode && stir.getJSON(reqapi, data=>{
        if(data.entryRequirements) {
            const route = data.entryRequirements.filter(item=>item.rouCode===(routecode)).pop();
            if(!route) {
                return scope.insertAdjacentHTML("afterbegin",`<p><pre>💾 ${routecode}: no match for this route code found in the requirements data</pre></p>`);
            }
			if(!route.entryRequirements || route.entryRequirements.length===0) {
				return scope.insertAdjacentHTML("afterbegin",`<p><pre>💾 route code ${routecode}: matched but requirements data is not available</pre></p>`);
			}
			scope.innerHTML = "<p>⚠️ These accordion sections are now using API data.</p>";
            render(scope,type,route);
        }
    })

})(document.getElementById("content_1_2"));