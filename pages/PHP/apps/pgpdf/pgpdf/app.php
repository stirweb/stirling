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

  FUNCTION: Helper for QS Consent 

*/

function check_consent($val, $super_val)
{
    if ($super_val === "false")
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

    // Whole form as a String
    $postData = $_POST;

    unset($postData["token"]);
    unset($postData["g-recaptcha-response"]);
    unset($postData["courses"]); // its already encoded so remove it to stop encoding twice

    $postData["courses"] = $courses;
    //$contact_payload["communicationcontent"] = "Test: data"; //json_encode(array($postData));

    $superConsent = $_POST['wed_love_to_keep_in_touch_by_sending_you_useful_information_about_the_university_and_our_courses'];

    $contact_payload = [
        "Name" => $_POST['first_name'],
        "Surname" => $_POST['last_name'],
        "Mobile" => $_POST['telephone'],
        "CountryOfCitizenship" => $_POST['country_of_origin'],
        "CountryOfResidence" => $_POST['country_of_residence'],
        //"Intake" => $_POST['study_year'],
        //"ContactStatus" => "Enquiry",
        "SubscribedToDirectEmails" => (check_consent($_POST['opt_in_for_email'], $superConsent)),
        "SubscribedToDirectPhoneCalls" => (check_consent($_POST['opt_in_for_phone'], $superConsent)),
        "SubscribedToDirectSms" => (check_consent($_POST['opt_in_for_sms'], $superConsent)),
        "Courses" => $courses,
        "SubChannel" => "WebEnquiry",
        "CreateTask" => true,
        "TaskType" => "Incoming Communication",
        "TaskDescription" => "Stirling Webform Prospectus Form Requested",
        "Tags" => [
            [
                "Tag" => "stir_adhoc_xx_Personalised PG Prospectus_xx_xx_xx-xx-xxxx",
            ],
        ],
        // "Communications" => [
        //     [
        //         "Incoming" => true,
        //         "Category" => "Web",
        //         "Type" => "Enquiry",
        //         "Headline" => "Stirling Webform Prospectus Form Requested",
        //         "Subject" => "Stirling Webform Prospectus Form Requested",
        //         //"Code" => "sample string 5",
        //         //"Effectiveness" => "sample string 6",
        //         "FromEmailAddress" => $_POST['email'],
        //         //"ToEmailAddress" => "sample string 8",
        //         "SendExternal" => false,
        //         "Source" => "Prospectus Form Requested",
        //         "ReferralSource" => "Test content",
        //         //"DateCreated" => "2024-08-13T19:28:31.8108045+10:00"
        //     ],
        // ],
        "Consents" => [
            [
                "Type" => "Would you like to keep receiving emails from us?",
                "Consent" => (check_consent($superConsent, $superConsent))
            ]
        ],

        "ContactNoteContent" => "Other interests: " . ($_POST['area_interest_research'] ?? '') . ' ' . ($_POST['area_interest_international_students'] ?? '') . ' ' . ($_POST['area_interest_accommodation'] ?? '') . ' ' . ($_POST['area_interest_students_union'] ?? '') . ' ' . ($_POST['area_interest_sport'] ?? ''),
        //"ContactNoteType" => "Communication",
        "EmailAddress" => $_POST['email']
    ];

    // New record so add additional stuff
    if (!isset($get_data->Data[0]->id)) {
        $contact_payload["Intake"] = $_POST['study_year'];
        $contact_payload["ContactStatus"] = "Enquiry";
    } else {
        // Existing record fix id just to be safe
        $contact_payload["CrmNumber"] = $get_data->Data[0]->id;
    }


    // POST data to QS
    $url = $api_url . "/processes/upsertcontact";

    $params = [
        "contactMatchingMinConfirmedScore" => 82,
        "contactMatchingMinNameSimilarity" => 0.4,
        "contactMatchingEnabled" => "True"
    ];

    $result = QS_Post($url, $params, null, $contact_payload); // returns CrmNumber

    echo json_decode($result);


    // Other communication
    $other_comm_payload = [
        "CrmNumber" => $result,
        "Incoming" => true,
        "CommunicationTypeId" => 1,
        "CommunicationCategoryName" => "Web",
        "CommunicationCategoryId" => 2,
        "CommunicationTypeName" => "Enquiry",
        "Headline" => "Stirling Webform Prospectus Form Requested",
        "SendExternal" => false,
        "Source" => "Prospectus Form Requested",
        "SubChannelId" => 1,
        "CommunicationTypeId" => 1,
        "CommunicationCategoryId" => 1,
        //"ReferralSource" => "Test content",
        //"Subject" => "Stirling Webform Prospectus Form Requested",
        //"FromEmailAddress" => $_POST['email'],
        //"DateCreated" => "2024-08-13T19:28:31.8108045+10:00"
    ];



    $other_comm_url = $api_url . "othercommunications/";

    echo $other_comm_url;
    echo json_encode($other_comm_payload);

    $other_comm_result = QS_Post($other_comm_url, [], null, json_encode($other_comm_payload)); // returns an id


    echo $other_comm_result;

    // Other communication content
    $comm_content_payload = [
        "Content" => "Test content",
    ];
    $comm_content_url = $api_url . "/othercommunications/$other_comm_result/communicationcontent";
    $comm_content_result = QS_Post($comm_content_url, $params, null, $comm_content_payload); // returns an id

    //echo $comm_content_result;


    return ["process" => "Data", "outcome" => "Success", "result" => $result];
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

$_SESSION["token"] = QS_get_token($api_url);



if (isset($_POST['email'])) {
    $qs_outcome = qs_init($api_url);
} else {
    $qs_outcome = ["process" => "Data", "outcome" => "Fail", "result" => ""];
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
    //$mail_outcome = run($message);
    $mail_outcome = ["process" => "Mail", "outcome" => "Success", "result" => ""];
} else {
    $mail_outcome = ["process" => "Mail", "outcome" => "Fail", "result" => ""];
}


echo json_encode([$mail_outcome, $qs_outcome]);
