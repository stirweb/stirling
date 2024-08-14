<?php

require("qs-api.php");

$url = QS_API . "processes/getcontactactivepreference";

$params = [
  "contactMatchingMinConfirmedScore" => 82,
  "contactMatchingMinNameSimilarity" => 0.4,
  "contactMatchingEnabled" => "True"
];

$payload = ["EmailAddress" => "bbinatone@example.com", "Name" => "Barry", "Surname" => "Binatone"];


print_r(QS_Post($url, $params, null, $payload));

exit();

// TEST MATCHING A CONTACT TO GET HIS ID
// For manual upserting
// The code below works and matches a contact best with these 3 inputs
// Then do above POST (see above) including the returned CrmNumber which will be returned if these 3 criteria match exactly

/*
  $match_uri_settings = '?contactMatchingMinConfirmedScore=82&contactMatchingMinNameSimilarity=0.4&contactMatchingEnabled=True';
  
  $post_getcontact_url = $api_url . 'processes/getcontactactivepreference' . $match_uri_settings;
  
  $contact_payload = json_encode(["EmailAddress"=>"ryankaye@gmail.com", "Name"=>"Ryan", "Surname"=>"Kaye"]);
  
  $curl3 = curl_init();
  
  curl_setopt($curl3, CURLOPT_CUSTOMREQUEST, "POST");
  curl_setopt($curl3, CURLOPT_RETURNTRANSFER, true);
  
  curl_setopt($curl3, CURLOPT_HTTPHEADER, [
    $auth_header, 'Content-Type: application/json'
  ]);
  
  curl_setopt($curl3, CURLOPT_POSTFIELDS, $contact_payload);
  
  curl_setopt($curl3, CURLOPT_URL, $post_getcontact_url);
  
  $contact_data = curl_exec($curl3);
  
  echo $contact_data;
  
  //
  
  
  //echo phpinfo();
  
  */
