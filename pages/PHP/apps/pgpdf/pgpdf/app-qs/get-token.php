<?php
require("qs-api.php");

session_start();

header('Content-Type: application/json');

//exit();

// GET AN ACCESS TOKEN
$body = [
	'grant_type' => 'password',
	'username' => getenv('QS_USER'),
	'password' => getenv('QS_TEST'),
];

$url = QS_API . "token";
$_SESSION["token"] = QS_Post($url, null, $body, null)->access_token;

echo $_SESSION["token"] . PHP_EOL;
