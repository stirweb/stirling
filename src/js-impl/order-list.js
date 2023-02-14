/*
 * Helper Function: Reorder items on page with class .c-order-listing
 * @author: Ryan Kaye
 * @version: 2
 * @date: October 2021 (rewrite)
 */

(function (nodes) {
  if (!nodes) return;

  /* --------------------------------------------
   * Sort all child elements in the container (node) by their "data-sort" value
   * Sort will MUTATE the data but give better render performance than stir.sort
   * ------------------------------------------- */
  const sortNodeItems = (node) => {
    const sortType = node.getAttribute("data-sort-type") ? node.getAttribute("data-sort-type") : "";
    const children = Array.prototype.slice.call(node.querySelectorAll(".c-order-listing-item"));

    const sortedChildren = children.sort((a, b) => {
      const aValue = a.getAttribute("data-sort");
      const bValue = b.getAttribute("data-sort");

      if (sortType === "int") {
        return parseInt(aValue) < parseInt(bValue) ? -1 : parseInt(aValue) > parseInt(bValue) ? 1 : 0;
      }

      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });

    node.innerHTML = stir.map((child) => child.outerHTML, sortedChildren).join("");
  };

  /*
   * Loop all "c-order-listing" nodes on the page
   */
  stir.each(sortNodeItems, nodes);
})(stir.nodes(".c-order-listing"));
