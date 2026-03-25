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

                <div class="cell main-content-header large-10 medium-10 small-12 u-padding-y">
                    <h1 class="c-automatic-page-heading c-page-heading u-heritage-green">Welcome back</h1>
                </div>

                <div class="cell medium-10 large-10">
                    <p><strong>Good to see you again <span id="pgstudent"></span>!</strong></p>
                    <p>In a matter of moments, you'll be able to download your personalised postgraduate prospectus containing just the information you want to read.</p>
                </div>

                <div class="cell small-12 u-padding-bottom ">
                    <form id="doStoredPDF"></form>
                    <div id="resultBox"></div>

                </div>

                <div class="cell u-margin-bottom medium-10 large-10">
                    <p>We've tried to make our prospectus ordering process green, convenient and designed around you, which is how we like to do everything at Stirling, all the time.</p>

                    <p>We look forward to welcoming you on campus soon, but if you've got any questions then please contact us at <a href="mailto:study@stir.ac.uk">study@stir.ac.uk</a>.</p>
                    <p>Best Wishes,<br />
                        The University of Stirling</p>
                </div>
            </div>
        </div>
    </main>

    <!-- iframe id="pdf" style="width: 100%; height: 10%;"></iframe -->

    <script src="../../../../../../../medias/Categorised/Dist/js/app.min.js"></script>

    <script>
        const subjectsData = [{
                "id": 1,
                "subject": "Accounting, Finance, Banking and Economics",
                "qsSubject": "Accounting, Finance, Banking and Economics",
                "courses": [{
                    "newName": "MSc International Accounting and Finance"
                }, {
                    "newName": "MSc Finance and Data Analytics"
                }, {
                    "newName": "MSc Finance"
                }, {
                    "newName": "MSc Digital Banking and Finance"
                }, {
                    "newName": "MSc Investment Analysis"
                }, {
                    "newName": "MSc Behavioural Science"
                }, {
                    "newName": "MSc Finance and Risk Management"
                }]
            },
            {
                "id": 2,
                "subject": "Aquaculture",
                "qsSubject": "Aquaculture",
                "courses": [{
                    "newName": "MSc Aquatic Pathobiology"
                }, {
                    "newName": "MSc Aquatic Veterinary Studies"
                }, {
                    "newName": "MSc Sustainable Aquaculture"
                }]
            },
            {
                "id": 3,
                "subject": "Business, Management, Marketing and Human Resources",
                "qsSubject": "Business and Management",
                "courses": [{
                    "newName": "MSc International Business"
                }, {
                    "newName": "MSc Human Resource Management"
                }, {
                    "newName": "MSc Marketing"
                }, {
                    "newName": "MSc Marketing Analytics"
                }, {
                    "newName": "MSc Digital Marketing and Brand Management"
                }, {
                    "newName": "MSc Behavioural Science"
                }, {
                    "newName": "MSc Business Analytics"
                }, {
                    "newName": "MSc Data Science for Business"
                }, {
                    "newName": "MSc Business and Management"
                }]
            },
            {
                "id": 4,
                "subject": "Marketing, Media, PR and Communications",
                "qsSubject": "Communications, Media and Culture",
                "courses": [{
                    "newName": "MSc Digital Media and Communication"
                }, {
                    "newName": "MSc International Journalism"
                }, {
                    "newName": "MSc Media Management"
                }, {
                    "newName": "MRes Media Research"
                }, {
                    "newName": "MSc Public Relations and Strategic Communication"
                }, {
                    "newName": "MSc Strategic Communication and Public Relations (Joint Degree UPF Barcelona)"
                }, {
                    "newName": "MSc Public Relations and Strategic Communication (Online)"
                }, {
                    "newName": "MSc Marketing"
                }, {
                    "newName": "MSc Marketing Analytics"
                }, {
                    "newName": "MSc Digital Marketing and Brand Management"
                }]
            },
            {
                "id": 5,
                "subject": "Criminology",
                "qsSubject": "Social Sciences",
                "courses": [{
                    "newName": "MSc Criminology"
                }, {
                    "newName": "MSc Criminological Research"
                }]
            },
            {
                "id": 6,
                "subject": "Dementia and Ageing",
                "qsSubject": "Social Sciences",
                "courses": [{
                    "newName": "MSc Dementia Studies (Online)"
                }, {
                    "newName": "PgCert Design for Dementia and Ageing (Online)"
                }, {
                    "newName": "MSc Gerontology and Global Ageing (Online)"
                }]
            },
            {
                "id": 7,
                "subject": "Artificial Intelligence, Big Data, Data Science and Analytics",
                "qsSubject": "Computing, Data Science and Mathematics",
                "courses": [{
                    "newName": "MSc Artificial Intelligence"
                }, {
                    "newName": "MSc Big Data"
                }, {
                    "newName": "MSc Financial Technology (FinTech)"
                }, {
                    "newName": "MSc Mathematics and Data Science"
                }, {
                    "newName": "MSc Advanced Computing with Artificial Intelligence"
                }, {
                    "newName": "MSc Big Data (Online)"
                }, {
                    "newName": "MSc Marketing Analytics"
                }, {
                    "newName": "MSc Finance and Data Analytics"
                }, {
                    "newName": "MSc Data Science for Business"
                }, {
                    "newName": "MSc Business Analytics"
                }]
            },
            {
                "id": 8,
                "subject": "Education",
                "qsSubject": "Education",
                "courses": [{
                    "newName": "MSc Education"
                }, {
                    "newName": "MSc English Language Teaching and Management"
                }, {
                    "newName": "PGDip Tertiary Education with Teaching Qualification (Further Education) - pre-service"
                }, {
                    "newName": "PGCert Tertiary Education with Teaching Qualification (Further Education) - in-service"
                }, {
                    "newName": "MSc Teaching English to Speakers of Other Languages (TESOL)"
                }, {
                    "newName": "MSc Teaching English to Speakers of Other Languages (TESOL) (Online)"
                }, {
                    "newName": "MSc Educational Leadership (Specialist Qualification for Headship)"
                }, {
                    "newName": "MRes Educational Research"
                }, {
                    "newName": "MSc Professional Education and Leadership"
                }, {
                    "newName": "PGDE Secondary Education: Physics with Science"
                }, {
                    "newName": "PGDE Secondary Education: Chemistry with Science"
                }]
            },
            {
                "id": 9,
                "subject": "Environmental Sciences, Law and Sustainability",
                "qsSubject": "Environmental Sciences",
                "courses": [{
                        "newName": "MSc Environmental Management"
                    }, {
                        "newName": "MSc Environmental Remote Sensing and Geospatial Sciences"
                    },
                    {
                        "newName": "MSc Global Environmental Sustainability"
                    },
                    {
                        "newName": "LLM Environmental Law and Climate Justice"
                    }
                ]
            },
            {
                "id": 10,
                "subject": "Health Sciences",
                "qsSubject": "Health Sciences",
                "courses": [{
                    "newName": "MSc Specialist Community Public Health Nurse (Health Visiting)"
                }, {
                    "newName": "MPH Master of Public Health"
                }, {
                    "newName": "MPH Master of Public Health (Online)"
                }, {
                    "newName": "MSc Physiotherapy (pre-registration)"
                }, {
                    "newName": "MSc Podiatry (pre-registration)"
                }, {
                    "newName": "MSc Advancing Practice"
                }, {
                    "newName": "MRes Health Research (Online)"
                }]
            },
            {
                "id": 11,
                "subject": "History and Heritage",
                "qsSubject": "History, Heritage and Politics",
                "courses": [{
                    "newName": "MSc Heritage"
                }, {
                    "newName": "MRes Historical Research"
                }, {
                    "newName": "MSc Historical Research"
                }]
            },
            {
                "id": 12,
                "subject": "Politics and International Relations",
                "qsSubject": "History, Heritage and Politics",
                "courses": [{
                        "newName": "MSc International Conflict and Cooperation"
                    },
                    {
                        "newName": "MSc Global Environmental Sustainability"
                    },
                    {
                        "newName": "MPP Public Policy"
                    }, {
                        "newName": "MSc, LLM Human Rights and Diplomacy"
                    }, {
                        "newName": "MSc Gender and Diplomatic Practice"
                    }, {
                        "newName": "MSc Global Politics"
                    }
                ]
            },
            {
                "id": 13,
                "subject": "Housing Studies",
                "qsSubject": "Social Sciences",
                "courses": [{
                    "newName": "MSc / PG Dip Housing Studies (part-time)"
                }, {
                    "newName": "MSc / PG Dip Housing Studies (with internship)"
                }]
            },
            {
                "id": 14,
                "subject": "Law and Philosophy",
                "qsSubject": "Law and Philosophy",
                "courses": [{
                    "newName": "LLM, MSc Human Rights and Diplomacy"
                }, {
                    "newName": "MLitt Philosophy"
                }, {
                    "newName": "LLM Environmental Law and Climate Justice"
                }]
            },
            {
                "id": 15,
                "subject": "Literature and Languages",
                "qsSubject": "Literature and Languages",
                "courses": [{
                    "newName": "MLitt Creative Writing"
                }, {
                    "newName": "MSc English Language and Linguistics"
                }, {
                    "newName": "MRes Humanities"
                }, {
                    "newName": "MLitt Publishing Studies"
                }, {
                    "newName": "MSc International Journalism"
                }, {
                    "newName": "MRes Publishing Studies"
                }]
            },
            {
                "id": 16,
                "subject": "Psychology",
                "qsSubject": "Psychology",
                "courses": [{
                    "newName": "MSc Autism and Neurodevelopmental Conditions Research"
                }, {
                    "newName": "MSc Health Psychology"
                }, {
                    "newName": "MSc / MA Human Animal Interaction"
                }, {
                    "newName": "MSc Psychological Research Methods"
                }, {
                    "newName": "MSc Psychological Therapy in Primary Care"
                }, {
                    "newName": "MSc Psychology (accredited conversion course)"
                }, {
                    "newName": "MSc Psychology of Sport (Accredited)"
                }, {
                    "newName": "MSc Behavioural Science"
                }]
            },
            {
                "id": 17,
                "subject": "Social Sciences",
                "qsSubject": "Social Sciences",
                "courses": [{
                    "newName": "MSc Applied Social Research"
                }, {
                    "newName": "MSc Social Statistics and Social Research"
                }, {
                    "newName": "MRes Criminological Research"
                }]
            },
            {
                "id": 18,
                "subject": "Social Work",
                "qsSubject": "Social Sciences",
                "courses": [{
                        "newName": "MSc Social Work Studies"
                    },
                    {
                        "newName": "MSc Applied Professional Studies"
                    },
                    {
                        "newName": "MSc Substance Use (Online)"
                    }
                ]
            },
            {
                "id": 19,
                "subject": "Sport",
                "qsSubject": "Sport",
                "courses": [{
                    "newName": "MSc Psychology of Sport (Accredited)"
                }, {
                    "newName": "MSc Physiotherapy (pre-registration)"
                }, {
                    "newName": "MSc Sport Management"
                }, {
                    "newName": "MSc Sport Performance Coaching (Online)"
                }]
            },
            {
                "id": 20,
                "subject": "Gender",
                "qsSubject": "Communications, Media and Culture",
                "courses": [{
                    "newName": "MLitt, MSc Genders and Sexualities"
                }, {
                    "newName": "MSc Gender and Diplomatic Practice"
                }]
            }
        ];
    </script>

    <script src="../../../../../../../medias/Categorised/Dist/js/other/_unminified/pg-personalised-prospectus-2.js"></script>




</body>

</html>