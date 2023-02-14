/*
 * @title: Search helpers
 * @description: To aid html generation
 * @author: Ryan Kaye


var StirSearchHelpers = (function () {
  /*
      SEARCH SUMMARY
   *

  const _formSummary = function (total, start, end) {
    return end === 0 ? `<p>No results found for this query</p>` : `<p>Showing ${start} - ${end} of <strong>${total} results</strong></p>`;
  };

  /*
      PAGINATION
   *

  /* Control the page calculations / rendering of the pagination nav *
const _formPagination = function (totalResults_, postsPerPage_, currentPage_, numOfLinks_) {
  const current = parseInt(currentPage_);
  const numOfLinks = getNumOfPages(parseInt(numOfLinks_));
  const total = getTotalPages(parseInt(totalResults_), parseInt(postsPerPage_));
  const start = getStartPage(current, numOfLinks);
  const end = getEndPage(numOfLinks, current, total);

  const values = {
    numOfLinks: numOfLinks,
    total: total,
    current: current,
    previous: current !== 1 ? current - 1 : 0,
    next: current !== total ? current + 1 : 0,
    range: getPageRange(start, end, numOfLinks, total, current),
  };

  return [renderPrevBtn(values), renderPageNav(values), renderNextBtn(values)].join("");
};

/*
      HELPERS
   *

  const getNumOfPages = (numLinks) => (numLinks % 2 === 0 ? numLinks : numLinks - 1);

  const getTotalPages = (totalResults, postsPerPage) => Math.ceil(totalResults / postsPerPage);

  const getIdealPadVal = (numOfLinks) => numOfLinks / 2;

  const getCurrentPadVal = (start, end) => end - start;

  const getStartDifference = (numOfLinks, start, current) => getIdealPadVal(numOfLinks) - current + start;

  const getEndDifference = (numOfLinks, end, current) => getIdealPadVal(numOfLinks) - (end - current);

  const getAdjustedStart = (dif, start) => (start - dif < 1 ? 1 : start - dif);

  const getAdjustedEnd = (dif, total, end) => (end + dif > total ? total : end + dif);

  /* Returns an array with the page numbers for the nav eg [4,5,6,7,8,9,10] *
  function getPageRange(start, end, numOfLinks, total, current) {
    if (getCurrentPadVal(start, end) === numOfLinks) {
      return stir.range(start, end, 1);
    }

    const endPadded = current - start !== getIdealPadVal(numOfLinks) ? getAdjustedEnd(getStartDifference(numOfLinks, start, current), total, end) : end;
    const startPadded = endPadded - current !== getIdealPadVal(numOfLinks) ? getAdjustedStart(getEndDifference(numOfLinks, current, endPadded), start) : start;

    return stir.range(startPadded, endPadded, 1);
  }

  /* Returns the start value for the pagination list *
  function getStartPage(current, numOfLinks) {
    const start = current > getIdealPadVal(numOfLinks) ? current - getIdealPadVal(numOfLinks) : 0;
    return start < 1 ? 1 : start;
  }

  /* Returns a end value for the paginaion list *
  function getEndPage(numOfLinks, current, total) {
    const end = getIdealPadVal(numOfLinks) + current;
    return end > total ? total : end;
  }

  /*
      RENDERERS
   *

  function renderNextBtn(vals) {
    return vals.current === vals.total
      ? `<div class="small-3 medium-3 cell"></div>`
      : `
        <div class="small-3 medium-3 cell text-right">
            <a href="#" class="button small no-arrow" aria-label="Next page" data-page="${vals.next}">
              <span class="show-for-medium">Next <span class="show-for-sr">page</span></span>
              <span class="uos-chevron-right"></span> 
            </a>
        </div> `;
  }

  function renderPrevBtn(vals) {
    return vals.current === 1
      ? '<div class="small-3 medium-3 cell"></div>'
      : `
        <div class="small-3 medium-3 cell">
            <a href="#" class="button small no-arrow" aria-label="Previous page" data-page="${vals.previous}">
              <span class="uos-chevron-left"></span> 
              <span class="show-for-medium">Previous <span class="show-for-sr">page</span></span>
            </a>
        </div> `;
  }

  function renderPageNav(vals) {
    return `
        <nav class="small-6 medium-6 cell text-center u-font-bold" aria-label="Pagination">
          <ul class="pagination show-for-large">
              ${renderPageList(vals)}
          </ul>
          <p class="hide-for-large">Page ${vals.current} of ${vals.total}</p>
        </nav>`;
  }

  function renderPageList(vals) {
    return stir
      .map((page) => {
        return page === vals.current
          ? `<li class="current">
              <span class="show-for-sr">You're on page</span> ${page}
            </li>`
          : `<li>
              <a href="#" aria-label="Page ${page}" data-page="${page}">${page}</a>
            </li>`;
      }, vals.range)
      .join("");
  }

  /*
     PUBLIC GET FUNCTIONS
   *

  return {
    formSearchSummaryHTML: _formSummary,
    renderSummary: _formSummary, // Nicer name
    formPaginationHTML: _formPagination,
    renderPagination: _formPagination, // Nicer name
  };
})();

*/
