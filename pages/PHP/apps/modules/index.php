<?php

include '../../stir-template/header.php';

/*
    
    APP

*/


/*
    RENDERERS
*/

/* renderHeader */
function renderHeader($moduleTitle, $moduleCode, $locationStudyMethods, $moduleLevel, $moduleCredits)
{
    $svg_barcode = '<t4 type="media" id="173865" formatter="inline/*"/>';
    $svg_graph = '<t4 type="media" id="173866" formatter="inline/*"/>';
    $svg_stars = '<t4 type="media" id="173867" formatter="inline/*"/>';
    return '<div class="grid-container">
                <div class="grid-x grid-padding-x u-my-2 align-middle">
                    <div class="cell large-6  c-course-title u-padding-y">
                        <h1 class="u-header-smaller ">' . $moduleTitle . '</h1>
                    </div>
                    <div class="cell large-6">
                        <div class="u-border u-border-width-5 flex-container  u-px-3 u-py-2">
                            <div class="grid-x grid-padding-x ">
                                <div class="cell medium-6 flex-container u-gap u-p-1">
                                    <span class="u-heritage-green u-inline-block u-width-48">' . $svg_barcode . '</span>
                                    <span><strong>Module code:</strong><br>' . $moduleCode . '</span>
                                </div>
                                <div class="cell medium-6 flex-container u-gap u-p-1">
                                    <span class="u-heritage-green u-inline-block u-width-48">' . $svg_graph . '</span>
                                    <span><strong>SCQF level:</strong><br>' . str_replace('SCQF LEVEL ', '', $moduleLevel) . '</span>
                                </div>
                                <div class="cell medium-6 flex-container u-gap u-p-1">
                                    <span class="u-heritage-green u-inline-block u-width-48">' . $svg_stars . '</span>
                                    <span><strong>SCQF credits:</strong><br>' . $moduleCredits . '</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>';
}

function renderListItem($item)
{
    return '<li>' . $item . '</li>';
}

/* renderContentAims */
function renderContentAims($moduleOverview, $learningOutcomes, $colourPack, $boilerplates)
{
    return '<div class="cell u-p-2">
                <h2 id="contentandaims" >Content and aims</h2>
                <h3 class="header-stripped u-bg-' . $colourPack[0]->first . '--10 u-' . $colourPack[0]->first . '-line-left u-p-1  u-border-width-5 u-text-regular">
                    Module overview
                </h3>' . $moduleOverview . '
                <h3 class="header-stripped u-bg-' . $colourPack[0]->first . '--10 u-' . $colourPack[0]->first . '-line-left u-p-1 u-border-width-5 u-text-regular u-mt-2">
                    Learning outcomes
                </h3>
                <p><strong>' . $boilerplates["outcomesIntro"] . '</strong></p>
                <ul>' . implode(" ", array_map('renderListItem', $learningOutcomes)) . '</ul>
            </div>';
}

/* renderDisclaimer    */
function renderDisclaimer($level, $url)
{
    $date = isset($_GET['session']) ? $_GET['session'] : 'current year';
    return '<div class="cell medium-9 bg-grey u-bleed u-p-2 ">
                <p>The module information below is for the ' . $date . ' intake and may be subject to change, including in response to student feedback and continuous innovation development. See our <a href="' . $url . '">terms and conditions</a> for more information.</p>
            </div>
            <div class="cell medium-3 align-middle align-center u-flex" id="backbutton"></div> ';
}

/* renderSectionStart    */
function renderSectionStart()
{
    return '<div class="grid-container"><div class="grid-x grid-padding-x start">';
}

/* renderSectionEnd    */
function renderSectionEnd()
{
    return `</div></div>`;
}


/* renderTeachingAssessment */
function renderTeachingAssessment($deliveries, $assessments, $colourPack, $boilerplates)
{
    return '<div class="cell">
              <h2 id="teaching" >Teaching and assessment</h2>
               ' . $boilerplates["teachingIntro"] . '
              
              <h3 class="header-stripped u-bg-' . $colourPack[0]->second . '--10 u-p-1 u-' . $colourPack[0]->second . '-line-left u-border-width-5 u-text-regular u-mt-2">Engagement overview</h3>
              <div class="grid-x grid-padding-x " id="deliveries"></div>

              <h3 class="header-stripped u-bg-' . $colourPack[0]->second . '--10 u-p-1 u-' . $colourPack[0]->second . '-line-left u-border-width-5 u-text-regular u-mt-1 ">Assessment overview</h3>
              
              <div class="grid-x grid-padding-x " id="assessments"></div>
              ' . $boilerplates["teachingTimetableInfo"] . '
              
          </div>';
}

/* renderAwards */
function renderAwards($moduleCredits, $ectsModuleCredits, $colourPack, $boilerplates, $studyLevel)
{
    $image1 = '<t4 type="media" id="173616" formatter="path/*"/>';
    $image2 = '<t4 type="media" id="173615" formatter="path/*"/>';

    return '<div class="cell u-mt-2">
                <h2 id="awards">Awards</h2>
                <h3 class="header-stripped u-bg-' . $colourPack[0]->third . '--10 u-p-1 u-' . $colourPack[0]->third . '-line-left u-border-width-5 u-text-regular">Credits</h3>
                <p class="flex-container u-gap align-middle"><img src="' . $image1 . '" width="65" height="44" alt="Scotland flag" />
                    This module is worth ' . $moduleCredits . ' SCQF (Scottish Credit and Qualifications Framework) credits.</p>

                <p class="flex-container u-gap align-middle"><img src="' . $image2 . '" width="65" height="44" alt="EU flag" /> 
                    This equates to ' . $ectsModuleCredits . ' ECTS (The European Credit Transfer and Accumulation System) credits.</p>
                <div class="u-mb-2 u-bg-' . $colourPack[0]->third . '--10 flex-container align-stretch ">
                    <span class="u-bg-' . $colourPack[0]->third . ' u-white flex-container align-middle u-width-64 u-px-1 ">
                      <t4 type="media" id="173864" formatter="inline/*"/> 
                    </span>
                    <p class="u-p-1 u-m-0 u-black "><strong>Discover more:</strong> 
                        <a href="' . ($studyLevel === "ug" ? $boilerplates["awardsCtaUG"] : $boilerplates["awardsCtaPG"]) . '" class="u-' . $colourPack[0]->third . '">Assessment and award of credit for ' . ($studyLevel === "ug" ? 'undergraduates' : 'postgraduates') . '</a></p>
                </div>
            </div>';
}

/* renderSupportingInfo */
function renderSupportingInfo($preparedotherinformation)
{
    return '<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Supporting notes</h3><p>' . $preparedotherinformation . '</p>';
}

/* renderStudyAbroad */
function renderStudyAbroad($content, $cta)
{
    $cta = '<a href="' . $cta . '">Find out more about our study abroad opportunities.</a></p>';
    $studyAbroadBits = explode('</p>', $content);
    array_push($studyAbroadBits, $cta);

    return '<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular">Visiting overseas students</h3>' . implode(' ', $studyAbroadBits);
}

/* renderAdditionalCosts */
function renderAdditionalCosts($additionalCosts)
{
    return !$additionalCosts ? '' : '<h3 class="header-stripped u-bg-heritage-green--10 u-p-1 u-heritage-line-left u-border-width-5 u-text-regular u-mt-2">Additional costs</h3><p>' . $additionalCosts . '</p>';
}

/* renderFurtherDetails */
function renderFurtherDetails($preparedOtherInformation, $studyAbroad, $additionalCosts, $boilerplates)
{
    return !$preparedOtherInformation && $studyAbroad !== "Yes" && !$additionalCosts
        ? ''
        : '<div class="cell u-mt-2">
                <h2 id="further">Further details</h2>
                ' . ($preparedOtherInformation ? renderSupportingInfo($preparedOtherInformation) : '') . '
                ' . ($studyAbroad === "Yes" ? renderStudyAbroad($boilerplates["studyAbroad"], $boilerplates["studyAbroadLink"]) : '') . '
                ' . renderAdditionalCosts($additionalCosts) . '
        </div>';
}

function renderTeachingAssementJSCode($assessments, $deliveries, $multipleAssessment, $assessmentsFallbackText, $deliveriesFallbackText, $studyLevel, $colours)
{
    return '<script> 
                var assessments =`' . json_encode($assessments) . '`;
                var deliveries =`' . json_encode($deliveries) . '`;
                var multipleAssessmentsText =`' . $multipleAssessment . '`;
                var assessmentsFallbackText =`' . $assessmentsFallbackText . '`;
                var deliveriesFallbackText =`' . $deliveriesFallbackText . '`;
                var studyLevel =`' . $studyLevel . '`;
                var colours =`' . json_encode($colours) . '`;
            </script>';
};

function renderError()
{
    return '<div class="cell u-padding-y"><h1>Page not found</h1></div>';
}



/* 
 
     HELPERS

 */

function getStudyLevel($level)
{
    if (!isset($level))
        return "ug";

    if (strpos(strtolower($level), "p") > -1)
        return "pg";

    return "ug";
}


function getColourPack($level, $colours)
{
    // global $filter_fresh;
    // $colourCurry = $filter_fresh(fn ($item) => $item->level === $level);
    // return $colourCurry($colours);
    // PHP 7 friendly
    return array_values((array_filter($colours, function ($item) use ($level) {
        return $item->level === $level;
    })));
}

/* 
 
     CONTROLLERS

 */

function main($data, $colours, $boilerplates)
{

    if (isset($data->error) || !isset($data)) {
        echo renderError();
        return null;
    }

    $studyLevel = getStudyLevel($data->moduleLevelDescription);
    $colourPack = getColourPack($studyLevel, $colours);

    // Place holder in case we move these into PHP as well but will currently leave in the JS
    $deliveries = '';
    $assessments = '';

    // RENDER the content
    echo '</div></div>';

    echo renderHeader($data->moduleTitle, $data->moduleCode, $data->locationStudyMethods, $data->moduleLevel, $data->moduleCredits);
    echo renderSectionStart();
    echo renderDisclaimer($studyLevel, $boilerplates["disclaimerUrl"]);
    echo renderContentAims($data->moduleOverview, $data->learningOutcomes, $colourPack, $boilerplates);
    echo renderTeachingAssessment($deliveries, $assessments, $colourPack, $boilerplates);
    echo renderAwards($data->moduleCredits, $data->ectsModuleCredits, $colourPack, $boilerplates, $studyLevel);
    echo renderFurtherDetails($data->preparedOtherInformation, $data->studyAbroad, $data->additionalCosts, $boilerplates);

    echo renderSectionEnd();
    echo renderTeachingAssementJSCode($data->assessments, $data->deliveries, $boilerplates["multipleAssessments"], $boilerplates["assessmentFallback"], $boilerplates["deliveriesFallback"], $studyLevel, $colourPack);
}




/* 
    On Load
*/



$code = isset($_GET['code']) ? $_GET['code'] : '';
$session = isset($_GET['session']) ? $_GET['session'] : '';
$semester = isset($_GET['semester']) ? $_GET['semester'] : '';

$content = file_get_contents("https://www.stir.ac.uk/data/courses/akari/module/index.php?module=$code/$session/$semester");
$init_data = json_decode($content);

// JSON url
echo "https://www.stir.ac.uk/data/courses/akari/module/index.php?module=$code/$session/$semester";



$colours_json = '[{ "level": "ug", "first": "heritage-green", "second": "energy-turq", "third": "energy-purple" },{ "level": "pg", "first": "heritage-purple", "second": "heritage-purple", "third": "heritage-green" }]';
$init_colours = json_decode($colours_json);



$disclaimer = '<p>The module information below is for the current academic year and may be subject to change, including in response to student feedback and continuous innovation development. See our <a data-t4-type="sslink" href="https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/30771" data-t4-ss-link-id="7">terms and conditions</a> for more information.</p>';
$disclaimerUrl = 'https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/30771';
$teachingIntro = '<p>Here\'s an overview of the learning, teaching and assessment methods, and the recommended time you should dedicate to the study of this module. Most modules include a combination of activity (e.g., lectures), assessments and self-study.</p>';
$teachingTimetableInfo = '<p>Teaching Timetable Info</p>';
$awardsCtaUG = 'https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/1725';
$awardsCtaPG = 'https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/1729';
$outcomesIntro = 'After successful completion of this module, you\'ll be able to:';
$deliveriesFallback = '<p>Engagement and teaching information isn\'t currently available, but it will be made clear to you when you make your module selections.</p>';
$assessmentFallback = '<p>Assessment information isn\'t currently available, but it will be made clear to you when you make your module selections.</p>';
$multipleAssessments = '<p>Assessment for this module may be different if your chosen course is delivered on campus or online.</p>';
$studyAbroad = '<p>This module is available to suitably qualified students studying elsewhere in the world who wish to join Stirling for a semester or academic year.</p>';
$studyAbroadLink = 'https://stiracuk-cms01-production.terminalfour.net/terminalfour/preview/1/en/30771';


$init_boilerplates = array(
    "disclaimer" => $disclaimer,
    "disclaimerUrl" => $disclaimerUrl,
    "studyAbroad" => $studyAbroad,
    "studyAbroadLink" => $studyAbroadLink,
    "teachingIntro" => $teachingIntro,
    "teachingTimetableInfo" => $teachingTimetableInfo,
    "awardsCtaUG" => $awardsCtaUG,
    "awardsCtaPG" => $awardsCtaPG,
    "outcomesIntro" => $outcomesIntro,
    "deliveriesFallback" => $deliveriesFallback,
    "assessmentFallback" => $assessmentFallback,
    "multipleAssessments" =>  $multipleAssessments
);

main($init_data, $init_colours, $init_boilerplates);

include '../../stir-template/footer.php';
