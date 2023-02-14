# Slide menu

Slide menu is a mobile drill down menu but also provides an intuitive way to access menu page links. For example, if we drill down to Menu > Sub-menu 2 > Deep menu 3 .. Deep menu 3 might have another level beyond but perhaps we want to open this menu page instead of drilling down. This slide menu allows that by putting the page link at the sub-menu links.

## Usage

See example.html

Slide menu can only support a single menu on a page, not multiple menus.

Slide menu must have a single root <li> element (Home, in the example below) that
all other nested menus are contained beneath:

```html
<ul class="slidemenu">
    <li>
        <a href="#">Home</a>
        <ul>
            <li>
                <a href="/menu1">Menu 1</a>
                <ul>
                    <li><a href="/menu1/sub-menu1">Sub Menu 1</a></li>
                    .
                    .
                    .
```

## Classes

The following classes are generated to allow styling of the slide menu:

ul.slidemenu__current - The currently showing menu
li.slidemenu__has-submenu - whether a menu item has submenus

Breadcrumb links, etc

li.slidemenu__bc - A breadcrumb item (back links, goto links, title etc)
li.slidemenu__title - Title item to show what section, not a link
li.slidemenu__back - Back links to drill up the menu
    a.slidemenu__back-link
li.slidemenu__goto - Link to allow user to navigate to page after drilling into menu
    a.slidemenu__goto-link
li.slidemenu__subitem - Submenu links showing under goto link
    a.slidemenu__subitem-link
li.slidemenu__active - if opened at a specific page, the current page
    a.slidemenu__active-link

Example

```html
<ul>
    <li>
        <a href="...">Menu 1</a>
        <ul class="slidemenu__current">
            <li class="slidemenu__bc slidemenu__back">
                <a href="..." class="slidemenu__back-link">Home</a>
            </li>
            <li class="slidemenu__bc slidemenu__back">
                <a href="..." class="slidemenu__back-link">Menu 1</a>
            </li>
            <li class="slidemenu__title">
                <span>Menu 1</span>
            </li>
            <li class="slidemenu__bc slidemenu__goto">
                <a href="..." class="slidemenu__goto-link">Menu 1</a>
            </li>
            <li>
                <a href="..." class="slidemenu__has-submenu">Sub-menu 1</a>
                <ul>
                    <li>
                        <a href="...">Sub-menu 1</a>
                    </li>
                </ul>
            </li>
            <li class="slidemenu__selected">
                <a href="..." class="slidemenu__selected-link">Sub-menu 2</a>
            </li>
        </ul>
    </li>
    .
    .
    .
</ul>
```

## Methods

```javascript

// INIT
// Initiate the slide menu

$("ul.slidemenu").slidermenu({

    // Will insert a title <li> above the currently opened menu links (default: true)
    insert_titles: true,

    // Format goto link text if required
    goto_text_format: "%s home",

    // Format back link text if required
    back_text_format: "&lt; %s",

    // Format title link text if required
    title_text_format: function(str, el) {
        if (el.href="/") $(el).addClass("home");
        return str.toUpper();
    },

    // // adjust the height of the opened menu to full size (default: true)
    // // REMOVED 2nd March, replaced with adjust to largest menu, register an event in future
    // auto_adjust_height: true,

    // adjust the height of the opened menu to full size (default: true)
    scroll_to_title: true

    // open the menu at the current page
    open_at: $(".menu a[href='/path/to/page/']")[0]
});

// OPEN
// Open the menu at a given location

$("ul.slidemenu").slidermenu("open", {
    menu_item: $("ul.slidemenu li a")[0]
});
```

## Events

```javascript
$("ul.slidemenu").slidemenu("register_event_handler", {
    event: "initiating",
    callback: function(options) {
        //...
    }
});

$("ul.slidemenu").slidemenu("register_event_handler", {
    event: "initiated",
    callback: function(options) {
        //...
    }
});

$("ul.slidemenu").slidemenu("register_event_handler", {
    event: "opening",
    callback: function(options, link) {
        //...
    }
});

$("ul.slidemenu").slidemenu("register_event_handler", {
    event: "opened",
    callback: function(options, link) {
        //...
    }
});

$("ul.slidemenu").slidemenu("register_event_handler", {
    event: "drilling",
    callback: function(options, link) {
        //...
    }
});

$("ul.slidemenu").slidemenu("register_event_handler", {
    event: "drilled",
    callback: function(options, link) {
        //...
    }
});

$("ul.slidemenu").slidemenu("register_event_handler", {
    event: "drilling_down",
    callback: function(options, link) {
        //...
    }
});

$("ul.slidemenu").slidemenu("register_event_handler", {
    event: "drilled_down",
    callback: function(options, link) {
        //...
    }
});

$("ul.slidemenu").slidemenu("register_event_handler", {
    event: "drilling_up",
    callback: function(options, link) {
        //...
    }
});

$("ul.slidemenu").slidemenu("register_event_handler", {
    event: "drilled_up",
    callback: function(options, link) {
        //...
    }
});
```
