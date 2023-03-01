<?php
//Initialise
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('log_errors', '0');

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

require('dbi.php');


$sql = 'SELECT
`ID` AS "id",
`Title` AS "title",
`name` AS "firstname",
`Surname` AS "lastname",
`email`,
`alpha_id`
FROM
`experts`
WHERE
1';

//$statement = $mysqli->prepare($sql);
//$statement->execute(); // Execute the statement.
//$result = $statement->get_result(); // Binds the last executed statement as a result.

$result = mysqli_query($link, $sql);
$rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
echo json_encode(($rows)); // Parse to JSON and print.
//echo('There are <a href="'.$mg_path.'browse.php?by=name">'.$row['total'].' experts</a> in the database');

mysqli_close($link);


?>