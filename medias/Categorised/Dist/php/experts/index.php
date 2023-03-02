<?php

require_once('mediaguide.inc.php');
$myView = new MediaGuide('browse');
$myView->query();

$myView->meta(); // get default metadata

$model = array();
$model['breadcrumb'] = '<li><a href="/news/">News</a></li><li><a href="' . MediaGuide::getCurrentURI() . '/">Find an expert</a></li>';
$model['body'] = $myView->form() . '<div class="grid-container medium-10 medium-centered columns"><div class="grid-x grid-padding-x u-margin-y"><div class="small-10 medium-8 cell">' . $myView->results() . '</div></div></div>' . $myView->footer();
$model['scripts'] = '';

$meta = $myView->getMeta();
if(is_array($meta['pagekeywords'])) {
	$meta['pagekeywords'] = implode(', ', $meta['pagekeywords']);
}

$model['title'] = 'Find an expert | University of Stirling'; // unique page title just for the landing page
$model['meta'] = $myView->output($meta, 'meta');

echo $myView->output($model);

mysqli_close($GLOBALS['link']);

?>