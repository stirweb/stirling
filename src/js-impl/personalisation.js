(function () {
  //const resultBox = document.getElementById("resultBox");
  const STORAGE_KEY = "stirsess";
  const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

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
   * Render data into the resultBox
   * @param {Array} data - The data to render
   */
  function renderData(data) {
    // const html = data.map((event, index) => {
    //     return `
    //             <div class="event">
    //                 <p>${index} --  ${event.v}  ${event.p}<hr></p>
    //             </div>`;
    // }).join("");
    // resultBox.innerHTML = html;
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
  function fetchAndStoreData(aid, cookieKey) {
    const formData = new FormData();
    formData.append("aid", aid);

    return fetch("server.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const dataMapped = data.map((item) => {
          return {
            v: item.v,
            s: item.s,
            p: item.p.replace("/courses", ""),
          };
        });
        const stirsess = {
          ts: new Date().toISOString(),
          data: dataMapped,
        };
        setCookie(cookieKey, JSON.stringify(stirsess), MAX_AGE_MS);
        return dataMapped;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
  }

  // Controller: Fetch new data if needed, otherwise use cached data
  // Use the _a_id from the cookie, fallback to default if not found
  const aid = getCookie("_a_id") || ``;
  //const aid = '4n72-ke1go-x95i8-r84a';

  if (!aid.length) return;

  const stored = getCookie(STORAGE_KEY) ? decodeURIComponent(getCookie(STORAGE_KEY)) : null;

  if (shouldFetch(stored, MAX_AGE_MS)) {
    // Fetch from the server
    console.log("Fetching from server...");
    fetchAndStoreData(aid, STORAGE_KEY).then(renderData);
  } else {
    // Use cached data
    //console.log("Fetching data from cookie...");
    const parsed = JSON.parse(stored);
    renderData(parsed.data);
  }
})();
