/*
@author: Ryan Kaye
@date: March 2022
@description: Enables a simple generic show / hide component with example html below

<div class="cell" data-showyhidey>
    <select>
        <option>Test</option>
        <option>Test2</option>
    </select>
    <div data-show="Test">
        <p>Test</p>
    </div>
    <div data-show="Test2">
        <p>Test 2</p>
    </div>
</div>
*/

(function (scope) {
  if (!scope) return;

  const initShowyHidey = (element) => {
    const select = element.querySelector("select");
    const contents = Array.prototype.slice.call(element.querySelectorAll("[data-show]"));

    const showSelectedItem = (e) => {
      const id = e.target.options[e.target.selectedIndex].value;
      const el = stir.node('[data-show="' + id + '"]');

      el && stir.each((item) => item.classList.add("hide"), contents);
      el && el.classList.remove("hide");
    };

    stir.each((item, index) => index !== 0 && item.classList.add("hide"), contents);
    select && (select.selectedIndex = "0");
    select && select.addEventListener("change", showSelectedItem);
  };

  stir.each(initShowyHidey, scope);
})(stir.nodes("[data-showyhidey]"));
