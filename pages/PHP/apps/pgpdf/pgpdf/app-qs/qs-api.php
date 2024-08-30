<?php

//require("token.php");

define('QS_API', 'https://integration-emea.qses.system/crms/api/');


/* 
   FUNCTION: GET A TOKEN TO ACCESS QS
*/
function QS_get_token($api_url)
{
	$body = [
		'grant_type' => 'password',
		'username' => getenv('QS_USER'),
		'password' => getenv('QS_PROD'),
	];


	$url = $api_url . "token";

	//var_dump(QS_Post($url, null, $body, null));
	return QS_Post($url, null, $body, null)->access_token;
}


/*
	Function: POST data to QS
*/
function QS_Post($url, $params = null, $body = null, $json = null)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	if (!empty($params)) {
		$url .= '?' . http_build_query($params);
	}
	if (!empty($body)) {
		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($body));
		curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
	} else {
		curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', "Authorization: Bearer {$_SESSION["token"]}"]);

		if (!empty($json)) {
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($json));
		}
	}
	curl_setopt($ch, CURLOPT_URL, $url);

	$response = curl_exec($ch);
	$code = curl_getinfo($ch);

	//var_dump($response);
	//print_r($code);
	curl_close($ch);
	if (false !== $response) {
		return json_decode($response);
	}
}

/*
	Function: Perform a GET request to pull data from QS
*/
function QS_Get($url, $params)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	if (!empty($params)) {
		$url .= '?' . http_build_query($params);
	}

	curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer {$_SESSION["token"]}"]);
	curl_setopt($ch, CURLOPT_URL, $url);

	$response = curl_exec($ch);
	$code = curl_getinfo($ch);

	//print_r($code);
	//print_r(json_decode($response));

	curl_close($ch);
	if (false !== $response) {
		return json_decode($response);
	}
}
