<?php

/*

require("app-qs/qs-api.php");

$api_url = "https://integration-emea.qses-uat.com/crms/api/";


/* 

  FUNCTION: Controller for QS

*

function qs_init($api_url)
{
  $courses = json_decode($_POST['courses']);

  $contact_payload = [
    "Name" => $_POST['first_name'],
    "Surname" => $_POST['last_name'],
    "PhoneHome" => $_POST['telephone'],
    "CountryOfBirth" => $_POST['country_of_origin'],
    "CountryOfResidence" => $_POST['country_of_residence'],
    "Intake" => $_POST['study_year'],
    "ContactStatus" => "Enquiry",
    "SubscribedToDirectEmails" => ($_POST['opt_in_for_email']  ? true : false),
    "SubscribedToDirectPhoneCalls" => ($_POST['opt_in_for_phone']  ? true : false),
    "SubscribedToDirectSms" => ($_POST['opt_in_for_sms']  ? true : false),
    "Courses" => $courses,
    "Consents" => [
      [
        "Type" => "Would you like to keep receiving emails from us?",
        "Consent" => ($_POST['wed_love_to_keep_in_touch_by_sending_you_useful_information_about_the_university_and_our_courses'] ? true : false)
      ]
    ],
    "ContactNoteContent" => ($_POST['area_interest_research'] ?? '') . ' ' . ($_POST['area_interest_international_students'] ?? '') . ' ' . ($_POST['area_interest_accommodation'] ?? '') . ' ' . ($_POST['area_interest_students_union'] ?? '') . ' ' . ($_POST['area_interest_sport'] ?? ''),
    "EmailAddress" => $_POST['email']
  ];

  $url = $api_url . "processes/upsertcontact";

  $params = [
    "contactMatchingMinConfirmedScore" => 82,
    "contactMatchingMinNameSimilarity" => 0.4,
    "contactMatchingEnabled" => "True"
  ];

  $result = QS_Post($url, $params, null, $contact_payload);

  return ["Outcome" => "Success"];
}


/*

  ON LOAD

*

$_SESSION["token"] = QS_get_token($api_url);

if (isset($_POST['email'])) {
  echo json_encode(qs_init($api_url));
}

*/