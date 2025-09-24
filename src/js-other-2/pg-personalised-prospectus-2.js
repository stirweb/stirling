(function () {
  /**
   *
   *   CONFIG
   *
   */

  const useUAT = typeof USE_UAT !== "undefined" ? USE_UAT : false;

  const SERVER = {
    path: UoS_env.name === `prod` ? "/research/hub/test/pgpdf/" : "",
    year: `2026`,
    app: useUAT ? "app-uat.php" : "app.php",
    verify: "verify.php",
  };

  /**
   * RENDERERS
   * These functions are used to render HTML elements dynamically based on the data provided. They are used to create dropdown options,
   * alerts, and other UI components.
   */

  const renderpleaseSelect = () => `<option value="" >Select an option</option>`;

  const renderDataAlert = () => {
    return `
          <div class="u-heritage-berry u-border-solid u-p-1 u-flex u-gap u-mb-1 align-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="width:24px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
              </svg>
               <p class="text-sm u-mb-0">The data agreement must be accepted</p>
          </div>`;
  };

  const renderMarketingAlert = () => {
    return `
          <div class="u-heritage-berry u-border-solid u-p-1 u-flex u-gap u-mb-1 align-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="width:24px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
          </svg>
          <p class="text-sm u-mb-0">You must agree to being contacted if you wish to opt in to one of our marketing channels</p>
          </div>`;
  };

  //const renderSubjectSelectItems = (subs) => subs.map((item) => `<option value="` + item.subject + `">` + item.subject + `</option>`).join(``);

  const renderSubjectCoursesOptions = (subject, index, data) => {
    const subjectSelected = data.filter((item) => item.subject === subject);

    return subjectSelected[0]
      ? subjectSelected[0].courses
          .map((item) => {
            const ident = item.newName.replaceAll(" ", "-").toLowerCase();
            return `<div class="u-flex u-mb-1 u-gap-8 "><input class="u-m-0" type="checkbox" id="${ident}" name="subject_course_${index}" value="${item.newName}" data-id="subject_course_${index}" data-type="subject_course"><label class="u-m-0" for="${ident}">${item.newName}</label></div>`;
          })
          .join(``)
      : ``;
  };

  const renderLink = (filePath) => {
    if (filePath === ``) return `Your file has downloaded. Please check your downloads folder`;
    return `<a href="${filePath}" target="_blank" class="button heritage-green u-inline-block u-mt-2">Download your guide</a>`;
  };

  const renderLinkBox = (filePath) => {
    return `<div class="u-bg-energy-purple--10 u-p-3 u-mt-2">
            <h3>Download your postgraduate guide</h3>
            <p class="u-flex u-gap-8 align-middle">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="width:24px;height:24px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Your guide has been successfully generated</p>
                <p>${renderLink(filePath)}</p>
          </div>`;
  };

  const renderGenerating = () => {
    return `<div class="u-bg-energy-purple--10 u-p-3 u-mt-2">
            <h3>Download your postgraduate guide</h3>
            <p>Building your pdf...</p>
          </div>`;
  };

  const renderRequiredAlert = () => {
    return `<div class="u-fixed u-bottom-0 u-center-fixed-horz u-fadeinout" id="requiredAlert">
              <div class="u-flex u-gap u-p-2 u-white text-center u-bg-heritage-berry ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="width:24px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
              </svg>
              <p class="u-mb-0">Please review the errors with the submission</p>
              </div>
            </div>`;
  };

  /**
   * HELPER FUNCTIONS
   * These functions are used to manipulate the DOM, handle data, and perform various tasks related to the PDF generation process.
   */

  const setDOMContent = stir.curry((node, html) => {
    stir.setHTML(node, html);
    return true;
  });

  /* getSubjectID */
  const getSubjectID = stir.curry((subsData, name) => {
    const obj = subsData.filter((item) => item.subject === name);

    if (!obj.length) return ``;
    return obj[0].id;
  });

  /* getSubjectFromID */
  const getSubjectFromID = stir.curry((data, id) => {
    const sub = data.filter((item) => item.id === Number(id));

    return !sub.length ? `` : sub[0].subject;
  });

  /* b64toBlob */
  function b64toBlob(b64Data, contentType, sliceSize) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {
      type: contentType,
    });

    return blob;
  }

  /* getSelectedSubjects */
  const getSelectedSubjects = () => {
    const subjectSelects = stir.nodes(".subjectSelect");
    const selectedSubjects = [];

    subjectSelects.forEach((elem) => {
      for (const option of elem.options) {
        if (option.selected) {
          selectedSubjects.push(option.dataset.qs);
        }
      }
    });

    return selectedSubjects
      .filter((item) => item)
      .map((item) => {
        return { StudyLevel: "Postgraduate", Faculty: item, Course: "" };
      });
  };

  /* getSelectedCourses */
  const getSelectedCourses = () => {
    return stir.nodes('input[data-type="subject_course"]:checked').map((elem) => {
      return { StudyLevel: "Postgraduate", Faculty: "", Course: elem.value };
    });
  };

  const escapeHTML = (unsafe) => {
    return unsafe;
    //return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  };

  const sanitizeInput = (input) => {
    if (typeof input !== "string") {
      return input;
    }

    // Convert input to string and trim whitespace
    let sanitized = input.toString().trim();

    // Remove potential script tags and their contents
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    sanitized = escapeHTML(sanitized);

    return sanitized;
  };

  /* cleanse */
  const cleanse = (string) => sanitizeInput(string);

  /**
   * submitData
   * @param {string} pdfPath - The path to the PDF file
   * @param {Object} server - The server configuration object
   * @param {FormData} formData - The form data to be sent
   * @description This function sends the PDF path and form data to the server for processing. It appends the selected courses and subjects to the form data and sends it via a POST request.
   * @returns {Promise<void>} - Returns a promise that resolves when the data is submitted
   * @throws {Error} - Throws an error if the fetch request fails
   */
  async function submitData(pdfPath, server, formData) {
    formData.append("pdfPath", pdfPath);

    const courses = [...getSelectedCourses(), ...getSelectedSubjects()];
    formData.append("courses", JSON.stringify(courses));

    try {
      const response = await fetch(server.path + server.app, {
        method: "POST",
        body: formData,
      });
      console.log(await response.text());
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * mergePdf
   * @param {string} url - URL of the PDF to merge
   * @param {PDFDocument} targetDoc - The document to merge into
   * @param {string} label - Label for logging
   * @returns {Promise<boolean>} - Success status
   * @description This function fetches a PDF from the given URL, loads it, and merges its pages into the target document.
   * It returns true if the merge is successful, otherwise false.
   * @throws {Error} - Throws an error if the PDF cannot be loaded
   */
  async function mergePdf(url, targetDoc, label) {
    try {
      const pdfBytes = await fetch(url).then((res) => res.arrayBuffer());
      const sourceDoc = await PDFLib.PDFDocument.load(pdfBytes);
      const pages = sourceDoc.getPages();

      var i = 0;
      while (i < pages.length) {
        let [p] = await targetDoc.copyPages(sourceDoc, [i]);
        targetDoc.addPage(p);
        i++;
      }

      return true;
    } catch (error) {
      console.log(`Error loading ${label} PDF`);
      return false;
    }
  }

  /**
   * CONTROLLER: Build the pdf
   * @param {Array} subsData - Array of subject data
   * @param {FormData} data - Form data from the user
   * @param {Object} server - Server configuration object
   * @returns {Promise<void>} - Returns a promise that resolves when the PDF is generated
   * @description This function generates a PDF document based on the provided subject data and user input. It retrieves the necessary
   * PDF templates, merges them, and customizes the content with user-specific information. The generated PDF is then made available for download.
   */
  async function doPdf(subsData, data, server) {
    const retrieveUrl = `https://www.stir.ac.uk/study/postgraduate/create-your-personalised-prospectus/welcome-back/`;
    const resultsNode = stir.node("#resultBox");

    setDOMContent(resultsNode, renderGenerating());
    resultsNode.scrollIntoView();

    // Get the data from the form
    const fullPdf = data.get("full_prospectus");

    const firstName = (data.get("first_name") || "").toUpperCase();
    //const lastName = data.get("last_name") || "";
    const email = data.get("email") || "";

    const subject1 = data.get("subject_area_0");
    const subject2 = data.get("subject_area_1");
    const subject3 = data.get("subject_area_2");

    // Start the PDF generation
    const pdfDoc = await PDFLib.PDFDocument.create();

    //const urlFull = server.path + "rawpdfs/full-non-personalised.pdf";
    const urlFront = server.path + "rawpdfs/" + server.year + "/Front.pdf";
    const urlIntro = server.path + "rawpdfs/" + server.year + "/Intro.pdf";
    const urlIntroInsert = server.path + "rawpdfs/" + server.year + "/IntroInsert.pdf";
    const urlBack = server.path + "rawpdfs/" + server.year + "/Back.pdf";

    const url1 = server.path + "rawpdfs/" + server.year + "/" + subject1.replaceAll(",", "") + ".pdf";
    const url2 = server.path + "rawpdfs/" + server.year + "/" + subject2.replaceAll(",", "") + ".pdf";
    const url3 = server.path + "rawpdfs/" + server.year + "/" + subject3.replaceAll(",", "") + ".pdf";

    // Font
    const fonturl = UoS_env.name === `dev` ? "GeneralSans-Semibold.otf" : '<t4 type="media" id="179150" formatter="path/*"/>';
    const fontBytes = await fetch(fonturl).then((res) => res.arrayBuffer());

    pdfDoc.registerFontkit(fontkit);
    const customFont = await pdfDoc.embedFont(fontBytes);
    // const helveticaFont = await frontPdf.embedFont(PDFLib.StandardFonts.Helvetica);

    /*  Full unpersonalised PDF */
    if (fullPdf === "1") {
      const pdfPathFull = retrieveUrl + `?n=${window.btoa(data.get("first_name"))}&s=&f=1}`;
      const fileNameFull = server.path + "rawpdfs/" + server.year + "/full-non-personalised.pdf";

      email && submitData(pdfPathFull, server, data);
      setDOMContent(resultsNode, renderLinkBox(fileNameFull));
      return;
    }

    // First page personalisation
    const frontPdfBytes = await fetch(urlFront).then((res) => res.arrayBuffer());
    const frontPdf = await PDFLib.PDFDocument.load(frontPdfBytes);
    const [firstPageCopy] = await pdfDoc.copyPages(frontPdf, [0]);
    const { width, height } = firstPageCopy.getSize();

    const largeFontSize = 72;
    const secondaryFontSize = 40;

    const fontSize = firstName.length > 8 ? secondaryFontSize : largeFontSize;
    const centre = width / 2;
    const textWidth = customFont.widthOfTextAtSize(firstName, fontSize);

    const xPos = centre - textWidth / 2;
    const yPos = fontSize === largeFontSize ? 477 : 500;

    firstPageCopy.drawText(firstName.toUpperCase(), {
      x: xPos,
      y: yPos,
      size: fontSize,
      font: customFont,
      color: PDFLib.rgb(0.99, 0.99, 0.99),
      rotate: PDFLib.degrees(0),
    });

    // First page merge
    pdfDoc.addPage(firstPageCopy);

    // Intro personalisation
    //const introInsertPdfBytes = await fetch(urlIntroInsert).then((res) => res.arrayBuffer());
    //const introInsertPdf = await PDFLib.PDFDocument.load(introInsertPdfBytes);
    //const [introInsertPageCopy] = await pdfDoc.copyPages(introInsertPdf, [0]);

    // introInsertPageCopy.drawText(firstName.toUpperCase() + ",", {
    //   x: 65,
    //   y: 767,
    //   size: secondaryFontSize,
    //   font: customFont,
    //   color: PDFLib.rgb(0.0, 0.4, 0.21),
    //   rotate: PDFLib.degrees(0),
    // });
    //pdfDoc.addPage(introInsertPageCopy);

    // Intro merge
    //const introPdfBytes = await fetch(urlIntro).then((res) => res.arrayBuffer());
    //const introPdfDoc = await PDFLib.PDFDocument.load(introPdfBytes);

    // const pagesIntro = introPdfDoc.getPages();
    // var i = 0;
    // while (i < pagesIntro.length) {
    //   if (i === 2) {
    //     pdfDoc.addPage(introInsertPageCopy);
    //   } else {
    //     let [p] = await pdfDoc.copyPages(introPdfDoc, [i]);
    //     pdfDoc.addPage(p);
    //   }
    //   i++;
    // }

    // Intro without personalisation
    await mergePdf(urlIntro, pdfDoc, "Intro");

    const errorUrl = server.path + "rawpdfs/.pdf";

    // Merge subject doc 1
    if (url1 !== errorUrl) {
      await mergePdf(url1, pdfDoc, "PDF 1");
    }

    // Merge subject doc 2
    if (url2 !== errorUrl) {
      await mergePdf(url2, pdfDoc, "PDF 2");
    }

    // Merge subject doc 3
    if (url3 !== errorUrl) {
      await mergePdf(url3, pdfDoc, "PDF 3");
    }

    // Merge back page
    await mergePdf(urlBack, pdfDoc, "Back Pages");

    // Generate as Base 64
    const pdfDataUri = await pdfDoc.saveAsBase64({
      dataUri: false,
    });

    const pdfBlob = b64toBlob(pdfDataUri, "application/pdf", 512);
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);

    const userSubjects = [getSubjectID(subsData, subject1), getSubjectID(subsData, subject2), getSubjectID(subsData, subject3)].filter((item) => Number(item));
    const pdfPath = retrieveUrl + `?n=${window.btoa(data.get("first_name"))}&f=0&s=${userSubjects.join(",")}`;

    email && submitData(pdfPath, server, data);

    const personalisedMessageNode = stir.node("#pgstudent");
    personalisedMessageNode && setDOMContent(personalisedMessageNode, data.get("first_name"));

    setDOMContent(resultsNode, renderLinkBox(pdfBlobUrl));

    return;
  }

  /**
   * isMarketingOk
   * @returns {boolean} - Returns true if marketing opt-in is valid, false otherwise
   * @description This function checks if the marketing opt-in is valid based on the user's selections. If the global opt-in is
   * not checked, it verifies that at least one marketing option is selected.
   */
  const isMarketingOk = () => {
    const nodes = stir.nodes('[data-section="marketing"]');
    const nodeGlobal = stir.node('[data-section="marketingglobal"]');

    if (nodeGlobal.value !== "true") {
      const optIns = nodes.map((item) => item.value).filter((item) => item === "true");
      if (optIns.length) return false;
    }
    return true;
  };

  /**
   * doCaptcha
   * @param {string} token - The captcha token
   * @param {FormData} data - The form data to be sent
   * @returns {Promise<boolean>} - Returns true if the captcha is valid, false otherwise
   * @description This function sends the captcha token to the server for verification. If the verification is successful, it proceeds
   * to generate the PDF. If not, it logs a message indicating suspected spam.
   */
  async function doCaptcha(server, token, data) {
    data.append("token", token);

    // For dev skip captcha check
    if (UoS_env.name === `dev`) {
      doPdf(subjectsData, data, server);
      return true;
    }

    try {
      // Check captcha
      const response = await fetch(server.path + server.verify, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.success === "true") {
        // Execute the PDF Stuff
        doPdf(subjectsData, data, server);
        return true;
      } else {
        // DON'T Execute the PDF Stuff
        console.log("Captcha - suspected spam");
        return false;
      }
    } catch (e) {
      console.log("Error with captcha check");
      return false;
    }
  }

  /**
   * ON LOAD - FORM VERSION
   * This function handles the generation of a personalized PDF prospectus based on user input. It sets up event listeners
   * for form submission, populates select options, and validates user input.
   */

  const generatePDFBtn = stir.node("#generatePDFBtn");
  const generatePDFForm = stir.node("#generatePDFForm");

  if (generatePDFForm) {
    const optionsArray = [
      { name: "Select an option", value: "Select an option" },
      ...subjectsData.map((item) => ({ name: item.subject, qs: item.qsSubject })).sort((a, b) => a.name.localeCompare(b.name)),
    ];
    const selects = ["subject_area_0", "subject_area_1", "subject_area_2"].map((id) => document.getElementById(id));

    // Function: populateSelect */
    function populateSelect(select, options) {
      select.innerHTML = "";
      options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.name !== "Select an option" ? option.name : "";
        optionElement.textContent = option.name;
        option.value !== "Select an option" ? optionElement.setAttribute("data-qs", option.qs) : optionElement.setAttribute("data-qs", "");
        select.appendChild(optionElement);
      });
    }

    // Function: updateSelects */
    function updateSelects(indexUpdated) {
      const selectedValues = selects.map((select) => select.value);

      selects.forEach((select, index) => {
        const availableOptions = optionsArray.filter((option) => !selectedValues.includes(option) || option === select.value);
        populateSelect(select, availableOptions);

        // Ensure the currently selected option remains selected
        if (selectedValues[index]) {
          select.value = selectedValues[index];
        }

        if (index === Number(indexUpdated)) {
          stir.node("#subject_area_" + index + "_courses").innerHTML = renderSubjectCoursesOptions(selectedValues[index], index, subjectsData);
        }
      });
    }

    // On load
    populateSelect(selects[0], optionsArray);

    // Change event listener for each select
    selects.forEach((select) =>
      select.addEventListener("change", (event) => {
        updateSelects(event.target.id.replace("subject_area_", ""));
      })
    );

    // ACTION: Form submit event
    generatePDFBtn &&
      generatePDFBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const data = new FormData(generatePDFForm);

        setDOMContent(stir.node("#marketingAlert"), ` `);
        setDOMContent(stir.node("#dataAgreeAlert"), ` `);

        // Required field checks
        const required = stir.nodes("[data-required]");
        const required2 = required.map((item) => item.name);

        required2.forEach((item) => {
          stir.node("[data-alertlabel=" + item + "]").innerText = " *";
        });

        const empties = required.filter((elem) => elem.value === "");

        if (empties.length) {
          const empties2 = empties.map((item) => item.name);

          empties2.forEach((item) => {
            const elem = stir.node("[data-alertlabel=" + item + "]");
            elem.innerText = " * This field is required";
            elem.classList.add("onalert");
          });

          //setDOMContent(stir.node("#formErrors"), renderRequiredError());
          stir.node(".onalert").scrollIntoView();
          setDOMContent(stir.node("#formErrors"), renderRequiredAlert());
          setTimeout(() => stir.node("#requiredAlert").remove(), 2500);
          return;
        }

        if (!isMarketingOk()) {
          setDOMContent(stir.node("#marketingAlert"), renderMarketingAlert());
          stir.node("#marketingAlert").scrollIntoView();

          setDOMContent(stir.node("#formErrors"), renderRequiredAlert());
          setTimeout(() => stir.node("#requiredAlert").remove(), 2500);
          return;
        }

        const dataAgreement = stir.node('[name="data_agreement"]');
        if (!dataAgreement.checked) {
          data.append("data_agreement", "false");
          stir.node("#dataAgreeSection").scrollIntoView();

          setDOMContent(stir.node("#dataAgreeAlert"), renderDataAlert());
          setDOMContent(stir.node("#formErrors"), renderRequiredAlert());
          setTimeout(() => stir.node("#requiredAlert").remove(), 2500);
          return;
        }

        grecaptcha.execute(CAPTCHA, { action: "register" }).then(function (token) {
          doCaptcha(SERVER, token, data);
          return;
        });
      });
  }

  /**
   * ON LOAD - RETRIEVE LATER VERSION FROM EMAIL URL
   * Retrieves the user's name and selected subjects from the URL parameters and generates a PDF prospectus based on that information.
   */

  if (stir.node("#doStoredPDF")) {
    let nameRaw = "";
    try {
      nameRaw = window.atob(QueryParams.get("n") ? QueryParams.get("n") : "");
    } catch (e) {
      nameRaw = "";
    }

    const firstName = cleanse(nameRaw);
    const sects = cleanse(QueryParams.get("s") ? QueryParams.get("s") : "");
    const full = cleanse(QueryParams.get("f") ? QueryParams.get("f") : "");

    const getSubjectFromIDCurry = getSubjectFromID(subjectsData); // Curry
    const selectedSects = sects
      .split(",")
      .map((item) => getSubjectFromIDCurry(item))
      .filter((item) => item);

    const fullProspectus = !firstName.length && !selectedSects.length ? "1" : full;

    const data = new FormData(doStoredPDF);
    data.append("first_name", firstName.charAt(0).toUpperCase() + firstName.slice(1));
    data.append("full_prospectus", fullProspectus);
    data.append("subject_area_0", selectedSects[0] ? selectedSects[0] : ``);
    data.append("subject_area_1", selectedSects[1] ? selectedSects[1] : ``);
    data.append("subject_area_2", selectedSects[2] ? selectedSects[2] : ``);

    doPdf(subjectsData, data, SERVER);
  }
})();
