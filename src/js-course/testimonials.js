/*
 * Dynamically insert testimonials based of "Name" id
 * @author: Ryan Kaye
 * @date: Dec 2022 Ho Ho Ho
 * @version: 1
 */

(function (scope) {
  if (!scope) return;

  /*
      VARS
   */

  const DATANODE = scope;

  //const server = 'stir-search.clients.uk.funnelback.com';
  const server = "search.stir.ac.uk";
  const urlBase = `https://${server}`; // ClickTracking
  const JSON_BASE = `${urlBase}/s/search.json?`;

  const scaleImage = stir.curry((server, image) => `https://${server}/s/scale?url=${encodeURIComponent(image)}&width=800&height=800&format=jpeg&type=crop_center`);
  const scaleImageWithFunnelback = scaleImage(server);

  const CONSTS = {
    SF: "[profileDegreeTitle,profileCountry,profileCourse,profileCourse1,profileCourse1Url,profileCourse1Modes,profilecourse1Delivery,profileCourse2,profileCourse2Url,profilecourse2Delivery,profileCourse2Modes,profileFaculty,profileSubject,profileYearGraduated,profileLevel,profileTags,profileSnippet,profileImage,profileMedia]",
    collection: "stir-www",
    sortBy: "metaprofileImage",
    tags: "[student alum]",
    postsPerPage: 9,
    noOfPageLinks: 9,
    urlBase: urlBase,
  };

  /*
      formatName() : @returns String (html)
   */
  const formatName = (name) => name.replace("| Student Stories | University of Stirling", "").trim();

  /*
      renderQuote() : @returns String (html)
   */
  const renderQuote = (item) => {
    return `
      <div id="pullquote-77513" class="pullquote pullquote-pic ">
            <img src="${scaleImageWithFunnelback("https://stir.ac.uk" + item.metaData.profileImage)}" alt="${formatName(item.title)}" loading="lazy"  width="700" height="600">
            <div class="pullquote--text">
              <cite>
                <span class="author">${formatName(item.title)}</span><br>
                <span class="info">${item.metaData.profileCountry}</span><br>
                <span class="info">${item.metaData.profileDegreeTitle}</span>
              </cite>
              <blockquote cite="#">
                <q>${item.metaData.profileSnippet}</q>
              </blockquote>
              <a href="${item.displayUrl}" aria-label="Read ${formatName(item.title)}'s story (${formatName(item.title)})" class="c-link">Read ${formatName(item.title).split(" ")[0]}'s story</a>
            </div>
        </div>
    `;
  };

  /*
      setDOMContent() : @returns boolean
   */
  const setDOMContent = (resultsArea, html) => {
    stir.setHTML(resultsArea, html);

    return true;
  };

  /*
      getTestimonial() : @returns string 
   */
  const getTestimonial = (testimonial, results) => {
    const filtered = results.filter((item) => {
      if (formatName(item.title) === testimonial) return item;
    });

    if (!filtered.length) return "";

    return renderQuote(filtered[0]);
  };

  /*
      main() : @returns boolean
   */
  const main = (dataNode, consts, jsonBase) => {
    const testimonials = dataNode
      .getAttribute("data-testimonials")
      .split("|")
      .filter((el) => el);

    if (!testimonials.length) return false;

    const params = Object.entries(consts)
      .map((item) => item[0] + "=" + item[1])
      .join("&");

    const query = `&query=[${testimonials.map((el) => el).join(" ")}]`;
    const jsonUrl = jsonBase + params + query;

    // Get the data from FunnelBack
    stir.getJSON(jsonUrl, (initialData) => {
      const results = initialData.response.resultPacket.results;
      const html = testimonials.map((item) => getTestimonial(item, results)).join(" ");
      const resultsArea = dataNode.querySelector(".pullquotesbox");

      resultsArea && setDOMContent(resultsArea, html);
    });

    return true;
  };

  /*
      On Load
   */

  const run = DATANODE.map((element) => main(element, CONSTS, JSON_BASE));

  /*
      End
   */
})(stir.nodes("[data-testimonials]"));
