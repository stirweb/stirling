/* 

    CONFIG 

*/

const path = UoS_env.name === `prod` ? "/research/hub/test/" : "";

/* 

    RENDERERS 

*/

const renderSubjectSelectItems = (subs) => subs.map((item) => `<option>` + item.subject + `</option>`).join(``);

const renderSubjectCoursesOptions = (subject, index, data) => {
  const subjectSelected = data.filter((item) => item.subject === subject);
  return subjectSelected[0].courses
    .map((item) => {
      const ident = item.replaceAll(" ", "-").toLowerCase();
      return `<div class="u-flex u-mb-1"><input class="u-m-0" type="checkbox" id="` + ident + `" name="courses_` + index + `" value="` + ident + `"><label for="` + ident + `">` + item + `</label></div>`;
    })
    .join(``);
};

const renderLink = (filePath) => {
  return `<p class="u-bg-energy-purple--10 u-p-3 text-center"><a href="${filePath}">View and download your personalised PDF</a></p>`;
};

/* 

   HELPERS

*/

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
 */
async function storePDF(pdf, fileName, path) {
  const fileNameFull = fileName + ".pdf";

  const SUPABASE_URL = "https://scezmsgewfitcalrkauq.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZXptc2dld2ZpdGNhbHJrYXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3NzY4ODQsImV4cCI6MjAzMTM1Mjg4NH0.-WZyB91qB-6PinAYDKT1ziWK3hNRB6GNZTTnVfvHDts";

  const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const pdfBlob = b64toBlob(pdf, "application/pdf", 512);

  const { data, error } = await _supabase.storage.from("pdfs").upload(fileNameFull, pdfBlob, {
    cacheControl: "3600",
    upsert: false,
  });

  if (data) {
    return data;
  }

  return null;
}

/* 
    
    CONTROLLER
    
*/
async function createPdf(data, path) {
  // console.log(data);

  setDOMContent(stir.node("#resultBox"), `<p class="u-bg-energy-purple--10 u-p-3 text-center">Building your pdf...</p>`);

  const fullPdf = data.get("full_prospectus");

  const firstName = data.get("first_name") || "";
  const lastName = data.get("last_name") || "";
  const email = data.get("email") || "";

  const subject1 = data.get("subject_area_1") || "";
  const subject2 = data.get("subject_area_2") || "";
  const subject3 = data.get("subject_area_3") || "";

  const pdfDoc = await PDFLib.PDFDocument.create();

  const urlFull = path + "rawpdfs/full-non-personalised.pdf";
  const urlFront = path + "rawpdfs/Front.pdf";
  const urlIntro = path + "rawpdfs/Intro.pdf";
  const urlIntroInsert = path + "rawpdfs/IntroInsert.pdf";
  const urlBack = path + "rawpdfs/Back.pdf";

  const url1 = path + "rawpdfs/" + subject1.replaceAll(",", "") + ".pdf";
  const url2 = path + "rawpdfs/" + subject2.replaceAll(",", "") + ".pdf";
  const url3 = path + "rawpdfs/" + subject3.replaceAll(",", "") + ".pdf";

  const fileName = firstName + lastName + String(Date.now()) + String(Math.floor(Math.random() * 100));

  // Font
  const fonturl = UoS_env.name === `dev` ? "GeneralSans-Semibold.otf" : '<t4 type="media" id="179150" formatter="path/*"/>';
  const fontBytes = await fetch(fonturl).then((res) => res.arrayBuffer());

  pdfDoc.registerFontkit(fontkit);
  const customFont = await pdfDoc.embedFont(fontBytes);
  // const helveticaFont = await frontPdf.embedFont(PDFLib.StandardFonts.Helvetica);

  /* 
        Full unpersonalised PDF 
     */
  if (fullPdf === "1") {
    const fullPdfBytes = await fetch(urlFull).then((res) => res.arrayBuffer());
    const fullPdfDoc = await PDFLib.PDFDocument.load(fullPdfBytes);

    const pagesFull = fullPdfDoc.getPages();
    var i = 0;
    while (i < pagesFull.length) {
      let [p] = await pdfDoc.copyPages(fullPdfDoc, [i]);
      pdfDoc.addPage(p);
      i++;
    }

    // Generate as Base 64 and download
    const pdfDataUri = await pdfDoc.saveAsBase64({
      dataUri: false,
    });

    storePDF(pdfDataUri, fileName, path);
    setDOMContent(stir.node("#resultBox"), renderLink(fileName, path));
    return;
  }

  /* 
        Personalised PDF 
     */
  const frontPdfBytes = await fetch(urlFront).then((res) => res.arrayBuffer());
  const frontPdf = await PDFLib.PDFDocument.load(frontPdfBytes);
  const [firstPageCopy] = await pdfDoc.copyPages(frontPdf, [0]);
  //const { width, height } = firstPageCopy.getSize();

  firstPageCopy.drawText(firstName.toUpperCase(), {
    x: 93,
    y: 530,
    size: 66,
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
    size: 40,
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

  // Generate as Base 64 and download
  const pdfDataUri = await pdfDoc.saveAsBase64({
    dataUri: false,
  });

  const response = await storePDF(pdfDataUri, fileName, path);
  const pdfPath = "https://scezmsgewfitcalrkauq.supabase.co/storage/v1/object/public/" + response.fullPath;

  setDOMContent(stir.node("#resultBox"), renderLink(pdfPath));

  emailUser(firstName, email, pdfPath, path);
}

/*
    emailUser
*/
async function emailUser(firstName, email, pdfPath, path) {
  const formData = new FormData();

  formData.append("pdfPath", pdfPath);
  formData.append("firstName", firstName);
  formData.append("email", email);

  try {
    const response = await fetch(path + "app2.php", {
      method: "POST",
      // Set the FormData instance as the request body
      body: formData,
    });
    console.log(await response.json());
  } catch (e) {
    console.error(e);
  }
}

/*  
    
    ON LOAD
            
*/

const generatePDFBtn = stir.node("#generatePDFBtn");
const generatePDFForm = stir.node("#generatePDFForm");

const selects = stir.nodes("select");
selects.forEach((element) => (element.value = ""));

const subjectSelect = stir.nodes(".subjectSelect");
subjectSelect[0].insertAdjacentHTML("beforeend", renderSubjectSelectItems(subjectsData));

// selects.forEach((element) => {
//     element.insertAdjacentHTML("beforeend", initSubjects);
// });

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

    if (e.target.id === "subject_area_1" && subject1) {
      stir.node("#subject_area_1_courses").innerHTML = renderSubjectCoursesOptions(subject1, "1", subjectsData);
      stir.node(".subject_area_2").classList.remove("hide");

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
  });

/* 
                ACTION: Form submit event 
            */
generatePDFBtn &&
  generatePDFBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const data = new FormData(generatePDFForm);
    createPdf(data, path);
  });
