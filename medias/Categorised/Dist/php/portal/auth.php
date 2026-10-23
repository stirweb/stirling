<?php

/**
 * PORTAL AUTHENTICATION
 * Updated 2018-06-07 by rwm2
 * Updated 2020-03-20 03.05pm by rwm2 - add new SiteImprove IP addresses.
 * Updated 2021-10-13 01.41pm by rwm2 - add Funnelback cloud-hosted IP addresses.
 * Updated 2022-07-15 11.00am by rwm2 - fix for PHP automatic URLDecoding cookies.
 * Updated 2026-03-30 8.46 am by rwm2 - change to paok17 and psess17
 *
 * The purpose of this script is to display the webpage only to authenticated users.
 * Portal-athenticated users will have the psess17 and paok17 cookies set.
 * We'll hash the psess17 value and check it matches paok17 that was set by the Portal.
 * 
 * Certain web-crawlers will be also allowed, determined by IP address.
 * 
 * @global boolean $login The user's authentication status.
 * @global string $complete_url Full URL of the current page, for authentication redirect link.
 * @global string $usertype User type, either STAFF or STUDENT.
 * 
 */

$login = false;
// Get the URL of the current page (so we can set up a login-and-return link so the user can authenticate, then come back here automatically).
$protocol     = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$complete_url = $protocol.$_SERVER["SERVER_NAME"].$_SERVER['REQUEST_URI'];

/* allow temporary guest access */
if( isset($_COOKIE['psessvip']) && $_COOKIE['psessvip']==='07cc50fdff67e80648de4c719c1be37d' ) {
	$login = true;
}

if(isset($_COOKIE['psess17']) && isset($_COOKIE['paok17'])) {
	$psess     = $_COOKIE['psess17'];
	$paok      = $_COOKIE['paok17'];
	$separator = '|';
	$salt      = '|ATh-@atha5eSeepr_napraa*ap_aZutRa-h&reTudrA';
	// !! be careful not to reveal this secret salt !!
	
	$psess = str_replace("\\\"","",$psess);
	$psess = str_replace("\"","",$psess);
	$psess = str_replace("\'", "'", $psess);
	
	//get data from the psess cookie
	$cdata        = explode($separator, $psess);
	$usertype     = $cdata[0]; // type, STAFF or STUDENT
	$userid       = $cdata[1]; // University network user ID
	$p_name       = $cdata[2]; // preferred name
	$last_log_in  = str_replace('_', ' ', $cdata[3]);  // date/time last logged on
	
	// decode then re-encode the name to ensure it matches the Portal format (i.e. fully-encoded,
	// including special chars, as opposed to the raw cookie format that only encodes spaces).
	$cdata[2] = urlencode(urldecode($cdata[2]));
	
	// Rebuild psess, hash it, then compare it to paok.
	// $login will be TRUE if the hash values match exactly
	$login = md5(implode($separator, $cdata).$salt) === $paok;
} else {
	$allowedIPs = array(

/* AddSearchBot */
'50.19.247.197' => 1,
'34.234.198.218' => 1,
'34.237.39.240' => 1,
'52.45.51.99' => 1,
'34.237.132.33' => 1,
'52.205.33.118' => 1,
'52.21.18.234' => 1,
'52.22.51.159' => 1,
'18.211.152.50' => 1,

/* Site Improve web crawlers */
'93.160.60.22' => 1, /* Content */
'185.229.144.22' => 1, /* Content */
'80.62.246.50' => 1, /* Content */
'52.48.230.149' => 1, /* Content */
'52.57.25.76' => 1, /* Content */
'3.10.81.130' => 1, /* Content */
'35.157.236.87' => 1, /* Content */
'35.157.42.7' => 1, /* Content */
'52.55.30.145' => 1, /* Content */
'52.20.183.91' => 1, /* Content */
'52.60.34.56' => 1, /* Content */
'185.229.144.10' => 1, /* Content */
'13.58.165.213' => 1, /* Content */
'18.116.191.222' => 1, /* Content */
'18.116.197.208' => 1, /* Content */
'18.189.206.159' => 1, /* Content */
'18.190.68.80' => 1, /* Content */
'18.216.137.252' => 1, /* Content */
'18.223.191.8' => 1, /* Content */
'3.13.121.241' => 1, /* Content */
'3.133.38.181' => 1, /* Content */
'3.135.49.180' => 1, /* Content */
'3.136.111.218' => 1, /* Content */
'3.138.54.100' => 1, /* Content */
'18.219.35.44' => 1, /* Content */
'18.157.140.51' => 1, /* Content */
'18.159.218.224' => 1, /* Content */
'18.196.205.2' => 1, /* Content */
'18.198.120.55' => 1, /* Content */
'3.124.26.114' => 1, /* Content */
'3.125.99.135' => 1, /* Content */
'3.64.159.177' => 1, /* Content */
'3.66.247.32' => 1, /* Content */
'3.68.122.244' => 1, /* Content */
'52.57.167.198' => 1, /* Content */
'35.158.180.204' => 1, /* Content */
'18.192.147.131' => 1, /* Content */
'52.58.146.230' => 1, /* Content */
'185.229.145.22' => 1, /* Content */
'52.7.141.1' => 1, /* Content */
'52.4.143.42' => 1, /* Content */
'3.136.111.218w' => 1, /* Content */
'3.129.126.175w' => 1, /* Content */
'52.64.209.168' => 1, /* Content */
'52.47.166.84' => 1, /* Content */
'35.204.24.17' => 1, /* Content */
'52.199.41.160' => 1, /* Content */
'35.156.240.123' => 1, /* Content */
'35.156.240.123' => 1, /* Behavior Map Service */
'18.223.89.15' => 1, /* Performance */
'3.209.121.100' => 1, /* Performance */
'52.8.130.130' => 1, /* Performance */
'3.123.96.88' => 1, /* Performance */
'3.10.81.130' => 1, /* Performance */
'52.63.157.211' => 1, /* Performance */
'3.113.133.88' => 1, /* Performance */
'18.230.72.87' => 1, /* Performance */
'13.48.252.26' => 1, /* Performance */
'35.182.100.126' => 1, /* Performance */
'18.162.92.10' => 1, /* Performance */
'52.62.119.24' => 1, /* Response */
'52.62.147.245' => 1, /* Response */
'54.233.93.223' => 1, /* Response */
'52.29.157.54' => 1, /* Response */
'52.29.165.98' => 1, /* Response */
'35.154.71.109' => 1, /* Response */
'52.78.201.227' => 1, /* Response */
'52.79.109.89' => 1, /* Response */
'52.49.22.75' => 1, /* Response */
'52.17.221.188' => 1, /* Response */
'52.192.200.212' => 1, /* Response */
'52.77.4.220' => 1, /* Response */
'52.76.24.207' => 1, /* Response */
'52.71.233.116' => 1, /* Response */
'52.70.218.116' => 1, /* Response */
'52.89.228.115' => 1, /* Response */
'52.33.171.213' => 1, /* Response */
'52.8.142.166' => 1, /* Response */
'52.8.3.121' => 1, /* Response */
);
	
	if(isset($_SERVER['HTTP_X_FORWARDED_FOR']) && isset($allowedIPs[$_SERVER['HTTP_X_FORWARDED_FOR']])) {
		$usertype = 'CRAWLER';
		$userid   = 'Funnelback';
		$login    = true;
	}
}

?>
