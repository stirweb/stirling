(() => {

	//console.info(window.location.search);

	const css = document.createElement('style');
	document.head.append(css);
	css.textContent = "span.lc { text-transform: lowercase; }";

	const u = new URL(window.location);
	const el = document.querySelector("main#content > .grid-container");
	const spinner = new stir.Spinner(el);
	const host = window.location.hostname;
	const path = '/data/pd-api-dev/';
	const ppth = 'terminalfour/preview/1/en/35030';
	const code = u.searchParams.has("route") ? u.searchParams.get('route') : 'UCX12-BUSLAW';
	const sess = u.searchParams.has("session") ? u.searchParams.get('session') : '2024/5';
	const seme = u.searchParams.has("semester") ? u.searchParams.get('semester') :'SPR';
	const query = `programme=${code}/${sess}/${seme}`;
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


	const apiUrl = (()=>{
		switch (UoS_env.name) {
			case "dev":
				return `https://www.stir.ac.uk${path}?${query}`;
				//return '/pages/data/akari/course.json';
			case "qa":
				return '/stirling/pages/data/akari/course.json';
			case "preview":
			case "appdev-preview":
				return `https://${host}/${ppth}?${query}`;
			case "prod":
				return `https://${host}${path}?${query}`;

		}
	})();

	console.info('[Main] apiUrl',apiUrl);

	const debug = ["learningOutcomes","programmeAvailabilities","programmeStructure","qaaBenchmarks"];
	const order = ["programmeOverview","careerAvenues"];
	const skip  = ["assessmentApproach","learnTeachApproach","programmeTitle","versionNumber","dateOfApproval","dateOfIntroduction","award","programmeCode","owningFaculty","owningDivision","ucasCode","creditPoints","ectsCredits","programmeLevel"].concat(order,debug);
	const ordered = element => order.indexOf(element) !== -1;
	const skips = element => skip.indexOf(element) === -1;
	const labels = {
		"assessmentApproach": "Approach to assessment",
		"awardBodies": "Awarding bodies",
		"careerAvenues": "My future",
		"learnTeachApproach": "Approach to learning and teaching",
		"partnerInstitutions": "Partner institutions",
		"programmeOverview": "Overview",
		"qaaBenchmarks": "QAA benchmarks"
	};
	const categories = {
		FT: "Full time",
		PTO: "Part time",
		SW: "Sandwich"
	};

	const modules = module => `
		<tr>
			<td><a target=_blank href="https://www.stir.ac.uk/courses/module/?code=${module.code||module.moduleCode}&session=${sess}&semester=${seme}" data-notused="occurrence=A">${module.title}</a> <span class="c-course-modules__module-code">(${module.code||module.moduleCode})</span></td>
			<td>${module.credits?module.credits+" credits":''}</td><td>${module.deliveryType||''}</td></tr>
		`; //ask peter to rename option module `moduleCode` to `code` so its same as normal modules
	const collections = collection => collection.collectionElements.length>0?`
		<p class=u-m-0><strong>Collections</strong></p>
		<p>Students will choose one (or as indicated) module/credits from a collection.</p>
		<details>
			<summary style="cursor:pointer">${collection.title}</summary>
			<table class=c-course-modules__table>
				${collection.collectionElements.map(modules).join('')}
			</table>
		</details>
	`:'<!-- no collections for this semester -->';

	const pathways = pathway => {
		return `<details class="u-border-bottom-solid u-pb-1 u-mb-1">
					<summary style="cursor:pointer" class="text-md u-font-bold">${pathway.pathwayDescription}</summary>
					<div class="u-mx-1 u-mb-1 u-py-1">
						${items(pathway.items)}
					</div>
				</details>`;
	};

	const items = data => data ? `${data.modules.length? `<p class=u-m-0><strong>Modules</strong></p><table class=c-course-modules__table>${data.modules.map(modules).join('')}</table>`:''}${data.collections.length ? data.collections.map(collections).join(''):''}`:'';

	const semester = semester => `
		<details class="u-border-bottom-solid u-pb-1 u-mb-1">
			<summary style="cursor:pointer" class="text-md u-font-bold">${semester.semesterDescription}</summary>
			<div class="u-mx-1 u-mb-1 u-py-1">
				${semester.pathways.map(pathways).join('')}
				${items(semester.items)}
				<!-- Options: ${semester.options.length} -->
			</div>
		</details>`;
	const initCap = text => `${text[0]}${text.slice(1).toLowerCase()}`;
	const onlyUnique = (value, index, self)  => self.indexOf(value) === index;
	const avail = (data,exhastive) => {
		const location = "STIRLING"!==data.location?initCap(data.location):'';
		const delivery = data.deliveryMode.replace(", UK",'');
		const mode = (categories[data.loadCategory]||data.loadCategory).toLowerCase();
		const date = `${months[parseInt(data.prospectiveStartDate.split('-')[1])]||''} ${data.year}`;
		const active = "Y"===data.isActive?"":' (Inactive)';
		return `${[location,location?delivery:initCap(delivery),mode,exhastive?date:'',active].filter(el=>el.length).join(', ')}`;
	};
	const availability = data => avail(data,false); 
	const availabilityx = data => avail(data,true); 
	const li = data => `<li>${data}</li>`;
	
	const structure = data => `<p>${data.entryPointDescription}</p> ${data.years.map(year=>`${year.semesters.map(semester).join('')}`).join('')}`;  
	
	const empties = el => ("string"===typeof el||"number"===typeof el) && el.length>0;

	const auto = (el,data) => empties(data) ? `<div class=u-mb-2><h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">${labels[el]||el}</h3><p>${data}</p></div>`:'';

	if(!el) return console.warn('[Course API] no DOM');

	spinner.show();

	//console.info("[Module]",apiUrl);

	fetch(apiUrl)
		.then((response) => {
			if (!response.ok) {
				console.error(`Response status: ${response.status}`);
			} else {
				return response.json();
			}
		})
		.then((data) => {
			if(!data || data.error) {
				spinner.hide();
				el.insertAdjacentHTML("beforeend",`<p><strong>Error</strong>: No data!</p>`);
				return;
			}
			//console.info(data);
			el.insertAdjacentHTML(
				"beforeend",
				`<div class="grid-container u-px-1">
					<div class="grid-x">
						<div class="cell medium-10 medium-offset-1 u-padding-y">
							<h1 class="c-course-heading c-course-title__heading u-heritage-green">${data["programmeTitle"]}</h1>
							<div class="u-bg-heritage-green--10 u-p-1 u-mb-2" style="column-count:2">
								${data.owningFaculty ? `<p><strong>Faculty</strong> ${data.owningFaculty}</p>`:''}
								${data.owningDivision ? `<p><strong>Division</strong> ${data.owningDivision}</p>`:''}
								${data.award ? `<p><strong>Award</strong> ${data.award}</p>`:''}
								${data.programmeCode ? `<p><strong>Programme route code</strong> ${data.programmeCode}</p>`:''}
								${data.programmeLevel ? `<p><strong>SCQF level</strong> ${data.programmeLevel&&data.programmeLevel.replace('Level ','')}</p>`:''}
								${data.creditPoints ? `<p><strong>Credits</strong> ${data.creditPoints}</p>`:''}
								${data.ectsCredits ? `<p><strong>ECTS</strong> ${data.ectsCredits}</p>`:''}
								${data.ucasCode ? `<p><strong>UCAS</strong> ${data.ucasCode}</p>`:''}
							</div>

							${data.programmeAvailabilities.length>0?'<div class=u-mb-2><h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Programme availabilities</h3><ul>':''}
							${data.programmeAvailabilities.map(availability).filter(onlyUnique).map(li).join('')}
							${data.programmeAvailabilities.length>0?'</ul><details style="margin-left:1.5rem;"><summary>Full list of availabilities</summary><ul>':''}
							${data.programmeAvailabilities.map(availabilityx).filter(onlyUnique).map(li).join('')}
							${data.programmeAvailabilities.length>0?'</ul></details></div>':''}

							${ order.map(el=>auto(el,data[el])).join("") }

							<!-- AUTO -->
							${ Object.keys(data).filter(skips).map(el => auto(el,data.el)).join("") }
							<!-- AUTO -->
							
							${data.qaaBenchmarks.length>0?'<div class=u-mb-2><h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">QAA benchmarks</h3><ul>':''}
							${data.qaaBenchmarks.map(li).join('')}
							${data.qaaBenchmarks.length>0?'</ul></div>':''}

							${data.learningOutcomes.length>0?'<div class=u-mb-2><h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Learning outcomes and graduate attributes</h3><ul>':''}
							${data.learningOutcomes.map(outcome => `	<li class="u-initcap u-mb-1">${outcome.description} <br><span class="text-xsm">Graduate attributes: ${Object.keys(outcome.graduateAttributes).map(id=>`<a class=x-tag-link href="https://www.stir.ac.uk/student-life/careers/careers-advice-for-students/graduate-attributes/#:~:text=${outcome.graduateAttributes[id]}">${outcome.graduateAttributes[id]}</a>`).join(', ')}</li>`).join('')}
							${data.learningOutcomes.length>0?'</ul></div>':''}

							<div class=u-mb-2>
								<h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Programme structure</h3>
								<p>The programme structures contained within the programme specifications are full-time structures. Where a student is taking the programme on a part-time basis the modules may be taken in an alternative sequence.</p>
								<p>The list below shows compulsory and option modules for this programme. Option modules are revised over time and, in some cases, will be dependent upon pre-requisite and/or co-requisites being taken. More information about these requirements can be found in the relevant Module Descriptors. The options available each year can be subject to change due to student demand and availability of teaching staff</p>
								<div class="u-p-2 u-mb-2" style="background: #f6f5f4">
									${data.programmeStructure.length>0?data.programmeStructure.map(structure).join(''):'<p>No data available.</p>'}
								</div>
							</div>
							
							${['learnTeachApproach','assessmentApproach'].map(el=>auto(el,data[el])).join('')}

							<div>
								<h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Assessment and feedback</h3>
								<h4>Academic Integrity</h4>
								<p>The University of Stirling is committed to protecting the quality and standards of its awards. Consequently, the University seeks to promote and nurture academic integrity, support staff academic integrity, and support students to understand and develop good academic skills that facilitate academic integrity. In addition, the University deals decisively with all forms of academic misconduct.</p>
								<p>More information can be found in the <a href="<t4 type="media" id="191162" formatter="path/*" />">University Academic Integrity Policy</a></p>
								<H4>Feedback on assessment</h4>
								<p>The University takes feedback very seriously and, along with the Students’ Union, have developed a <a href="https://www.stir.ac.uk/about/professional-services/student-academic-and-corporate-services/academic-registry/feedback-on-student-work/">feedback policy</a> and student guidance on feedback.</p>

								<h4>Assessment Regulations and Policy</h4>
								<p>The University of Stirling regulations and policy relevant to assessment can be accessed via:</p>
								<ul>
									<li><a href="https://www.stir.ac.uk/about/professional-services/student-academic-and-corporate-services/academic-registry/regulations/undergraduate/">Undergraduate</a></li>
									<li><a href="https://www.stir.ac.uk/about/professional-services/student-academic-and-corporate-services/academic-registry/regulations/postgraduate-taught-regulations/">Postgraduate – Taught</a></li>
									<li><a href="https://www.stir.ac.uk/about/professional-services/student-academic-and-corporate-services/academic-registry/regulations/postgraduate-research-regulations/">Postgraduate - Research</a></li>
								</ul>
							</div>
						</div>
					</div>
				</div>`);
			spinner.hide();
		});

})();