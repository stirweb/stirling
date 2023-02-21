<?php
error_reporting(1);
ini_set('display_errors', '1');
ini_set('log_errors', '0');

if (!function_exists("simplexml_load_file")) {
    header("Content-Type: text/plain");
    echo("Unable to load XML");
    exit(1);
}

date_default_timezone_set("Europe/London");
$format = (!empty($_GET["format"] && $_GET["format"] === "JSON")) ? "JSON" : "JSONp";

function getMaxNumberOfResults() {
    // hardcoded options so we don't have to sanitise input

    // default    
    if(empty($_GET["max"])){
        return 5;
    }
    if($_GET["max"] === "4") {
        return 4;
    }
    if($_GET["max"] === "3") {
        return 3;
    }
    if($_GET["max"] === "2") {
        return 2;
    }
    if($_GET["max"] === "1") {
        return 1;
    }
}

function getIdentifierFromURL($url) {
    // author ID is the last part of the URL (after the final dash).
    return end(explode('-', $url));
}

function getImagesFromPage($url, $authorID){
    $authorimage = '';
    $mainimage   = '';
    
    if(!empty($url)) {
        $text = file_get_contents($url);
        $matches = array();
        $didmatch = 0;

        // get author image
        $didmatch = preg_match('/data-src="(.*\/avatars\/' . $authorID . '[^"]*)"/i', $text, $matches);
        $authorimage = ($didmatch > 0) ? $matches[1] : "";

        //get main image
        $pattern = 'meta property="og:image" content="(.*[^"])"';
        $didmatch = preg_match('/'.$pattern.'/i', $text, $matches);
        $mainimage = ($didmatch > 0) ? $matches[1] : "";
        $mainimage = preg_replace('/w=\d+/','w=450', $mainimage);
        $mainimage = preg_replace('/h=\d+/','h=338', $mainimage);

        //get main image description
        $pattern = 'figcaption>\s*(.*[^<^\s])';
        $didmatch = preg_match('/'.$pattern.'/i', $text, $matches);
        $imagealt = strip_tags(($didmatch > 0) ? $matches[1] : "");
    }

    return array($authorimage, $mainimage, $imagealt);
}

$xml = simplexml_load_file("https://theconversation.com/institutions/university-of-stirling/articles.atom");
$xml = simplexml_load_file("https://theconversation.com/institutions/university-of-stirling-1697/articles.atom");

//$xml = simplexml_load_file("articles.atom");
$namespaces = $xml->getNamespaces(true);
$i = 0;
$r = [];
$max = getMaxNumberOfResults();

foreach($xml->entry as $article){
    
    if ($i++ >= $max) { break; }
    
    $stir_authors = array();
    $authorimage = '';
    $mainimage = '';
    $coauthors = array();

    foreach ($article->author as $author) {        
        $name = $author->name;
        if(strpos($name, "University of Stirling") !== false) {
            $name = str_replace(", University of Stirling", '', $name);
            $boom = explode(", ",$name);
            array_push($stir_authors, array(
                'name' => $boom[0],
                'etc' => implode(", ", array_slice($boom, 1)),
                'homepage' => (string)$author->children($namespaces['foaf'])->attributes('rdf', TRUE)['resource']
            ));
        } else {
            array_push($coauthors, $author);
        }
    }
    
    // check author details are available
    // we can only show one, so we'll just take the first one (there may be more?!)
    $name     = (!empty($stir_authors[0])) ? $stir_authors[0]['name'] : '';
    $etc      = (!empty($stir_authors[0])) ? $stir_authors[0]['etc'] : '';
    $homepage = (!empty($stir_authors[0])) ? $stir_authors[0]['homepage'] : '';
    
    // scrape images from the article's webpage:
    $authorURL = (string)$article->link['href'];
    $authorID  = getIdentifierFromURL($homepage);
    list($authorimage, $mainimage, $imagealt) = getImagesFromPage($authorURL, $authorID);
    
    array_push($r, '{"title":"'.$article->title.'","href":"'.(string)$article->link['href'].'","published":"'.$article->published.'","readablepubdate":"'.date('l j F', strtotime($article->published)) . '","author": {"name":"' . $name . '","etc":"'.$etc.'","homepage":"'.$homepage.'","image":"'.$authorimage.'"}, "image":"'.$mainimage.'","alt":"'.$imagealt.'","coauthors": ' . json_encode($coauthors) . '}');
}

// [optional] here we can append an extra article not otherwise in the feed
$extra = '';
    //'{"title":"‘Insularity is not the way forward’: three university vice-chancellors on Brexit","href":"http://theconversation.com/insularity-is-not-the-way-forward-three-university-vice-chancellors-on-brexit-60660","published":"2016-06-13T13:03:08Z","readablepubdate":"Monday 13 June","author": {"name":"Prof. Gerry McCormac","etc":" Principal and Vice-Chancellor","homepage":"http://theconversation.com/profiles/gerry-mccormac-144681","image":"https://62e528761d0685343e1c-f3d1b99a743ffa4142d9d7f1978d9686.ssl.cf2.rackcdn.com/avatars/144681/width170/RackMultipart20141111-23218-8zg5tk.jpg"} } ,';

$r = '[' . $extra . implode(' ,', $r) . ']';

if($format == "JSONp"){
    header('Content-Type: application/javascript; charset=utf-8');
    echo 'conversation('. $r .');';
} else {
    header('Content-Type: application/json; charset=utf-8');
    echo '{"articles": '. $r .'}';
}

?>