<?php

session_start();

/*
* HubSpot integration index file
* Base Url: https://api.hubapi.com/crm/v3/objects/
* Auth: Bearer Token in the Authorization header
* HTTP Method: POST
*/

$env = parse_ini_file(dirname(__DIR__, 3) . '/' . '.env');

if (!$env) {
    echo json_encode([["process" => "Data", "outcome" => "Fail"], ["process" => "Mail", "outcome" => "Fail"]]);
    exit();
} else {
    foreach ($env as $k => $v) putenv(trim("$k=$v"));
}



/*
 * Get raw headers describing the schema of raw_row_json
 * @description: a JSON-stringified schema describing the data type of each field in raw_row_json (string, boolean, datetime, array, object, etc.) 
 * @return: string (escaped) JSON-encoded schema of raw_row_json
 */
function get_raw_headers()
{
    return json_encode(array(
        "Name" => "string",
        "Surname" => "string",
        "EmailAddress" => "string",
        "Mobile" => "string",
        "CountryOfCitizenship" => "string",
        "CountryOfResidence" => "string",
        "SubscribedToDirectEmails" =>  "boolean",
        "SubscribedToDirectPhoneCalls" => "boolean",
        "SubscribedToDirectSms" => "boolean",
        "WhatsApp Consent Given" => "boolean",
        "Mobile Phone Number" => "string",
        "SubChannel" => "string",
        "Consents" => [
            [
                "Type" => "string",
                "Consent" => "boolean"
            ]
        ],
        "Tags" => [
            [
                "Tag" => "string",
            ],
        ],
        "Intake" => "string",
        "ContactStatus" => "string",
        //"Courses" => "array",
        "Courses" => [
            [
                "StudyLevel" => "string",
                "Faculty" => "string",
                "Course" => "string"
            ]
        ],
        "HeatStatus" => "string"
    ));
}

/*
 * Check consent function
 * @param: string $val The consent value
 * @param: string $super_val The super consent value
 * @return: boolean True if consent is given, false otherwise
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
 * Get raw row JSON
 * @description: Creates a JSON-stringified object containing the actual row data
 * @return: string (escaped) JSON-encoded raw row data
 */
function get_raw_row_json()
{
    $courses = json_decode($_POST['courses']);
    $superConsent = $_POST['wed_love_to_keep_in_touch_by_sending_you_useful_information_about_the_university_and_our_courses'];
    $heat_status = $superConsent === "" || $superConsent === "false" ? "COLD" : "WARM";

    return json_encode(array(
        "Name" => $_POST['first_name'],
        "Surname" => $_POST['last_name'],
        "Mobile" => $_POST['telephone'],
        "EmailAddress" => $_POST['email'],

        "CountryOfCitizenship" => $_POST['country_of_origin'],
        "CountryOfResidence" => $_POST['country_of_residence'],
        "SubscribedToDirectEmails" => (check_consent($_POST['opt_in_for_email'], $superConsent)),
        "SubscribedToDirectPhoneCalls" => (check_consent($_POST['opt_in_for_phone'], $superConsent)),
        "SubscribedToDirectSms" => (check_consent($_POST['opt_in_for_sms'], $superConsent)),

        "WhatsApp Consent Given" => (check_consent($_POST['opt_in_for_whatsapp'], $superConsent)),
        "Mobile Phone Number" => $_POST['whatsapp_phone_number'],
        "SubChannel" => "WebEnquiry",
        "Consents" => [
            [
                "Type" => "Would you like to keep receiving emails from us?",
                "Consent" => (check_consent($superConsent, $superConsent))
            ],
            [
                "Type" => "Opt-In to Social Media?",
                "Consent" => (check_consent($_POST['opt_in_for_social'], $superConsent))
            ],
            [
                "Type" => "Opt-In to WhatsApp messaging?",
                "Consent" => (check_consent($_POST['opt_in_for_whatsapp'], $superConsent))
            ]
        ],
        "Tags" => [
            [
                "Tag" => "stir_pgpr_xx_Personalised PG Prospectus_xx_xx_xx-xx-xx",
            ],
        ],
        "Intake" => $_POST['study_year'],
        "ContactStatus" => "Enquiry",
        "Courses" => $courses,
        "HeatStatus" => $heat_status
    ));
}

/* 
 *   Create a new HubSpot object using the HubSpot API
 *   @description: Creates a new HubSpot object with the specified import name and raw data then submits the data to the HubSpot endpoint.
 *   @param: string $object_id The HubSpot object ID
 *   @param: string $bearer_token The Bearer token for authentication
 *   @param: string $import_name The import name to associate with the object
 *   @return: array An array containing the process, outcome, and result of the operation 
 *
 */
function qs_init($object_id, $bearer_token, $import_name)
{
    $url = "https://api.hubapi.com/crm/v3/objects/" . $object_id;

    $data = array(
        "properties" => array(
            "holding_import_name" => $import_name,
            "raw_headers_json" => get_raw_headers(), // desribes the raw_row_json schema
            "raw_row_json" => get_raw_row_json(), // contains the actual row data
        )
    );

    $options = array(
        "http" => array(
            "header" => "Content-Type: application/json\r\n" .
                "Authorization: Bearer " . $bearer_token . "\r\n",
            "method" => "POST",
            "content" => json_encode($data)
        )
    );

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if ($result === FALSE) {
        // Handle error
        echo "Error creating HubSpot object.";
        var_dump($result);
        return ["process" => "Data", "outcome" => "Fail", "result" => ""];
    }

    if ($result !== FALSE) {
        echo "HubSpot object created successfully.";
        var_dump($result);
        return ["process" => "Data", "outcome" => "Success", "result" => ""];
    } 
}


/*

	ON LOAD

*/


/*

  ON LOAD: QS (HUBSPOT)

*/


// Use environment variables for HubSpot object ID and bearer token
$object_id = $env['HUBSPOT_QA_OBJECT_ID'] ;
$bearer_token = $env['HUBSPOT_QA_BEARER_TOKEN'];
$import_name = "ESI API Import – Stirling Webform Prospectus Form Requested";

qs_init($object_id, $bearer_token, $import_name);

/*

	ON LOAD: MailChimp

*/
