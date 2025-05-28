(() => {

	console.info(window.location.search);

	const u = new URL(window.location);
	const el = document.querySelector("main#content > .grid-container");
	const spinner = new stir.Spinner(el);
	const host = window.location.hostname;
	const path = '/data/pd-api-dev/';
	const ppth = 'terminalfour/preview/1/en/35030';
	const code = u.searchParams.has("route") ? u.searchParams.get('route') : 'UCX12-BUSLAW';
	const sess = u.searchParams.has("sess") ? u.searchParams.get('sess') : '2024/5';
	const seme = 'SPR';
	const query = `programme=${code}/${sess}/${seme}`;

	const apiUrl = (()=>{
		switch (UoS_env.name) {
			case "dev":
				//return `https://www.stir.ac.uk${path}?${query}`;
				return '/pages/data/akari/course.json';
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

	const skip = ["programmeTitle","versionNumber","dateOfApproval","dateOfIntroduction","award","programmeCode","owningFaculty","owningDivision","ucasCode","creditPoints","ectsCredits","programmeLevel"];
	const skips = element => skip.indexOf(element) === -1;

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
	
	const availability = data => `<p>${data.year} ${data.location} ${data.deliveryMode} ${data.loadCategory} (Active: ${data.isActive})</p>`;
		
	function structure(data) {
		return `<p>${data.entryPointDescription}</p>
				${data.years.map(year=>`${year.semesters.map(semester).join('')}`).join('')}
		`;
	} 


	if(!el) return console.warn('[Course API] no DOM');

	function element(item) {
		return
	}

	spinner.show();

	fetch(apiUrl)
		.then((response) => response.json())
		.then((data) => {
			el.insertAdjacentHTML(
				"beforeend",
				`<div class="grid-container u-px-1">
					<div class="grid-x">
						<div class="cell u-padding-y">
							<h1 class="c-course-heading c-course-title__heading u-heritage-green">${data["programmeTitle"]}</h1>
							<div>
								<p><strong>Award</strong> ${data.award}</p>
								<p><strong>UCAS</strong> ${data.ucasCode}</p>
								<p><strong>Code</strong> ${data.programmeCode}</p>
								<p><strong>Level</strong> ${data.programmeLevel}</p>
								<p><strong>ECTS</strong> ${data.ectsCredits}</p>
								<p><strong>Credits</strong> ${data.creditPoints}</p>
								<p><strong>Faculty</strong> ${data.owningFaculty} (${data.owningDivision})</p>

							</div>
							<!-- "string"===typeof data[el]||"number"===typeof data[el] -->
							${ Object.keys(data).filter(skips).filter(el=>true).map(el => `<p><b>${el} [${typeof data[el]}]</b><br>${data[el]}</p><br>`).join("") }
							<p><b>Learning outcomes</b></p>
							${console.info(data.learningOutcomes)||''}
							<ul>
								${data.learningOutcomes.map(outcome => `<li>${outcome.description} ${Object.keys(outcome.graduateAttributes).map(id=>`<strong>${outcome.graduateAttributes[id]}</strong>`).join(", ")}</li>`).join('')}
							</ul>
							
							<p><b>Programme availabilities</b></p>
							${data.programmeAvailabilities.map(availability).join('')}
							<div class="u-p-2 u-mb-2" style="background: #f6f5f4">
								<p><b>Programme structure</b></p>
								${data.programmeStructure.map(structure).join('')}
							</div>
						</div>
					</div>
				</div>`);
			spinner.hide();
		});

})();