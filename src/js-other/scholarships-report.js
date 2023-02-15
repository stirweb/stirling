(function () {
  const data = stir.jsonscholarships.scholarships || [];
  const elementReport = stir.node("#report");
  const elementOverdue = stir.node("#overdue");

  if (!data.length || !elementReport) return;

  const today = Number(new Date().toISOString().split("T")[0].replaceAll("-", ""));

  const renderOverdue = (item) => {
    return `
        <div class="u-mb-1">
          <strong>${item.title}</strong>. (Deadline: ${item.deadlineFormatted}). <a class="u-border-bottom-solid" href="https://stiracuk-cms01-production.terminalfour.net/terminalfour/page/section#edit/${item.sid}">Edit section</a>
        </div>`;
  };

  const renderReport = (item) => {
    return `
          <div class="u-border-solid u-p-2 u-mt-2">
              <p><strong>${item.title}</strong></p>

              <div><strong>Deadline:</strong> ${item.deadlineFormatted ? item.deadlineFormatted : "N/A"} |  
                  <a href="https://stiracuk-cms01-production.terminalfour.net/terminalfour/page/content#edit/${item.sid}/${item.cid}" class="u-border-bottom-solid" target="_blank">Edit this scholarship</a> | 
                  <a href="${item.url}" class="u-border-bottom-solid">Preview page</a></div>
              
              <div class="u-mt-1"><strong>Last edited:</strong> ${item.lastEditedFormatted} by ${item.lastEditedBy}</div>
              <div class="u-mb-1"><strong>Owner:</strong> ${item.owner}</div>
              
              <div><strong>Metadata:</strong></div> 
              <div>${item.metadata}</div>
              <div><strong>Teaser:</strong></div> 
              <div>${item.teaser}</div>

              <div class="u-mt-1"><strong>Study Level (tag):</strong> ${item.studyLevel}</div>
              <div><strong>Nationalities (tag):</strong> ${item.nationality}</div>
              <div><strong>Promoted Subjects (Tag):</strong> ${item.promotedSubject}</div>
              <div><strong>Value:</strong> ${item.value}</div>
              <div><strong>Awards:</strong> ${item.awards}</div>
          </div>`;
  };

  const getOverdue = (item) => {
    if (item.deadline && Number(item.deadline) < today) return item;
  };

  elementReport.innerHTML = data
    .filter((item) => item.title)
    .map(renderReport)
    .join("");

  elementOverdue.innerHTML = data
    .filter((item) => item.title)
    .filter(getOverdue)
    .sort((a, b) => a.deadline - b.deadline)
    .map(renderOverdue)
    .join("");
})();
