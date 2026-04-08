!function(){var e="prod"!==UoS_env.name;const a=document.querySelector("main#content"),t=window.location.hostname,i="dev"===UoS_env.name?"course.html":'<t4 type="navigation" name="Helper: Path to programme specification" id="5300" />';var s=(()=>{switch(UoS_env.name){case"dev":return"/pages/data/akari/menu.json";case"qa":return"/stirling/pages/data/akari/menu.json";case"preview":case"appdev-preview":return`https://${t}/terminalfour/preview/1/en/35030?menu`;case"pub":case"prod":return`https://${t}/data/pd-api-dev/?menu`}})();const r={menu:s=>{if(console.info(s),s&&s.academicYears)return console.info(Object.keys(s.academicYears).map(t=>Object.keys(s.academicYears[t].faculties).map(a=>Object.keys(s.academicYears[t].faculties[a].divisions).map(e=>s.academicYears[t].faculties[a].divisions[e].routes)))),`
				<div class="grid-container u-px-1">
					<div class="grid-x">
						<div class=cell>
							<p>${Object.keys(s.academicYears).map(t=>{var e=Object.keys(s.academicYears[t].faculties);return`<details class=u-accordion>
									<summary>${t}</summary>
									<div class=u-px-1>
										${e.map(a=>{var e=Object.keys(s.academicYears[t].faculties[a].divisions);return`<details>
											<summary>${a}</summary>
											<div class=u-px-1>
												${e.map(e=>`
												<details>
													<summary>${e}</summary>
													<div class=u-px-1>
														<table>
															<thead>
																<tr>
																	<th>Route code</th><th>Course name</th><th>Partner institution</th>
																</tr>
															</thead>
															<caption>${a} (${e}) routes for ${t}:</caption>
															<tbody>
															${s.academicYears[t].faculties[a].divisions[e].routes.map(e=>`
															<tr>
																<td><small>${e.routeCode}</small></td>
																<td><a href="${i}?session=${t}&route=${e.routeCode}&semester=AUT" target=_blank>${e.routeName}</a></td>
																<td>
																<!-- <a href="${i}?session=${t}&route=${e.routeCode}&semester=AUT" target=_blank>Autumn</a> | 
																<a href="${i}?session=${t}&route=${e.routeCode}&semester=SPR" target=_blank>Spring</a> | 
																<a href="${i}?session=${t}&route=${e.routeCode}&semester=SUM" target=_blank>Summer</a> -->
																${e.partnerInstitution.join(", ")}
																</td>
															</tr>
														`).join("")}
															</tbody>
														</table>
													</div>
												</details>
												`).join("")}
											</div>
										</details>`}).join("")}
									</div>
								</details>`}).join("")}</p>
						</div>
					</div>
				</div>`}};e&&((e=document.getElementById("debug"))&&e.classList&&e.classList.add("cell","u-bg-heritage-green--10","u-heritage-green-line-left","u-p-1","u-mb-2"),e)&&(e.innerText="💡Using data from: "+s),fetch(s).then(e=>e.json()).then(e=>a.insertAdjacentHTML("beforeend",r.menu(e),console.info(e)))}();