(()=>{

	const id = "aboutSDG"
	const el = document.getElementById(id);
	const trigger = document.querySelector(`[data-open="${id}"]`);
	trigger.onclick = ()=>el.showModal();

})();