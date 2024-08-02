<!doctype html>
<html class="no-js" lang="en">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=11" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow">

    <meta name="description" content="Buttons Kitchen sink – University of Stirling" />
    <!-- meta -->
    <title>Create your personalised prospectus | Study | University of Stirling</title>

    <link rel="preload" href="../../../../../../medias/Categorised/Dist/fonts/fsmaja/FSMajaWeb-Regular.woff?v=0.1" as="font" type="font/woff" crossorigin>
    <link rel="preload" href="../../../../../../medias/Categorised/Dist/fonts/open-sans/OpenSans-Regular.ttf?v=0.1" as="font" type="font/ttf" crossorigin>
    <link rel="preload" href="../../../../../../medias/Categorised/Dist/fonts/open-sans/OpenSans-Bold.ttf?v=0.1" as="font" type="font/ttf" crossorigin>
    <link rel="preload" href="../../../../../../medias/Categorised/Dist/fonts/fonts.css?v=3.1" as="style">
    <link rel="stylesheet" href="../../../../../../medias/Categorised/Dist/fonts/fonts.css?v=3.1">


    <link rel="preload" href="../../../../../../medias/Categorised/Dist/css/app.min.css?v=175.1" as="style">
    <link rel="stylesheet" href="../../../../../../medias/Categorised/Dist/css/app.min.css?v=175.1">

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

    <script src="https://unpkg.com/pdf-lib"></script>
    <script src=" https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js "></script>
</head>

<body class="external-pages" data-noqaprotect>

    <!-- 
				 MAIN CONTENT 
		-->
    <main class="wrapper-content" aria-label="Main content" id="content">
        <div class="grid-container">
            <div class="grid-x grid-padding-x">
                <!-- 

                <div class="cell main-content-header large-10 medium-10 small-12 u-padding-y"> 
                    <h1 class="c-automatic-page-heading c-page-heading u-heritage-green">Create your personalised prospectus</h1>     		
                </div>
                -->
                <!-- Alternative Page Heading -->
            </div>
        </div> <!-- Banner -->
        <!-- End Banner -->
        <div class="grid-container">
            <div class="grid-x grid-padding-x">
                <!-- Text with Heading -->
                <div class="cell small-12  medium-10 large-10  u-padding-top" id="d.en.121060">
                    <div class="c-wysiwyg-content">
                        <p><strong>Build your bespoke postgraduate prospectus in a few simple steps and start your
                                Masters journey with Stirling today.&nbsp;</strong></p>
                    </div>
                </div>
                <!-- End Text with Heading -->

                <div class="cell small-12    u-padding-y u-margin-top u-bg-grey u-bleed bg-grey">
                    <form id="doStoredPDF"></form>
                    <div id="resultBox"></div>
                </div>

            </div>
        </div>
    </main>

    <!-- iframe id="pdf" style="width: 100%; height: 10%;"></iframe -->

    <script src="../../../../../../../medias/Categorised/Dist/js/app.min.js"></script>

    <script>
        const subjectsData = [{
                "subject": "Accounting, Finance, Banking and Economics",
                "id": 1,
                "courses": [{
                        "name": "MSc Digital Banking and Finance"
                    },
                    {
                        "name": "MSc Finance"
                    },
                    {
                        "name": "MSc Finance and Data Analytics"

                    },
                    {
                        "name": "MSc Finance and Risk Management"

                    },
                    {
                        "name": "MSc International Accounting and Finance"

                    },
                    {
                        "name": "MSc Investment Analysis"

                    }
                ]
            },
            {
                "subject": "Aquaculture",
                "id": 2,
                "courses": [{
                        "name": "MSc Aquatic Pathobiology"
                    },
                    {
                        "name": "MSc Aquatic Veterinary Studies"
                    },
                    {
                        "name": "MSc Sustainable Aquaculture"
                    }
                ]
            },
            {
                "subject": "Business and Management",
                "id": 3,
                "courses": [{
                        "name": "Master of Business Administration (MBA)"
                    },
                    {
                        "name": "MRes Business and Management"
                    },
                    {
                        "name": "MSc Behavioural Science"
                    },
                    {
                        "name": "MSc Business Analytics"
                    },
                    {
                        "name": "MSc Business and Management"
                    },
                    {
                        "name": "MSc Data Science for Business"
                    }, {
                        "name": "MSc Human Resource Management"
                    },
                    {
                        "name": "MSc International Business"
                    },
                    {
                        "name": "MSc Marketing"
                    },
                    {
                        "name": "MSc Marketing Analytics"
                    },
                    {
                        "name": "MSc Marketing and Brand Management"
                    }
                ]
            },
            {
                "subject": "Communications, Media and Culture",
                "id": 4,
                "courses": [{
                        "name": "MLitt / MSc Gender Studies"
                    },
                    {
                        "name": "MRes Media Research"
                    },
                    {
                        "name": "MSc Digital Media and Communication"
                    },
                    {
                        "name": "MSc International Journalism"
                    },
                    {
                        "name": "MSc Media Management"
                    },
                    {
                        "name": "MSc Public Relations and Strategic Communication"
                    },
                    {
                        "name": "MSc Public Relations and Strategic Communication (ONLINE)"
                    },
                    {
                        "name": "MSc Strategic Communication and Public Relations (PFU)"
                    }
                ]
            },
            {
                "subject": "Computing, Data Science and Mathematics",
                "id": 5,
                "courses": [{
                        "name": "MSc Artificial Intelligence"
                    },
                    {
                        "name": "MSc Big Data"
                    },
                    {
                        "name": "MSc Big Data (ONLINE)"
                    },
                    {
                        "name": "MSc Financial Technology"
                    },
                    {
                        "name": "MSc Mathematics and Data Science"
                    }
                ]
            },
            {
                "subject": "Education",
                "id": 6,
                "courses": [{
                        "name": "MRes Educational Research"
                    },
                    {
                        "name": "MSc Education"
                    },
                    {
                        "name": "MSc Educational Leadership (Specialist Qual for Headship)"
                    },
                    {
                        "name": "MSc English Language Teaching and Management"
                    },
                    {
                        "name": "MSc Professional Education and Leadership"
                    },
                    {
                        "name": "MSc Teaching English to Speakers of Other Languages"
                    },
                    {
                        "name": "MSc Teaching English to Speakers of Other Languages (ONLINE)"
                    },
                    {
                        "name": "PG Cert Teaching Qualification in Further Education (In-service)"
                    },
                    {
                        "name": "PG Dip Teaching Qualification in Further Education (Pre-service)"
                    }
                ]
            },
            {
                "subject": "Environmental Sciences",
                "id": 7,
                "courses": [{
                        "name": "MSc Environmental Management"
                    },
                    {
                        "name": "MSc Environmental Remote Sensing and Geospatial Sciences"
                    }
                ]
            },
            {
                "subject": "Health Sciences",
                "id": 8,
                "courses": [{
                        "name": "MPH Public Health (ONLINE)"
                    },
                    {
                        "name": "MRes Health Research (ONLINE)"
                    },
                    {
                        "name": "MSc Advancing Practice"
                    },
                    {
                        "name": "MSc Early Years Practice Health Visiting"
                    }
                ]
            },
            {
                "subject": "History, Heritage and Politics",
                "id": 9,
                "courses": [{
                        "name": "MPP Public Policy"
                    },
                    {
                        "name": "MRes Historical Research"
                    },
                    {
                        "name": "MSc Heritage"
                    },
                    {
                        "name": "MSc Historical Research"
                    },
                    {
                        "name": "MSc International Conflict and Cooperation"
                    }
                ]
            },
            {
                "subject": "Law and Philosophy",
                "id": 10,
                "courses": [{
                        "name": "LLM International Energy and Environmental"
                    },
                    {
                        "name": "MLitt Philosophy"
                    },
                    {
                        "name": "MSc Human Rights and Diplomacy Law"
                    }
                ]
            },
            {
                "subject": "Literature and Languages",
                "id": 11,
                "courses": [{
                        "name": "MLitt Creative Writing"
                    },
                    {
                        "name": "MLitt English Language and Linguistics"
                    },
                    {
                        "name": "MLitt Publishing Studies"
                    },
                    {
                        "name": "MRes Humanities"
                    },
                    {
                        "name": "MRes Publishing Studies"
                    }
                ]
            },
            {
                "subject": "Psychology",
                "id": 12,
                "courses": [{
                        "name": "MSc / MA Human Animal Interaction"
                    },
                    {
                        "name": "MSc Autism Research"
                    },
                    {
                        "name": "MSc Health Psychology"
                    },
                    {
                        "name": "MSc Psychological Research Methods"
                    },
                    {
                        "name": "MSc Psychology (accredited conversion course)"
                    }
                ]
            },
            {
                "subject": "Social Sciences",
                "id": 13,
                "courses": [{
                        "name": "MRes Criminological Research"
                    },
                    {
                        "name": "MSc Applied Professional Studies"
                    },
                    {
                        "name": "MSc Applied Social Research"
                    },
                    {
                        "name": "MSc Criminology"
                    },
                    {
                        "name": "MSc Dementia Studies (ONLINE)"
                    },
                    {
                        "name": "MSc Gerontology and Global Ageing"
                    },
                    {
                        "name": "MSc Housing Studies (part-time)"
                    },
                    {
                        "name": "MSc Housing Studies (with internship)"
                    },
                    {
                        "name": "MSc Social Statistics and Social Research"
                    },
                    {
                        "name": "MSc Social Work Studies"
                    },
                    {
                        "name": "MSc Substance Use (ONLINE)"
                    }
                ]
            },
            {
                "subject": "Sport",
                "id": 14,
                "courses": [{
                        "name": "MSc Psychology of Sport"
                    },
                    {
                        "name": "MSc Sport Management"
                    },
                    {
                        "name": "MSc Sport Nutrition"
                    },
                    {
                        "name": "MSc Sport Performance Coaching (ONLINE)"
                    }
                ]
            }
        ];
    </script>

    <script src="../../../../../../../medias/Categorised/Dist/js/other/_unminified/pg-personalised-prospectus.js"></script>




</body>

</html>