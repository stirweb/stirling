<?php

// Load environment variables
$env = parse_ini_file(dirname(__DIR__, 2) . '/' . '.env');

if (!$env) {
    echo json_encode([["process" => "Data", "outcome" => "Fail"], ["process" => "Mail", "outcome" => "Fail"]]);
    exit();
} else {
    foreach ($env as $k => $v) putenv(trim("$k=$v"));
}

// Get the schema type and video ID from the POST request
$schema = $_POST['schemaType'];
$vid = $_POST['vid'];

// YouTube
if ($schema === 'youtube') {

    $apiKey =  getenv('YOUTUBE');
    //$vid = "oFXce-5gybU"; // Test Video ID

    $apiUrl = "https://www.googleapis.com/youtube/v3/videos?key=" . $apiKey . "&id=" . $vid . "&part=snippet,contentDetails,statistics";

    // Fetch the data
    $json_data = @file_get_contents($apiUrl);

    if ($json_data === false) {
        die("Error: Could not find data for this video in the YouTube API.");
    }

    $data = json_decode($json_data);

    if ($data === null || !isset($data->items[0])) {
        die("Error fetching or decoding data from YouTube API.");
    }

    // Get the first video item from the response
    $video = $data->items[0];
    $snippet = $video->snippet;
    $statistics = $video->statistics;
    $contentDetails = $video->contentDetails;

    // Prepare the data for the schema
    $schema = [
        "@context" => "https://schema.org",
        "@type" => "VideoObject",
        "name" => $snippet->title,
        "description" => $snippet->description,
        "thumbnailUrl" => [
            $snippet->thumbnails->default->url,
            $snippet->thumbnails->medium->url,
            $snippet->thumbnails->high->url
        ],
        "uploadDate" => $snippet->publishedAt,
        "duration" => $contentDetails->duration,
        "contentUrl" => "https://www.youtube.com/watch?v=" . $vid,
        "embedUrl" => "https://www.youtube.com/embed/" . $vid,
        "interactionStatistic" => [
            "@type" => "InteractionCounter",
            "interactionType" => ["@type" => "WatchAction"],
            "userInteractionCount" => $statistics->viewCount
        ]
    ];
}



// Vimeo
if ($schema === 'vimeo') {

    // $vid = 362740219; // Test Video ID
    $jsonObjId = "video$vid";
    $apiUrl = "https://api.vimeo.com/videos/$vid?access_token=" . getenv('VIMEO') . "&scope=public";

    $json_data = @file_get_contents($apiUrl);

    if ($json_data === false) {
        die("Error: Could not find data for this video in the Vimeo API.");
    }

    $video = json_decode($json_data);

    $schema = [
        "@context" => "https://schema.org",
        "@type" => "VideoObject",
        "name" => $video->name,
        "description" => $video->description,
        "thumbnailUrl" => [
            $video->pictures->sizes[5]->link
        ],
        "uploadDate" => $video->created_time,
        "duration" => $video->duration,
        "contentUrl" => $video->link,
        "embedUrl" => htmlspecialchars($video->player_embed_url, ENT_QUOTES),
        "interactionStatistic" => [
            "@type" => "InteractionCounter",
            "interactionType" => ["@type" => "WatchAction"],
            "userInteractionCount" => $video->stats->plays
        ]
    ];
}

echo json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
