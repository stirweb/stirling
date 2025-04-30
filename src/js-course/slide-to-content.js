/*
   Find a content item then animate scroll to it opening any tabs / accords along the way
   @author: Ryan Kaye
   @version: 2
   @date: Oct 2021
 */

(function () {
  /*
    DOM elements
  */

  const applySlideBtns = stir.nodes("[data-applyslidelink]");
  const skipLinks = stir.nodes(".skip-link");
  const buttonsNode = stir.node(".c-course-title__buttons");

  /*
    Vars
  */

  const offsets = { small: 50, medium: 150 };
  const errorMsg = ["WARNING!! Missing content: Entry Requirements > Application Procedure"];

  if (!applySlideBtns && !skipLinks) return;

  /* 
    Returns a node that outputs an error message
  */
  const renderErrorNode = (contentId, errorMsg) => `<p class="alert callout">` + errorMsg[0] + ` ` + contentId + ` ` + errorMsg[1] + `</p>`;

  /* 
    Return the node id part from a url (#nodeid)
  */
  const getLinkId = (href) => {
    const contentUris = href.split("#");
    return contentUris.length > 1 ? contentUris[1] : "";
  };

  /*
    Find the content item then smooth scroll to it
   */
  const slideToContent = (node, offset) => {
    if (!node) return;

    const panel = node.closest('[role="tabpanel"],[role="region"]');

    // Open the tab if found and not already open
    if (panel) {
      const tab = panel.hasAttribute("aria-labelledby") && document.getElementById(panel.getAttribute("aria-labelledby"));
      if (tab) {
        if (tab.hasAttribute("aria-selected") && tab.getAttribute("aria-selected") !== "true") {
          tab.click();
        } else if (tab.hasAttribute("aria-expanded") && tab.getAttribute("aria-expanded") !== "true") {
          tab.click();
        }
      }
    }

    if (node.getAttribute("data-behaviour") === "accordion") {
      const accordion = node.querySelector('button[aria-expanded="false"]');
      accordion && accordion.click();
    }

    node && stir.scrollToElement(node, offset);
    return;
  };

  /*
    Handle click events
   */
  const handleClick = (e) => {
    const contentId = getLinkId(e.target.href);
    if (contentId) {
      const offset = offsets[stir.MediaQuery.current] ? offsets[stir.MediaQuery.current] : 100;
      slideToContent(document.getElementById(contentId), offset);
      e.preventDefault();
      return;
    }
  };

  /*
    Listen for click events
   */
  const addClickListener = (btn) => {
    btn.addEventListener("click", handleClick);
    return;
  };

  /* 
    Error handling 
  */
  const handleError = (btn, buttonsNode, errorMsg) => {
    const contentId = getLinkId(btn.getAttribute("href"));
    if (!document.getElementById(contentId)) {
      // No target node so output a message for the content team
      if (UoS_env.name !== "prod") {
        if (buttonsNode) {
          buttonsNode.insertAdjacentHTML("beforeend", renderErrorNode(contentId, errorMsg));
        }
      }
      // Hide the button for live
      if (UoS_env.name === "prod") btn.classList.add("hide");
      return "Error";
    }
    return "No Error";
  };

  /*
    ON LOAD: Apply button actions
   */

  if (applySlideBtns) {
    stir.each((btn) => {
      handleError(btn, buttonsNode, errorMsg);
      addClickListener(btn);
    }, applySlideBtns);
  }

  /*
    ON LOAD: Skiplink actions
   */

  skipLinks && stir.each(addClickListener, skipLinks);

  /* END */
})();
