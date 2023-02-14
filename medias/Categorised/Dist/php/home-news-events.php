<?php

    /**
     * Get the homepage JSON Feeds for news and events, and return a single JSONp (or JSON) file.
     * @param {string} callback the callback to use for JSONp
     * 
     * @author Robert Morrison <r.w.morrison@stir.ac.uk> 
     */

    //error_reporting(E_ALL);
    ini_set('display_errors', '0');
    ini_set('log_errors', '0');

    $data = array();

    $data['news']   = getJSONFeedItems("https://www.stir.ac.uk/media/stirling/feeds/news-homepage.json");
    $data['events'] = getJSONFeedItems("https://www.stir.ac.uk/media/stirling/feeds/events-homepage.json");

    function getJSONFeedItems($url) {
        $data = @file_get_contents($url);
        if($data) {
            $json = json_decode($data, true);
            return empty($json['items']) ? '' : $json['items'];
        }
        return '';
    }

    if(!empty($_REQUEST['callback'])) {

        if( preg_match('/^[a-z0-9_-]+$/i', $_REQUEST['callback']) === 1 ) {
            header("Content-Type: application/javascript; charset=utf-8");
            print $_REQUEST['callback'] . "(" . json_encode($data) . ")";
            exit;
        }
        
    }

    header("Content-type: application/json; charset=utf-8");
    print json_encode($data);

?>