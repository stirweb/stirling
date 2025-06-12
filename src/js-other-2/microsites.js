document.addEventListener("DOMContentLoaded", () => {
  const mainMenu = document.getElementById("mainmenu");

  if (!mainMenu || !mobileLinksUrl) return;

  // Parse the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(mobileLinksUrl, "text/html");

  // Find the first level item (to skip it) and get its children
  const firstLevelItem = doc.querySelector("ul > li");
  if (!firstLevelItem) return;

  // Get the second level menu (these will be our main visible links)
  const secondLevelMenu = firstLevelItem.querySelector("ul");
  if (!secondLevelMenu) return;

  // Process all second-level items
  const secondLevelItems = Array.from(secondLevelMenu.children);
  secondLevelItems.forEach((item) => {
    // Get link element
    const link = item.querySelector(":scope > a");
    if (!link) return;

    // Skip the home link
    if (link.innerText === "Home") return;

    // Create nav item container
    const navItem = document.createElement("div");
    navItem.className = "main-nav-item";

    // Clone the link
    const mainLink = document.createElement("a");
    mainLink.href = link.getAttribute("href");
    mainLink.textContent = link.textContent;
    mainLink.className = "main-nav-link";

    // Check if this item has children (third level)
    const subMenu = item.querySelector(":scope > ul");
    if (subMenu) {
      // This has a dropdown
      navItem.classList.add("has-dropdown");

      // Create dropdown container
      const dropdown = document.createElement("div");
      dropdown.className = "main-dropdown-menu";

      // Process all third-level items
      const thirdLevelItems = Array.from(subMenu.children);
      thirdLevelItems.forEach((subItem) => {
        const subLink = subItem.querySelector("a");
        if (!subLink) return;

        const dropdownItem = document.createElement("a");
        dropdownItem.href = subLink.getAttribute("href");
        dropdownItem.textContent = subLink.textContent;
        dropdownItem.className = "main-dropdown-item";

        dropdown.appendChild(dropdownItem);
      });

      // Add indicator for dropdown
      const dropdownIndicator = document.createElement("span");
      dropdownIndicator.className = "main-dropdown-indicator";
      dropdownIndicator.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg>`;
      mainLink.appendChild(dropdownIndicator);

      // Append dropdown to nav item
      navItem.appendChild(mainLink);
      navItem.appendChild(dropdown);

      // Toggle dropdown on hover for desktop
      navItem.addEventListener("mouseenter", () => {
        dropdown.classList.add("active");
      });

      navItem.addEventListener("mouseleave", () => {
        dropdown.classList.remove("active");
      });
    } else {
      // Simple link with no children
      navItem.appendChild(mainLink);
    }

    // Add to main menu
    mainMenu.appendChild(navItem);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuButton = document.getElementById("mobilemenubutton");
  const mobileMenu = document.getElementById("mobilemenu");

  if (!mobileMenu || !mobileMenuButton) return;

  // Pure function to create an element with properties
  const createElement = (tag, props = {}, children = []) => {
    const element = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else if (key === "innerHTML") {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    children.forEach((child) => element.appendChild(child));
    return element;
  };

  // Pure function to create a dropdown icon
  const createDropdownIcon = () =>
    createElement("span", {
      className: "dropdown-icon",
      innerHTML: "+",
    });

  // Pure function to style links
  const styleLink = (link, isParent, level = 1) => {
    const baseClass = isParent ? "mobile-nav-link parent" : "mobile-nav-link";
    link.className = `${baseClass} level-${level}`;
    return link;
  };

  // Pure function to create toggle handler
  const createToggleHandler = (subMenu, dropdownIcon) => (e) => {
    e.preventDefault();
    const isShown = subMenu.classList.contains("show");
    subMenu.classList.toggle("show");
    dropdownIcon.innerHTML = isShown ? "+" : "-";
  };

  // Pure function to process submenu with level tracking
  const processSubMenu = (subMenu, level = 2) => {
    // Add level-specific class for potential styling
    subMenu.className = `mobile-nav-children level-${level}`;

    // Process all list items within this submenu
    Array.from(subMenu.querySelectorAll(":scope > li")).forEach((item) => {
      const link = item.querySelector(":scope > a");
      const childSubMenu = item.querySelector(":scope > ul");

      if (link && childSubMenu) {
        // This is a parent link with children
        styleLink(link, true, level);

        // Add dropdown icon for this parent
        const dropdownIcon = createDropdownIcon();
        link.appendChild(dropdownIcon);

        // Process the child submenu recursively
        processSubMenu(childSubMenu, level + 1);

        // Add toggle functionality to this parent link
        link.addEventListener("click", createToggleHandler(childSubMenu, dropdownIcon));
      } else if (link) {
        // This is a leaf node (no children)
        styleLink(link, false, level);
      }
    });

    return subMenu;
  };

  // Function to process a menu item with level tracking
  const processMenuItem = (item, level = 1) => {
    const link = item.querySelector(":scope > a");
    const subMenu = item.querySelector(":scope > ul");

    if (!link) return item;

    if (subMenu) {
      // Parent link with children
      styleLink(link, true, level);

      const dropdownIcon = createDropdownIcon();
      link.appendChild(dropdownIcon);

      // Process the submenu with level tracking
      processSubMenu(subMenu, level + 1);

      // Add toggle functionality
      link.addEventListener("click", createToggleHandler(subMenu, dropdownIcon));
    } else {
      // Simple link
      styleLink(link, false, level);
    }

    return item;
  };

  // Process sitemap hierarchical structure function
  const processSitemap = (sitemapHtml) => {
    // Parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(sitemapHtml, "text/html");

    // Find the top-level list
    const topLevelList = doc.querySelector("ul");
    if (!topLevelList) return null;

    // Get the first li (which contains the site name)
    const firstLi = topLevelList.querySelector(":scope > li");
    if (!firstLi) return null;

    // Get the second-level ul (main nav)
    const mainNavUl = firstLi.querySelector(":scope > ul");
    if (!mainNavUl) return null;

    // Create a new main list for our mobile menu
    const mainList = createElement("ul", { className: "mobile-menu-main-list" });

    // Process all second-level list items (main nav items)
    const mainNavItems = Array.from(mainNavUl.querySelectorAll(":scope > li"));
    mainNavItems.forEach((item) => {
      const processedItem = processMenuItem(item.cloneNode(true), 1);
      mainList.appendChild(processedItem);
    });

    return mainList;
  };

  // Fetch and process the sitemap
  const fetchSitemap = () => {
    // Show loading indicator
    mobileMenu.innerHTML = '<div class="text-center"><em>Loading menu...</em></div>';

    if (!mobileLinksUrl) return;

    const mainList = processSitemap(mobileLinksUrl);

    if (mainList) {
      // Clear and add the processed menu
      mobileMenu.innerHTML = "";
      mobileMenu.appendChild(mainList);
    }
  };

  // Toggle menu visibility function
  const toggleMobileMenu = () => {
    const isHidden = mobileMenu.classList.contains("hide");
    mobileMenu.classList.toggle("hide");
    mobileMenuButton.setAttribute("aria-expanded", isHidden ? "true" : "false");

    // Load the menu on first open if not already loaded
    if (isHidden && !mobileMenu.querySelector(".mobile-menu-main-list")) {
      fetchSitemap();
    }
  };

  // Initialize: Attach click event to mobile menu button
  mobileMenuButton && mobileMenuButton.addEventListener("click", toggleMobileMenu);
});
