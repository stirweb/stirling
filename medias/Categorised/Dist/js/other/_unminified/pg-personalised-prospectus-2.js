(function () {
  /* 

    CONFIG 

*/

  const serverPath = UoS_env.name === `prod` ? "/research/hub/test/pgpdf/" : "";

  /* 

    RENDERERS 

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

  /* 

   HELPERS

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

  /*  b64toBlob */
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

  /*  getSelectedSubjects */
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

  /*  getSelectedCourses */
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
  //const cleanse = (string) => string.replaceAll("script>", "").replaceAll("script%3E", "").replaceAll("<", "");

  /*
    CONTROLLERS
*/

  /*
    CONTROLLER: submitData: 
    Send data (formData) to the backend to be processed (MC QS)
*/
  async function submitData(pdfPath, serverPath, formData) {
    console.log(pdfPath);

    formData.append("pdfPath", pdfPath);

    const courses = [...getSelectedCourses(), ...getSelectedSubjects()];
    formData.append("courses", JSON.stringify(courses));

    try {
      const response = await fetch(serverPath + "app.php", {
        method: "POST",
        body: formData,
      });
      console.log(await response.text());
    } catch (e) {
      console.error(e);
    }
  }

  /* 
    CONTROLLER: Build the pdf
*/
  async function doPdf(subsData, data, serverPath) {
    const retrieveUrl = `https://www.stir.ac.uk/study/postgraduate/create-your-personalised-prospectus/welcome-back/`;
    const resultsNode = stir.node("#resultBox");

    setDOMContent(resultsNode, renderGenerating());
    resultsNode.scrollIntoView();

    // Build PDF
    const fullPdf = data.get("full_prospectus");

    const firstName = (data.get("first_name") || "").toUpperCase();
    //const lastName = data.get("last_name") || "";
    const email = data.get("email") || "";

    const subject1 = data.get("subject_area_0");
    const subject2 = data.get("subject_area_1");
    const subject3 = data.get("subject_area_2");

    const pdfDoc = await PDFLib.PDFDocument.create();

    //const urlFull = serverPath + "rawpdfs/full-non-personalised.pdf";
    const urlFront = serverPath + "rawpdfs/Front.pdf";
    const urlIntro = serverPath + "rawpdfs/Intro.pdf";
    const urlIntroInsert = serverPath + "rawpdfs/IntroInsert.pdf";
    const urlBack = serverPath + "rawpdfs/Back.pdf";

    const url1 = serverPath + "rawpdfs/" + subject1.replaceAll(",", "") + ".pdf";
    const url2 = serverPath + "rawpdfs/" + subject2.replaceAll(",", "") + ".pdf";
    const url3 = serverPath + "rawpdfs/" + subject3.replaceAll(",", "") + ".pdf";

    //const fileName = String(Date.now() + "--" + firstName + lastName + String(Math.floor(Math.random() * 100)));

    // Font
    const fonturl = UoS_env.name === `dev` ? "GeneralSans-Semibold.otf" : '<t4 type="media" id="179150" formatter="path/*"/>';
    const fontBytes = await fetch(fonturl).then((res) => res.arrayBuffer());

    pdfDoc.registerFontkit(fontkit);
    const customFont = await pdfDoc.embedFont(fontBytes);
    // const helveticaFont = await frontPdf.embedFont(PDFLib.StandardFonts.Helvetica);

    /*  Full unpersonalised PDF */
    if (fullPdf === "1") {
      const pdfPathFull = retrieveUrl + `?n=${window.btoa(data.get("first_name"))}&s=&f=1}`;
      const fileNameFull = serverPath + "rawpdfs/full-non-personalised.pdf";

      email && submitData(pdfPathFull, serverPath, data);
      setDOMContent(resultsNode, renderLinkBox(fileNameFull));
      return;
    }

    /* Personalised PDF */
    const frontPdfBytes = await fetch(urlFront).then((res) => res.arrayBuffer());
    const frontPdf = await PDFLib.PDFDocument.load(frontPdfBytes);
    const [firstPageCopy] = await pdfDoc.copyPages(frontPdf, [0]);
    const { width, height } = firstPageCopy.getSize();

    const largeFontSize = 77;
    const secondaryFontSize = 40;

    const fontSize = firstName.length > 11 ? secondaryFontSize : largeFontSize;
    const centre = width / 2;
    const textWidth = customFont.widthOfTextAtSize(firstName, fontSize);

    const xPos = centre - textWidth / 2;
    const yPos = fontSize === largeFontSize ? 330 : 335;

    firstPageCopy.drawText(firstName.toUpperCase(), {
      x: xPos,
      y: yPos,
      size: fontSize,
      font: customFont,
      color: PDFLib.rgb(0.99, 0.99, 0.99),
      rotate: PDFLib.degrees(0),
    });

    pdfDoc.addPage(firstPageCopy);

    // Intro insert
    const introInsertPdfBytes = await fetch(urlIntroInsert).then((res) => res.arrayBuffer());
    const introInsertPdf = await PDFLib.PDFDocument.load(introInsertPdfBytes);
    const [introInsertPageCopy] = await pdfDoc.copyPages(introInsertPdf, [0]);

    introInsertPageCopy.drawText(firstName.toUpperCase() + ",", {
      x: 65,
      y: 767,
      size: secondaryFontSize,
      font: customFont,
      color: PDFLib.rgb(0.0, 0.4, 0.21),
      rotate: PDFLib.degrees(0),
    });
    // pdfDoc.addPage(introInsertPageCopy);

    // Intro merge
    const introPdfBytes = await fetch(urlIntro).then((res) => res.arrayBuffer());
    const introPdfDoc = await PDFLib.PDFDocument.load(introPdfBytes);

    const pagesIntro = introPdfDoc.getPages();
    var i = 0;
    while (i < pagesIntro.length) {
      if (i === 2) {
        //let [p] = await pdfDoc.copyPages(introPdfDoc, [i]);
        //pdfDoc.addPage(p);
        pdfDoc.addPage(introInsertPageCopy);
      } else {
        let [p] = await pdfDoc.copyPages(introPdfDoc, [i]);
        pdfDoc.addPage(p);
      }
      i++;
    }

    const errorUrl = serverPath + "rawpdfs/.pdf";

    // Main merge
    if (url1 !== errorUrl) {
      const doc1PdfBytes = await fetch(url1).then((res) => res.arrayBuffer());
      const doc1PdfDoc = await PDFLib.PDFDocument.load(doc1PdfBytes);

      const pages1 = doc1PdfDoc.getPages();
      var i = 0;
      while (i < pages1.length) {
        let [p] = await pdfDoc.copyPages(doc1PdfDoc, [i]);
        pdfDoc.addPage(p);
        i++;
      }
    }

    // Merge 2
    if (url2 !== errorUrl) {
      const doc2PdfBytes = await fetch(url2).then((res) => res.arrayBuffer());
      const doc2PdfDoc = await PDFLib.PDFDocument.load(doc2PdfBytes);

      const pages2 = doc2PdfDoc.getPages();
      var i = 0;
      while (i < pages2.length) {
        let [p] = await pdfDoc.copyPages(doc2PdfDoc, [i]);
        pdfDoc.addPage(p);
        i++;
      }
    }

    // Merge 3
    if (url3 !== errorUrl) {
      const doc3PdfBytes = await fetch(url3).then((res) => res.arrayBuffer());
      const doc3PdfDoc = await PDFLib.PDFDocument.load(doc3PdfBytes);

      const pages3 = doc3PdfDoc.getPages();
      var i = 0;
      while (i < pages3.length) {
        let [p] = await pdfDoc.copyPages(doc3PdfDoc, [i]);
        pdfDoc.addPage(p);
        i++;
      }
    }

    // Back page merge
    const backPdfBytes = await fetch(urlBack).then((res) => res.arrayBuffer());
    const backPdfDoc = await PDFLib.PDFDocument.load(backPdfBytes);

    const pagesBack = backPdfDoc.getPages();
    var i = 0;
    while (i < pagesBack.length) {
      let [p] = await pdfDoc.copyPages(backPdfDoc, [i]);
      pdfDoc.addPage(p);
      i++;
    }

    // Generate as Base 64
    const pdfDataUri = await pdfDoc.saveAsBase64({
      dataUri: false,
    });

    const pdfBlob = b64toBlob(pdfDataUri, "application/pdf", 512);
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);

    const userSubjects = [getSubjectID(subsData, subject1), getSubjectID(subsData, subject2), getSubjectID(subsData, subject3)].filter((item) => Number(item));
    const pdfPath = retrieveUrl + `?n=${window.btoa(data.get("first_name"))}&f=0&s=${userSubjects.join(",")}`;

    email && submitData(pdfPath, serverPath, data);

    const personalisedMessageNode = stir.node("#pgstudent");
    personalisedMessageNode && setDOMContent(personalisedMessageNode, data.get("first_name"));

    setDOMContent(resultsNode, renderLinkBox(pdfBlobUrl));

    return;
  }

  /* isMarketingOk */
  const isMarketingOk = () => {
    const nodes = stir.nodes('[data-section="marketing"]');
    const nodeGlobal = stir.node('[data-section="marketingglobal"]');

    if (nodeGlobal.value !== "true") {
      const optIns = nodes.map((item) => item.value).filter((item) => item === "true");
      if (optIns.length) return false;
    }
    return true;
  };

  /* 
  doCaptcha Spam check 
*/
  async function doCaptcha(token, data) {
    data.append("token", token);

    // For dev skip captcha check
    if (UoS_env.name === `dev`) {
      doPdf(subjectsData, data, serverPath);
      return true;
    }

    try {
      // Check captcha
      const response = await fetch(serverPath + "verify.php", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      //const result = { success: "true" };

      if (result.success === "true") {
        // Exectue the PDF Stuff
        doPdf(subjectsData, data, serverPath);
        return true;
      } else {
        // DONT Exectue the PDF Stuff
        console.log("Captcha - suspected spam");
        return false;
      }
    } catch (e) {
      console.log("Error with captcha check");
      //console.log(e);
      return false;
    }
  }

  /*  
    ON LOAD - FORM VERSION   
*/

  const generatePDFBtn = stir.node("#generatePDFBtn");
  const generatePDFForm = stir.node("#generatePDFForm");

  if (generatePDFForm) {
    const optionsArray = [{ name: "Select an option", value: "Select an option" }, ...subjectsData.map((item) => ({ name: item.subject, qs: item.qsSubject })).sort((a, b) => a.name.localeCompare(b.name))];
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

    /* 
    ACTION: Form submit event 
    */
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
          doCaptcha(token, data);
          return;
        });
      });
  }

  /*
  ON LOAD - RETRIEVE LATER VERSION
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

    doPdf(subjectsData, data, serverPath);
  }
})();
