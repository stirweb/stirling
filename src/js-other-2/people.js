(()=>{
	
	const output = document.querySelector('[data-id-list][data-entity-type="person"]');
	
	if(!window.fetch || !output) return;
	
	const list = output.getAttribute("data-id-list").split(",").filter(i=>i.trim());

	console.info(output,list);
	
	const person = (el,id) => {
		if(!el || !id) return;
		
		fetch(`https://www.stir.ac.uk/people/${id}/?format=json`)
			.then((response) => {
				if(response.status !== 200) {
					el.remove();
					throw new Error("Oops!");
				}
				return response.json();
			})
			.then(data => {
				const html = [];
				html.push('<figure>')
				html.push(`	<a href="https://www.stir.ac.uk/people/${data.entity.ID}">`);
				html.push(`	<img src="https://www.stir.ac.uk/research/hub/image/${data.entity.ID}" width=400 height=400 alt="Profile picture for ${data.entity.KnownAs}">`);
				html.push('	</a>')
				html.push(` <figcaption><a href="https://www.stir.ac.uk/people/${data.entity.ID}">${data.entity.Title||''} ${data.entity.KnownAs}</a></figcaption>`);
				html.push('</figure>')
				el.innerHTML = html.join("\n\t");
			})
			.catch((error) => {
				console.error(error);
			});
	};

	list.forEach(id => {
		const el = document.createElement('div');
		el.id = `people/${id}`;
		el.classList.add("cell","medium-4","large-3","u-padding-bottom");
		el.innerHTML = `<div><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
		<title>person</title>
		<path fill="#f6f5f4" d="M32.128 25.472c6.272 0 11.52-5.12 11.52-11.52 0-6.272-5.12-11.52-11.52-11.52s-11.52 5.12-11.52 11.52c0 6.4 5.12 11.52 11.52 11.52zM32.128 5.76c4.608 0 8.32 3.712 8.32 8.32s-3.712 8.32-8.32 8.32c-4.608 0-8.32-3.712-8.32-8.32s3.712-8.32 8.32-8.32zM32.128 28.928c-11.136 0-20.608 9.088-20.608 19.968v11.008c0 0.896 0.64 1.536 1.536 1.536h38.144c0.896 0 1.536-0.64 1.536-1.536v-11.008c0-10.88-9.472-19.968-20.608-19.968zM49.664 58.368h-35.072v-9.472c0-9.216 8.064-16.896 17.536-16.896s17.536 7.808 17.536 16.896v9.472z"></path>
		</svg><p class=text-center>Loading…</p></div>`;
		output.append(el);
		person(el,id)
	});

})();