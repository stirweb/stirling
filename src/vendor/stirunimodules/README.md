# Stirling Uni Modules JS

This is a client library to load modules for UG and PG courses. It loads the JSONP
data from the Degree Programme Tables and presents it to the page. To change the
HTML of the render, overwrite the the renderers with custom functions (see below).

## Usage

First define your HTML container divs:

```html
<div id="modules_container"></div>

<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
<script src="StirUniModules.js"></script>
<script>

StirUniModules.loadoptions("TXX44-SPR", "PG", {

    // this is the container of the modules, sub-elements (e.g. select) we'll put inside here
    container: "#modules_container",

    // this will tell the page to auto load the first modules on load
    autoload_first_route: true,

    // this will tell the page to auto load the first modules on load
    autoload_first_option: true,

    // use modules lib build in cache
    use_cache: true,
    
});

</script>
```

## Custom renderers

The default renderers can be customised:

```javascript
StirUniModules.setShowOptionsRenderer(function(data) {
    //...
});

StirUniModules.setShowOptionsErrorRenderer(function(data) {
    //...
});

StirUniModules.setShowModulesRenderer(function(data) {
    //...
});

StirUniModules.setShowModulesErrorRenderer(function(data) {
    //...
});

StirUniModules.setShowModuleRenderer(function(data) {
    //...
});

StirUniModules.setShowModuleErrorRenderer(function(data) {
    //...
});

StirUniModules.setShowLoadingRenderer(function(data) {
    //...
});

StirUniModules.setHideLoadingRenderer(function(data) {
    //...
});
```

Best approach would be to first copy the default render functions from the source
code into the above methods, then modify as needed.


TODO
* multiple instances for multiple containers? eg. var modules = new StirUniModules("TXX44-SPR", "PG", {...})
