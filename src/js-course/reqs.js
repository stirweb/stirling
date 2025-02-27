((scope)=>{

	//const debug = window.location.hostname != "www.stir.ac.uk" ? true : false;
	const debug = false;

	const debuglink = `javascript:alert('[Work in progess] This link will need a T4 Nav Object')`;

	const template = {
		wp: "Widening access students may be eligible for an adjusted offer of entry. To find out if this applies to you go to our widening access pages. Care-experienced applicants will be guaranteed an offer of a place if they meet the minimum entry requirements.",
		es: "<p>Essential subjects must have been taken within the last five years to ensure your required subject knowledge is current.<br>Recent work experience can be taken into consideration in place of a formal qualification.</p>",
		elr: ""
	};
	const elr = {
		UG: ["INTELI1","INTELP1","INTELT1"],
		PG: ["PGELI1","PGELP1","PGELT1"]
	};
	const setELR = (ELI1,ELP1,ELT1) => {
		template.elr = `<p>If English is not your first language you must have one of the following qualifications as evidence of your English language skills:</p>
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
						{id: "SY1HN", title:"Scottish HNC/HND", prenote: "Year one minimum entry - ",},
						{id: "SY1ACC50%", title:"Access courses", prenote: ""},
						{id: "SY1SWAPB", postnote: " - for mature students only"},
						{id: "", body:'Email our <a href="mailto:admissions@stir.ac.uk">Admissions Team</a> for advice about other access courses.'}
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
		const wrapper = document.createElement('div');
		el.append(wrapper);

		console.info('route',route); console.info('structure',structure.UG); console.info('codes',codes);

		setELR(
			route.entryRequirements.filter(req=>req.entryRequirementCode===elr[type][0]).map(req=>req.note),
			route.entryRequirements.filter(req=>req.entryRequirementCode===elr[type][1]).map(req=>req.note),
			route.entryRequirements.filter(req=>req.entryRequirementCode===elr[type][2]).map(req=>req.note)
		);

		// generate HTML using the JSON structure object
		structure[type].sections.map(section=>{
				console.info('[Entry requirements] sections…')

			// if a section has an ID it must match at least one 
			// requirement code otherwise it won't be shown.
			if (section.id) {
				if (codes.filter(code=>code.indexOf(section.id)===0).length) {
					const heading = `<h3>${section.title}</h3>`;
					// if the section has codes, map them to the route data
					const body = section.codes ? section.codes.map(subsection => {
						if(subsection.id) {
							const matches = route.entryRequirements.filter(req=>req.entryRequirementCode.indexOf(subsection.id)===0);
							const title = subsection.title?`<strong>${subsection.title}</strong><br>`:"";
							return matches.length ? `<p>${title}${subsection.prenote||""}${matches.map(req=>req.note).join('')}${subsection.body||""}${subsection.postnote||""}</p>` : (debug?`<p><strong>${subsection.title||subsection.id}</strong><br>[no data]</p>`:'');
						}
						return "<p>"+(subsection.title?`<strong>${subsection.title}</strong><br>`:"") + (subsection.body||"") +"</p>";
					}).join('') : section.body;
					return heading + body;
				}
				return (debug?`<h3>${section.title}</h3><p>No matches</p>`:'');
			}

			// if a ssection has no ID then it will just always be shown
			return `<h3>${section.title}</h3>${("function"===typeof section.body?section.body():section.body)||''}`

		})
		.map(accordion => {
			const el = document.createElement('div');
			el.setAttribute("data-behaviour","accordion");
			el.innerHTML = accordion;
			new stir.accord(el,false);
			return el;
		}).forEach(element => wrapper.append(element));

		return wrapper;
		
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
            var feeccordion = document.createElement('div');
            feeccordion.setAttribute('data-behaviour','accordion');
            render(feeccordion,type,route);
            console.info(scope);
            //scope.appendChild(frag);
            scope.prepend(feeccordion);
            new stir.accord(feeccordion, false)
        }
    })

})(document.getElementById("content_1_2"));