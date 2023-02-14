/**
 * HR Annual Leave Calculator
 * Coped as-is from pre-DTP website
 * Updated 2020-08-24 by r.w.morrison@stir.ac.uk
 * - Removed jQuery and fixed a11y issues
 */
(function () {
  var form = document.getElementById('calculator');
  if (!form) return;
  var fteSelect = form.querySelector('#fte');
  var entitlementSelect = form.querySelector('#entitlement');
  var monthsSelect = form.querySelector('#months');
  var output = form.querySelector('#answer');
  if (!fteSelect || !entitlementSelect) return;

  function calculate(event) {
    event.preventDefault();
    var fte = fteSelect.value;
    var entitlement = entitlementSelect.options[entitlementSelect.selectedIndex].value;
    var months = monthsSelect.options[monthsSelect.selectedIndex].value;
    var answer = Math.round(entitlement * fte / 100 / 12 * months * 100) / 100;

    if (answer) {
      output.value = answer;
    } else {
      output.value = 0;
    }
  }

  form.addEventListener('submit', calculate);
})();