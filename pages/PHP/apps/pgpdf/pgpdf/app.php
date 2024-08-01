<?php

session_start();

require_once('vendor/autoload.php');
require("app-qs/qs-api.php");

$api_url = "https://integration-emea.qses-uat.com/crms/api/";


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


/* 

  FUNCTION: Controller for QS

*/

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

    return ["process" => "Data", "outcome" => "Success"];
}


/* 

    MailChimp: Send Email to User

*/

function run($message)
{
    try {
        $mailchimp = new MailchimpTransactional\ApiClient();
        $mailchimp->setApiKey(getenv('MAIL'));

        $response = $mailchimp->messages->sendTemplate($message);
        return ["process" => "Mail", "outcome" => "Success"];
    } catch (Error $e) {
        return  ["process" => "Mail", "outcome" => "Fail"];;
    }
}


/*

	ON LOAD
*/

if (!isset($_POST['email'])) {
    echo json_encode([["process" => "Data", "outcome" => "Fail"], ["process" => "Mail", "outcome" => "Fail"]]);
    exit();
}


if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode([["process" => "Data", "outcome" => "Fail"], ["process" => "Mail", "outcome" => "Fail"]]);
    exit();
}


/*

  ON LOAD: QS

*/

$_SESSION["token"] = QS_get_token($api_url);

if (isset($_POST['email'])) {
    $qs_outcome = qs_init($api_url);
} else {
    $qs_outcome = ["process" => "Data", "outcome" => "Fail"];
}


/*

	ON LOAD: MailChimp

*/

$from = "study@stir.ac.uk";
$subject = "Your Personalised Prospectus is ready";

// Dynamic content
$to = $_POST["email"];
$first =  $_POST["first_name"];
$link = $_POST["pdfPath"];

$message = [
    "message" => [
        "from_email" => $from,
        "subject" => $subject,
        "text" => $subject,
        "to" => [
            [
                "email" => $to,
                "type" => "to"
            ]
        ],
        "merge_vars" =>  [[
            "rcpt" => $to,
            "vars" => [
                ["name" => "link", "content" => $link],
                ["name" => "first", "content" => $first]
            ]
        ]],
    ],
    "template_name" => "pg-personalised-prospectus",
    "template_content" => []
];

if (isset($_POST['email'])) {
    $mail_outcome = run($message);
} else {
    $mail_outcome = ["process" => "Mail", "outcome" => "Fail"];
}


echo json_encode([$mail_outcome, $qs_outcome]);
