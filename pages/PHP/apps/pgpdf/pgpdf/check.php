<?php
session_start();

/* 

  ENVIRONMENTAL VARS: Load vars from .env

*/

$env = parse_ini_file(dirname(__DIR__, 3) . '/' . '.env');

if (!$env) {
  echo json_encode([["process" => "Data", "outcome" => "Fail"], ["process" => "Mail", "outcome" => "Fail"]]);
  exit();
} else {
  foreach ($env as $k => $v) putenv(trim("$k=$v"));
}

//require("qs-api.php");

// The code below works
// It will try to upsert automatically but from my tests it will normally just add a new contact - if you want to try manual upserting see code below
// Leave CrmNumber out if new or unmatched 

// --------
// TODO
// --------
// Courses are not mapping - tried both below but rejects without saying why
// Consents / Subscriptions - No where to add social media - might need to ask them to add this

// --------
// PROBLEMS
// --------
// Phone number requires a country code - could just use +44 for all then leave it up the recruiter to deal with it. Or use a Web service.

/*
$payload = [
  //    "CrmNumber"=>"2408", 
  "Name" => "Barry",
  "Surname" => "Binatone",
  "PhoneHome" => "+44 01764 467764",
  "CountryOfBirth" => "United Kingdom",
  "CountryOfResidence" => "United Kingdom",
  "Intake" => "jan-24",
  "ContactStatus" => "Enquiry",
  "SubscribedToDirectEmails" => true,
  "SubscribedToDirectPhoneCalls" => true,
  "SubscribedToDirectSms" => true,
  "Courses" => [
    [
      "PreferenceNumber" => 1,
      "StudyLevel" => "Postgraduate",
      "Faculty" => "Accounting, Finance, Banking and Economics",
      "Course" => "",
      "Department" => "",
      "Campus" => "",
      "StudyArea" => ""
    ]
  ],
  "Consents" => [
    [
      "Type" => "Would you like to keep receiving emails from us?",
      "Consent" => true
    ]
  ],
  "EmailAddress" => "bbinatone@example.com"
];

$url = QS_API . "processes/upsertcontact";

$params = [
  "contactMatchingMinConfirmedScore" => 82,
  "contactMatchingMinNameSimilarity" => 0.4,
  "contactMatchingEnabled" => "True"
];

echo $url . PHP_EOL;

print_r(QS_Post($url, $params, null, $payload));

exit();
  
  */

require("app-qs/qs-api.php");

$params = [
  "contactMatchingMinConfirmedScore" => 82,
  "contactMatchingMinNameSimilarity" => 0.4,
  "contactMatchingEnabled" => "True"
];

$api_url = "https://integration-emea.qses-uat.com/crms/api/";

$api_geturl = $api_url . "/api/communicationcategories?name=Web";
// $pay =   [
//   "CrmNumber" => '2619'
// ];


//POST $api_url . "api/othercommunications/{id}/communicationcontent";

$data  = QS_GET($api_geturl, null);


print_r($data);

// if (isset($data->Data[0])) {
//     echo $data->Data[0]->Id;
// } else {
//     echo "no found";
// }

// if (!isset($data->Data[0])) {
//     echo "no found";
// }
// if (isset($data->Data[0])) {
//     echo "found";
// }


$contact_payload = [
  "Name" => "name",
  "Surname" => "surname",
  "Intake" => "it",
  "Communications" => [
    [
      "Incoming" => true,
      "Category" => "Web",
    ]
  ]
];

// New record so add additional stuff
//if ($new === true) {
$contact_payload["Intake"] = "study year";
$contact_payload["ContactStatus"] = "Enquiry";
$contact_payload["Communications"]["Content"] = json_encode(array($contact_payload));
//}

//print_r(json_decode($contact_payload["Communications"]["Content"]));
