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





    <script src="https://www.google.com/recaptcha/api.js?render=6LeLc_wpAAAAAK9XBEY5HhZcsYEgTTi1wukDL685"></script>




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
        <section class="grid-x c-banner-masthead" id="d.en.120305" aria-label="Banner masthead (120305)">
            <div class="cell large-12">
                <div class="u-object-cover   " data-objectfit="true"><img src="prospectus-landing-page-1920x689.jpg" width="1920" height="689" alt="Airthrey Loch and Wallace Monument." loading="lazy" /> </div>
                <div class="grid-container grid-x u-padding-y u-gap-40">
                    <h1 class="cell large-10 u-callout-text u-m-0 u-font-primary u-heritage-green">Create your personalised prospectus</h1>
                </div>
            </div>
        </section><!-- End Banner -->
        <div class="grid-container">
            <div class="grid-x grid-padding-x">
                <!-- Text with Heading -->
                <div class="cell small-12  medium-10 large-10  " id="d.en.121060">
                    <div class="c-wysiwyg-content">
                        <p><strong>Build your bespoke postgraduate prospectus in a few simple steps and start your
                                Masters journey with Stirling today.&nbsp;</strong></p>
                    </div>
                </div>
                <!-- End Text with Heading -->

                <!-- Text with Heading -->
                <div class="cell small-12  medium-8 large-6  " id="d.en.120320">
                    <div class="c-wysiwyg-content">
                        <p>Complete the short form to customise your prospectus and ensure we only show you the
                            information that matters to you most. You’ll receive a download link straight to your inbox
                            within moments.</p>
                        <p>By choosing digital, you’re also doing your bit for the planet. As part of Stirling’s
                            commitment to sustainability, your personalised digital prospectus saves on paper and
                            delivery – helping to reduce our carbon footprint.</p>
                        <p>You’re about to make a very exciting and important decision about where you choose to study –
                            and, with more than 90 taught and online Masters courses to choose from, we’re confident
                            Stirling is the right university for you.</p>
                    </div>
                </div>
                <!-- End Text with Heading -->

                <div class="cell small-12    u-padding-y u-margin-top u-bg-grey u-bleed bg-grey">
                    <form id="generatePDFForm">

                        <div id="formErrors"></div>

                        <h2>Your details </h2>

                        <div>
                            <label class="block" for="first_name">
                                First name
                                <span class="u-heritage-berry " data-alertlabel="first_name">*</span>
                            </label>

                            <input id="first_name" type="text" name="first_name" data-required>
                        </div>

                        <div>
                            <label class="block" for="last_name">
                                Last name
                                <span class="u-heritage-berry " data-alertlabel="last_name">*</span>
                            </label>

                            <input id="last_name" type="text" name="last_name" data-required>
                        </div>

                        <div>
                            <label class="block" for="email">
                                Email
                                <span class="u-heritage-berry " data-alertlabel="email">*</span>
                            </label>

                            <input id="email" type="text" name="email" data-required>
                        </div>


                        <div>
                            <label class="block" for="telephone">
                                Telephone
                            </label>

                            <input id="telephone" type="text" name="telephone">
                        </div>


                        <div>
                            <label class="block" for="country_of_origin">
                                Country of origin
                                <span class="u-heritage-berry " data-alertlabel="country_of_origin">*</span>
                            </label>

                            <select id="country_of_origin" name="country_of_origin" data-required>
                                <option value="">Select an option</option>
                                <option value="AFG">Afghanistan</option>
                                <option value="ALA">Aland Islands</option>
                                <option value="ALB">Albania</option>
                                <option value="DZA">Algeria</option>
                                <option value="ASM">American Samoa</option>
                                <option value="AND">Andorra</option>
                                <option value="AGO">Angola</option>
                                <option value="AIA">Anguilla</option>
                                <option value="ATA">Antarctica</option>
                                <option value="ATG">Antigua and Barbuda</option>
                                <option value="ARG">Argentina</option>
                                <option value="ARM">Armenia</option>
                                <option value="ABW">Aruba</option>
                                <option value="AUS">Australia</option>
                                <option value="AUT">Austria</option>
                                <option value="AZE">Azerbaijan</option>
                                <option value="BHS">Bahamas</option>
                                <option value="BHR">Bahrain</option>
                                <option value="BGD">Bangladesh</option>
                                <option value="BRB">Barbados</option>
                                <option value="BLR">Belarus</option>
                                <option value="BEL">Belgium</option>
                                <option value="BLZ">Belize</option>
                                <option value="BEN">Benin</option>
                                <option value="BMU">Bermuda</option>
                                <option value="BTN">Bhutan</option>
                                <option value="BOL">Bolivia</option>
                                <option value="BES">Bonaire</option>
                                <option value="BIH">Bosnia and Herzegovina</option>
                                <option value="BWA">Botswana</option>
                                <option value="BVT">Bouvet Island</option>
                                <option value="BRA">Brazil</option>
                                <option value="IOT">British Indian Ocean Territory</option>
                                <option value="BRN">Brunei Darussalam</option>
                                <option value="BGR">Bulgaria</option>
                                <option value="BFA">Burkina Faso</option>
                                <option value="BDI">Burundi</option>
                                <option value="KHM">Cambodia</option>
                                <option value="CMR">Cameroon</option>
                                <option value="CAN">Canada</option>
                                <option value="CPV">Cape Verde</option>
                                <option value="CYM">Cayman Islands</option>
                                <option value="CAF">Central African Republic</option>
                                <option value="TCD">Chad</option>
                                <option value="Channel Islands">Channel Islands</option>
                                <option value="CHL">Chile</option>
                                <option value="CHN">China</option>
                                <option value="CXR">Christmas Island</option>
                                <option value="CCK">Cocos (Keeling) Islands</option>
                                <option value="COL">Colombia</option>
                                <option value="COM">Comoros</option>
                                <option value="COG">Congo</option>
                                <option value="COD">Congo, the Democratic Republic of the</option>
                                <option value="COK">Cook Islands</option>
                                <option value="CRI">Costa Rica</option>
                                <option value="HRV">Croatia</option>
                                <option value="CUB">Cuba</option>
                                <option value="CUW">Curacao</option>
                                <option value="CYP">Cyprus</option>
                                <option value="CZE">Czech Republic</option>
                                <option value="DNK">Denmark</option>
                                <option value="DJI">Djibouti</option>
                                <option value="DMA">Dominica</option>
                                <option value="DOM">Dominican Republic</option>
                                <option value="ECU">Ecuador</option>
                                <option value="EGY">Egypt</option>
                                <option value="SLV">El Salvador</option>
                                <option value="England">England</option>
                                <option value="GNQ">Equatorial Guinea</option>
                                <option value="ERI">Eritrea</option>
                                <option value="EST">Estonia</option>
                                <option value="ETH">Ethiopia</option>
                                <option value="FLK">Falkland Islands (Malvinas)</option>
                                <option value="FRO">Faroe Islands</option>
                                <option value="FJI">Fiji</option>
                                <option value="FIN">Finland</option>
                                <option value="FRA">France</option>
                                <option value="GUF">French Guiana</option>
                                <option value="PYF">French Polynesia</option>
                                <option value="ATF">French Southern Territories</option>
                                <option value="GAB">Gabon</option>
                                <option value="GMB">Gambia</option>
                                <option value="GEO">Georgia</option>
                                <option value="DEU">Germany</option>
                                <option value="GHA">Ghana</option>
                                <option value="GIB">Gibraltar</option>
                                <option value="GRC">Greece</option>
                                <option value="GRL">Greenland</option>
                                <option value="GRD">Grenada</option>
                                <option value="GLP">Guadeloupe</option>
                                <option value="GUM">Guam</option>
                                <option value="GTM">Guatemala</option>
                                <option value="GGY">Guernsey</option>
                                <option value="GIN">Guinea</option>
                                <option value="GNB">Guinea-Bissau</option>
                                <option value="GUY">Guyana</option>
                                <option value="HTI">Haiti</option>
                                <option value="HMD">Heard Island and McDonald Islands</option>
                                <option value="VAT">Holy See (Vatican City State)</option>
                                <option value="HND">Honduras</option>
                                <option value="HKG">Hong Kong</option>
                                <option value="HUN">Hungary</option>
                                <option value="ISL">Iceland</option>
                                <option value="IND">India</option>
                                <option value="IDN">Indonesia</option>
                                <option value="IRN">Iran, Islamic Republic of</option>
                                <option value="IRQ">Iraq</option>
                                <option value="IRL">Ireland</option>
                                <option value="IMN">Isle of Man</option>
                                <option value="ISR">Israel</option>
                                <option value="ITA">Italy</option>
                                <option value="CIV">Ivory Coast</option>
                                <option value="JAM">Jamaica</option>
                                <option value="JPN">Japan</option>
                                <option value="JEY">Jersey</option>
                                <option value="JOR">Jordan</option>
                                <option value="KAZ">Kazakhstan</option>
                                <option value="KEN">Kenya</option>
                                <option value="KIR">Kiribati</option>
                                <option value="PRK">Korea (North)</option>
                                <option value="KOR">Korea (South)</option>
                                <option value="XK">Kosovo</option>
                                <option value="KWT">Kuwait</option>
                                <option value="KGZ">Kyrgyzstan</option>
                                <option value="LAO">Lao People's Democratic Republic</option>
                                <option value="LVA">Latvia</option>
                                <option value="LBN">Lebanon</option>
                                <option value="LSO">Lesotho</option>
                                <option value="LBR">Liberia</option>
                                <option value="LBY">Libya</option>
                                <option value="LIE">Liechtenstein</option>
                                <option value="LTU">Lithuania</option>
                                <option value="LUX">Luxembourg</option>
                                <option value="MAC">Macao</option>
                                <option value="MDG">Madagascar</option>
                                <option value="MWI">Malawi</option>
                                <option value="MYS">Malaysia</option>
                                <option value="MDV">Maldives</option>
                                <option value="MLI">Mali</option>
                                <option value="MLT">Malta</option>
                                <option value="MHL">Marshall Islands</option>
                                <option value="MTQ">Martinique</option>
                                <option value="MRT">Mauritania</option>
                                <option value="MUS">Mauritius</option>
                                <option value="MYT">Mayotte</option>
                                <option value="MEX">Mexico</option>
                                <option value="FSM">Micronesia, Federated States of</option>
                                <option value="MDA">Moldova</option>
                                <option value="MCO">Monaco</option>
                                <option value="MNG">Mongolia</option>
                                <option value="MNE">Montenegro</option>
                                <option value="MSR">Montserrat</option>
                                <option value="MAR">Morocco</option>
                                <option value="MOZ">Mozambique</option>
                                <option value="MMR">Myanmar</option>
                                <option value="NAM">Namibia</option>
                                <option value="NRU">Nauru</option>
                                <option value="NPL">Nepal</option>
                                <option value="NLD">Netherlands</option>
                                <option value="AN">Netherlands Antilles</option>
                                <option value="NCL">New Caledonia</option>
                                <option value="NZL">New Zealand</option>
                                <option value="NIC">Nicaragua</option>
                                <option value="NER">Niger</option>
                                <option value="NGA">Nigeria</option>
                                <option value="NIU">Niue</option>
                                <option value="NFK">Norfolk Island</option>
                                <option value="MKD">North Macedonia</option>
                                <option value="Northern Ireland">Northern Ireland</option>
                                <option value="MNP">Northern Mariana Islands</option>
                                <option value="NOR">Norway</option>
                                <option value="Not Provided by University">Not Provided by University</option>
                                <option value="OMN">Oman</option>
                                <option value="PAK">Pakistan</option>
                                <option value="PLW">Palau</option>
                                <option value="PSE">Palestine</option>
                                <option value="PAN">Panama</option>
                                <option value="PNG">Papua New Guinea</option>
                                <option value="PRY">Paraguay</option>
                                <option value="PER">Peru</option>
                                <option value="PHL">Philippines</option>
                                <option value="PCN">Pitcairn</option>
                                <option value="POL">Poland</option>
                                <option value="PRT">Portugal</option>
                                <option value="PRI">Puerto Rico</option>
                                <option value="QAT">Qatar</option>
                                <option value="REU">Reunion</option>
                                <option value="ROU">Romania</option>
                                <option value="RUS">Russia</option>
                                <option value="RWA">Rwanda</option>
                                <option value="BLM">Saint Barthelemy</option>
                                <option value="SHN">Saint Helena, Ascension and Tristan da Cunha</option>
                                <option value="KNA">Saint Kitts and Nevis</option>
                                <option value="LCA">Saint Lucia</option>
                                <option value="MAF">Saint Martin (French part)</option>
                                <option value="SPM">Saint Pierre and Miquelon</option>
                                <option value="VCT">Saint Vincent and the Grenadines</option>
                                <option value="WSM">Samoa</option>
                                <option value="SMR">San Marino</option>
                                <option value="STP">Sao Tome and Principe</option>
                                <option value="SAU">Saudi Arabia</option>
                                <option value="Scotland">Scotland</option>
                                <option value="SEN">Senegal</option>
                                <option value="SRB">Serbia</option>
                                <option value="SYC">Seychelles</option>
                                <option value="SLE">Sierra Leone</option>
                                <option value="SGP">Singapore</option>
                                <option value="SXM">Sint Maarten (Dutch part)</option>
                                <option value="SVK">Slovakia</option>
                                <option value="SVN">Slovenia</option>
                                <option value="SLB">Solomon Islands</option>
                                <option value="SOM">Somalia</option>
                                <option value="ZAF">South Africa</option>
                                <option value="SGS">South Georgia and the South Sandwich Islands</option>
                                <option value="SSD">South Sudan</option>
                                <option value="ESP">Spain</option>
                                <option value="LKA">Sri Lanka</option>
                                <option value="SDN">Sudan</option>
                                <option value="SUR">Suriname</option>
                                <option value="SJM">Svalbard and Jan Mayen</option>
                                <option value="SWZ">Swaziland</option>
                                <option value="SWE">Sweden</option>
                                <option value="CHE">Switzerland</option>
                                <option value="SYR">Syrian Arab Republic</option>
                                <option value="TWN">Taiwan</option>
                                <option value="TJK">Tajikistan</option>
                                <option value="TZA">Tanzania</option>
                                <option value="THA">Thailand</option>
                                <option value="TLS">Timor-Leste</option>
                                <option value="TGO">Togo</option>
                                <option value="TKL">Tokelau</option>
                                <option value="TON">Tonga</option>
                                <option value="TTO">Trinidad and Tobago</option>
                                <option value="TUN">Tunisia</option>
                                <option value="TUR">Turkey</option>
                                <option value="TKM">Turkmenistan</option>
                                <option value="TCA">Turks and Caicos Islands</option>
                                <option value="TUV">Tuvalu</option>
                                <option value="UGA">Uganda</option>
                                <option value="UKR">Ukraine</option>
                                <option value="ARE">United Arab Emirates</option>
                                <option value="GBR">United Kingdom</option>
                                <option value="USA">United States</option>
                                <option value="UMI">United States Minor Outlying Islands</option>
                                <option value="URY">Uruguay</option>
                                <option value="UZB">Uzbekistan</option>
                                <option value="VUT">Vanuatu</option>
                                <option value="VEN">Venezuela, Bolivarian Republic of</option>
                                <option value="VNM">Vietnam</option>
                                <option value="VGB">Virgin Islands, British</option>
                                <option value="VIR">Virgin Islands, U.S.</option>
                                <option value="Wales">Wales</option>
                                <option value="WLF">Wallis and Futuna</option>
                                <option value="ESH">Western Sahara</option>
                                <option value="YEM">Yemen</option>
                                <option value="ZMB">Zambia</option>
                                <option value="ZWE">Zimbabwe</option>
                            </select>

                        </div>

                        <div>
                            <label class="block" for="country_of_residence">
                                Country of residence
                                <span class="u-heritage-berry " data-alertlabel="country_of_residence">*</span>
                            </label>

                            <select id="country_of_residence" name="country_of_residence" data-required>
                                <option value="">Select an option</option>
                                <option value="AFG">Afghanistan</option>
                                <option value="ALA">Aland Islands</option>
                                <option value="ALB">Albania</option>
                                <option value="DZA">Algeria</option>
                                <option value="ASM">American Samoa</option>
                                <option value="AND">Andorra</option>
                                <option value="AGO">Angola</option>
                                <option value="AIA">Anguilla</option>
                                <option value="ATA">Antarctica</option>
                                <option value="ATG">Antigua and Barbuda</option>
                                <option value="ARG">Argentina</option>
                                <option value="ARM">Armenia</option>
                                <option value="ABW">Aruba</option>
                                <option value="AUS">Australia</option>
                                <option value="AUT">Austria</option>
                                <option value="AZE">Azerbaijan</option>
                                <option value="BHS">Bahamas</option>
                                <option value="BHR">Bahrain</option>
                                <option value="BGD">Bangladesh</option>
                                <option value="BRB">Barbados</option>
                                <option value="BLR">Belarus</option>
                                <option value="BEL">Belgium</option>
                                <option value="BLZ">Belize</option>
                                <option value="BEN">Benin</option>
                                <option value="BMU">Bermuda</option>
                                <option value="BTN">Bhutan</option>
                                <option value="BOL">Bolivia</option>
                                <option value="BES">Bonaire</option>
                                <option value="BIH">Bosnia and Herzegovina</option>
                                <option value="BWA">Botswana</option>
                                <option value="BVT">Bouvet Island</option>
                                <option value="BRA">Brazil</option>
                                <option value="IOT">British Indian Ocean Territory</option>
                                <option value="BRN">Brunei Darussalam</option>
                                <option value="BGR">Bulgaria</option>
                                <option value="BFA">Burkina Faso</option>
                                <option value="BDI">Burundi</option>
                                <option value="KHM">Cambodia</option>
                                <option value="CMR">Cameroon</option>
                                <option value="CAN">Canada</option>
                                <option value="CPV">Cape Verde</option>
                                <option value="CYM">Cayman Islands</option>
                                <option value="CAF">Central African Republic</option>
                                <option value="TCD">Chad</option>
                                <option value="Channel Islands">Channel Islands</option>
                                <option value="CHL">Chile</option>
                                <option value="CHN">China</option>
                                <option value="CXR">Christmas Island</option>
                                <option value="CCK">Cocos (Keeling) Islands</option>
                                <option value="COL">Colombia</option>
                                <option value="COM">Comoros</option>
                                <option value="COG">Congo</option>
                                <option value="COD">Congo, the Democratic Republic of the</option>
                                <option value="COK">Cook Islands</option>
                                <option value="CRI">Costa Rica</option>
                                <option value="HRV">Croatia</option>
                                <option value="CUB">Cuba</option>
                                <option value="CUW">Curacao</option>
                                <option value="CYP">Cyprus</option>
                                <option value="CZE">Czech Republic</option>
                                <option value="DNK">Denmark</option>
                                <option value="DJI">Djibouti</option>
                                <option value="DMA">Dominica</option>
                                <option value="DOM">Dominican Republic</option>
                                <option value="ECU">Ecuador</option>
                                <option value="EGY">Egypt</option>
                                <option value="SLV">El Salvador</option>
                                <option value="England">England</option>
                                <option value="GNQ">Equatorial Guinea</option>
                                <option value="ERI">Eritrea</option>
                                <option value="EST">Estonia</option>
                                <option value="ETH">Ethiopia</option>
                                <option value="FLK">Falkland Islands (Malvinas)</option>
                                <option value="FRO">Faroe Islands</option>
                                <option value="FJI">Fiji</option>
                                <option value="FIN">Finland</option>
                                <option value="FRA">France</option>
                                <option value="GUF">French Guiana</option>
                                <option value="PYF">French Polynesia</option>
                                <option value="ATF">French Southern Territories</option>
                                <option value="GAB">Gabon</option>
                                <option value="GMB">Gambia</option>
                                <option value="GEO">Georgia</option>
                                <option value="DEU">Germany</option>
                                <option value="GHA">Ghana</option>
                                <option value="GIB">Gibraltar</option>
                                <option value="GRC">Greece</option>
                                <option value="GRL">Greenland</option>
                                <option value="GRD">Grenada</option>
                                <option value="GLP">Guadeloupe</option>
                                <option value="GUM">Guam</option>
                                <option value="GTM">Guatemala</option>
                                <option value="GGY">Guernsey</option>
                                <option value="GIN">Guinea</option>
                                <option value="GNB">Guinea-Bissau</option>
                                <option value="GUY">Guyana</option>
                                <option value="HTI">Haiti</option>
                                <option value="HMD">Heard Island and McDonald Islands</option>
                                <option value="VAT">Holy See (Vatican City State)</option>
                                <option value="HND">Honduras</option>
                                <option value="HKG">Hong Kong</option>
                                <option value="HUN">Hungary</option>
                                <option value="ISL">Iceland</option>
                                <option value="IND">India</option>
                                <option value="IDN">Indonesia</option>
                                <option value="IRN">Iran, Islamic Republic of</option>
                                <option value="IRQ">Iraq</option>
                                <option value="IRL">Ireland</option>
                                <option value="IMN">Isle of Man</option>
                                <option value="ISR">Israel</option>
                                <option value="ITA">Italy</option>
                                <option value="CIV">Ivory Coast</option>
                                <option value="JAM">Jamaica</option>
                                <option value="JPN">Japan</option>
                                <option value="JEY">Jersey</option>
                                <option value="JOR">Jordan</option>
                                <option value="KAZ">Kazakhstan</option>
                                <option value="KEN">Kenya</option>
                                <option value="KIR">Kiribati</option>
                                <option value="PRK">Korea (North)</option>
                                <option value="KOR">Korea (South)</option>
                                <option value="XK">Kosovo</option>
                                <option value="KWT">Kuwait</option>
                                <option value="KGZ">Kyrgyzstan</option>
                                <option value="LAO">Lao People's Democratic Republic</option>
                                <option value="LVA">Latvia</option>
                                <option value="LBN">Lebanon</option>
                                <option value="LSO">Lesotho</option>
                                <option value="LBR">Liberia</option>
                                <option value="LBY">Libya</option>
                                <option value="LIE">Liechtenstein</option>
                                <option value="LTU">Lithuania</option>
                                <option value="LUX">Luxembourg</option>
                                <option value="MAC">Macao</option>
                                <option value="MDG">Madagascar</option>
                                <option value="MWI">Malawi</option>
                                <option value="MYS">Malaysia</option>
                                <option value="MDV">Maldives</option>
                                <option value="MLI">Mali</option>
                                <option value="MLT">Malta</option>
                                <option value="MHL">Marshall Islands</option>
                                <option value="MTQ">Martinique</option>
                                <option value="MRT">Mauritania</option>
                                <option value="MUS">Mauritius</option>
                                <option value="MYT">Mayotte</option>
                                <option value="MEX">Mexico</option>
                                <option value="FSM">Micronesia, Federated States of</option>
                                <option value="MDA">Moldova</option>
                                <option value="MCO">Monaco</option>
                                <option value="MNG">Mongolia</option>
                                <option value="MNE">Montenegro</option>
                                <option value="MSR">Montserrat</option>
                                <option value="MAR">Morocco</option>
                                <option value="MOZ">Mozambique</option>
                                <option value="MMR">Myanmar</option>
                                <option value="NAM">Namibia</option>
                                <option value="NRU">Nauru</option>
                                <option value="NPL">Nepal</option>
                                <option value="NLD">Netherlands</option>
                                <option value="AN">Netherlands Antilles</option>
                                <option value="NCL">New Caledonia</option>
                                <option value="NZL">New Zealand</option>
                                <option value="NIC">Nicaragua</option>
                                <option value="NER">Niger</option>
                                <option value="NGA">Nigeria</option>
                                <option value="NIU">Niue</option>
                                <option value="NFK">Norfolk Island</option>
                                <option value="MKD">North Macedonia</option>
                                <option value="Northern Ireland">Northern Ireland</option>
                                <option value="MNP">Northern Mariana Islands</option>
                                <option value="NOR">Norway</option>
                                <option value="Not Provided by University">Not Provided by University</option>
                                <option value="OMN">Oman</option>
                                <option value="PAK">Pakistan</option>
                                <option value="PLW">Palau</option>
                                <option value="PSE">Palestine</option>
                                <option value="PAN">Panama</option>
                                <option value="PNG">Papua New Guinea</option>
                                <option value="PRY">Paraguay</option>
                                <option value="PER">Peru</option>
                                <option value="PHL">Philippines</option>
                                <option value="PCN">Pitcairn</option>
                                <option value="POL">Poland</option>
                                <option value="PRT">Portugal</option>
                                <option value="PRI">Puerto Rico</option>
                                <option value="QAT">Qatar</option>
                                <option value="REU">Reunion</option>
                                <option value="ROU">Romania</option>
                                <option value="RUS">Russia</option>
                                <option value="RWA">Rwanda</option>
                                <option value="BLM">Saint Barthelemy</option>
                                <option value="SHN">Saint Helena, Ascension and Tristan da Cunha</option>
                                <option value="KNA">Saint Kitts and Nevis</option>
                                <option value="LCA">Saint Lucia</option>
                                <option value="MAF">Saint Martin (French part)</option>
                                <option value="SPM">Saint Pierre and Miquelon</option>
                                <option value="VCT">Saint Vincent and the Grenadines</option>
                                <option value="WSM">Samoa</option>
                                <option value="SMR">San Marino</option>
                                <option value="STP">Sao Tome and Principe</option>
                                <option value="SAU">Saudi Arabia</option>
                                <option value="Scotland">Scotland</option>
                                <option value="SEN">Senegal</option>
                                <option value="SRB">Serbia</option>
                                <option value="SYC">Seychelles</option>
                                <option value="SLE">Sierra Leone</option>
                                <option value="SGP">Singapore</option>
                                <option value="SXM">Sint Maarten (Dutch part)</option>
                                <option value="SVK">Slovakia</option>
                                <option value="SVN">Slovenia</option>
                                <option value="SLB">Solomon Islands</option>
                                <option value="SOM">Somalia</option>
                                <option value="ZAF">South Africa</option>
                                <option value="SGS">South Georgia and the South Sandwich Islands</option>
                                <option value="SSD">South Sudan</option>
                                <option value="ESP">Spain</option>
                                <option value="LKA">Sri Lanka</option>
                                <option value="SDN">Sudan</option>
                                <option value="SUR">Suriname</option>
                                <option value="SJM">Svalbard and Jan Mayen</option>
                                <option value="SWZ">Swaziland</option>
                                <option value="SWE">Sweden</option>
                                <option value="CHE">Switzerland</option>
                                <option value="SYR">Syrian Arab Republic</option>
                                <option value="TWN">Taiwan</option>
                                <option value="TJK">Tajikistan</option>
                                <option value="TZA">Tanzania</option>
                                <option value="THA">Thailand</option>
                                <option value="TLS">Timor-Leste</option>
                                <option value="TGO">Togo</option>
                                <option value="TKL">Tokelau</option>
                                <option value="TON">Tonga</option>
                                <option value="TTO">Trinidad and Tobago</option>
                                <option value="TUN">Tunisia</option>
                                <option value="TUR">Turkey</option>
                                <option value="TKM">Turkmenistan</option>
                                <option value="TCA">Turks and Caicos Islands</option>
                                <option value="TUV">Tuvalu</option>
                                <option value="UGA">Uganda</option>
                                <option value="UKR">Ukraine</option>
                                <option value="ARE">United Arab Emirates</option>
                                <option value="GBR">United Kingdom</option>
                                <option value="USA">United States</option>
                                <option value="UMI">United States Minor Outlying Islands</option>
                                <option value="URY">Uruguay</option>
                                <option value="UZB">Uzbekistan</option>
                                <option value="VUT">Vanuatu</option>
                                <option value="VEN">Venezuela, Bolivarian Republic of</option>
                                <option value="VNM">Vietnam</option>
                                <option value="VGB">Virgin Islands, British</option>
                                <option value="VIR">Virgin Islands, U.S.</option>
                                <option value="Wales">Wales</option>
                                <option value="WLF">Wallis and Futuna</option>
                                <option value="ESH">Western Sahara</option>
                                <option value="YEM">Yemen</option>
                                <option value="ZMB">Zambia</option>
                                <option value="ZWE">Zimbabwe</option>
                            </select>

                        </div>


                        <h2 class="u-mt-2">
                            Personalise your prospectus
                        </h2>

                        <p>First select a start date then choose up to three subject areas you are
                            interested in:</p>
                        <div>
                            <div>
                                <label class="block" for="study_year">
                                    When will you begin your studies?
                                    <span class="u-heritage-berry " data-alertlabel="study_year">*</span>
                                </label>

                                <select id="study_year" name="study_year" data-required>
                                    <option value="">Select an option</option>
                                    <option value="jan-24">Jan-24</option>
                                    <option value="may-24">May-24</option>
                                    <option value="sep-24">Sep-24</option>
                                    <option value="jan-25">Jan-25</option>
                                    <option value="may-25">May-25</option>
                                    <option value="sep-25">Sep-25</option>
                                    <option value="jan-26">Jan-26</option>
                                    <option value="sep-26">Sep-26</option>
                                    <option value="jan-27">Jan-27</option>
                                    <option value="sep-27">Sep-27</option>
                                    <option value="jan-28">Jan-28</option>
                                    <option value="sep-28">Sep-28</option>
                                </select>

                            </div>

                            <div>
                                <div class="subject_area_1">
                                    <label for="subject_area_1">Subject area 1 <span class="u-heritage-berry " data-alertlabel="subject_area_1">*</span></label>
                                    <select id="subject_area_1" name="subject_area_1" required="true" class="subjectSelect">
                                        <option value="">Select an option</option>
                                    </select>
                                    <div id="subject_area_1_courses" class="u-columns-2 u-mx-1"></div>
                                </div>


                                <div class="subject_area_2">
                                    <div>
                                        <label for="subject_area_2">Subject area 2</label>
                                        <select id="subject_area_2" name="subject_area_2" class="subjectSelect">
                                            <option value="">Select an option</option>
                                        </select>
                                    </div>
                                    <div id="subject_area_2_courses" class="u-columns-2  u-mx-1"></div>
                                </div>

                                <div class="subject_area_3">
                                    <div>
                                        <label for="subject_area_3">Subject area 3</label>
                                        <select id="subject_area_3" name="subject_area_3" class="subjectSelect">
                                            <option value="">Select an option</option>
                                        </select>
                                    </div>
                                    <div id="subject_area_3_courses" class="u-columns-2  u-mx-1"></div>
                                </div>

                            </div>



                            <p class="u-mt-2">Not sure what you want to study?</p>

                            <div>
                                <label for="full_prospectus" class="flex items-center text-sm">
                                    <input id="full_prospectus" type="checkbox" name="full_prospectus" value="1">
                                    <span>Check this box to receive the full, non-personalised
                                        prospectus</span>
                                </label>

                            </div>

                            <p class="u-mt-2">
                                You're almost done...
                                Now tell us about any other areas you're interested in:
                            </p>

                            <div>
                                <div>
                                    <label for="area_interest_research" class="flex items-center">
                                        <input id="area_interest_research" type="checkbox" name="area_interest_research" value="research">
                                        <span class="ml-2">Research</span>
                                    </label>

                                </div>

                                <div>
                                    <label for="area_interest_international_students" class="flex items-center">
                                        <input id="area_interest_international_students" type="checkbox" name="area_interest_international_students" value="international_students">
                                        <span>International Students</span>
                                    </label>

                                </div>

                                <div>
                                    <label for="area_interest_accommodation" class="flex items-center">
                                        <input id="area_interest_accommodation" type="checkbox" name="area_interest_accommodation" value="accommodation">
                                        <span>Accommodation</span>
                                    </label>

                                </div>

                                <div>
                                    <label for="area_interest_students_union" class="flex items-center">
                                        <input id="area_interest_students_union" type="checkbox" name="area_interest_students_union" value="students_union">
                                        <span class="ml-2">Students' Union</span>
                                    </label>

                                </div>

                                <div>
                                    <label for="area_interest_sport" class="flex items-center">
                                        <input id="area_interest_sport" type="checkbox" name="area_interest_sport" value="sport">
                                        <span class="ml-2">Sport</span>
                                    </label>

                                </div>
                            </div>
                        </div>


                        <h2 class="u-mt-2">
                            Please confirm
                        </h2>

                        <div>
                            <p class="text-sm text-gray-700">
                                The personal information you provide above will be used to build your
                                personalised digital postgraduate prospectus. We'll only contact you about the
                                prospectus itself unless you select to receive more information.
                                <br><br>
                                The University uses a third party (Sterling Solutions) to produce your
                                personalised postgraduate prospectus, for more information on how the University
                                and Sterling Solutions use your personal data, please read our respective
                                privacy policies (<a href="https://www.stir.ac.uk/about/professional-services/student-academic-and-corporate-services/policy-and-planning/legal-compliance/data-protectiongdpr/privacy-notices/?sl=privacy" target="_blank" class="underline">University of Stirling privacy policy</a>
                                and <a href="https://www.sterlingsolutions.co.uk/privacy-policy/" target="_blank" class="underline">Sterling Solutions Privacy Policy</a>).
                            </p>

                            <div>
                                <label class="block text-sm">
                                    <input type="checkbox" name="data_agreement" value="1" class="" data-required>
                                    Please confirm that you agree to your information being used in this way.
                                    <span class="u-heritage-berry " data-alertlabel="data_agreement">*</span>
                                </label>

                            </div>

                            <h2 class="u-mt-2">
                                Keep in touch
                            </h2>

                            <p>
                                <label class="block" for="wed_love_to_keep_in_touch">
                                    We'd love to keep in touch by sending you useful information about the
                                    University and our courses
                                </label>

                                <select id="wed_love_to_keep_in_touch" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" name="wed_love_to_keep_in_touch_by_sending_you_useful_information_about_the_university_and_our_courses" wire:model.defer="data.wed_love_to_keep_in_touch_by_sending_you_useful_information_about_the_university_and_our_courses">
                                    <option value="">Select an option</option>
                                    <option value="true">Yes, keep me up to date with everything I need to know
                                        about Stirling</option>
                                    <option value="false">No, thank you</option>
                                </select>
                            </p>

                            <p class="text-sm text-gray-700">
                                By submitting you are agreeing to the <a href="https://www.stir.ac.uk/about/policy-legal-and-cookies" target="_blank" class="underline">University's terms of use and privacy statement</a>.
                            </p>

                            <p class="text-sm text-gray-700">We'd love to keep in touch by sending you useful
                                information about the University and our courses. I would like to be contacted
                                by:</p>

                            <div>
                                <label class="block" for="opt_in_for_email">
                                    Opt in for email
                                </label>

                                <select id="opt_in_for_email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" name="opt_in_for_email" wire:model.defer="data.opt_in_for_email">
                                    <option value="">Select an option</option>
                                    <option value="true">Yes please</option>
                                    <option value="false">No thanks</option>
                                </select>

                            </div>

                            <div>
                                <label class="block" for="opt_in_for_phone">
                                    Opt in for phone
                                </label>

                                <select id="opt_in_for_phone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" name="opt_in_for_phone" wire:model.defer="data.opt_in_for_phone">
                                    <option value="">Select an option</option>
                                    <option value="true">Yes please</option>
                                    <option value="false">No thanks</option>
                                </select>

                            </div>

                            <div>
                                <label class="block" for="opt_in_for_sms">
                                    Opt in for sms
                                </label>

                                <select id="opt_in_for_sms" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" name="opt_in_for_sms" wire:model.defer="data.opt_in_for_sms">
                                    <option value="">Select an option</option>
                                    <option value="true">Yes please</option>
                                    <option value="false">No thanks</option>
                                </select>

                            </div>

                            <div>
                                <label class="block" for="social_media_advertising_or_digital_advertising">
                                    Social media advertising or digital advertising
                                </label>

                                <select id="social_media_advertising_or_digital_advertising" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" name="social_media_advertising_or_digital_advertising" wire:model.defer="data.social_media_advertising_or_digital_advertising">
                                    <option value="">Select an option</option>
                                    <option value="true">Yes please</option>
                                    <option value="false">No thanks</option>
                                </select>

                            </div>


                            <p class="text-sm text-gray-700">
                                You can unsubscribe at any time by emailing: <a href="mailto:study.stirling@stir.ac.uk" class="underline">study.stirling@stir.ac.uk</a>
                            </p>

                            <div class="g-recaptcha" data-sitekey="6LeLc_wpAAAAAK9XBEY5HhZcsYEgTTi1wukDL685" data-callback="onSubmit" data-size="invisible">
                            </div>

                            <div class="u-mt-2"><button id="generatePDFBtn" class="button ">Generate</button></div>

                    </form>

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
                "id": 432,
                "courses": [{
                        "name": "MSc Digital Banking and Finance",
                        "value": "Digital Banking and Finance (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Finance",
                        "value": "Finance (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Finance and Data Analytics",
                        "value": "Finance and Data Analytics (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Finance and Risk Management",
                        "value": "Finance and Risk Management (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc International Accounting and Finance",
                        "value": "International Accounting and Finance (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Investment Analysis",
                        "value": "Investment Analysis (PG)",
                        "id": ""
                    }
                ]
            },
            {
                "subject": "Aquaculture",
                "id": 433,
                "courses": [{
                        "name": "MSc Aquatic Pathobiology",
                        "value": "Aquatic Pathobiology (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Aquatic Veterinary Studies",
                        "value": "Aquatic Veterinary Studies (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Sustainable Aquaculture",
                        "value": "Sustainable Aquaculture (PG)",
                        "id": ""
                    }
                ]
            },
            {
                "subject": "Business and Management",
                "id": 434,
                "courses": [{
                        "name": "Master of Business Administration (MBA)",
                        "value": "Master of Business Administration (MBA)",
                        "id": ""
                    },
                    {
                        "name": "MRes Business and Management",
                        "value": "Business and Management (MRes) (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Behavioural Science",
                        "value": "Behavioural Science (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Business Analytics",
                        "value": "Business Analytics (Online) (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Business and Management",
                        "value": "Business and Management (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Data Science for Business",
                        "value": "Data Science for Business (Online) (PG)",
                        "id": ""
                    }, {
                        "name": "MSc Human Resource Management",
                        "value": "Human Resource Management (UG)",
                        "id": ""
                    },
                    {
                        "name": "MSc International Business",
                        "value": "International Business (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Marketing",
                        "value": "Marketing (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Marketing Analytics",
                        "value": "Marketing Analytics (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Marketing and Brand Management",
                        "value": "Digital Marketing and Brand Management (PG)",
                        "id": ""
                    }
                ]
            },
            {
                "subject": "Communications, Media and Culture",
                "id": 435,
                "courses": [{
                        "name": "MLitt / MSc Gender Studies",
                        "value": "Gender Studies (Applied) (PG)",
                        "id": ""
                    },
                    {
                        "name": "MRes Media Research",
                        "value": "Media Research (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Digital Media and Communication",
                        "value": "Digital Media and Communication (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc International Journalism",
                        "value": "International Journalism (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Media Management",
                        "value": "Media Management (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Public Relations and Strategic Communication",
                        "value": "Public Relations and Strategic Communication (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Public Relations and Strategic Communication (ONLINE)",
                        "value": "Public Relations and Strategic Communication (Online) (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Strategic Communication and Public Relations (PFU)",
                        "value": "Strategic Communication and Public Relations (Joint Degree) (PG)",
                        "id": ""
                    }
                ]
            },
            {
                "subject": "Computing, Data Science and Mathematics",
                "id": 436,
                "courses": [{
                        "name": "MSc Artificial Intelligence",
                        "value": "Artificial Intelligence (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Big Data",
                        "value": "Big Data (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Big Data (ONLINE)",
                        "value": "Big Data (Online) (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Financial Technology",
                        "value": "Financial Technology (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Mathematics and Data Science",
                        "value": "Mathematics and Data Science (PG)",
                        "id": ""
                    }
                ]
            },
            {
                "subject": "Education",
                "id": 437,
                "courses": [{
                        "name": "MRes Educational Research",
                        "value": "Educational Research (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Education",
                        "value": "Education (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Educational Leadership (Specialist Qual for Headship)",
                        "value": "Educational Leadership (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc English Language Teaching and Management",
                        "value": "English Language Teaching and Management (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Professional Education and Leadership",
                        "value": "Professional Education and Leadership (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Teaching English to Speakers of Other Languages",
                        "value": "Teaching English to Speakers of Other Languages (TESOL) (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Teaching English to Speakers of Other Languages (ONLINE)",
                        "value": "Teaching English to Speakers of Other Languages (TESOL) (online) (PG)",
                        "id": ""
                    },
                    {
                        "name": "PG Cert Teaching Qualification in Further Education (In-service)",
                        "value": "",
                        "id": ""
                    },
                    {
                        "name": "PG Dip Teaching Qualification in Further Education (Pre-service)",
                        "value": "Tertiary Education with Teaching Qualification (Further Education) (PG)",
                        "id": ""
                    }
                ]
            },
            {
                "subject": "Environmental Sciences",
                "id": 438,
                "courses": [{
                        "name": "MSc Environmental Management",
                        "value": "Environmental Management (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Environmental Remote Sensing and Geospatial Sciences",
                        "value": "Environmental Remote Sensing and Geospatial Sciences (PG)",
                        "id": ""
                    }
                ]
            },
            {
                "subject": "Health Sciences",
                "id": 439,
                "courses": [{
                        "name": "MPH Public Health (ONLINE)",
                        "value": "Public Health (PG)",
                        "id": ""
                    },
                    {
                        "name": "MRes Health Research (ONLINE)",
                        "value": "Health Research (online) (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Advancing Practice",
                        "value": "Advancing Practice (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Early Years Practice Health Visiting",
                        "value": "",
                        "id": ""
                    }
                ]
            },
            {
                "subject": "History, Heritage and Politics",
                "id": 440,
                "courses": [{
                        "name": "MPP Public Policy",
                        "value": "Public Policy (PG)",
                        "id": ""
                    },
                    {
                        "name": "MRes Historical Research",
                        "value": "Historical Research (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Heritage",
                        "value": "Heritage (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Historical Research",
                        "value": "Historical Research (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc International Conflict and Cooperation",
                        "value": "International Conflict and Cooperation (PG)",
                        "id": ""
                    }
                ]
            },
            {
                "subject": "Law and Philosophy",
                "id": 441,
                "courses": [{
                        "name": "LLM International Energy and Environmental",
                        "value": "",
                        "id": ""
                    },
                    {
                        "name": "MLitt Philosophy",
                        "value": "Philosophy (Mlitt) (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Human Rights and Diplomacy Law",
                        "value": "Human Rights and Diplomacy (PG)",
                        "id": ""
                    }
                ]
            },
            {
                "subject": "Literature and Languages",
                "id": 442,
                "courses": [{
                        "name": "MLitt Creative Writing",
                        "value": "Creative Writing (PG)",
                        "id": ""
                    },
                    {
                        "name": "MLitt English Language and Linguistics",
                        "value": "English Language and Linguistics (PG)",
                        "id": ""
                    },
                    {
                        "name": "MLitt Publishing Studies",
                        "value": "Publishing Studies (MLitt) (PG)",
                        "id": ""
                    },
                    {
                        "name": "MRes Humanities",
                        "value": "Humanities (PG)",
                        "id": ""
                    },
                    {
                        "name": "MRes Publishing Studies",
                        "value": "Publishing Studies (MRes) (PG)",
                        "id": ""
                    }
                ]
            },
            {
                "subject": "Psychology",
                "id": 443,
                "courses": [{
                        "name": "MSc / MA Human Animal Interaction",
                        "value": "Human Animal Interaction (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Autism Research",
                        "value": "Autism Research (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Health Psychology",
                        "value": "Health Psychology (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Psychological Research Methods",
                        "value": "Psychological Research Methods (General)  (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Psychology (accredited conversion course)",
                        "value": "Psychology (conversion course) (PG)",
                        "id": ""
                    }
                ]
            },
            {
                "subject": "Social Sciences",
                "id": 444,
                "courses": [{
                        "name": "MRes Criminological Research",
                        "value": "Criminological Research (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Applied Professional Studies",
                        "value": "Applied Professional Studies (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Applied Social Research",
                        "value": "Applied Social Research (MSc) (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Criminology",
                        "value": "Criminology (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Dementia Studies (ONLINE)",
                        "value": "Dementia Studies (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Gerontology and Global Ageing",
                        "value": "Gerontology and Global Ageing (Online) (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Housing Studies (part-time)",
                        "value": "Housing Studies (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Housing Studies (with internship)",
                        "value": "Housing Studies with Internship (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Social Statistics and Social Research",
                        "value": "Applied Social Research (Social Statistics and Social Research) (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Social Work Studies",
                        "value": "Social Work Studies (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Substance Use (ONLINE)",
                        "value": "Substance Use (PG)",
                        "id": ""
                    }
                ]
            },
            {
                "subject": "Sport",
                "id": 445,
                "courses": [{
                        "name": "MSc Psychology of Sport",
                        "value": "Psychology of Sport (Accredited) (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Sport Management",
                        "value": "Sport Management (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Sport Nutrition",
                        "value": "Sport Nutrition (PG)",
                        "id": ""
                    },
                    {
                        "name": "MSc Sport Performance Coaching (ONLINE)",
                        "value": "Sport Performance Coaching (PG)",
                        "id": ""
                    }
                ]
            }
        ];
    </script>

    <script src="../../../../../../../medias/Categorised/Dist/js/other/_unminified/personalised-pg-prospectus.js"></script>





    <script>
        //9BvqDYRmk8KlBMeg
    </script>
</body>

</html>