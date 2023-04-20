var stir = stir || {};

/*
   Replaces the Foundation reveal modal
   @author: Ryan Kaye
   Will find modals already in the html
   or allow a modal to be built on the fly
 */

stir.Modal = function Modal(el) {
  var id;

  /* 
    Initiate the modal 
  */
  function initModal() {
    if (!el.hasAttribute("data-stirreveal")) return;

    id = el.id;

    var overlay = document.createElement("section");
    var openButtons = stir.nodes('[data-modalopen="' + id + '"]');
    var closeButton = el.querySelector(".close-button");

    if (!el.parentElement || !el.parentElement.classList.contains("reveal-overlay")) {
      overlay.insertAdjacentElement("beforeend", el);
      el.setAttribute("aria-hidden", true);
      el.setAttribute("role", "dialog");
      el.style.display = "none";

      overlay.classList.add("reveal-overlay");
      document.querySelector("body").insertAdjacentElement("beforeend", overlay);
    }

    overlay.setAttribute("aria-label", "Container for modal " + id);
    overlay.addEventListener("click", overlayClickHandler);

    /*
      Event: Listen for "Show Modal" clicks
     */
    openButtons.forEach((button) => {
      button.addEventListener("click", function (event) {
        open_();
        event.preventDefault();
      });
    });

    /*
      Event: Listen for "Close Modal" clicks
     */
    if (closeButton) {
      closeButton.onclick = function (e) {
        close_();
        e.preventDefault();
      };
    }
  }

  /*
    Function: Show the modal
   */
  function open_() {
    if (!el.hasAttribute("data-stirreveal")) return;
    //el.setAttribute('aria-hidden', false);
    el.removeAttribute("aria-hidden");
    el.style.display = "block";
    el.parentNode.style.display = "block";
  }

  /*
    Function: Hide the modal
   */
  function close_() {
    if (!el.hasAttribute("data-stirreveal")) return;

    if (el.classList.contains("reveal")) {
      el.setAttribute("aria-hidden", true);
      el.style.display = "none";
      el.parentNode.style.display = "none";
    }
  }

  function overlayClickHandler(event) {
    if (event.target != this) return;
    event.preventDefault();
    close_();
  }

  /*
    Function: Use this to create a modal if one doesnt already exist on the page
   */
  function _render(id, label) {
    var html = [];
    var modal = document.createElement("div");

    html.push('<button class="close-button" data-close aria-label="Close modal" type="button">');
    html.push('<span aria-hidden="true">&times;</span>');
    html.push("</button>");

    modal.innerHTML = html.join("\n");
    modal.setAttribute("aria-label", label);
    modal.setAttribute("data-stirreveal", "");
    modal.classList.add("reveal");
    modal.id = id;

    el = modal;
    initModal();
  }

  /*
    Function: Helper: Set the modal content
   */
  function setContent_(html, docFragment) {
    if (!el.hasAttribute("data-stirreveal")) return;
    var button = el.querySelector(".close-button"); // retain the close button for re-use
    el.innerHTML = html;
    docFragment && el.appendChild(docFragment); // insert DOM elements
    button && el.insertAdjacentElement("beforeend", button);
  }

  /*
    On Load: set the modal up
   */
  if (el) initModal();

  /*
    Public functions
   */
  return {
    getId: function () {
      return el.id;
    },

    setContent: function (html, el) {
      setContent_(html, el);
    },

    open: function () {
      open_();
    },

    close: function () {
      close_();
    },

    render: function (newid, newlabel) {
      id = newid;
      _render(newid, newlabel);
    },
  };
};

/*

   Dialog Component

 */

stir.Dialog = function Dialog(element) {
  const close_ = () => element.close();
  const open_ = () => element.showModal();
  const getOpenBtns_ = (id_) => stir.nodes('[data-opendialog="' + id_ + '"]');
  const getCloseBtn_ = () => element.querySelector("[data-closedialog]");

  const setContent_ = (html) => {
    stir.setHTML(element, html + renderCloseBtn_());
    initListeners();
  };

  const renderCloseBtn_ = () => `<button data-closedialog class="close-button">&times;</button>`;

  const initListeners = (id_) => {
    const closeBtn = getCloseBtn_();

    getOpenBtns_(id_).forEach((button) => {
      button.addEventListener("click", (e) => open_());
    });

    closeBtn && closeBtn.addEventListener("click", (e) => close_());
  };

  /*
    Initilaise
  */

  if (!element) return;

  const id = element.dataset.dialog ? element.dataset.dialog : null;

  if (!id) {
    console.error("Dialog's require a data-dialog attribute");
    return;
  }

  !getCloseBtn_() && setContent_("");
  initListeners(id);

  /*
    Public functions
   */

  return {
    getId: function () {
      return element.dataset.dialog;
    },

    getDialog: function () {
      return element;
    },

    setContent: function (html) {
      setContent_(html);
    },

    open: function () {
      open_();
    },

    close: function () {
      close_();
    },
  };
};

/*

   On load: Set up Modals and Dialogs found on the page
 
 */

(function (modals_, dialogs) {
  /* InitDialogs */
  const initDialogs = (dialogs) => {
    stir.t4Globals = stir.t4Globals || {};
    stir.t4Globals.dialogs = stir.t4Globals.dialogs || [];

    dialogs.forEach((element) => {
      stir.t4Globals.dialogs.push(stir.Dialog(element));
    });
  };

  /* Fallback to use legacy modal code */
  const dialogFallback = (dialogs) => {
    const dialogBtns = stir.nodes("[data-opendialog]");

    dialogs.forEach((element) => {
      element.removeAttribute("data-dialog");
      element.classList.add("reveal");
      element.setAttribute("data-stirreveal", "");
      element.setAttribute("aria-label", "Modal box");
      element.setAttribute("id", element.dataset.dialog);
    });

    dialogBtns.forEach((element) => {
      element.removeAttribute("data-opendialog");
      element.dataset.modalopen = element.dataset.opendialog;
    });
  };

  /* 
    ON LOAD   
  */

  /* Dialog support??? */
  if (stir.node("dialog")) {
    typeof HTMLDialogElement === "function" ? initDialogs(dialogs) : dialogFallback(dialogs);
  }

  /* Legacy modals - rescan to get Dialog fallbak instances */
  const modals = stir.nodes("[data-stirreveal]");

  stir.t4Globals = stir.t4Globals || {};
  stir.t4Globals.modals = stir.t4Globals.modals || [];

  modals.forEach((el) => {
    stir.t4Globals.modals.push(new stir.Modal(el));
  });
})(stir.nodes("[data-stirreveal]"), stir.nodes("dialog"));
