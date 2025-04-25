var stir = stir || {};
stir.templates = stir.templates || {};

stir.templates.course = {
	link: (text,href) => `<a href="${href}">${text}</a>`,
	para: content => `<p>${content}</p>`,
	option: option => `Starting ${option[3]}, ${option[1].toLowerCase()} (${option[4]})`,
	div: (id,onclick) => {
		const div = document.createElement('div');
		div.id = id; div.onclick = onclick;
		return div;
	},
	dialogue: () => {
		const d = document.createElement('dialog');
        const x = document.createElement('button');
        d.setAttribute('data-module-modal','');
        d.append(x);
        x.addEventListener("click",e=>{
            d.close();
        });
        x.textContent = "Close";
		return d;
	},
	paths: (paths, year) => `<p class="c-callout info"><strong><span class="uos-shuffle"></span> There are ${paths} alternative paths in year ${year}.  Please review all options carefully.</strong></p>`,

	offline: `<p class="text-center c-callout">Module information is temporarily unavailable.</p>`,

	disclaimer: `<p><strong>The module information below provides an example of the types of course module you may study. The details listed are for the academic year that starts in September 2024. Modules and start dates are regularly reviewed and may be subject to change in future years.</strong></p>`,
};

stir.templates.course.module = (boilerplates, data) => {
    console.info('[Modules] boilerplates',boilerplates);
    if (!boilerplates) return 'no data';
    if (!data || !data.moduleTitle || !data.moduleCode || !data.moduleLevel || !data.moduleCredits || !data.moduleOverview || !data.learningOutcomes) {
        console.error('[stir.templates.course.module] data error',data);
        return 'data error';
    }

    var otherInfo,additionalCosts;

    const studyAbroad = (()=>{
        if (data.studyAbroad !== "Yes") return;
        return `<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>
        ${boilerplates["studyAbroad"]?boilerplates["studyAbroad"]:''}
        ${boilerplates["studyAbroadLink"]?`<p><a href="${boilerplates["studyAbroadLink"]}">Find out more about our study abroad opportunities.</a></p>`:''}`;
    })();

    const furtherDetails = (()=>{
        if(!otherInfo && !studyAbroad && !additionalCosts) return '';
        return `<div class="cell u-mt-2">
                <h2 id="further">Further details</h2>
                ${otherInfo?otherInfo:''}
                ${studyAbroad?studyAbroad:''}
                ${additionalCosts?additionalCosts:''}
            </div>`;
    })();

    return `<main class="wrapper-content u-padding-bottom" aria-label="Main content" id="content">
    <div class="grid-container" data-api="PROD">
        <div class="grid-x grid-padding-x u-my-2 align-middle">
            <div class="cell large-6  c-course-title u-padding-y">
                <h1 class="u-header-smaller">${data.moduleTitle}</h1>
            </div>
            <div class="cell large-6">
                <div class="u-border u-border-width-5 flex-container u-px-3 u-py-2">
                    <div class="grid-x grid-padding-x">
                        <div class="cell medium-6 flex-container u-gap u-p-1">
                            <span class="u-heritage-green u-inline-block u-width-48"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" class="svg-icon"><path d="M.75,0V15M7.417,0V15M9.639,0V15M11.861,0V15M15.194,0V15M16.306,0V15M19.639,0V15M20.75,0V15M4.083,0V15M5.194,0V15" transform="translate(1.25 4.5)" stroke-miterlimit="10"></path></svg></span>
                            <span><strong>Module code:</strong><br>${data.moduleCode}</span>
                        </div>
                        <div class="cell medium-6 flex-container u-gap u-p-1">
                            <span class="u-heritage-green u-inline-block u-width-48"><svg
                                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"
                                    class="svg-icon">
                                    <path d="M1.1,11.99,9.422,3.942l4.57,4.57L21.659.845M17.756.75h3.99V4.88"
                                        transform="translate(0.579 5.573)" stroke-linecap="round"
                                        stroke-linejoin="round"></path>
                                </svg></span>
                            <span><strong>SCQF level:</strong><br>${data.moduleLevel}</span>
                        </div>
                        <div class="cell medium-6 flex-container u-gap u-p-1">
                            <span class="u-heritage-green u-inline-block u-width-48"><svg
                                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"
                                    class="svg-icon">
                                    <path
                                        d="M6.58.52,8.452,4.314l4.187.608L9.609,7.875l.715,4.171L6.58,10.077,2.835,12.045,3.55,7.875.521,4.922l4.187-.608Zm8.889,8.547-2.574.374,1.863,1.816-.44,2.565,2.3-1.211,2.3,1.211-.44-2.565,1.863-1.816-2.574-.374L16.621,6.734Zm-5.076,7.371-2.21.321,1.6,1.56L9.4,20.52l1.977-1.04,1.977,1.04-.378-2.2,1.6-1.56-2.212-.321-.989-2Z"
                                        transform="translate(1.566 1.48)" fill="rgba(255,255,255,0)"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg></span>
                            <span><strong>SCQF credits:</strong><br>${data.moduleCredits}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="grid-container">
        <div class="grid-x grid-padding-x start">
            <div class="cell medium-9 bg-grey u-bleed u-p-2 ">
                <p>The module information below is for the 2024/5 intake and may be subject to change, including in
                    response to student feedback and continuous innovation development. See our 
                    <a href="/study/important-information-for-applicants/terms-conditions/2023-24-student-terms-and-conditions/">
                    terms and conditions</a> for more information.</p>
            </div>
            <div class="cell u-p-2">
                <h2 id="contentandaims">Content and aims</h2>
                <h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular">
                    Module overview
                </h3>
                ${data.moduleOverview}

                <h3 class="header-stripped u-bg-heritage-green--10 u-heritage-green-line-left u-p-1 u-border-width-5 u-text-regular u-mt-2">Learning outcomes</h3>
                <p><strong>${boilerplates["outcomes"]}</strong></p>
                <ul>${data.learningOutcomes.map(item=>`<li>${item}</li>`).join('')}</ul>
            </div>
            <div class="cell">
                <h2 id="teaching">Teaching and assessment</h2>
                ${boilerplates["teaching"]}

                <h3 class="header-stripped u-bg-energy-turq--10 u-p-1 u-energy-turq-line-left u-border-width-5 u-text-regular u-mt-2">Engagement overview</h3>
                <div class="grid-x grid-padding-x" id="deliveries">
                    <div class="cell">
                        <p>Engagement and teaching information isn't currently available, but it will be made clear to you when you make your module selections.</p>
                    </div>
                </div>

                <h3 class="header-stripped u-bg-energy-turq--10 u-p-1 u-energy-turq-line-left u-border-width-5 u-text-regular u-mt-3">Assessment overview</h3>

                <div class="grid-x grid-padding-x" id="assessments">
                    <div class="cell large-12 u-mb-1">
                        <div>
                            <span class="u-inline-block u-p-tiny u-px-1">Coursework</span>
                            <div class="u-flex">
                                <div class="barchart u-relative u-flex u-flex1 align-middle u-overflow-hidden u-bg-light-medium-grey" data-value="100" data-max="100" data-unit="%" data-colour="energy-turq"></div>
                                <div class="u-pl-2 text-xlg u-font-primary u-line-height-1 u-energy-turq u-top--16 u-relative">100%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cell u-mt-2">
                <h2 id="awards">Awards</h2>
                <h3 class="header-stripped u-bg-energy-purple--10 u-p-1 u-energy-purple-line-left u-border-width-5 u-text-regular">Credits</h3>
                <p class="flex-container u-gap align-middle"><img src="https://www.stir.ac.uk/media/dist/images/modules/scotland-flag.png" width="65" height="44" alt="Scotland flag"> This module is worth 20 SCQF (Scottish Credit and Qualifications Framework) credits.</p>
                <p class="flex-container u-gap align-middle"><img src="https://www.stir.ac.uk/media/dist/images/modules/EU-flag.png" width="65" height="44" alt="EU flag"> This equates to 10 ECTS (The European Credit Transfer and Accumulation System) credits.</p>
                <!-- A1 -->
            </div>
            ${furtherDetails}
        </div>
    </div>
</main>`;};

/* A1 ––– <div class="u-mb-2 u-bg-energy-purple--10 flex-container align-stretch">
                    <span class="u-bg-energy-purple u-white flex-container align-middle u-width-64 u-px-1">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" class="svg-icon">
                            <path d="M14.667,4.5,23,12.833m0,0-8.333,8.333M23,12.833H3" transform="translate(-1 -0.833)" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </span>
                    <p class="u-p-1 u-m-0 u-black "><strong>Discover more:</strong> <a href="" class="u-energy-purple">Assessment and award of credit for undergraduates</a></p>
                </div> */