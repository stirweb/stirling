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
							<h1 class=c-course-heading>Courses</h1>
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
														<p>${route.name} <small>${route.code}</small>
															<a href="/pages/courses/api/course.html?session=${year.academicYear}&route=${route.code}&semester=AUT">Autumn</a> | 
															<a href="/pages/courses/api/course.html?session=${year.academicYear}&route=${route.code}&semester=SPR">Spring</a> | 
															<a href="/pages/courses/api/course.html?session=${year.academicYear}&route=${route.code}&semester=SUM">Summer</a>
														</p>
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

//	fetch(apiUrl)
//		.then( (response) => response.json() )
//		.then( (data) => el.insertAdjacentHTML("beforeend",templates.menu(data),console.info(data)) );

	el.insertAdjacentHTML("beforeend",templates.menu([
	{
		"academicYear": "2023/4",
		"faculties": [
			{
				"name": "Arts & Humanities",
				"divisions": [
					{
						"routes": [
							{
								"code": "UCX12-BUSFMS",
								"name": "BA (Hons) Film and Media"
							}
						],
						"name": "Communications, Media and Culture"
					},
					{
						"routes": [
							{
								"code": "UCX12-HISHER",
								"name": "BA (Hons) History and Heritage"
							},
							{
								"code": "UHX12-HIT",
								"name": "BA (Hons) Heritage and Tourism"
							}
						],
						"name": "History, Heritage and Politics"
					},
					{
						"routes": [
							{
								"code": "UHX12-BSL",
								"name": "BA (Hons) Business Law"
							}
						],
						"name": "Law and Philosophy"
					},
					{
						"routes": [
							{
								"code": "TXX43-CRW",
								"name": "MLitt Creative Writing"
							}
						],
						"name": "Literature and Languages"
					}
				]
			},
			{
				"name": "Faculty of Social Sciences",
				"divisions": [
					{
						"routes": [
							{
								"code": "TXO45-DEM",
								"name": "MSc Dementia Studies (Online)"
							}
						],
						"name": "Dementia and Ageing"
					}
				]
			}
		]
	},
	{
		"academicYear": "2024/5",
		"faculties": [
			{
				"name": "Arts & Humanities",
				"divisions": [
					{
						"routes": [
							{
								"code": "UCX12-BUSFMS",
								"name": "BA (Hons) Film and Media 2024/5 (test)"
							}
						],
						"name": "Communications, Media and Culture"
					},
					{
						"routes": [
							{
								"code": "UCX12-HISHER",
								"name": "BA (Hons) History and Heritage"
							},
							{
								"code": "UHX12-HIT",
								"name": "BA (Hons) Heritage and Tourism"
							}
						],
						"name": "History, Heritage and Politics"
					},
					{
						"routes": [
							{
								"code": "UHX12-BSL",
								"name": "BA (Hons) Business Law"
							}
						],
						"name": "Law and Philosophy"
					},
					{
						"routes": [
							{
								"code": "TXX43-CRW",
								"name": "MLitt Creative Writing"
							}
						],
						"name": "Literature and Languages"
					}
				]
			},
			{
				"name": "Faculty of Social Sciences",
				"divisions": [
					{
						"routes": [
							{
								"code": "TXO45-DEM",
								"name": "MSc Dementia Studies (Online)"
							}
						],
						"name": "Dementia and Ageing"
					}
				]
			}
		]
	}
]));


})();