/*
  
  @title: Header Link JS
  @author: Ryan Kaye
  @description: Dynamically add links to the header / mobile navs on the fly
  @date: 
  @updated: 24 August 2022 
    
*/

(function () {
  /*
    Create a header nav item (not the megamenu) 
  */
  const renderHeaderNavLink = (text, url, ident) => {
    return `
      <li class="c-header-nav__item c-header-nav__item-${ident} show-for-large">
          <a ident="header-link-${ident}" class="c-header-nav__link" rel="nofollow" href="${url}">${text}</a>
      </li>`;
  };

  /*
      Create a mobile nav menu item
   */
  const renderMobileNavLink = (text, url, ident) => {
    return `
      <li class="slidemenu__other-links-${ident} text-sm">
        <a ident="menu-link-${ident}" href="${url}" rel="nofollow">${text}</a>
      </li>`;
  };

  /* 
      Main 
  */
  const main = (text, url, ident) => {
    const headerHtml = renderHeaderNavLink(text, url, ident);
    const headerNode = stir.node(".c-header-nav--secondary");

    headerNode && headerNode.insertAdjacentHTML("afterbegin", headerHtml);

    const mobileHtml = renderMobileNavLink(text, url, ident);
    const mobileNode = stir.node(".slidemenu__other-links");

    mobileNode && mobileNode.insertAdjacentHTML("afterbegin", mobileHtml);
  };

  /* 
    getUserType 
  */
  const getUserType = () => {
    if (UoS_env.name === "dev") return "STAFF";
    return window.Cookies && Cookies.get("psessv0") !== undefined ? Cookies.get("psessv0").split("|")[0] : "";
  };

  /*
    On load
  */

  if (getUserType() === "STAFF") {
    main("Staff info", "/internal-staff/", "staff");
  }

  if (getUserType() === "STUDENT") {
    main("Student info", "/internal-students/", "students");
  }
})();
