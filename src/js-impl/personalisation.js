(function () {
  const STORAGE_KEY = "stirsess";
  const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
  const SERVER_PATH = UoS_env.name === `prod` ? "/research/hub/test/big-query/server.php" : "server.php";
  const CLOSING_DATE = new Date("2025-12-01T23:59:59"); // Example closing date

  const MESSAGES = [
    { region: "India", message: "£20,000" },
    { region: "Africa", message: "£30,000" },
    { region: "Asia", message: "£40,000" },
    { region: "Southeast Asia", message: "£50,000" },
  ];

  /**
   * Get a cookie value by name
   * @param {string} name - The name of the cookie
   * @returns {string|null}
   */
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  /**
   * Get the AID from cookie or return default for non-prod
   * @returns {string}
   */
  function getAID() {
    if (UoS_env.name !== `prod`) {
      return "4n72-ke1go-x95i8-r84a";
    }
    return getCookie("_a_id") || ``;
  }

  /**
   * Set a cookie value
   * @param {string} name - The name of the cookie
   * @param {string} value - The value to set (should be encoded)
   * @param {number} maxAgeMS - Max age in milliseconds
   */
  function setCookie(name, value, maxAgeMS) {
    const expires = new Date(Date.now() + maxAgeMS).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  /**
   * Render data onto the page
   * @param {Array} data - The data to render
   */
  function renderData(data, closingDate, message) {
    if (!data || !data.length) return;

    const event = data[0];
    const daysLeft = Math.ceil((closingDate - Date.now()) / (1000 * 60 * 60 * 24));
    const html = `<div class="grid-x grid-container">
                    <div class="u-my-1 cell  ">
                        <div class="grid-x flex-dir-column medium-flex-dir-row u-p-2 u-m-0 c-wrapper-2025 purples ">
                            <p class="cell small-12 large-8 u-m-0 ">
                                <span class="text-lg u-text-coloured "><b>Applications for January close in ${daysLeft} days</b></span><br>
                                <span class="text-md  u-font-secondary"><b><a href="${event.p}">${event.prefix} ${event.title}</a></b></span><br>
                                <span class="text-md  u-font-secondary u-mt-tiny"><b>${message.message}</b> in scholarships available if you are from ${message.region}</span><br>
                               
                            </p>
                            <p class="cell small-12 large-4 u-m-0"> <a class="button expanded" href="${event.p}">Apply now</a></p>
                        </div>
                    </div>
                </div>`;

    // const html = data
    //   .map((event, index) => {
    //     return `
    //             <div class="event">
    //                 <p>${index} --  ${event.v}  ${event.p}<hr></p>
    //             </div>`;
    //   })
    //   .join("");
    return html;
  }

  /**
   * Determine if we should fetch new data based on stored data age
   * @param {string|null} stored - The stored cookie value
   * @param {number} maxAgeMS - Max age in milliseconds
   * @returns {boolean}
   */
  function shouldFetch(stored, maxAgeMS) {
    if (!stored) return true;
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.ts) return true;
      const age = Date.now() - new Date(parsed.ts).getTime();
      return age > maxAgeMS;
    } catch {
      return true;
    }
  }

  /**
   * Fetch data from the API, store with ts, and render
   * @param {string} aid - The aid to send to the server
   * @param {string} cookieKey - The cookie key
   */
  function fetchAndStoreData(aid, cookieKey, path) {
    const formData = new FormData();
    formData.append("aid", aid);

    return fetch(path, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const stirsess = {
          ts: new Date().toISOString(),
          data: data,
        };
        setCookie(cookieKey, JSON.stringify(stirsess), MAX_AGE_MS);
        return data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
  }

  /**
   * Process data to filter for January starts
   * @param {*} data
   * @returns {Promise<void>}
   */
  function processData(data) {
    if (!data || !data.length) return Promise.resolve();

    return fetch("./january-starts.json")
      .then((response) => response.json())
      .then((dataJans) => {
        // Process January starts data
        const janUrls = dataJans.map((item) => item.url);
        const filtered = data
          .filter((event) => {
            return janUrls.includes(event.p);
          })
          .map((event) => {
            const janItem = dataJans.find((item) => item.url === event.p);
            return {
              ...event,
              ...janItem,
            };
          });
        return filtered;
      });
  }

  function getMessageForRegion(messages, data) {
    return messages.find((msg) => msg.region === data.n || msg.region === data.c);
  }

  /**
   * Main controller function
   * @returns {Promise<void>}
   */
  async function controller() {
    const aid = getAID();

    if (!aid.length) return;

    const stored = getCookie(STORAGE_KEY) ? decodeURIComponent(getCookie(STORAGE_KEY)) : null;

    if (shouldFetch(stored, MAX_AGE_MS)) {
      // Fetch from the server
      console.log("Fetching from server...");
      const parsed = await fetchAndStoreData(aid, STORAGE_KEY, SERVER_PATH);

      const dataJans = await processData(parsed);
      const message = getMessageForRegion(MESSAGES, dataJans[0]);
      const html = await renderData(dataJans, CLOSING_DATE, message);

      document.querySelector("main").insertAdjacentHTML("afterbegin", html);
    } else {
      // Use cached data
      console.log("Fetching data from cookie...");
      const parsed = JSON.parse(stored);

      const dataJans = await processData(parsed.data);
      const message = getMessageForRegion(MESSAGES, dataJans[0]);

      const html = await renderData(dataJans, CLOSING_DATE, message);

      document.querySelector("main").insertAdjacentHTML("afterbegin", html);
    }
  }

  /* Away you go */
  controller();
})();
