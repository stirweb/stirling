<?php

    error_reporting(E_ALL);
	ini_set('display_errors', 1);
	ini_set('log_errors', 0);

    define("USE_GROUP_ONE", true); // i.e. MD20
    define("USE_GROUP_TWO", false); // MD40

    if(empty($_REQUEST['postcode'])) {
        header("Content-Type: text/plain", true, 400);
        echo "postcode parameter is required";
        exit;
    }
    
    
    function normaliseInput($string) {
        return str_replace(' ','',(strtoupper(trim(urldecode($string)))));
    }
    
    function checkPostcodeValidity($postcode) {
        if(preg_match('/^[a-zA-Z0-9 ]+$/', $postcode)!==1){
            return array(
                'result' => false,
                'message' => 'Please enter a valid UK postcode.'
            );
        }
        $postcode_normal = normaliseInput($postcode);
        $strings = array(
            'success' => 'We can confirm that __1__ is a __2__ priority postcode. This will be taken into consideration when assessing your application.',
            'failure' => 'Sorry. Postcode __1__ is not a priority postcode.'
        );

        if(USE_GROUP_ONE) {
            require 'group1.php';
            if(!is_array($group1)) {
                return array('data error');
            }
    
            if(in_array($postcode_normal, $group1)) {
                return array(
                    'result' => true,
                    'group' => 1,
                    'message' => str_replace(['__1__','__2__'], [$postcode,"Group 1"], $strings['success']),
                    'postcode' => $postcode
                );
            }
        }

        if(USE_GROUP_TWO) {
            require 'group2.php';
            if(!is_array($group2)) {
                return array('data error');
            }
            if(in_array($postcode_normal, $group2)) {
                return array(
                    'result' => true,
                    'group' => 2,
                    'message' => str_replace(['__1__','__2__'], [$postcode,"Group 2"], $strings['success']),
                    'postcode' => $postcode
                );
            }
        }

        return array(
            'result' => false,
            'message' => str_replace('__1__', $postcode, $strings['failure']),
            'postcode' => $postcode
        );
    }

    $response = checkPostcodeValidity($_REQUEST['postcode']);

    if(!empty($_REQUEST) && !empty($_REQUEST['format']) && $_REQUEST['format']=="json"){
        header("Content-Type: application/json");
        header("Access-Control-Allow-Origin: *");
        echo json_encode($response);
    } else {
        header("Content-Type: text/plain");
        echo $response['message'];
    }


?>