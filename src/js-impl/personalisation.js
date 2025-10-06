(function () {
  const STORAGE_KEY = "stirsess";
  const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
  const SERVER_PATH = UoS_env.name === `§` ? "/research/hub/test/personalisation/server.php" : "server.php";
  const JAN_COURSES_PATH = UoS_env.name === `prod` ? "/data/courses/pg/json/january-starts/index.json" : "./january-starts.json";
  const CLOSING_DATE = new Date("2025-11-14T23:59:59");
  const DEV_MODE = UoS_env.name === `dev`;
  const PROD_MODE = UoS_env.name === `prod`;

  const EXEMPT_LIST = ["/courses/"];

  const SCHOLARSHIPS = [
    { region: "India", value: "£4,000" },
    { region: "Malaysia", value: "£7,000" },
    { region: "Singapore", value: "£7,000" },
    { region: "Cambodia", value: "£7,000" },
    { region: "Indonesia", value: "£7,000" },
    { region: "Philippines", value: "£7,000" },
    { region: "Myanmar", value: "£7,000" },
    { region: "Thailand", value: "£7,000" },
    { region: "Vietnam", value: "£7,000" },
    { region: "Africa", value: "£5,000" },
    { region: "Asia", value: "£8,000" },
  ];

  // Dont fire on non-dev/prod envs
  if (UoS_env.name !== `dev` && UoS_env.name !== `prod`) {
    return;
  }

  // Dont fire if we are on an exempt page
  if (EXEMPT_LIST.some((exempt) => window.location.pathname.startsWith(exempt))) {
    return;
  }

  // Dont fire if past closing date
  if (Date.now() > CLOSING_DATE.getTime()) {
    return;
  }

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
      return "yvdksi-t77z0d-sykh-8kujo";
    }
    return getCookie("_a_id") || ``;
  }

  /**
   * Sets a cookie
   * @param {string} name - The name of the cookie
   * @param {string} value - The value to set (should be encoded)
   * @param {number} maxAgeMS - Max age in milliseconds
   */
  function setCookie(name, value, maxAgeMS) {
    const expires = new Date(Date.now() + maxAgeMS).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  /**
   * Render the scholarship message
   * @param {Object|null} scholarship - The scholarship object or null
   * @param {string} region - The user's region
   * @returns {string}
   */
  function renderMessage(scholarship, region) {
    if (!scholarship) return " ";
    return `<span class="text-md u-mt-tiny"><b>${scholarship.value}</b> in scholarships available if you are from ${region}</span><br>  `;
  }

  /**
   * Render data onto the page
   * @param {Array} data - The data to render
   * @param {Date} closingDate - The closing date for applications
   * @param {Object|null} scholarship - The scholarship object or null
   * @returns {string} - The HTML string to insert
   */
  function renderData(data, closingDate, scholarship) {
    if (!data || !data.length) return ``;

    const event = data[0];
    //const daysLeft = Math.ceil((closingDate - Date.now()) / (1000 * 60 * 60 * 24));
    const humanDate = closingDate.toLocaleDateString("en-GB", { month: "long", day: "numeric" });
    const html = `<div class="grid-x grid-container">
                    <div class="u-my-2 cell">
                        <div class="grid-x flex-dir-column medium-flex-dir-row u-p-2 u-m-0 c-wrapper-2025 purples ">
                            <p class="cell small-12 large-8 u-m-0 ">
                                <span class="text-md  "><b><a href="${event.p}">${event.prefix} ${event.title}</a></b></span><br>
                                <span class="text-lg u-text-coloured "><b>January application deadline ${humanDate}</b></span><br>
                                ${renderMessage(scholarship, event.n)}
                            </p>
                            <p class="cell small-12 large-4 u-m-0"> <a class="button expanded" href="${event.p}">Apply now</a></p>
                        </div>
                    </div>
                </div>`;

    // const html = data
    //   .map((event, index) => {
    //     return ``;
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
   * Store data in cookie
   * @param {string} cookieKey
   * @param {string} timestamp
   * @param {Object} data
   * @param {number} shows
   * @return {boolean} True if stored successfully
   */
  function storeData(cookieKey, timestamp, data, shows) {
    const stirsess = {
      ts: timestamp,
      data: data,
      shows: shows,
    };
    setCookie(cookieKey, JSON.stringify(stirsess), MAX_AGE_MS);
    return true;
  }

  /**
   * Fetch data from the API, store with ts, and render
   * @param {string} aid - The aid to send to the server
   * @param {string} cookieKey - The cookie key
   */
  function fetchAndStoreData(aid, cookieKey, path, shows) {
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
          shows: shows,
        };
        setCookie(cookieKey, JSON.stringify(stirsess), MAX_AGE_MS);
        return data;
      })
      .catch((error) => {
        console.error("Error fetching  data:", error);
        throw error;
      });
  }

  /**
   * Process data to filter for January starts
   * @param {Array<Object>} data
   * @returns {Promise<void>}
   */
  function processData(janPath, data) {
    if (!data || !data.length) return Promise.resolve();

    return fetch(janPath)
      .then((response) => response.json())
      .then((janData) => {
        // Process January starts data
        const janUrls = janData.map((item) => item.url);
        const filtered = data
          .filter((event) => {
            return janUrls.includes(event.p);
          })
          .map((event) => {
            const janItem = janData.find((item) => item.url === event.p);
            return {
              ...event,
              ...janItem,
            };
          });
        return filtered;
      });
  }

  /**
   * Merges local page view data from 'stirsess2' cookie with server data.
   * @param {Array} serverData - The data fetched from the server.
   * @returns {Array} - The merged data array.

  function mergeWithLocalData(serverData) {
    const localDataCookie = getCookie("stirsess2");
    if (!localDataCookie) return serverData;

    const localData = JSON.parse(decodeURIComponent(localDataCookie));
    const localPages = localData && Array.isArray(localData.pages) ? localData.pages : [];

    const country = serverData.length && serverData[0].c ? serverData[0].c : null;
    const nationality = serverData.length && serverData[0].n ? serverData[0].n : null;

    const notFound = localPages
      .filter((item) => {
        if (!serverData.find((page) => page.p === item.p)) {
          return item;
        }
      })
      .map((localItem) => {
        return { p: localItem.p, v: Number(localItem.v), s: 0, c: country, n: nationality };
      });

    const found = serverData
      .filter((item) => {
        if (localPages.find((page) => page.p === item.p)) {
          return item;
        }
      })
      .map((serverItem) => {
        if (localPages.find((page) => page.p === serverItem.p)) {
          return { p: serverItem.p, v: Number(localPages.find((page) => page.p === serverItem.p).v) + Number(serverItem.v), s: serverItem.s, c: country, n: nationality };
        }
      });

    return [...found, ...notFound];
  }
  */

  /**
   * Get the message for the user's region
   * @param {Array} scholarships - The array of SCHOLARSHIPS with regions
   * @param {Object} data - The user data with region info
   * @returns {Object|null}
   */
  function getScholarshipForRegion(scholarships, data) {
    if (!data) return null;
    return scholarships.find((item) => item.region === data.n || item.region === data.c);
  }

  /**
   * Checks if the user has consented to performance cookies.
   * @param {string} cookieControl - The value of the CookieControl cookie.
   * @returns {boolean} True if consent is given, false otherwise.
   */
  const hasPerformanceCookieConsent = (cookieControl, dev) => {
    if (dev) return true;
    try {
      if (!cookieControl) return false;
      const consentData = JSON.parse(cookieControl);
      return consentData?.optionalCookies?.performance === "accepted";
    } catch (error) {
      console.error("Error parsing CookieControl cookie:", error);
      return false;
    }
  };

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
      const parsed = await fetchAndStoreData(aid, STORAGE_KEY, SERVER_PATH, 1);
      if (!parsed.length) return;

      //const mergedData = mergeWithLocalData(parsed);
      const janData = await processData(JAN_COURSES_PATH, parsed);

      if (!janData || !janData.length) return;
      const scholarship = getScholarshipForRegion(SCHOLARSHIPS, janData[0]);

      const html = await renderData(janData, CLOSING_DATE, scholarship);
      document.querySelector("main").insertAdjacentHTML("afterbegin", html);

      PROD_MODE && dataLayer.push({ event: "personalisation-janstarts" });
    } else {
      // Use cached data
      console.log("Fetching data from cookie...");
      const parsed = JSON.parse(stored);
      if (!parsed.data.length) return;

      const shows = parsed.shows && Number.isInteger(parsed.shows) ? parsed.shows : 1;

      // Only show 3 times in a day
      if (shows > 2) return;

      //const mergedData = mergeWithLocalData(parsed.data);
      const janData = await processData(JAN_COURSES_PATH, parsed.data);

      if (!janData || !janData.length) return;
      const scholarship = getScholarshipForRegion(SCHOLARSHIPS, janData[0]);

      const html = await renderData(janData, CLOSING_DATE, scholarship);
      document.querySelector("main").insertAdjacentHTML("afterbegin", html);
      storeData(STORAGE_KEY, parsed.ts, parsed.data, shows + 1);

      PROD_MODE && dataLayer.push({ event: "personalisation-janstarts" });
    }
  }

  // Dont fire if no cookie consent
  const cookieControl = getCookie("CookieControl");
  if (!hasPerformanceCookieConsent(cookieControl, DEV_MODE)) {
    return;
  }

  // Away you go
  controller();
})();
