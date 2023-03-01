<?php

	error_reporting(E_ALL);
	ini_set('display_errors', '0');
	ini_set('log_errors', '0');


/***
 * Database Connection Script
 *
 * Admin Section
 *
 * 16/07/2008
 ***/


	//DEV SETTINGS
	/*$hostname_newconnection = "mysql1.stir.ac.uk";
	$database_newconnection = "gt3-practice";
	$username_newconnection = "gt3-practice";
	$password_newconnection = "app2a3er";
	$newconnection = mysql_connect($hostname_newconnection, $username_newconnection, $password_newconnection) or trigger_error(mysql_error(),E_USER_ERROR);
	mysql_select_db('gt3-practice');*/

	//PRODUCTION SETTINGS
/*
	$hostname_newconnection = "mysql1.stir.ac.uk";
	$database_newconnection = "mediaguide";
	$username_newconnection = "mediaguide";
	$password_newconnection = "dou42ing";
	$newconnection = mysql_connect($hostname_newconnection, $username_newconnection, $password_newconnection) or trigger_error(mysql_error(),E_USER_ERROR);
	mysql_select_db($database_newconnection);
*/	
	
	$link = new mysqli("mysql1.stir.ac.uk", "mediaguide", "dou42ing", "mediaguide");	//Production
	//$link = new mysqli("localhost", "root", "", "mediaguide",null,'/tmp/mysql.sock');	//Dev

	if (mysqli_connect_errno()) {
    	echo "Failed to connect to MySQL: (" . mysqli_connect_errno() . ") " . mysqli_connect_error();
	}

?>