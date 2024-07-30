<?php

/*

	On load : recapture

*/

$env = file_get_contents(dirname(__DIR__, 3) . "/.env");
$lines = explode("\n", $env);

foreach ($lines as $line) {
    preg_match("/([^#]+)\=(.*)/", $line, $matches);
    if (isset($matches[2])) {
        putenv(trim($line));
    }
}


// Get the IP address of the origin of the submission
$ip = $_SERVER['REMOTE_ADDR'];
$reCAPTCHA_secret_key =  getenv('RECAPTURE');
$g_recaptcha_allowable_score = 0.5;
$token = $_POST['token'];

// Submit the check to Google
$url =  'https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($reCAPTCHA_secret_key) . '&response=' . urlencode($token) . '&remoteip=' . urlencode($ip);

// Save the response, e.g. print_r($response) prints { "success": true, "challenge_ts": "2019-07-24T11:19:07Z", "hostname": "your-website-domain.co.uk", "score": 0.9, "action": "contactForm" }
$response = file_get_contents($url);

// Decode the response, e.g. print_r($responseKeys) prints Array ( [success] => 1 [challenge_ts] => 2019-07-24T11:19:07Z [hostname] => your-website-domain.co.uk [score] => 0.9 [action] => contactForm )
$responseKeys = json_decode($response, true);



if ($responseKeys["success"]) {
    if ($responseKeys["score"] >= $g_recaptcha_allowable_score) {
        //echo $response;
        echo '{"success":"true"}';
    } else {
        // failed spam test
        echo '{"success":"false"}';
    }
}

// Send the outcome back the Frontend
//echo $response;
