<?php

require("qs-api.php");

$url = QS_API . "courses";

echo   $url;

print_r(QS_Get($url, null, null, null));
