var stir = stir || {};
stir.course = stir.course || {};

(()=>{

	stir.course.api = (()=>{

		console.info('[Course API] ', new Date());

		const EOL = "\n\t";

		const dictionary = {
			location: {
				STIRLING: "Stirling"
			},
			loadCategory: {
				FT: "full time",
				PTO: "part time"
			}
		};

		const req = new Request('prog.json');

		const map = {
			availabilities: data => `<option>${dictionary.location[data.location]}, ${dictionary.loadCategory[data.loadCategory]}, ${data.prospectiveStartDate}</li>`,
			structures: data => data.sections.map(map.section).join(EOL),
			section: data =>`<p><small>${data.sectionNumber}</small> ${data.title}</p><ul>${data.sectionContent.map(map.sectionContent).join(EOL)}</ul>`,
			sectionContent: data => `<li>${data.title}</li>`
		};

		window
			.fetch(req)
			.then(response => response.json())
			.then(data => {
				document.body.innerHTML = `
				<h1>${data.programmetitle}</h1>
				<p><strong>${data.programmecode}</strong></p><p> SCQF level ${data.programmelevel}</p>
				<p>This course has ${data.programmeAvailabilities.length} availabilities:</p>
				<select>
					${data.programmeAvailabilities.map(map.availabilities).join(EOL)}
				</select>
				<hr>
				<p>${data.programmeStructure.map(map.structures).join(EOL)}</p>
				<pre>${JSON.stringify(data,null,"\t")}</pre>
				`;
			});

		return {

		};


	})();


})();