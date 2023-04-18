"qa"!==UoS_env.name||document.querySelector("[data-noqaprotect]")||(document.querySelector("main").classList.add("hide"),document.querySelector("body").insertAdjacentHTML("afterbegin",`
          <div id="qaformbox" class="u-absolute u-top-0 u-bottom-0 u-right-0 u-left-0 u-z-50 u-bg-grey flex-container flex-dir-column large-flex-dir-row align-center" >
            <div class="u-flex1"></div>
            <div class="u-flex1">
                <form id="qaform" class="u-margin-top flex-container u-gap flex-dir-column u-p-2" >
                    <label class="text-lg">Enter password:</label>
                    <input type="password" class="u-p-2" />
                    <input class="button expanded" type="submit" value="Submit" />
                    <p class="hide">Error: Wrong password entered</p>
                </form>
              </div>
              <div class="u-flex1"></div>
          </div>`),document.querySelector("#qaform").addEventListener("submit",e=>{e.preventDefault(),async function(e){return e=(new TextEncoder).encode(e),e=await crypto.subtle.digest("SHA-256",e),Array.from(new Uint8Array(e)).map(e=>e.toString(16).padStart(2,"0")).join("")}(document.querySelector("#qaform input[type=password]").value).then(e=>{"382d309715d6e70838449b8799afb50cb1ee0879ac03848aaa3250e37d95b815"===e?(document.querySelector("main").classList.remove("hide"),document.querySelector("#qaformbox").remove()):document.querySelector("#qaformbox p").classList.remove("hide")})}));