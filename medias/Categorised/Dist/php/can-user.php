<?php

    /**
     * Campus Area Network user identifier
     * This script uses the user's IP to tell if they are a campus (or VPN) user.
     */

	// We'll format the output of this script as JSON
    header("Content-Type: application/json; charset=utf-8");
    header("Access-Control-Allow-Origin: *");

	// get user's IP as represented by a long integer (for easier comparison);
	$ip = ip2long(empty($_SERVER['REMOTE_ADDR']) ? "192.168.1.1" : $_SERVER['REMOTE_ADDR']);
	
	// Start of the University of Stirling IP range
	$start = 2342060032; //ip2long("139.153.0.0");
	
	// End of the University of Stirling IP range
	$end = 2342125567; //ip2long("139.153.255.255");
	
	// Test: is the user's IP in range?
	$status = $ip >= $start && $ip <= $end ? true : false;
	
	// Present the result.
	echo json_encode( array("CANUser" => $status));
?>