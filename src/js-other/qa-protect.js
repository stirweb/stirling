(function () {
  if (UoS_env.name !== "qa") return;

  const disableProtect = querySelector("[data-noqaprotect]");

  if (disableProtect) return;

  async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }

  const renderForm = () => {
    return `
          <div id="qaformbox" class="u-absolute u-top-0 u-bottom-0 u-right-0 u-left-0 u-z-50 u-bg-grey flex-container flex-dir-column large-flex-dir-row align-center" >
            <div class="u-flex1"></div>
            <div class="u-flex1">
                <form id="qaform" class="u-margin-top flex-container u-gap flex-dir-column u-p-2" >
                    <label class="text-lg">Speak friend and enter:</label>
                    <input type="password" class="u-p-2" />
                    <input class="button expanded" type="submit" value="Submit" />
                    <p class="hide">Error: Wrong password entered</p>
                </form>
              </div>
              <div class="u-flex1"></div>
          </div>`;
  };

  document.querySelector("main").classList.add("hide");
  document.querySelector("body").insertAdjacentHTML("afterbegin", renderForm());

  document.querySelector("#qaform").addEventListener("submit", (event) => {
    event.preventDefault();
    const pw = document.querySelector("#qaform input[type=password]").value;

    digestMessage(pw).then((digestHex) => {
      if (digestHex === "382d309715d6e70838449b8799afb50cb1ee0879ac03848aaa3250e37d95b815") {
        document.querySelector("main").classList.remove("hide");
        document.querySelector("#qaformbox").remove();
        return;
      } else {
        document.querySelector("#qaformbox p").classList.remove("hide");
        return;
      }
    });
  });
})();
