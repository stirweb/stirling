<?php
	ini_set('display_errors', true);
	ini_set('log_errors', false);
	header("Content-type: application/json");	// JSON header
	header("Access-Control-Allow-Origin: *");	// CORS header

	//$_GET['module'] = 'FREU9A1/2022/3/AUT';
	$pattern = '/^[A-Z][A-Z0-9]+\/\d\d\d\d\/\d\/[A-Z]{3,4}$/';
		
	// if(!isset($_GET['module']) || preg_match($pattern,$_GET['module'])!==1) {
	// 	exit(json_encode(['error'=>'invalid request']));
	// }

	$ch = curl_init();
	
	$bai_host = 'pd-api.stir.ac.uk';
	$username = 'ws15';
	$password = 'lw781jf0ailf24!a8me3df';

	

	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);	// ignore SSL cert errors
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);	// ignore SSL cert errors
	curl_setopt($ch, CURLOPT_URL, "https://{$bai_host}/akari-stirling/api/fee/get/{$_GET['c']}");
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	
	$response = curl_exec($ch);

	if(curl_errno($ch)){
		//If an error occured, throw an Exception.
		throw new Exception(curl_error($ch));
	}
	
	curl_close($ch);
	echo $response
?>