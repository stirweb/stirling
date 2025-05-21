/**
 * W E L C O M E  t o   t h e  M E N U   A. P. I. 
 * "menu API" for building course lists
 * Started Friday 9 May 2025
 * r.w.morrison@stir.ac.uk
 */

(function() {

	const el = document.querySelector("main#content > .grid-container");
//	const host = window.location.hostname;
//	const path = '/data/pd-api-dev/';
//	const ppth = 'terminalfour/preview/1/en/35030';
//	const code = 'UCX12-BUSLAW';
//	const sess = '2024/5';
//	const seme = 'SPR';
//	const query = `programme=${code}/${sess}/${seme}`;

	const apiUrl = (()=>{
		switch (UoS_env.name) {
			case "dev":
				return '/pages/data/akari/menu.json';
			case "qa":
				return '/stirling/pages/data/akari/menu.json';
//			case "preview":
//			case "appdev-preview":
//				return `https://${host}/${ppth}?${query}`;
//			case "pub":
//				return `https://${host}${path}?${query}`;

		}
	})();

	const templates = {
		menu: data => `
				<div class="grid-container u-px-1">
					<div class="grid-x">
						<div class=cell>
							<h1>Courses</h1>
							<p>${data.map(year => `
								<details>
									<summary>${year.academicYear}</summary>
									<div class=u-px-1>
										${year.faculties.map(faculty => `
										<details>
											<summary>${faculty.name}</summary>
											<div class=u-px-1>
												${faculty.divisions.map(division => `
												<details>
													<summary>${division.name}</summary>
													<div class=u-px-1>
														${division.routes.map(route => `
														<p><a href="course.html?year=${year.academicYear}&route=${route.code}">${route.name}</a> <small>${route.code}</small></p>
														`).join('')}
													</div>
												</details>
												`).join('')}
											</div>
										</details>`).join('')}
									</div>
								</details>
								`).join('')}</p>
						</div>
					</div>
				</div>`
	};

	fetch(apiUrl)
		.then( (response) => response.json() )
		.then( (data) => el.insertAdjacentHTML("beforeend",templates.menu(data),console.info(data)) );



})();