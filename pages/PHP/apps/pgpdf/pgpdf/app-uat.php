<?php

session_start();

$ENV_MODE = 'QA'; // Change to 'PROD' for production or QA for UAT / Test mode

// These only take effect if ENV_MODE is set to QA - in PROD mode everything is active
$TEST_QS = false; // Set to false to test without sending data to QS
$TEST_MAIL = false; // Set to false to test without sending emails via mailchimp


require_once('vendor/autoload.php');
require("app-qs/qs-api.php");

$api_url = $ENV_MODE === 'QA' ? "https://integration-emea.qses-uat.com/crms/api/" : "https://integration-emea.qses.systems/crms/api/";


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

  FUNCTION: Helper for QS Consent 

*/

function check_consent($val, $super_val)
{
    if ($super_val === "" || $super_val === "false")
        return false;

    if ($val === 'true')
        return true;

    return false;
}

/* 

  FUNCTION: Controller for QS

*/
function qs_init($api_url)
{
    // Check if there is a record already for this person
    $api_geturl = $api_url . "/contacts?emailAddress=" .  $_POST['email'];
    $get_data = QS_GET($api_geturl, null);

    $courses = json_decode($_POST['courses']);
    $superConsent = $_POST['wed_love_to_keep_in_touch_by_sending_you_useful_information_about_the_university_and_our_courses'];
    $heat_status = $superConsent === "" || $superConsent === "false" ? "COLD" : "WARM";

    $contact_payload = [
        "Name" => $_POST['first_name'],
        "Surname" => $_POST['last_name'],
        "Mobile" => $_POST['telephone'],
        "CountryOfCitizenship" => $_POST['country_of_origin'],
        "CountryOfResidence" => $_POST['country_of_residence'],
        "SubscribedToDirectEmails" => (check_consent($_POST['opt_in_for_email'], $superConsent)),
        "SubscribedToDirectPhoneCalls" => (check_consent($_POST['opt_in_for_phone'], $superConsent)),
        "SubscribedToDirectSms" => (check_consent($_POST['opt_in_for_sms'], $superConsent)),

        "SubChannel" => "WebEnquiry",

        "Tags" => [
            [
                "Tag" => "stir_pgpr_xx_Personalised PG Prospectus_xx_xx_xx-xx-xx",
            ],
        ],
        "Consents" => [
            [
                "Type" => "Would you like to keep receiving emails from us?",
                "Consent" => (check_consent($superConsent, $superConsent))
            ],
            [
                "Type" => "Opt-In to Social Media?",
                "Consent" => (check_consent($_POST['opt_in_for_social'], $superConsent))
            ]
        ],

        "EmailAddress" => $_POST['email']
    ];

    $transaction_type = '';

    // New record so add additional stuff
    if (!isset($get_data->Data[0]->Id)) {
        $contact_payload["Intake"] = $_POST['study_year'];
        $contact_payload["ContactStatus"] = "Enquiry";
        $contact_payload["Courses"] = $courses;
        $contact_payload["HeatStatus"] = $heat_status;
        $transaction_type = "added";
    } else {
        // Existing record fix id just to be safe
        $contact_payload["CrmNumber"] = $get_data->Data[0]->Id;
        $transaction_type = "updated";
    }

    // POST student data to QS
    $url = $api_url . "/processes/upsertcontact";

    $params = [
        "contactMatchingMinConfirmedScore" => 82,
        "contactMatchingMinNameSimilarity" => 0.4,
        "contactMatchingEnabled" => "True"
    ];

    $result = QS_Post($url, $params, null, $contact_payload); // should return CrmNumber

    // Other communication
    $other_comm_payload = [
        "CrmNumber" => $result,
        "Incoming" => true,
        "CommunicationCategoryID" => 8,
        "CommunicationTypeID" => 1,
        "Headline" => "Stirling Webform Prospectus Form Requested",
        "SendExternal" => false,
        "Source" => "Prospectus Form Requested",
        "SubChannelID" => 101,
        "Task" => [
            "TaskTypeId" => 6,
            "Description" => "Stirling Webform Prospectus Form Requested"
        ]
    ];

    // Whole formData as a String
    $post_data = $_POST;

    unset($post_data["token"]);
    unset($post_data["g-recaptcha-response"]);
    unset($post_data["courses"]); // its already encoded so remove it to stop encoding twice
    unset($post_data["pdfPath"]);

    $post_data["courses"] = json_encode($courses);

    $string_it = function ($key, $value) {
        return $key . ": " . $value . "<br>\r";
    };

    $arr_posted_data = array_map($string_it, array_keys($post_data), $post_data);
    $str_posted_data2 = implode("<br>\r", $arr_posted_data);

    $other_comm_url = $api_url . "othercommunications";
    $other_comm_result_id = QS_Post($other_comm_url, null, null, $other_comm_payload); // should return an id

    // Other communication content
    $comm_content_payload = [
        "Content" => $str_posted_data2,
    ];

    $comm_content_url = $api_url . "/othercommunications/$other_comm_result_id/communicationcontent";
    $comm_content_result = QS_Post($comm_content_url, $params, null, $comm_content_payload); // returns an id

    return ["process" => "Data", "outcome" => "Success", "result" => "$result $transaction_type"];
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
        return ["process" => "Mail", "outcome" => "Success", "result" => ""];
    } catch (Error $e) {
        return  ["process" => "Mail", "outcome" => "Fail", "result" => ""];;
    }
}


/*
    FUNCTION: Check if testing
*/
function check_if_submitting($env, $testing)
{
    if ($env !== 'QA')
        return true;

    return $testing;
}


/*

	ON LOAD

*/


if (!isset($_POST['email'])) {
    echo json_encode([["process" => "Data", "outcome" => "Fail", "result" => ""], ["process" => "Mail", "outcome" => "Fail", "result" => ""]]);
    exit();
}

if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode([["process" => "Data", "outcome" => "Fail", "result" => ""], ["process" => "Mail", "outcome" => "Fail", "result" => ""]]);
    exit();
}


/*

  ON LOAD: QS

*/

$_SESSION["token"] = QS_get_token($api_url, $ENV_MODE);


if (isset($_POST['email'])) {
    $submitqs = check_if_submitting($ENV_MODE, $TEST_QS);
    $qs_outcome = $submitqs ? qs_init($api_url) : ["process" => "Data", "outcome" => "Success", "result" => "Skipped sending"];
} else {
    $qs_outcome = ["process" => "Data", "outcome" => "Fail", "result" => ""];
}


/*

	ON LOAD: MailChimp

*/

$from = "study@stir.ac.uk";
$subject = "Your personalised prospectus is ready!";

// Dynamic content
$to = $_POST["email"];
$first =  ucfirst($_POST["first_name"]);
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
    $submitmail = check_if_submitting($ENV_MODE, $TEST_MAIL);
    $mail_outcome = $submitmail ? run($message) : ["process" => "Mail", "outcome" => "Success", "result" => "Skipped sending"];
} else {
    $mail_outcome = ["process" => "Mail", "outcome" => "Fail", "result" => ""];
}


echo json_encode([$mail_outcome, $qs_outcome]);
