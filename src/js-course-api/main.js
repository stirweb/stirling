(() => {

	console.info(window.location.search);

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
			case "pub":
				return `https://${host}${path}?${query}`;

		}
	})();

	console.info('[Main] apiUrl',apiUrl);

	const debug = ["learningOutcomes","programmeAvailabilities","programmeStructure","qaaBenchmarks"];
	const skip = ["programmeTitle","versionNumber","dateOfApproval","dateOfIntroduction","award","programmeCode","owningFaculty","owningDivision","ucasCode","creditPoints","ectsCredits","programmeLevel"].concat(debug);
	const skips = element => skip.indexOf(element) === -1;
	const labels = {
		"assessmentApproach": "Approach to assessment",
		"awardBodies": "Awarding bodies",
		"careerAvenues": "Career avenues",
		"learnTeachApproach": "Approach to learning and teaching",
		"partnerInstitutions": "Partner institutions",
		"programmeOverview": "Overview",
		"qaaBenchmarks": "QAA benchmarks"
	};
	const categories = {
		FT: "Full time",
		PTO: "Part time"
	};

	const modules = module => `
		<tr>
			<td><a href="#">${module.title}</a> <span class="c-course-modules__module-code">(${module.code||module.moduleCode})</span></td>
			<td>${module.credits?module.credits:'XX'} credits</td></tr>
		`; //ask peter to rename option module `moduleCode` to `code` so its same as normal modules
	const collections = collection => `
		<details>
			<summary style="cursor:pointer">${collection.title}</summary>
			<table class=c-course-modules__table>
				${collection.collectionElements.map(modules).join('')}
			</table>
		</details>
	`;
	const semester = semester => `
		<details class="u-border-bottom-solid u-pb-1 u-mb-1">
			<summary style="cursor:pointer" class="text-md u-font-bold">${semester.semesterDescription}</summary>
			<div class="u-mx-1 u-mb-2">
				<p>Modules</p>
				<table class=c-course-modules__table>
					${semester.items.modules.map(modules).join('')}
				</table>
				<p>Collections</p>
				${semester.items.collections.map(collections).join('')}
			</div>
		</details>`;
	
	const availability = data => `<li>${data.year} ${data.location}, ${data.deliveryMode} ${categories[data.loadCategory]||data.loadCategory}${"Y"===data.isActive?"":' (Inactive)'}</li>`;
	const benchmark = data => `<li>${data}</li>`;
		
	const structure = data => `<p>${data.entryPointDescription}</p> ${data.years.map(year=>`${year.semesters.map(semester).join('')}`).join('')}`;  


	if(!el) return console.warn('[Course API] no DOM');

	function element(item) {
		return
	}

	spinner.show();

	el.insertAdjacentHTML("beforeend",`<div class=cell><pre>🤖 ${apiUrl}</pre></div>`);

	fetch(apiUrl)
		.then((response) => {
			if (!response.ok) {
				console.error(`Response status: ${response.status}`);
			} else {
				return response.json();
			}
		})
		.then((data) => {
			if(!data) {
				spinner.hide();
				el.insertAdjacentHTML("beforeend",`<p><strong>Error</strong>: No data!</p>`);
				return;
			}
			el.insertAdjacentHTML(
				"beforeend",
				`<div class="grid-container u-px-1">
					<div class="grid-x">
						<div class="cell u-padding-y">
							<h1 class="c-course-heading c-course-title__heading u-heritage-green">${data["programmeTitle"]}</h1>
							<div class="u-bg-heritage-green--10 u-p-1 u-mb-2" style="column-count:2">
								<p><strong>Award</strong> ${data.award}</p>
								<p><strong>UCAS</strong> ${data.ucasCode}</p>
								<p><strong>Code</strong> ${data.programmeCode}</p>
								<p><strong>Level</strong> ${data.programmeLevel}</p>
								<p><strong>ECTS</strong> ${data.ectsCredits}</p>
								<p><strong>Credits</strong> ${data.creditPoints}</p>
								<p><strong>Faculty</strong> ${data.owningFaculty}</p>
								<p><strong>Division</strong> ${data.owningDivision}</p>
							</div>

							<!-- AUTO -->
							<!-- "string"===typeof data[el]||"number"===typeof data[el] -->
							${ Object.keys(data).filter(skips).filter(el=>true).map(el => `<h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">${labels[el]||el}</h3><p>${data[el]} [${typeof data[el]}]</p><br>`).join("") }
							<!-- AUTO -->

							<h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">QAA benchmarks</h3>
							<ul>${data.qaaBenchmarks.map(benchmark).join('')}</ul>
							<h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Learning outcomes and graduate attributes</h3>
							<ul>
								${data.learningOutcomes.map(outcome => `<li>${outcome.description} ${Object.keys(outcome.graduateAttributes).map(id=>`<strong>${outcome.graduateAttributes[id]}</strong>`).join(", ")}</li>`).join('')}
							</ul>
							<h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Programme availabilities</h3>
							<ul>${data.programmeAvailabilities.map(availability).join('')}</ul>
							<h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">Programme structure</h3>
							<div class="u-p-2 u-mb-2" style="background: #f6f5f4">
								${data.programmeStructure.map(structure).join('')}
							</div>
						</div>
					</div>
				</div>`);
			spinner.hide();
		});

})();