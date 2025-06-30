/**
 * W E L C O M E  t o   t h e  M E N U   A. P. I. 
 * "menu API" for building course lists
 * Started Friday 9 May 2025
 * r.w.morrison@stir.ac.uk
 */

(function() {

	const el = document.querySelector("main#content > .grid-container");
	const host = window.location.hostname;
	const path = '/data/pd-api-dev/';
	const ppth = 'terminalfour/preview/1/en/35030';
	const query = 'menu';

	const apiUrl = (()=>{
		switch (UoS_env.name) {
			case "dev":
				return '/pages/data/akari/menu.json';
			case "qa":
				return '/stirling/pages/data/akari/menu.json';
			case "preview":
			case "appdev-preview":
				return `https://${host}/${ppth}?${query}`;
			case "pub":
				return `https://${host}${path}?${query}`;

		}
	})();

	const templates = {
		menu: data => { 
			console.info(data);
			
			if(!data || !data.academicYears) return;

			console.info(Object.keys(data.academicYears).map(year => Object.keys(data.academicYears[year].faculties).map(faculty => Object.keys(data.academicYears[year].faculties[faculty].divisions).map(division => data.academicYears[year].faculties[faculty].divisions[division].routes))));

			return `
				<div class="grid-container u-px-1">
					<div class="grid-x">
						<div class=cell>
							<p>${Object.keys(data.academicYears).map(year => {
								const faculties = Object.keys(data.academicYears[year].faculties);
								return `<details class=u-accordion>
									<summary>${year}</summary>
									<div class=u-px-1>
										${faculties.map(faculty => {
											const divisions = Object.keys(data.academicYears[year].faculties[faculty].divisions);
											return `<details>
											<summary>${faculty}</summary>
											<div class=u-px-1>
												${divisions.map(division => `
												<details>
													<summary>${division}</summary>
													<div class=u-px-1>
														<table>
															<thead>
																<tr>
																	<th>Route code</th><th>Course name</th><th>More information</th>
																</tr>
															</thead>
															<caption>${faculty} (${division}) routes for ${year}:</caption>
															${data.academicYears[year].faculties[faculty].divisions[division].routes.map(route => `
															<tr><td><small>${route.routeCode}</small></td><td>${route.routeName}</td><td>
																<a href="/pages/courses/api/course.html?session=${year}&route=${route.routeCode}&semester=AUT">Autumn</a> | 
																<a href="/pages/courses/api/course.html?session=${year}&route=${route.routeCode}&semester=SPR">Spring</a> | 
																<a href="/pages/courses/api/course.html?session=${year}&route=${route.routeCode}&semester=SUM">Summer</a>
															</td></tr>
														`).join('')}
														</table>
													</div>
												</details>
												`).join('')}
											</div>
										</details>`;
									}).join('')}
									</div>
								</details>`;
							}).join('')}</p>
						</div>
					</div>
				</div>`;}
	};

	fetch(apiUrl)
		.then( (response) => response.json() )
		.then( (data) => el.insertAdjacentHTML("beforeend",templates.menu(data),console.info(data)) );

})();