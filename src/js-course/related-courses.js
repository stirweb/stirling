/*
 * Data parsing and listing moved to T4. Now just the button hack remaining.
 * @author: Ryan Kaye
 * @version: 3
 * @date: March 2022
 */

(function (scope) {
  if (!scope) return;

  /* EVENT Listener for and handle click events */
  const addCourseItemListener = (el) => {
    if (el.children[0] && el.children[0].hasAttribute("href"))
      el.onclick = () => (window.location = el.children[0].attributes.href.value);
  };

  /* Make the related courses <li />s fully clickable */
  stir.each((el) => addCourseItemListener(el), stir.nodes(".c-course-related__buttons ul li"));

  /* End */
})(stir.node(".c-course-related__buttons"));
