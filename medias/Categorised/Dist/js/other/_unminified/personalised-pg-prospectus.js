/* 

    CONFIG 

*/

const path = UoS_env.name === `prod` ? "/research/hub/test/pgpdf/" : "";
const SUPABASE_URL = "https://kkiqupbzfaghcmmacixr.supabase.co";

/* 

    RENDERERS 

*/

const renderSubjectSelectItems = (subs) => subs.map((item) => `<option value="` + item.subject + `">` + item.subject + `</option>`).join(``);

const renderSubjectCoursesOptions = (subject, index, data) => {
  const subjectSelected = data.filter((item) => item.subject === subject);

  return subjectSelected[0].courses
    .filter((item) => item.value)
    .map((item) => {
      const ident = item.name.replaceAll(" ", "-").toLowerCase();
      return `<div class="u-flex u-mb-1"><input class="u-m-0" type="checkbox" id="${ident}" name="subject_course_${index}_${item.id}" value="${item.value}" data-id="subject_course_${index}.${item.id}" data-type="subject_course"><label for="${ident}">${item.name}</label></div>`;
    })
    .join(``);
};

const renderLink = (filePath) => {
  return `<div class="u-bg-energy-purple--10 u-p-3 u-mt-2">
            <h3>Download your prospectus</h3>
            <p class="u-flex u-gap-8 align-middle">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="width:24px;height:24px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Your prospectus has been successfully generated</p>
            <p><a href="${filePath}" class="button heritage-green u-inline-block u-mt-2">Download your prospectus</a></p>
          </div>`;
};

const renderGenerating = () => {
  return `<div class="u-bg-energy-purple--10 u-p-3 u-mt-2">
            <h3>Download your prospectus</h3>
            <p>Building your pdf...</p>
          </div>`;
};

const renderRequiredError = () => {
  return `<p class="u-p-2 u-heritage-berry text-center u-heritage-berry u-border-solid u-bg-white" >Please ensure you have completed all required fields</p>`;
};

/* 

   HELPERS

*/

/* getSubjectFileName - returns the name of the raw pdf */
const getSubjectFileName = (id, subsData) => {
  const obj = subsData.filter((item) => item.id === Number(id));

  if (!obj.length) return ``;
  return obj[0].subject.replaceAll(",", "");
};

const setDOMContent = stir.curry((node, html) => {
  stir.setHTML(node, html);
  return true;
});

/* 
    downloadPDF 

function storePDF2(pdf, fileName2, path) {
    const linkSource = `${pdf}`;
    const fileName = "YourPersonalisedPGPerspectus.pdf";
    const fileURL = linkSource;

    if (!window.ActiveXObject) {
        var save = document.createElement("a");
        save.href = fileURL;
        save.target = "_blank";
        var filename = fileURL.substring(fileURL.lastIndexOf("/") + 1);
        save.download = fileName || filename;
        if (navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) && navigator.userAgent.search("Chrome") < 0) {
            document.location = save.href;
            // window event not working here
        } else {
            var evt = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: false,
            });
            save.dispatchEvent(evt);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        }
    }
}
*/

/* 
    b64toBlob 
 */
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

/* 
    storePDF 
    * SEND the pdf file to Supabase and get the link url back *
 */
async function storePDF(pdf, fileName, path) {
  const fileNameFull = fileName + ".pdf";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtraXF1cGJ6ZmFnaGNtbWFjaXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg5MDEwNjEsImV4cCI6MjAzNDQ3NzA2MX0.qvfBzihxwwWTzsS6BV2CDVcW2nfEGxGUqMjdrQbYnlA";

  const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const pdfBlob = b64toBlob(pdf, "application/pdf", 512);

  const { data, error } = await _supabase.storage.from("pdfs").upload(fileNameFull, pdfBlob, {
    cacheControl: "3600",
    upsert: false,
  });

  if (data) return data;

  return null;
}

/* 
  getSelectedSubjects 
*/
const getSelectedSubjects = () => {
  const subjectSelects = stir.nodes(".subjectSelect");
  const selectedSubjects = [];

  subjectSelects.forEach((elem) => {
    for (const option of elem.options) {
      if (option.selected) {
        selectedSubjects.push(option.value);
      }
    }
  });

  return selectedSubjects
    .filter((item) => item)
    .map((item) => {
      return { StudyLevel: "Postgraduate", Faculty: item, Course: "" };
    });
};

/* 
  getSelectedCourses 
*/
const getSelectedCourses = () => {
  return stir.nodes('input[data-type="subject_course"]:checked').map((elem) => {
    return { StudyLevel: "Postgraduate", Faculty: "", Course: elem.value };
  });
};

/*
    submitData: Send data (formData) to the backend to be processed (MC QS)
*/
async function submitData(pdfPath, serverPath, formData) {
  formData.append("pdfPath", pdfPath);

  const courses = [...getSelectedCourses(), ...getSelectedSubjects()];
  formData.append("courses", JSON.stringify(courses));

  try {
    const response = await fetch(serverPath + "app.php", {
      method: "POST",
      body: formData,
    });
    console.log(await response.json());
  } catch (e) {
    console.error(e);
  }
}

/* 
    
    CONTROLLERS
    
*/
async function doPdf(subsData, data, path) {
  const resultsNode = stir.node("#resultBox");

  setDOMContent(resultsNode, renderGenerating());
  resultsNode.scrollIntoView();

  // Build PDF
  const fullPdf = data.get("full_prospectus");

  const firstName = data.get("first_name") || "";
  const lastName = data.get("last_name") || "";
  //const email = data.get("email") || "";

  const subject1 = getSubjectFileName(data.get("subject_area_1"), subsData);
  const subject2 = getSubjectFileName(data.get("subject_area_2"), subsData);
  const subject3 = getSubjectFileName(data.get("subject_area_3"), subsData); // data.get("subject_area_3") || "";

  const pdfDoc = await PDFLib.PDFDocument.create();

  //const urlFull = path + "rawpdfs/full-non-personalised.pdf";
  const urlFront = path + "rawpdfs/Front.pdf";
  const urlIntro = path + "rawpdfs/Intro.pdf";
  const urlIntroInsert = path + "rawpdfs/IntroInsert.pdf";
  const urlBack = path + "rawpdfs/Back.pdf";

  const url1 = path + "rawpdfs/" + subject1.replaceAll(",", "") + ".pdf";
  const url2 = path + "rawpdfs/" + subject2.replaceAll(",", "") + ".pdf";
  const url3 = path + "rawpdfs/" + subject3.replaceAll(",", "") + ".pdf";

  const fileName = String(Date.now() + "--" + firstName + lastName + String(Math.floor(Math.random() * 100)));

  // Font
  const fonturl = UoS_env.name === `dev` ? "GeneralSans-Semibold.otf" : '<t4 type="media" id="179150" formatter="path/*"/>';
  const fontBytes = await fetch(fonturl).then((res) => res.arrayBuffer());

  pdfDoc.registerFontkit(fontkit);
  const customFont = await pdfDoc.embedFont(fontBytes);
  // const helveticaFont = await frontPdf.embedFont(PDFLib.StandardFonts.Helvetica);

  /*  Full unpersonalised PDF */
  if (fullPdf === "1") {
    const fileNameFull = path + "rawpdfs/full-non-personalised.pdf";
    setDOMContent(resultsNode, renderLink(fileNameFull));
    submitData(fileNameFull, path, data);
    return;
  }

  /* Personalised PDF */
  const frontPdfBytes = await fetch(urlFront).then((res) => res.arrayBuffer());
  const frontPdf = await PDFLib.PDFDocument.load(frontPdfBytes);
  const [firstPageCopy] = await pdfDoc.copyPages(frontPdf, [0]);
  //const { width, height } = firstPageCopy.getSize();

  const largeFontSize = 66;
  const secondaryFontSize = 40;

  const fontSize = firstName.length > 11 ? secondaryFontSize : largeFontSize;

  firstPageCopy.drawText(firstName.toUpperCase(), {
    x: 93,
    y: 530,
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
  //const { width, height } = firstPageCopy.getSize();

  introInsertPageCopy.drawText(firstName.toUpperCase(), {
    x: 45,
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

  const errorUrl = path + "rawpdfs/.pdf";

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

  const response = await storePDF(pdfDataUri, fileName, path);

  const pdfPath = response ? SUPABASE_URL + "/storage/v1/object/public/" + response.fullPath : "";

  if (!pdfPath) {
    console.log("Error uploading to Supabase!");
    return;
  }

  setDOMContent(resultsNode, renderLink(pdfPath));
  submitData(pdfPath, path, data);
  return;
}

/* doCaptcha Spam check */
async function doCaptcha(token, data) {
  data.append("token", token);

  try {
    const response = await fetch(path + "verify.php", {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (result.success === "true") {
      // Exectue the PDF Stuff
      const required = stir.nodes("[data-required]");
      const required2 = required.map((item) => item.name);

      required2.forEach((item) => {
        stir.node("[data-alertlabel=" + item + "]").innerText = " *";
      });

      const empties = required.filter((elem) => elem.value === "");

      if (empties.length) {
        const empties2 = empties.map((item) => item.name);

        empties2.forEach((item) => {
          stir.node("[data-alertlabel=" + item + "]").innerText = " * This field is required";
        });

        setDOMContent(stir.node("#formErrors"), renderRequiredError());
        stir.node("#formErrors").scrollIntoView();
        return;
      }

      doPdf(subjectsData, data, path);

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
    
    ON LOAD
            
*/

const generatePDFBtn = stir.node("#generatePDFBtn");
const generatePDFForm = stir.node("#generatePDFForm");

const selects = stir.nodes("select");
selects.forEach((element) => (element.value = "")); // reset on load

const subjectSelect = stir.nodes(".subjectSelect");
subjectSelect[0].insertAdjacentHTML("beforeend", renderSubjectSelectItems(subjectsData));

/* 

   ACTION: Form change events 

*/
generatePDFForm &&
  generatePDFForm.addEventListener("change", function (e) {
    e.preventDefault();

    const data = new FormData(generatePDFForm);

    const studyYear = data.get("study_year");
    const subject1 = data.get("subject_area_1");
    const subject2 = data.get("subject_area_2");
    const subject3 = data.get("subject_area_3");

    if (studyYear) {
      stir.node(".subject_area_1").classList.remove("hide");
    }

    //console.log(e.target.id);

    if (e.target.id === "subject_area_1" && subject1) {
      // Populate the list
      stir.node("#subject_area_1_courses").innerHTML = renderSubjectCoursesOptions(subject1, "1", subjectsData);
      stir.node(".subject_area_2").classList.remove("hide");
      // Remove the selected item from the subject list
      const subjectsData1 = subjectsData.filter((item) => item.subject !== subject1);
      subjectSelect[1].insertAdjacentHTML("beforeend", renderSubjectSelectItems(subjectsData1));
    }

    if (e.target.id === "subject_area_2" && subject2) {
      stir.node("#subject_area_2_courses").innerHTML = renderSubjectCoursesOptions(subject2, "2", subjectsData);
      stir.node(".subject_area_3").classList.remove("hide");

      const subjectsData2 = subjectsData.filter((item) => item.subject !== subject2 && item.subject !== subject1);
      subjectSelect[2].insertAdjacentHTML("beforeend", renderSubjectSelectItems(subjectsData2));
    }

    if (e.target.id === "subject_area_3" && subject3) {
      stir.node("#subject_area_3_courses").innerHTML = renderSubjectCoursesOptions(subject3, "3", subjectsData);
    }
    return;
  });

/* 
    ACTION: Form submit event 
 */
generatePDFBtn &&
  generatePDFBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const data = new FormData(generatePDFForm);

    grecaptcha.execute("6LeLc_wpAAAAAK9XBEY5HhZcsYEgTTi1wukDL685", { action: "register" }).then(function (token) {
      doCaptcha(token, data);
      return;
    });
  });
