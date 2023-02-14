(function () {
  //const debug   = UoS_env.name === "dev" || UoS_env.name === "qa" ? true : false;
  //const preview = UoS_env.name === "preview" ? true : false;
  //if(!(debug||preview)) return;

  const date_elements = Array.prototype.slice.call(document.querySelectorAll("[name=meta_startval]"));
  if (!date_elements.length) return;

  const months = [, "January", , , , , , , , "September", , ,];

  const regex = new RegExp(/\d\d\d\d/);
  const ay = new RegExp(/AY\d\d\d\d\D\d\d/i);
  const delim = new RegExp(/ay/i);
  const dates = date_elements.map((date) => {
    return {
      data: date.value,
      date: date.value.replace(ay, ""),
      month: date.value.indexOf("-") > -1 ? months[parseInt(date.value.split("-")[1])] || "" : "",
      year: date.value.match(regex) ? date.value.match(regex).shift() : "",
      acyear: date.value.match(ay) ? date.value.match(ay).shift().replace(delim, "") : "",
    };
  });
  const years = dates.map((date) => date.acyear.replace(delim, "")).filter((value, index, self) => self.indexOf(value) === index && value);

  const root = date_elements[0].parentElement.parentElement.parentElement;

  // remove checkboxes only if the years array is populated
  if (!years.length) return;
  date_elements.forEach((el) => {
    el.parentElement.parentElement.remove();
  });

  const DateInput = (type, name, value) => {
    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.value = value;
    return input;
  };

  const DateLabel = (name, value) => {
    const input = new DateInput("radio", "meta_startval", `[1st ${value}]`);
    const label = document.createElement("label");
    label.appendChild(input);
    label.appendChild(document.createTextNode(name));
    return label;
  };

  const picker = document.createElement("li");

  years.forEach((acyear) => {
    // Array: get all dates relevant to this academic year
    const thisyear = dates.filter((date) => date.acyear === acyear);

    // String: create a meta-search parameter of 'other' dates (i.e. neither Sept nor Jan)
    const other = thisyear
      .filter((date) => date.date.indexOf("-01") === -1 && date.date.indexOf("-09") === -1)
      .map((date) => date.data)
      .join(" ");

    // DOM: show heading
    const set = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.classList.add("u-my-1", "text-xsm");

    set.appendChild(legend);
    set.setAttribute("class", "c-search-filters-subgroup");
    legend.innerText = `Academic year ${acyear}`;
    picker.appendChild(set);

    // DOM: show conventional start dates (Sept, Jan)
    thisyear
      .filter((date) => date.acyear === acyear && (date.date.indexOf("-01") > -1 || date.date.indexOf("-09") > -1))
      .map((date) => {
        set.appendChild(new DateLabel(`${date.month} ${date.year}`, date.data));
      });

    // DOM: lastly show 'other' dates
    if (other.length) set.appendChild(new DateLabel(`Other ${acyear}`, `${other}`));
  });

  root.appendChild(picker);
})();
