var do_goToOption_click = function (e) {
  e.preventDefault(); // bind click event to link
  do_goToOption($(this));
};
var do_goToOption = function (activeTab) {
  var year = $(activeTab).data("year");
  var opt = $(activeTab).data("option");
  $('#tabContent').show();
  $('#tabContent #year' + year + ' .tab-pane').hide();
  $('#tabContent #year' + year + ' #option' + opt).show();
};

var do_groupProg_click = function (e) {
  e.preventDefault(); // bind click event to link
  do_groupProg(e);
};


var do_groupProg = function (groupOrg) {
  if (!$(groupOrg).hasClass("active")) {
	var allActiveGroups = $('#sidebar .groupProg.active');
	allActiveGroups.removeClass("active");
	allActiveGroups.next('div').collapse('hide');
	$(groupOrg).addClass("active");
	setTimeout(function () {
	  $(groupOrg).next('div').collapse('show');
	});
  } else {
	$(groupOrg).removeClass("active");
  }
};

//think this might be redundant stuff
buildHTML = function (tag, html, attrs) {
  // you can skip html param
  if (typeof (html) !== 'string') {
	attrs = html;
	html = null;
  }
  var h = '<' + tag;
  for (var attr in attrs) {
	if (attrs[attr] === false)
	  continue;
	h += ' ' + attr + '="' + attrs[attr] + '"';
  }
  return h += html ? ">" + html + "</" + tag + ">" : "/>";
};

var ver = "";
var activeVersionName;
var activeVersionLabel;
var activeVersionCreated;
var activeVersionCreatedISO;
var showAvailabilityBtn = false;

$(document).ready(function () {
  $body = $("body");
  $("#searchModulePanel").hide();

  $(document).on({
	ajaxStart: function () {
	  $body.addClass("loading");
	},
	ajaxStop: function () {
	  $body.removeClass("loading");
	}
  });


  $(document.body).on('click', '#versions div a', function (e) {
	if (undefined !== $('#mainContent').data("rc")) {
	  e.preventDefault();
	  location.href = $(this).attr("href") + "&rouCode=" + $('#mainContent').data("rc");
	}
  });

  $(document.body).on('click', '#sidebar > a.school', function (e) {

	if (!$(this).hasClass("active")) {
	  var allActive = $('#sidebar .school.active');
	  allActive.removeClass("active");
	  allActive.next('div').collapse('hide');
	  var allActiveGroups = $('#sidebar .groupProg.active');

	  allActiveGroups.removeClass("active");
	  allActiveGroups.next('div').collapse('hide');
	  $(this).addClass("active");
	  setTimeout(function () {
		$(this).next('div').collapse('show');
	  });
	  if ($(this).next('div').children('div').length === 1) {
		do_groupProg($(this).next('div').children('div a.groupProg'));
	  }
	} else {
	  $(this).removeClass("active");
	}
  });


  $(document.body).on('click', '#sidebar  a.groupProg', function (e) {
	do_groupProg_click(e);

  });

  $(document.body).on('click', '#sidebar  a.indProg', function (e) {
	e.preventDefault();

	var currentId = $(this).attr('id');
	if (currentId !== "" && typeof currentId !== 'undefined') {
	  $('#semesterContent').empty();
	  $('#tabContent').empty();
	  $('#detailsContent').empty();
	  $('#moduleContent').empty();
	  //getMOA(currentId);
	  $('#shareLinkContent').empty();
	  getPgOpts(currentId);
	  //loadProgramme(currentId,1);
	}
	$('#sidebar a.indProg').removeClass("active");
	$(this).addClass("active");
	return false;
  });

  $(document.body).on('click', '#searchPrg_chzn', function (e) {
	var allActiveNodes = $('#sidebar .active');
	allActiveNodes.removeClass("active");
	allActiveNodes.next('div').collapse('hide');

  });


  $('#detailsModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget); // Button that triggered the modal
	var recipient = button.data('whatever'); // Extract info from data-* attributes
	var detailsContent = $("#" + button.attr('data-id')).html();

	var modal = $(this);
	modal.find('.modal-body').html(detailsContent);

  });

  $('#shareLinkModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget); // Button that triggered the modal
	var shareLinkContent = $("#" + button.attr('data-id')).html();
	var modal = $(this);
	modal.find('.modal-body').html(shareLinkContent);
  });

  $('#shareLinkModal').on('shown.bs.modal', function () {
	$('.modal #shareLinkTxt').focus();
	$('.modal #shareLinkTxt').select();

  });




  //hopefully deprecated
  $(document.body).on('click', '#chooseMoaOccl  button.moa', function (e) {
	var rouCode = $(this).data("rouCode");
	var moaCode = $(this).data("moaCode");
	getOccl(rouCode, moaCode);

  });

  //hopefully deprecated
  $(document.body).on('click', '#chooseMoaOccl  button.occl', function (e) {
	var rouCode = $(this).data("rouCode");
	var occlCode = $(this).data("occlCode");
	var moaCode = $(this).data("moaCode");
	loadProgramme(rouCode, moaCode, occlCode);

  });

  //click handler for options choice
  $(document.body).on('click', '#opts > a.opt', function (e) {
	$('#semesterContent').empty();
	$('#introContent').empty();
	$('#tabContent').empty();
	$('#detailsContent').empty();
	$('#moduleContent').empty();
	var rouCode = $(this).data("rouCode");
	var occlCode = $(this).data("occlCode");
	var moaCode = $(this).data("moaCode");
	loadProgramme(rouCode, moaCode, occlCode);
  });

  //click handler for switch option
  $(document.body).on('click', '#variant-opts > a.variant', function (e) {
	$('#semesterContent').empty();
	$('#introContent').empty();
	$('#tabContent').empty();
	$('#detailsContent').empty();
	$('#moduleContent').empty();
	var rouCode = $(this).data("rouCode");
	var occlCode = $(this).data("occlCode");
	var moaCode = $(this).data("moaCode");
	loadProgramme(rouCode, moaCode, occlCode);
  });

  $('.chooseYear').on('click', 'a.goToYear', function (e) {//year chosen
	e.preventDefault();
	//closeAllPopovers(e);
	var currentId = $(this).text();
	var tabs = $(this).data("tabs");
	$('.chooseYear').find('li.active').removeClass("active");
	$('.yearlink' + currentId).parent().addClass("active");

	$('.showYear').hide();
	$('#year' + currentId).show();
	if (tabs === "false") {
	  $('#tabContent').hide();
	} else {
	  $('#tabContent').show();
	  $('.tab-pane').hide();//cludge - should check if any are visible, if yes, leave it visible - this always default back to showing option 1
	  $('#year' + currentId + ' .tab-pane#option1').show();
	  $('#tab_option1').addClass("active");
	  $('#tab_option2').removeClass("active");//CLUDGE!
	}
	return false;
  });

  $(document.body).on('click', '.goToOption', do_goToOption_click);

  $(".chzn-select").chosen({
	search_contains: true
  });
  $("#menu").menu();
  var rouCodeParam = params.rouCode;
  var modCodeParam = params.modCode;
  $('#mainContent').data("rc", rouCodeParam);
  var moa = params.moa;
  var occ = params.occ;
  ver = params.versionId;
  var sharedLink = params.share;
  var verPassed = true;
  if (ver === undefined || ver === null) {//no version specified in URL
	ver = -1;
	verPassed = false;
  }
  //build versions menu
  $.getJSON("/servlet/CalendarServlet?opt=version-menu&ct=PG&callback=?", null, function (versions) {
	$("#versions").empty();
	var latestVersionId = "";
	var shareParam = "";
	if (sharedLink !== undefined && sharedLink !== null && sharedLink === "true") {
	  shareParam = "&share=true";
	}
	for (var i in versions) {

	  version = versions[i];
	  versionId = version.versionId;
	  versionName = version.versionName;
	  minorVersion = version.minorVersion;
	  versionLabel = version.versionLabel;
	  versionActive = version.versionActive;
	  versionCreated = version.createdDate;
	  versionCreatedISO = version.createdDateISO;
	  //bigTextPath = version.bigTextPath;
	  if(versionActive !== "D") {  //never attempt to show deleted
		if (!verPassed) {
		  if (versionActive === "Y" && parseInt(versionId) > ver) {
			ver = parseInt(versionId);//if no versionId passed in get params, default to highest version id in version set
		  }
		}
		if (versionActive === "Y" && parseInt(versionId) >= latestVersionId) {
		  latestVersionId = parseInt(versionId);
		}
		if(versionActive === "Y" || versionId.toString() === ver){ //only add to the versions menu if Active or historic version being viewed
		  if (versionActive === "Y") {
			$("#versions").append("<div id='version" + versionId + "'><a href='/calendar/calendar-pg.jsp?versionId=" + versionId + shareParam + "' class='list-group-item'>" + versionLabel + "<div id='active-badge' style='float:right'></div></a></div>");
		  }else{
			$("#versions").append("<div id='version" + versionId + "'><a href='/calendar/calendar-pg.jsp?versionId=" + versionId + shareParam + "' class='list-group-item'>" + versionLabel + "<div id='active-historic-badge' style='float:right'></div></a></div>");
		  }
		  $("#version" + versionId).data("versionName", versionName);
		  if (versionActive === "Y") {
			$("#version" + versionId ).data("versionLabel", versionLabel);
		  }else{
			$("#version" + versionId ).data("versionLabel", versionLabel+" (Historic Version)");
		  }
		  $("#version" + versionId ).data("versionCreated", versionCreated);
		  $("#version" + versionId ).data("versionCreatedISO", versionCreatedISO);
		}
	  }
	}
	$("#versions #version" + ver).addClass("active");
	$("#versions #version" + ver + " #active-badge").append("<span class='label label-success' style='padding:2px'>ACTIVE</span>");
	$("#versions #version" + ver + " #active-historic-badge").append("<span class='label label-success' style='padding:2px'>HISTORIC</span>");
	activeVersionName = $("#version" + ver).data("versionName");
	activeVersionLabel = $("#version" + ver).data("versionLabel");
	var versionWarning = "";


	if (sharedLink !== undefined && sharedLink !== null && sharedLink === "true") {
	  if (ver.toString() !== latestVersionId.toString()) {
		versionWarning = "<span id='versionWarning' class='label label-warning' style='margin-left:5px;'>Click <a href='/calendar/calendar-pg.jsp?versionId=" + latestVersionId.toString().trim() + "&rouCode=" + rouCodeParam + "'>here</a> to view the current published version</label>";
	  }
	}
	$("#pageTitle").html("<h1>Postgraduate Degree Programme Tables " + activeVersionName + "</h1><h3 style='font-family:Verdana, Geneva, sans-serif;'>" + activeVersionLabel + versionWarning + "</h3>");
	if ($("#versions div:first-child").hasClass("active") || ver === "0") {
	  if (sitsAvailable === "Y" && modSpacesCheckYN === "Y") {
		showAvailabilityBtn = true;
	  }
	}
  }).done(function () {
	$.getJSON("/servlet/CalendarServlet?opt=pgmenu&ct=PG&ver=" + ver + "&callback=?", null, function (menu) {
	  $("#searchPrg").empty();
	  $("#searchPrg").append(new Option()).trigger("liszt:updated");
	  for (var i in menu) {
		menuItem = menu[i];
		opt = "<option value='" + menuItem.rouCode + "'>" + menuItem.rouName + " (" + menuItem.rouCode + ")</option>";
		$("#searchPrg").append(opt);
	  }
	  $("#searchPrg").trigger("liszt:updated");

	}).done(function () {
	  $.getJSON("/servlet/CalendarServlet?opt=pg-school-menu&ct=PG&ver=" + ver + "&callback=?", null, function (menu) {
		$("#sidebar").empty();
		for (var i in menu) {
		  var school = menu[i];
		  var schoolCode = school.schoolCode;
		  var schoolName = school.schoolName;
		  //var programmeCount = school.programmeCount;
		  $("#sidebar").append("<a href='#" + schoolCode + "' class='list-group-item school' data-toggle='collapse'>" + schoolName
				  + "</a>"
				  + "<div id='" + schoolCode + "' class='list-group subitem collapse'></div>");

		  var divisions = school.divisions;
		  for (var j in divisions) {
			var division = divisions[j];
			var divCode = division.divCode;
			var divName = division.divName;
			//var divProgrammeCount =  division.programmeCount;
			$("#" + schoolCode).append("<a href='#" + divCode + "' class='list-group-item groupProg' data-toggle='collapse'><span class='glyphicon glyphicon-chevron-right'></span>" + divName
					+ "</a>"
					+ "<div id='" + divCode + "' class='list-group subitem collapse'></div>");



			var programmes = division.programmes;
			for (var k in programmes) {
			  var programme = programmes[k];
			  var rouCode = programme.rouCode;
			  var rouName = programme.rouName;
			  $("#" + divCode).append("<a href='#' id='" + rouCode + "' class='list-group-item indProg'>"
					  + "<span class='glyphicon glyphicon-book'></span> " + rouName + " <small>(" + rouCode + ")</small></a>");


			}
		  }
		}
	  }).done(function () {
		$.getJSON("/servlet/CalendarServlet?opt=pgmod-menu&ct=PG&ver=" + ver + "&callback=?", null, function (modMenu) {
		  $("#searchModule").empty();
		  $("#searchModule").append(new Option()).trigger("liszt:updated");
		  for (var i in modMenu) {
			modMenuItem = modMenu[i];
			modOpt = "<option value='" + modMenuItem.modCode + "'>" + modMenuItem.modName + " (" + modMenuItem.modCode + ")</option>";
			$("#searchModule").append(modOpt);
		  }
		  $("#searchModule").trigger("liszt:updated");
		  $("#searchModulePanel").show();

		}).always(function () {
		  if (rouCodeParam !== undefined && rouCodeParam !== null && rouCodeParam.length > 0) {
			$('#semesterContent').empty();
			$('#introContent').empty();
			$('#tabContent').empty();
			$('#detailsContent').empty();
			$('#moduleContent').empty();
			$('#variants').hide();
			//if route code passed as only parameter/
			getPgOpts(rouCodeParam);
			//loadProgramme(rouCodeParam, moa, occ);//TODO
		  } else if (modCodeParam !== undefined && modCodeParam !== null && modCodeParam.length > 0) {
			$('#semesterContent').empty();
			$('#introContent').empty();
			$('#tabContent').empty();
			$('#detailsContent').empty();
			$('#moduleContent').empty();
			$('#variants').hide();
			loadModule(modCodeParam, 1);
		  }
		});
	  });

	});
	//now build schools menu


  });

  //build search list


  $('#menu a').click(function () {
	$('#semesterContent').empty();
	$('#introContent').empty();
	$('#tabContent').empty();
	$('#detailsContent').empty();
	$('#moduleContent').empty();
	$('#variants').hide();
	$('#shareLinkContent').empty();
	//getMOA($(this).attr('id'));
	getPgOpts($(this).attr('id'));
	//loadProgramme($(this).attr('id'),1); 
  });

  //search box used to pick programme
  $("#searchPrg").change(function () {
	$('#semesterContent').empty();
	$('#introContent').empty();
	$('#tabContent').empty();
	$('#detailsContent').empty();
	$('#moduleContent').empty();
	$('#variants').hide();
	$('#versionWarning').hide();
	//collapse expanded Divs
	var allActiveDivs = $('#sidebar .subitem');
	allActiveDivs.removeClass("in");

	//remove highlight from active elements
	var allActiveElements = $('#sidebar .active');
	allActiveElements.removeClass("active");
	$('#shareLinkContent').empty();
	//getMOA($(this).val());
	getPgOpts($(this).val());
	// loadProgramme($(this).val(),1);
  });

  $("#searchModule").change(function () {
	$('#mainContent').children().empty();

	loadModule($(this).val(), 1);
  });

  $(document.body).on('click', '.closepanel', function (e) {
	e.preventDefault();
	var collapsePanel = $(this).closest('.panel-collapse');

	collapsePanel.collapse('hide');

	collapsePanel.focus();

	//alert("click");
	//$("#panel3").collapse('hide');
  });
  $(document.body).on('click', '.checkAvailabilityBtn', function (e) {
	e.preventDefault();
	var spanElem = $(this).parent();
	var spanId = spanElem.attr("id");
	var moduleCode = spanElem.data("moduleCode");
	var mavOccurrence = spanElem.data("mavOccurrence");
	var mavSemCode = spanElem.data("mavSemCode");
	var mavSemSession = spanElem.data("mavSemSession");



	$.getJSON("/servlet/CalendarServlet?opt=places&ct=PG&mod=" + moduleCode +
			"&sess=" + mavSemSession +
			"&sem=" + mavSemCode +
			"&occ=" + mavOccurrence +
			"&callback=?", null, function (result) {
			  var spaces = Number(result.modSpaces);
			  if (spaces > 100) {
				$("#" + spanId).html("<span class='badge badge-info'>Space Available</span>");
			  } else if (spaces === -999) {
				$("#" + spanId).html("<span class='badge badge-info'>Error</span>");
			  } else if (spaces === -1) {
				$("#" + spanId).html("<span class='badge badge-info'>Unknown</span>");
			  } else if (spaces >= 0 && spaces < 5) {
				$("#" + spanId).html("<span class='badge badge-info'>Module Full</span>");
			  } else {
				$("#" + spanId).html("<span class='badge badge-info'>Available Places: " + result.modSpaces + " </span>");
			  }
			});

  });
});

//deprecating in favour of combined menu
function getMOA(routeCode) {
  $("#introContent").empty();
  $("#chooseMoaOccl").empty();
  $(".chooseYear").empty();
  $('#variants').hide();
  $.getJSON("/servlet/CalendarServlet?opt=moa-opts&rouCode=" + routeCode + "&ct=PG&ver=" + ver + "&callback=?", null, function (json) {
	if (json.length > 1) {
	  $("#chooseMoaOccl").append("<h3> Choose how you study</h3><div class='btn-group'>");
	  for (var x in json) {
		y = json[x][0];
		ys = json[x][1];
		$("#chooseMoaOccl").append("<button type='button' class='btn btn-default moa " + y + "' > " + ys + "</button>");
		$("#chooseMoaOccl ." + y).data("rouCode", routeCode);
		$("#chooseMoaOccl ." + y).data("moaCode", y);
	  }
	  $("#chooseMoaOccl").append("</div>");
	} else if (json.length === 1) {
	  var moaCode = json[0][0];
	  getOccl(routeCode, moaCode);
	}
  }
  );
}

//deprecating in favour of combined menu
function getOccl(rouCode, moaCode) {
  $("#chooseMoaOccl").empty();
  $('#variants').hide();
  $.getJSON("/servlet/CalendarServlet?opt=occl-opts&rouCode=" + rouCode + "&moa=" + moaCode + "&ct=PG&ver=" + ver + "&callback=?", null, function (json) {
	if (json.length > 1) {
	  $("#chooseMoaOccl").append("<h3> Choose start/location</h3><div class='btn-group'>");
	  for (var x in json) {
		y = json[x][0];
		start = json[x][1];
		place = json[x][2];
		if (y.length > 0) {
		  $("#chooseMoaOccl").append("<button type='button' class='btn btn-default occl " + y + "' > " + start + " (" + place + ")</button>");
		  $("#chooseMoaOccl ." + y).data("rouCode", rouCode);
		  $("#chooseMoaOccl ." + y).data("occlCode", y);
		  $("#chooseMoaOccl ." + y).data("moaCode", moaCode);
		}
	  }
	  $("#chooseMoaOccl").append("</div>");
	} else if (json.length === 1) {
	  var occlCode = json[0][0];
	  loadProgramme(rouCode, moaCode, occlCode);
	}
  }
  );
}

//function makes AJAX call to get JSON object with MOA and OCCL options - always at least one combination
function getPgOpts(rouCode) {
  $("#introContent").empty();
  $(".chooseYear").empty();
  $("#chooseOption").empty();
  $('#variants').hide();
  $.getJSON("/servlet/CalendarServlet?opt=pg-opts&rouCode=" + rouCode + "&ct=PG&ver=" + ver + "&callback=?", null, function (options) {
	if (options.length > 1) {
	  $("#chooseOption").append("<div class='panel panel-default'><div class='panel-heading'><h3>This programme has the following options</h3></div><div id='opts' class='list-group'>");
	  for (var x in options) {
		var moa = options[x][0];
		var moaName = options[x][1];
		var occ = options[x][2];
		var startMonth = options[x][3];
		var location = options[x][4];
		var optLabel = "Start: " + startMonth + ", Location: " + location + ", Attendance: " + moaName;
		$("#opts").append("<a href='#' class='list-group-item opt " + moa + occ + "'>" + optLabel + "</a>");
		$("#opts ." + moa + occ).data("rouCode", rouCode);
		$("#opts ." + moa + occ).data("occlCode", occ);
		$("#opts ." + moa + occ).data("moaCode", moa);
	  }
	  $("#chooseOption").append("</div></div>");
	} else if (options.length === 1) {
	  var moaCode = options[0][0];
	  var occlCode = options[0][2];
	  loadProgramme(rouCode, moaCode, occlCode);
	} else {
	  $("#chooseOption").append("An error occurred retrieving the options for " + rouCode);
	}
	window.scrollTo(0, 0);
  }
  );
}


function loadModule(moduleCode) {
  $('#introContent').html("<h1>Module Details</h1>");
  $('#versionWarning').hide();
  $.getJSON("/servlet/CalendarServlet?opt=pg-module&mod=" + moduleCode + "&ct=PG&ver=" + ver + "&callback=?", null, function (moduleDetail) {

	$('#moduleContent').html("<div class='panel panel-success'></div>");
	$('#moduleContent .panel-success').append("<div class='panel-heading'><h3 class='panel-title'>" + moduleDetail.modName + " (" + moduleDetail.modCode + ")</h3></div>");
	$('#moduleContent .panel-success').append("<div class='panel-body'></div>");
	$('#moduleContent .panel-body').append("<div class='row'><div class='col-md-4'><strong>Division:</strong></div><div class='col-md-8'>" + moduleDetail.dptName + "</div></div>");

	$('#moduleContent .panel-body').append("<div class='row'><div class='col-md-4'><strong>Semester:</strong></div><div class='col-md-8'>" + moduleDetail.mavSemSemester + "</div></div>");
	$('#moduleContent .panel-body').append("<div class='row'><div class='col-md-4'><strong>Credits:</strong></div><div class='col-md-8'>" + moduleDetail.modCredit + "</div></div>");
	$('#moduleContent .panel-body').append("<div class='row'><div class='col-md-4'><strong>Level:</strong></div><div class='col-md-8'>" + moduleDetail.modLevel + "</div></div>");
	if (moduleDetail.mavPrsTitle !== "[n]" && moduleDetail.mavPrsName !== "[n]") {
	  $('#moduleContent .panel-body').append("<div class='row'><div class='col-md-4'><strong>Module Co-ordinator:</strong></div><div class='col-md-8'>" + moduleDetail.mavPrsTitle + " " + moduleDetail.mavPrsName + "</div></div>");
	} else {
	  $('#moduleContent .panel-body').append("<div class='row'><div class='col-md-4'><strong>Module Co-ordinator:</strong></div><div class='col-md-8'></div></div>");
	}
	if (moduleDetail.modNote.length > 0) {
	  $('#moduleContent .panel-body').append("<div class='row'><div class='col-md-4'><strong>Notes:</strong></div><div class='col-md-8'>" + moduleDetail.modNote + "</div></div>");
	}
	var prerequisiteInfo = getPrerequisiteInfo(moduleDetail);
	if (prerequisiteInfo.length > 0) {
	  $('#moduleContent .panel-body').append("<div class='row'><div class='col-md-12'>" + prerequisiteInfo + "</div></div>");
	}
	var modDescr = moduleDetail.modDescr;
	if (modDescr !== undefined && modDescr.length > 0) {
	  $('#moduleContent .panel-body').append("<div class='row'><div class='col-md-12'><h3>Module Description</h3>" + modDescr + "</div></div>");
	}
	var allActive = $('#sidebar .school.active');
	allActive.removeClass("active");
	allActive.next('div').collapse('hide');
	var allActiveGroups = $('#sidebar .groupProg.active');

	allActiveGroups.removeClass("active");
	allActiveGroups.next('div').collapse('hide');
	window.scrollTo(0, 0);
  }).error(function (jqXHR, textStatus, errorThrown) {

	$('#introContent').html("<h1>" + "</h1><p>Data Not Available</p>");
	$('#moduleContent').empty();
  });
}

function getModuleDetails(moduleDetail, popoverBtnSelector, popoverSelector) {
  var modDetail = "";
  modDetail += "<div class='panel panel-success'>";


  modDetail += "<div class='panel-heading'><h3 class='panel-title'>" + moduleDetail.modName + " (" + moduleDetail.modCode + ")</h3></div>";
  modDetail += "<div class='panel-body'>";
  modDetail += "<div class='row'><div class='col-md-4'><strong>Division:</strong></div><div class='col-md-8'>" + moduleDetail.dptName + "</div></div>";

  modDetail += "<div class='row'><div class='col-md-4'><strong>Semester:</strong></div><div class='col-md-8'>" + moduleDetail.mavSemSemester + "</div></div>";
  modDetail += "<div class='row'><div class='col-md-4'><strong>Credits:</strong></div><div class='col-md-8'>" + moduleDetail.modCredit + "</div></div>";
  modDetail += "<div class='row'><div class='col-md-4'><strong>Level:</strong></div><div class='col-md-8'>" + moduleDetail.modLevel + "</div></div>";
  if (moduleDetail.mavPrsTitle !== "[n]" && moduleDetail.mavPrsName !== "[n]") {
	modDetail += "<div class='row'><div class='col-md-4'><strong>Module Co-ordinator:</strong></div><div class='col-md-8'>" + moduleDetail.mavPrsTitle + " " + moduleDetail.mavPrsName + "</div></div>";
  } else {
	modDetail += "<div class='row'><div class='col-md-4'><strong>Module Co-ordinator:</strong></div><div class='col-md-8'></div></div>";
  }
  if (moduleDetail.modNote.length > 0) {
	modDetail += "<div class='row'><div class='col-md-4'><strong>Notes:</strong></div><div class='col-md-8'>" + moduleDetail.modNote + "</div></div>";
  }
  var prerequisiteInfo = getPrerequisiteInfo(moduleDetail, popoverBtnSelector, popoverSelector);
  if (prerequisiteInfo.length > 0) {
	modDetail += "<div class='row'><div class='col-md-12'>" + prerequisiteInfo + "</div></div>";
  }
  var modDescr = moduleDetail.modDescr;
  if (modDescr !== undefined && modDescr.length > 0) {
	modDetail += "<div class='row'><div class='col-md-12'><h3>Module Description</h3>" + modDescr + "</div></div>";
  }

  modDetail += "</div>";
  modDetail += "</div>";

  return modDetail;
}

function loadProgramme(routeCode, moaCode, occlCode) {
  $('#mainContent').data("rc", routeCode);
  $("#chooseMoaOccl").empty();
  $('#variant-opts').empty();
  $("#chooseOption").empty();
  $('#variants').hide();
  //var semesters_per_year = 3;
  var envUrl = $(location).attr('protocol') + "//" + $(location).attr('host') + $(location).attr('pathname');
  //populate variants if any
  $.getJSON("/servlet/CalendarServlet?opt=pg-opts&rouCode=" + routeCode + "&moa=" + moaCode + "&occ=" + occlCode + "&ct=PG&ver=" + ver + "&callback=?", null, function (variants) {
	if (variants.length > 1) { //if only one it will be the one selected
	  $('#variants').show();
	  for (var x in variants) {
		var moa = variants[x][0];
		var moaName = variants[x][1];
		var occ = variants[x][2];
		var startMonth = variants[x][3];
		var location = variants[x][4];
		var optLabel = startMonth + ", " + location + ", " + moaName;
		if (!(moa === moaCode && occlCode === occ)) { //different to the one being viewed
		  $("#variant-opts").append("<a href='#' class='list-group-item variant " + moa + occ + "'>" + optLabel + "</a>");
		  $("#variant-opts ." + moa + occ).data("rouCode", routeCode);
		  $("#variant-opts ." + moa + occ).data("occlCode", occ);
		  $("#variant-opts ." + moa + occ).data("moaCode", moa);
		}
	  }
	} else {
	  $('#variant-opts').empty();
	  $('#variants').hide();
	}
  });

  $('.chooseYear').html("<h4>Year</h4><ul class='pagination pagination-lg pageYear'></ul>");

  $.getJSON("/servlet/CalendarServlet?opt=runpgcode&rouCode=" + routeCode + "&moa=" + moaCode + "&occ=" + occlCode + "&ct=PG&ver=" + ver + "&callback=?", null, function (json) {
	$('#tabContent').empty();
	var prgName = json.rouPrgName;
	var startMonth = $.trim(json.startMonth);
	var location = json.location;

	var progDirector = json.progDirector;
	if (progDirector !== '') {
	  progDirector = "<div class='row'><div class='col-md-4'><strong>Programme Director:</strong></div><div class='col-md-8'>" + progDirector + "</div></div>";
	}
	var owningSchool = json.dptName;
	if (owningSchool !== '') {
	  owningSchool = "<div class='row' ><div class='col-md-4'><strong>Owning Division:</strong></div><div class='col-md-8'>" + owningSchool + "</div></div>";
	}
	var moaName = moaCode;
	if (moaCode === 'FT') {
	  moaName = 'Full Time';
	} else if (moaCode === 'PT') {
	  moaName = 'Part Time';
	} else {
	  moaName = moaCode;
	}

	var pdttRept = $.trim(json.pdttRept);
	if (pdttRept !== null && pdttRept.length > 0) {
	  pdttRept = "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + pdttRept + "</div></div>";
	}
	var pdtDesc = $.trim(json.pdtDesc);
	if (pdtDesc !== null && pdtDesc.length > 0) {
	  pdtDesc = "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + pdtDesc + "</div></div>";
	}
	var name = json.rouName;
	var honsgen = $.trim(json.rouHonsGen);
	if (honsgen === "Hons") {
	  honsgen = "Hons";
	} else {
	  honsgen = "";
	}
	var uhlp = "";
	var initialText = json.initialText;//todo - check this is the right field
	var entryCriteria = json.entryCriteria;
	var trailingText = json.trailingText;
	if (initialText !== null && initialText.length > 0) {
	  uhlp += "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + initialText + "</div></div>";
	}
	if (entryCriteria !== null && entryCriteria.length > 0) {
	  uhlp += "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + entryCriteria + "</div></div>";
	}
	if (trailingText !== null && trailingText.length > 0) {
	  uhlp += "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + trailingText + "</div></div>";
	}

	$("#introContent").html("<h1>" + prgName + " " + honsgen + " " + name + " <span style='font-size: small; font-family:Verdana, Geneva, sans-serif'>(" + routeCode + ", " + moaCode + ", " + occlCode + ")</span></h1>" +
	  "<div class='row' style='margin-top:10px;'><div class='col-md-6'><h3>Start: " + startMonth + ", " + location + ", " + moaName + "</h3></div><div class='col-md-3 col-md-offset-1'><h4><a href='#' onclick='printableView(&#39;" + routeCode + "&#39;,&#39;" + moaCode + "&#39;,&#39;" + occlCode + "&#39;);' style='float: right' title='View a one-page, printable summary of this programme'><span class='glyphicon glyphicon-print' style='margin-right:5px;' ></span>Printable View</a> </h4></div><div class='col-md-2'  ><h4><a href='#' id='shareLink' data-id='shareLinkContent'  data-toggle='modal' data-target='#shareLinkModal' title='Share link to this programme' > <span class='glyphicon glyphicon-share' style='margin-right:5px;' ></span>Share</a></h4></div></div>" +
	  progDirector + owningSchool + pdttRept + pdtDesc + uhlp);

	var shareLinkContent = " The URL for this programme is below.  Copy it to share with others.<input type='text' class='form-control' id='shareLinkTxt' value='" + envUrl + "?rouCode=" + routeCode + "&versionId=" + ver + "&share=true' style='margin-top:10px;'></input>";
	$('#shareLinkContent').append(shareLinkContent);
	var semesterGroups = json.semesterGroupBeans;//array of all semester groups
	var newYear = false;
	var sems = []; //array of semesters to use to tell if a new year
	var year = 0;
	var group = 0;
	var compModuleClass = "list-group-item-success";
	var optModuleClass = "list-group-item-info";

	for (var i = 0; i < semesterGroups.length; i++) {//iterate through semester groups
	  var semesterGroup = semesterGroups[i];
	  group++;//same as i, no need?
	  var options = semesterGroup.groupOptions;//array of all options
	  var tabs = false;
	  if (options.length > 1) {
		tabs = true;
	  }
	  var set = 0;
	  for (var j = 0; j < options.length; j++) {//iterate through options
		var option = options[j];

		set++;//same as j - no need?
		var semesters = option.semestersInOption;//array of semesters within this option block

		for (var k = 0; k < semesters.length; k++) {//iterate through semesters
		  var semester = semesters[k];
		  var code = parseInt(semester.semesterCode);
		  var semName = semester.semesterName;
		  var pdmNote = semester.pdmNote;
		  //          var pdmDiv = ""; 
		  //          if(pdmNote!= null && pdmNote.length > 0) {
		  //            pdmDiv = "<div class='alert alert-danger'> <strong>" + pdmNote + "</strong></div>"
		  //          }

		  if (i === 0 && j === 0 && k === 0) { //first semesterGroup, first option, first semester
			newYear = true;
			year++;
			sems.push(semName);
		  } else if ($.inArray(semName, sems) === -1 && j === 0) { //new semester and option 1
			newYear = false;
			sems.push(semName);
		  } else if (j === 0) { //else if repeated semester and still option 1 - only increment year on option 1
			newYear = true;
			sems = []; //reset array of semesters
			sems.push(semName);
			year++;
		  } else {
			newYear = false;
		  }

		  /* old year handling code
		   year = getYear(code, semesters_per_year);
		   if(i==0 && j==0 && k==0) {
		   newYear = true;
		   } else {
		   newYear = isNewYear(code, semesters_per_year);
		   }*/

		  //newYear = isOdd(code);//cludge alert, will do for now...
		  //if(newYear && set=="1") { //try to make newYear better
		  if (newYear) { //|| newOption
			$('.chooseYear .pageYear').append("<li><a href='#year_" + year + "' class='goToYear yearlink" + year + "'>" + year + "</a></li>");

			$('#semesterContent').append("<div id='year" + year + "' style='display:none' class='showYear'></div>");
			//build the tabs for this year, content will come later...
			if (!tabs) {
			  $('.chooseYear .pageYear li a.yearlink' + year).data("tabs", "false");//set attribute indiciating no tabs with the content pane
			  $('#semesterContent #year' + year).append("<div id='option" + set + "'></div></div>");
			}
			if (tabs) {
			  $('.chooseYear .pageYear li a.yearlink' + year).data("tabs", "true");//set attribute indiciating tabs with the content pane
			  $('#semesterContent #year' + year).append("<div class='alert alert-danger'> <strong>There are " + options.length + " alternative paths in year " + year + ".  Please review all options carefully.</strong></div>");
			  $('#semesterContent #year' + year).append("<ul class='nav nav-tabs' id='group" + group + "' data-tabs='tabs'  ></ul>");
			  $('#tabContent').append("<div id='year" + year + "'></div>");

			  for (var m = 0; m < options.length; m++) {//iterate through options again
				var option = options[m];

				var optSet = m + 1;//option.set;
				$('#semesterContent #group' + group).append("<li id='tab_option" + optSet + "' ><a href='#' id='year" + year + "_option" + optSet + "' data-toggle='tab' class='goToOption'>Option " + optSet + "</a></li>");

				$('#year' + year + '_option' + optSet).data("year", year);
				$('#year' + year + '_option' + optSet).data("option", optSet);
				if (m === 0) {

				  do_goToOption($('#year' + year + '_option' + optSet));

				}

				$('#tabContent #year' + year).append("<div class='tab-pane' id='option" + optSet + "'></div>");
			  }
			}//finished building tabs structure
			$('.tab-pane').hide();
		  }
		  $('#semesterContent #year' + year + ' #option' + set).append("<div id='sem" + code + "' ></div>");
		  $('#tabContent #year' + year + ' #option' + set).append("<div id='sem" + code + "' ></div>");
		  $('#year' + year + ' #option' + set + ' #sem' + code).append("<h2>" + semName + " Semester</h2>");
		  $('#year' + year + ' #option' + set + ' #sem' + code).append("<div class='compulsoryModules'></div>");

		  $('#year' + year + ' #option' + set + ' #sem' + code).append("<div class='optionalModules'></div>");
		  $('#year' + year + ' #option' + set + ' #sem' + code).append("<div class='dissertationModules'></div>");


		  var collections = semester.collections;
		  for (var y = 0; y < collections.length; y++) {//iterate through collections
			var collection = collections[y];
			var type = collection.collectionType;
			var colStatCode = collection.collectionStatusCode;
			//if (colStatCode.indexOf("C") == 0){
			//  type = "COMP";
			//}
			collapseOptions = "false";
			moduleOpts = collection.mods;
			moduleDivTitleList = "";
			if (moduleOpts.length > 4) {
			  collapseOptions = "true";
			}
			if (moduleOpts.length > 1) {
			  moduleDivTitleList = "List";
			}

			collectionNote = collection.collectionNotes;

			if (colStatCode.indexOf("E") > -1) {//Optional
			  if (colStatCode.indexOf("C") === 0) { //it's a choice from list but choosing at least 1 is compulsory
				modulePanelClass = compModuleClass;
				moduleDivClass = "compulsoryModules";
				moduleDivTitle = "Compulsory Module ";
			  } else {
				modulePanelClass = optModuleClass;
				moduleDivClass = "optionalModules";
				moduleDivTitle = "Option Module ";
			  }
			  $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<br /><br />");
			  $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<h4><span class='glyphicon glyphicon-list' style='margin-right:5px;'></span>" + moduleDivTitle + moduleDivTitleList + "</h4>");

			} else {//compulsory
			  modulePanelClass = compModuleClass;
			  moduleDivClass = "compulsoryModules";
			  moduleDivTitle = "Compulsory Module ";
			  if (colStatCode === "D") {
				moduleDivClass = "dissertationModules";
				moduleDivTitle = "Dissertation ";
			  }
			  $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<br /><br />");
			  if (type === "COMP") {
				$('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<h4><span class='glyphicon glyphicon-star' style='margin-right:5px;'></span>" + moduleDivTitle + moduleDivTitleList + "</h4>");
			  } else {
				$('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<h4><span class='glyphicon glyphicon-star-empty' style='margin-right:5px;'></span>" + moduleDivTitle + moduleDivTitleList + "</h4>");
			  }
			  if (moduleOpts.length > 1 && type === "COMP") { //more than one option and not CHOICE (which gets label added below)
				$('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass + " h4").last().append("<span class='badge choice_label' title='" + collectionNote + "'>" + collectionNote + "</span>");
			  }

			}



			collectionId = collection.collectionSemester + collection.collectionOverarchSeqn;
			if (type === "LIST" || type === "CHOICE") {
			  // var accordStyle = "background-image:linear-gradient(to bottom, #FDF6CF 0, #FCFAF1 100%)";
			  var accordStyle = "background-image:linear-gradient(to bottom, #DFECF3 0, #B4D5E6 100%)";//blue
			  if (colStatCode === "C" || colStatCode === "CLC" || colStatCode === "D" || colStatCode === "R") { //compulsory style
				accordStyle = "background-image:linear-gradient(to bottom, #CCF2BC 0, #EBEFE9 100%)";
			  }
			  var size = collection.collectionSize;
			  if (size !== "" && typeof size !== 'undefined') {
				size = size + " choices";
			  } else {
				size = "";
			  }
			  if (collectionNote !== null && collectionNote.length > 0) {
				if (collapseOptions === "true") {
				  $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<div class='panel-group' id='" + collectionId + "_group'><div class='panel panel-default' id='panel_y" + year + "_o" + set + "_s" + code + "_" + collectionId + "'><div class='panel-heading' style='" + accordStyle + "'> <h4 class='panel-title'><a class='accordion-toggle' data-toggle='collapse' data-parent='#" + collectionId + "_group' href='#y" + year + "_o" + set + "_s" + code + "_" + collectionId + "'>" + collectionNote + "</a> <span class='label choice_size'>" + size + "</span></h4></div></div></div>");//need id?
				} else {
				  $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass + " h4").last().append("<span class='badge choice_label' title='" + collectionNote + "'>" + collectionNote + "</span>");
				}
			  }
			}
			collectionFootnote = collection.collectionFootnote;

			if (collapseOptions === "true") {
			  var obj1 = $('#panel_y' + year + '_o' + set + '_s' + code + '_' + collectionId);


			  obj1.append(
				"<div id='y" + year + "_o" + set + "_s" + code + "_" + collectionId + "' class='panel-collapse collapse'><div class='panel-body'>" +
				"</div></div>");
			  var panelObj = $('#y' + year + '_o' + set + '_s' + code + '_' + collectionId + ' .panel-body');
			  //var furtherInfoObj = $('#y' + year + '_o' + set + '_s' + code+ '_' + collectionId  + ' .panel-body .' + modulePanelClass + ' button') ;
			  for (var z = 0; z < moduleOpts.length; z++) {
				moduleDetail = moduleOpts[z];
				//$('#year'+year+' #option'+set + ' #sem'+code + ' .' + moduleDivClass + ' #' + collectionId + '_group .panel #' + collectionId ).append(
				//getprerequisite data
				//var prerequisiteInfo = getPrerequisiteInfo(moduleDetail, "#y" + year + "_o" + set + "_s" + code+ "_c" + y+"_button" + z,"#y" + year + "_o" + set + "_s" + code+ "_c" + y+"_popover" + z);//Todo second param check
				escapedModNote = moduleDetail.modNote.replace(/'/g, "&#39;");
				/*dataContent = "<div id='y" + year + "_o" + set + "_s" + code+ "_c" + y +"_popover" + z 
				 + "'><strong>"+moduleDetail.dptName+"</strong><br /><strong>Module Coordinator: </strong>"
				 +moduleDetail.mavPrsTitle+" "+moduleDetail.mavPrsName+
				 "<br /><strong>Level: </strong>"
				 +moduleDetail.modLevel
				 +"<br />";
				 if (moduleDetail.modNote != null && moduleDetail.modNote.length > 0){
				 dataContent = dataContent + "<strong>Notes: </strong>"+escapedModNote+ "<br />" 
				 }
				 dataContent = dataContent + prerequisiteInfo + "</div>"; 
				 */
				//new bit
				dataContent = "<div id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_popover" + z
				  + "'>" + getModuleDetails(moduleDetail, "#y" + year + "_o" + set + "_s" + code + "_c" + y + "_button" + z, "#y" + year + "_o" + set + "_s" + code + "_c" + y + "_popover" + z) + "</div>";
				//end new bit
				if (showAvailabilityBtn
				  && (moduleDetail.mavSemSemester !== null && moduleDetail.mavSemSemester.length > 0 && moduleDetail.mavSemSemester !== "[n]")
				  && (moduleDetail.mavSemSession !== null && moduleDetail.mavSemSession.length > 0 && moduleDetail.mavSemSession !== "[n]")
				) {
				  checkAvailabilityBtn = "<a href='#'  class='checkAvailabilityBtn' >Check Availability</a>";
				} else {
				  if (sitsAvailable === "N" || modSpacesCheckYN === "N") {
					checkAvailabilityBtn = "Space Availability Check Offline";
				  } else {
					checkAvailabilityBtn = "";
				  }
				}
				panelContent = "<span class='list-group-item " + modulePanelClass + "'>" +
				  "<h4 class='list-group-item-heading'>" + moduleDetail.modName + "</h4>" +
				  "<span class='badge'>" + moduleDetail.mavSemSemester + "</span>" +
				  "<span class='badge'>" + moduleDetail.modCredit + " Credits</span>" +
				  "<p class='list-group-item-text'>" + moduleDetail.modCode + "</p>" +
				  "<p><button id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_button" + z + "' data-id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_popover" + z + "' class='btn btn-primary' ' data-toggle='modal' data-target='#detailsModal'  >Further Info</button>" +
				  "<span id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z + "' style='float: right'>" + checkAvailabilityBtn + "</span>" +
				  "</p>" +
				  "</span>";

				panelObj.append(panelContent);
				$('#detailsContent').append(dataContent);
				$("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("moduleCode", moduleDetail.modCode);
				$("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("mavOccurrence", moduleDetail.mavOccurrence);
				$("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("mavSemCode", moduleDetail.mavSemCode);
				$("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("mavSemSession", moduleDetail.mavSemSession);


			  }


			  panelObj.append("<div style='text-align:center;'><br /><button type='button' class='btn closepanel'>Close Collection <span class=' glyphicon glyphicon-chevron-up' ></span></button></div>");
			  if (collectionFootnote !== null && collectionFootnote.length > 0) {
				//obj1.append("</br><span class='glyphicon glyphicon-info-sign' style='margin-right:5px;margin-left:15px;'></span><i>" + collectionFootnote + "</i>");
				$('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<span class='glyphicon glyphicon-info-sign' style='margin-right:5px;margin-left:15px;'></span><i>" + collectionFootnote + "</i>");
			  }
			} else {
			  for (var z = 0; z < moduleOpts.length; z++) {
				moduleDetail = moduleOpts[z];
				//var prerequisiteInfo = getPrerequisiteInfo(moduleDetail, "#y" + year + "_o" + set + "_s" + code+ "_c" + y+"_button" + z, "#y" + year + "_o" + set + "_s" + code+ "_c" + y +"_popover" + z);
				escapedModNote = moduleDetail.modNote.replace(/'/g, "&#39;");
				/*     dataContent = "<div id='y" + year + "_o" + set + "_s" + code+ "_c" + y + "_popover" + z 
				 +"'><strong>"+moduleDetail.dptName+"</strong><br /><strong>Module Coordinator: </strong>"
				 +moduleDetail.mavPrsTitle+" "+moduleDetail.mavPrsName 
				 +"<br /><strong>Level: </strong>"
				 +moduleDetail.modLevel
				 +"<br />";
				 if (moduleDetail.modNote != null && moduleDetail.modNote.length > 0){
				 dataContent = dataContent + "<strong>Notes: </strong>"+escapedModNote+ "<br />" 
				 }
				 dataContent = dataContent + prerequisiteInfo + "</span>";  */
				//new bit
				dataContent = "<div id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_popover" + z
				  + "'>" + getModuleDetails(moduleDetail, "#y" + year + "_o" + set + "_s" + code + "_c" + y + "_button" + z, "#y" + year + "_o" + set + "_s" + code + "_c" + y + "_popover" + z) + "</div>";
				//end of new bit
				if (showAvailabilityBtn
				  && (moduleDetail.mavSemSemester !== null && moduleDetail.mavSemSemester.length > 0 && moduleDetail.mavSemSemester !== "[n]")
				  && (moduleDetail.mavSemSession !== null && moduleDetail.mavSemSession.length > 0 && moduleDetail.mavSemSession !== "[n]")
				) {
				  checkAvailabilityBtn = "<a href='#'  class='checkAvailabilityBtn' >Check Availability</a>";
				} else {
				  if (sitsAvailable === "N" || modSpacesCheckYN === "N") {
					checkAvailabilityBtn = "Space Availability Check Offline";
				  } else {
					checkAvailabilityBtn = "";
				  }
				}
				$('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<span class='list-group-item " + modulePanelClass + "'>" +
				  "<h4 class='list-group-item-heading'>" + moduleDetail.modName + "</h4>" +
				  "<span class='badge'>" + moduleDetail.mavSemSemester + "</span>" +
				  "<span class='badge'>" + moduleDetail.modCredit + " Credits</span>" +
				  "<p class='list-group-item-text'>" + moduleDetail.modCode + "</p>" +
				  "<p><button id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_button" + z + "' data-id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_popover" + z + "' class='btn btn-primary' data-toggle='modal' data-target='#detailsModal' >Further Info</button>" +
				  "<span id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z + "' style='float: right'>" + checkAvailabilityBtn + "</span>" +
				  "</p>" +
				  "</span>");
				$('#detailsContent').append(dataContent);
				$("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("moduleCode", moduleDetail.modCode);
				$("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("mavOccurrence", moduleDetail.mavOccurrence);
				$("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("mavSemCode", moduleDetail.mavSemCode);
				$("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("mavSemSession", moduleDetail.mavSemSession);




			  }
			  if (collectionFootnote !== null && collectionFootnote.length > 0) {
				$('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("</br><span class='glyphicon glyphicon-info-sign' style='margin-right:5px;margin-left:15px;'></span><i>" + collectionFootnote + "</i>");
			  }
			}
		  }
		  $(".hideCollectionlink").hide();

		  $('#year' + year + ' #option' + set + ' #sem' + code).append("<br /><br />");
		}
	  }
	}


	$('#year' + year + ' #option' + set + ' #sem' + code).append("<br /><br />");
	window.scrollTo(0, 0);

  }).done(function () {

	$('#semesterContent div').first().show();
	$('.chooseYear li:first-child').addClass("active");
	//hide years menu if only 1 - might not be best way
	var noOfYears = $('#mainChooseYear li').length;//TODO - still works?
	if (noOfYears === 1) {
	  $('.chooseYear').empty();
	}
	//not sure if this is needed
	var noOfVariants = $('#variant-opts a').length;
	if (noOfVariants === 0) {
	  $('#variants').hide();
	}
	//if tab options in first year show them
	if ($('#year1 .nav-tabs')) {
	  $('#year1 .tab-pane#option1').show();
	  $('#tab_option1').addClass('active');
	}
  }).error(function (jqXHR, textStatus, errorThrown) {
	//console.log("error " + textStatus);
	//console.log("incoming Text " + jqXHR.responseText);
	$('#introContent').html("<h1>" + "</h1><p>Data Not Available</p>");
	$('#chooseSem').empty();
  });



//another for loop here for optional modules

}


function getPrerequisiteInfo(moduleDetail, popoverBtnSelector, popoverSelector) {

  var preMods = moduleDetail.preMods;
  var preTakenMods = moduleDetail.preTakenMods;
  var recoMods = moduleDetail.recoMods;
  var nonMods = moduleDetail.nonMods;
  var coMods = moduleDetail.coMods;

  var prerequisiteInfo = "";

  if (preMods !== null && preMods.length > 0) {
	//prerequisiteInfo += "<Strong>Pre-requisites: </strong><ul>";
	for (var pmCount = 0; pmCount < preMods.length; pmCount++) {
	  premod = preMods[pmCount];

	  if (pmCount === 0) {
		var preModsTitle = premod.preReqTitle !== null ? premod.preReqTitle : "Compulsory Pass Prerequisites";
		var preModsDescr = premod.preReqDescr !== null ? premod.preReqDescr : "Before taking this module you must pass:";
		prerequisiteInfo += "<Strong>" + preModsTitle + "</strong><br/>" + preModsDescr + "<ul>";
	  }
	  var premodElementsCount = parseInt(premod.elementsCount);
	  if (premodElementsCount <= 1) {
		prerequisiteInfo += "<li>" + premod.label + premod.descr + " (" + premod.code + ")</li>";
	  } else {
		if (typeof popoverBtnSelector !== "undefined" && typeof popoverSelector !== "undefined") {
		  //      prerequisiteInfo += "<li>" + premod.label + premod.descr + " (<span class=\"collectionLink\">" + premod.code + "</span>)</li>";
		  prerequisiteInfo += "<li>" + premod.label + premod.descr
				  + "<span class='" + premod.code + "'>"
				  + "<span class='showCollectionlink'> (<a href=\"javascript:loadCollection(&#39;" + premod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\" >Show Details</a>)</span>"
				  + "<span class='hideCollectionlink'> (<a href=\"javascript:hideCollection(&#39;" + premod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\" >Hide Details</a>)</span>"
				  + "<span class='collectionContent'></span> </span></li>";
		} else {
		  prerequisiteInfo += "<li class='collDetails_" + premod.code + "'>" + premod.label + " " + premod.descr
				  + "</li>";
		  getCollection(premod.code, "collDetails_" + premod.code);

		}
	  }

	}
	prerequisiteInfo += "</ul>";
  }

  if (preTakenMods !== null && preTakenMods.length > 0) {
	//prerequisiteInfo += "<Strong>Pre-requisites: </strong><ul>";
	for (var ptCount = 0; ptCount < preTakenMods.length; ptCount++) {
	  pretakenmod = preTakenMods[ptCount];

	  if (ptCount === 0) {
		var ptModsTitle = pretakenmod.preReqTitle !== null ? pretakenmod.preReqTitle : "Module Content Prerequisites";
		var ptModsDescr = pretakenmod.preReqDescr !== null ? pretakenmod.preReqDescr : "Before taking this module you must have taken:";
		prerequisiteInfo += "<Strong>" + ptModsTitle + "</strong><br/>" + ptModsDescr + "<ul>";
	  }
	  var ptElementsCount = parseInt(pretakenmod.elementsCount);
	  if (ptElementsCount <= 1) {
		prerequisiteInfo += "<li>" + pretakenmod.label + pretakenmod.descr + " (" + pretakenmod.code + ")</li>";
	  } else {
		if (typeof popoverBtnSelector !== "undefined" && typeof popoverSelector !== "undefined") {

		  prerequisiteInfo += "<li>" + pretakenmod.label + pretakenmod.descr
				  + "<span class='" + pretakenmod.code + "'>"
				  + "<span class='showCollectionlink'> (<a href=\"javascript:loadCollection(&#39;" + pretakenmod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\" >Show Details</a>)</span>"
				  + "<span class='hideCollectionlink'> (<a href=\"javascript:hideCollection(&#39;" + pretakenmod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\" >Hide Details</a>)</span>"
				  + "<span class='collectionContent'></span> </span></li>";
		} else {
		  prerequisiteInfo += "<li class='collDetails_" + pretakenmod.code + "'>" + pretakenmod.label + " " + pretakenmod.descr
				  + "</li>";
		  getCollection(pretakenmod.code, "collDetails_" + pretakenmod.code);

		}
	  }

	}
	prerequisiteInfo += "</ul>";
  }


  if (recoMods !== null && recoMods.length > 0) {
	//prerequisiteInfo += "<Strong>Pre-requisites: </strong><ul>";
	for (var rmCount = 0; rmCount < recoMods.length; rmCount++) {
	  recomod = recoMods[rmCount];

	  if (rmCount === 0) {
		var recoModsTitle = recomod.preReqTitle !== null ? recomod.preReqTitle : "Recommended Prerequisites";
		var recoModsDescr = recomod.preReqDescr !== null ? recomod.preReqDescr : "Before taking this module it is advised that you should have passed:";
		prerequisiteInfo += "<Strong>" + recoModsTitle + "</strong><br/>" + recoModsDescr + "<ul>";
	  }
	  var recoElementsCount = parseInt(recomod.elementsCount);
	  if (recoElementsCount <= 1) {
		prerequisiteInfo += "<li>" + recomod.label + recomod.descr + " (" + recomod.code + ")</li>";
	  } else {
		if (typeof popoverBtnSelector !== "undefined" && typeof popoverSelector !== "undefined") {

		  prerequisiteInfo += "<li>" + recomod.label + recomod.descr
				  + "<span class='" + recomod.code + "'>"
				  + "<span class='showCollectionlink'> (<a href=\"javascript:loadCollection(&#39;" + recomod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\" >Show Details</a>)</span>"
				  + "<span class='hideCollectionlink'> (<a href=\"javascript:hideCollection(&#39;" + recomod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\" >Hide Details</a>)</span>"
				  + "<span class='collectionContent'></span> </span></li>";
		} else {
		  prerequisiteInfo += "<li class='collDetails_" + recomod.code + "'>" + recomod.label + " " + recomod.descr
				  + "</li>";
		  getCollection(recomod.code, "collDetails_" + recomod.code);
		}
	  }

	}
	prerequisiteInfo += "</ul>";
  }


  if (nonMods !== null && nonMods.length > 0) {

	for (var nmCount = 0; nmCount < nonMods.length; nmCount++) {
	  nonmod = nonMods[nmCount];
	  if (nmCount === 0) {
		var nonModsTitle = nonmod.preReqTitle !== null ? nonmod.preReqTitle : "Prohibited Combinations";
		var nonModsDescr = nonmod.preReqDescr !== null ? nonmod.preReqDescr : "You may not take this module if you have previously passed:";
		prerequisiteInfo += "<Strong>" + nonModsTitle + "</strong><br/>" + nonModsDescr + "<ul>";
	  }
	  var nonmodElementsCount = parseInt(nonmod.elementsCount);
	  if (nonmodElementsCount <= 1) {

		prerequisiteInfo += "<li>" + nonmod.label + nonmod.descr + " (" + nonmod.code + ")</li>";
	  } else {
		if (typeof popoverBtnSelector !== "undefined" && typeof popoverSelector !== "undefined") {

		  prerequisiteInfo += "<li>" + nonmod.label + nonmod.descr
				  + "<span class='" + nonmod.code + "'>"
				  + "<span class='showCollectionlink'> (<a href=\"javascript:loadCollection(&#39;" + nonmod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\">Show Details</a>)</span>"
				  + "<span class='hideCollectionlink'> (<a href=\"javascript:hideCollection(&#39;" + nonmod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\">Hide Details</a>)</span>"
				  + "<span class='collectionContent'></span></span></li>";
		} else {
		  prerequisiteInfo += "<li class='collDetails_" + nonmod.code + "'>" + nonmod.label + " " + nonmod.descr
				  + "</li>";
		  getCollection(nonmod.code, "collDetails_" + nonmod.code);
		}

	  }
	}
	prerequisiteInfo += "</ul>";
  }

  if (coMods !== null && coMods.length > 0) {


	for (var cmCount = 0; cmCount < coMods.length; cmCount++) {
	  comod = coMods[cmCount];
	  if (cmCount === 0) {
		var coModsTitle = comod.preReqTitle !== null ? comod.preReqTitle : "Co-requisite combinations";
		var coModsDescr = comod.preReqDescr !== null ? comod.preReqDescr : "You must also take modules:";
		prerequisiteInfo += "<Strong>" + coModsTitle + "</strong><br/>" + coModsDescr + "<ul>";

	  }
	  var comodElementsCount = parseInt(comod.elementsCount);
	  if (comodElementsCount <= 1) {
		prerequisiteInfo += "<li>" + comod.label + comod.descr + " (" + comod.code + ")</li>";

	  } else {
		//prerequisiteInfo += "<li>" + comod.label + comod.descr + " (<span class=\"collectionLink\" >" + comod.code + "</span>)</li>"; 
		if (typeof popoverBtnSelector !== "undefined" && typeof popoverSelector !== "undefined") {
		  prerequisiteInfo += "<li>" + comod.label + comod.descr
				  + "<span class='" + comod.code + "'>"
				  + "<span class='showCollectionlink'> (<a href=\"javascript:loadCollection(&#39;" + comod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\"><span class='collectionlabel'>Show Details</span></a>)</span>"
				  + "<span class='hideCollectionlink'> (<a href=\"javascript:hideCollection(&#39;" + comod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\"><span class='collectionlabel'>Hide Details</span></a>)</span>"
				  + "<span class='collectionContent'></span></span></li>";
		} else {
		  prerequisiteInfo += "<li class='collDetails_" + comod.code + "'>" + comod.label + " " + comod.descr
				  + "</li>";
		  getCollection(comod.code, "collDetails_" + comod.code);

		}

	  }
	}
	prerequisiteInfo += "</ul>";
  }


  return prerequisiteInfo;
}

function loadCollection(fmcCode, popoverBtnSelector, popoverSelector) {
  var collectionList = $(popoverSelector.trim() + " ." + fmcCode + " .collectionContent");
  var collectionListHtml = "<ul class='list-group'>";
  $.getJSON("/servlet/CalendarServlet?opt=collection&fmcc=" + fmcCode + "&ct=PG&ver=" + ver + "&callback=?", null, function (collection) {
	for (var i in collection) {
	  moduleInfo = collection[i];
	  collectionListHtml += "<li class='list-group-item'>" + moduleInfo[1] + " (" + moduleInfo[0] + ")</li>";
	}
	collectionListHtml += "</ul>";
	collectionList.html(collectionListHtml);
	var hideLink = $(popoverSelector.trim() + " ." + fmcCode + " .hideCollectionlink");
	var showLink = $(popoverSelector.trim() + " ." + fmcCode + " .showCollectionlink");
	hideLink.show();
	showLink.hide();

  }).error(function (jqXHR, textStatus, errorThrown) {
	//console.log("error " + textStatus);
	//console.log("incoming Text " + jqXHR.responseText);

  });
}

function getCollection(fmcCode, listClass) {

  var collectionListHtml = "";
  $.getJSON("/servlet/CalendarServlet?opt=collection&fmcc=" + fmcCode + "&ct=PG&ver=" + ver + "&callback=?", null, function (collection) {
	collectionListHtml = "<ul class='list-group'>";

	for (var i in collection) {
	  moduleInfo = collection[i];
	  if (moduleInfo[1] !== null && moduleInfo[1] !== "Module not currently available") {
		collectionListHtml += "<li class='list-group-item'>" + moduleInfo[1] + " (" + moduleInfo[0] + ")</li>";
	  } else {
		collectionListHtml += "<li class='list-group-item'>" + moduleInfo[0] + "</li>";
	  }
	}
	collectionListHtml += "</ul>";


  }).done(function () {
	$("." + listClass).append(collectionListHtml);

  });


}

function hideCollection(fmcCode, popoverBtnSelector, popoverSelector) {


  var collectionList = $(popoverSelector.trim() + " ." + fmcCode + " .collectionContent");
  var hideLink = $(popoverSelector.trim() + " ." + fmcCode + " .hideCollectionlink");
  var showLink = $(popoverSelector.trim() + " ." + fmcCode + " .showCollectionlink");
  collectionList.empty();
  hideLink.hide();
  showLink.show();
  // popover.show();

}

function getYear(code, semesters_per_year) {
  var year = 1;
  if (semesters_per_year === 3) {

	switch (code) {
	  case 1:
	  case 2:
	  case 3:
		year = 1;
		break;
	  case 4:
	  case 5:
	  case 6:
		year = 2;
		break;
	  case 7:
	  case 8:
	  case 9:
		year = 3;
		break;
	  case 11:
	  case 12:
	  case 13:
		year = 4;
		break;
	  case 14:
	  case 15:
	  case 16:
		year = 5;
		break;


	}
  } else {

	switch (code) {
	  case 1:
	  case 2:
		year = 1;
		break;
	  case 3:
	  case 4:
		year = 2;
		break;
	  case 5:
	  case 6:
		year = 3;
		break;
	  case 7:
	  case 8:
		year = 4;
		break;
	  case 9:
	  case 10:
		year = 5;
		break;


	}
  }
  return year;
}

function isNewYear(code, semesters_per_year) {
  var newYear = false;
  if (semesters_per_year === 3) {
	switch (code) {
	  case 1:
	  case 4:
	  case 7:
	  case 10:
	  case 13:
		newYear = true;
		break;

	  default:
		newYear = false;
		break;
	}
  } else {

	switch (code) {
	  case 1:
	  case 3:
	  case 5:
	  case 7:
	  case 9:
		newYear = true;
		break;

	  default:
		newYear = false;
		break;
	}
  }
  return newYear;
}

function getSearchParameters() {
  var prmstr = window.location.search.substr(1);
  return prmstr !== null && prmstr !== "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
  var params = {};
  var prmarr = prmstr.split("&");
  for (var i = 0; i < prmarr.length; i++) {
	var tmparr = prmarr[i].split("=");
	params[tmparr[0]] = tmparr[1];
  }
  return params;
}

var params = getSearchParameters();


//function to create html for printableView window
function printableView(routeCode, moaCode, occlCode) {

  //var semesters_per_year = 2;
  var footnoteCounter = 0;
  //console.log('get json for '+routeCode+', '+moaCode+', '+occlCode+', '+ver);
  $.getJSON("/servlet/CalendarServlet?opt=runpgcode&rouCode=" + routeCode + "&moa=" + moaCode + "&occ=" + occlCode + "&ct=PG&ver=" + ver + "&callback=?", null, function (json) {
	//  $('#tabContent').empty();
	$('.whileLoading').show(); //show the loading gif
	$('#printableView').children().empty();
	$('#printableView').hide();
	var prgName = json.rouPrgName;
	var startMonth = $.trim(json.startMonth);
	var location = json.location;

	var progDirector = json.progDirector;
	if (progDirector !== null && progDirector !== '') {
	  progDirector = "<div class='row'><div class='col-md-4'><strong>Programme Director:</strong></div><div class='col-md-8'>" + progDirector + "</div></div>";
	}
	var owningSchool = json.dptName;
	if (owningSchool !== '') {
	  owningSchool = "<div class='row'><div class='col-md-4'><strong>Owning Division:</strong> </div><div class='col-md-8'>" + owningSchool + "</div></div>";
	}
	var pdttRept = $.trim(json.pdttRept);
	if (pdttRept !== null && pdttRept.length > 0) {
	  pdttRept = "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + pdttRept + "</div></div>";
	}
	var pdtDesc = $.trim(json.pdtDesc);
	if (pdtDesc !== null && pdtDesc.length > 0) {
	  pdtDesc = "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + pdtDesc + "</div></div>";
	}
	var moaName = moaCode;
	if (moaCode === 'FT') {
	  moaName = 'Full Time';
	} else if (moaCode === 'PT') {
	  moaName = 'Part Time';
	} else {
	  moaName = moaCode;
	}

	var name = json.rouName;
	var honsgen = $.trim(json.rouHonsGen);
	if (honsgen === "Hons") {
	  honsgen = "Hons";
	} else {
	  honsgen = "";
	}
	var uhlp = "";
	var initialText = json.initialText;//todo - check this is the right field
	var entryCriteria = json.entryCriteria;
	var trailingText = json.trailingText;
	if (initialText !== null && initialText.length > 0) {
	  uhlp += "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + initialText + "</div></div>";
	}
	if (entryCriteria !== null && entryCriteria.length > 0) {
	  uhlp += "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + entryCriteria + "</div></div>";
	}
	if (trailingText !== null && trailingText.length > 0) {
	  uhlp += "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + trailingText + "</div></div>";
	}

	//    $('#printableView #introContent').html("<h1>"+prgName+" "+honsgen+" "+name+ "</h1><a href='#' onClick='printPage();' id='printTable'><span class='glyphicon glyphicon-print'></span>Print</a><br/> "  + uhlp);
	$('#printableView #introContent').html("<h1>" + prgName + " " + honsgen + " " + name + " <span style='font-size: small; font-family:Verdana, Geneva, sans-serif'>(" + routeCode + ", " + moaCode + ", " + occlCode + ") (version: "+activeVersionLabel+", id: "+ver+")</span></h1>"
			+ "<h4>Start: " + startMonth + ", " + location + ", " + moaName + "</h4>" + progDirector + owningSchool + "<span class='float:right'><a href='#' onClick='printPage();' id='printTable'><span class='glyphicon glyphicon-print'></span>Print</a></span>"
			+ pdttRept + pdtDesc + uhlp);
	var semesterGroups = json.semesterGroupBeans;//array of all semester groups
	var newYear = false;
	var sems = []; //array of semesters to use to tell if a new year
	var year = 0;
	var group = 0;
	var compModuleClass = "list-group-item-success";
	var optModuleClass = "list-group-item-warning";

	$('#printableView #semesterContent').append("<table id='dptable' class='table table-bordered table-condensed'></table><div id='footnotes'></div>");
	var warningClass = "";
	for (var i = 0; i < semesterGroups.length; i++) {//iterate through semester groups
	  if (warningClass !== "warning") {
		warningClass = "warning";
	  } else {
		warningClass = "danger";
	  }
	  var semesterGroup = semesterGroups[i];
	  group++;//same as i, no need?
	  var options = semesterGroup.groupOptions;//array of all options
	  var tabs = false;
	  if (options.length > 1) {
		tabs = true;
	  }
	  var set = 0;
	  var newOption = false;
	  var optNo = 0;
	  for (var j = 0; j < options.length; j++) {//iterate through options
		var option = options[j];

		set++;//same as j - no need?
		var semesters = option.semestersInOption;//array of semesters within this option block

		for (var k = 0; k < semesters.length; k++) {//iterate through semesters
		  var semester = semesters[k];
		  var code = parseInt(semester.semesterCode);
		  var semName = semester.semesterName;
		  var pdmNote = semester.pdmNote;
//          var pdmDiv = ""; 
//          if(pdmNote!= null && pdmNote.length > 0) {
//            pdmDiv = "<div class='alert alert-danger'> <strong>" + pdmNote + "</strong></div>"
//          }
		  //year = getYear(code, semesters_per_year);
		  //newYear = isNewYear(code, semesters_per_year);

		  if (i === 0 && j === 0 && k === 0) { //first semesterGroup, first option, first semester
			newYear = true;
			year++;
			sems.push(semName);
		  } else if ($.inArray(semName, sems) === -1 && j === 0) {
			newYear = false;
			sems.push(semName);
		  } else if (j === 0) { //else if option 1
			newYear = true;
			sems = []; //reset array of semesters
			sems.push(semName);
			year++;
		  }
		  if (j !== optNo) {
			newOption = true;
			optNo++;
		  } else {
			newOption = false;
		  }

		  if (newYear || newOption) {
			if (options.length > 1) {
			  $('#printableView #semesterContent #dptable').append("<tr class='yearRow info'><td colspan='2'>Year " + year + " Option " + (j + 1) + "</td></tr>");
			} else {
			  $('#printableView #semesterContent #dptable').append("<tr class='yearRow info'><td colspan='2'>Year " + year + "</td></tr>");
			}
		  }
		  if (options.length > 1) {
			$('#printableView #semesterContent #dptable').append("<tr class='semesterRow " + warningClass + "'><td> " + semName + " Semester </td><td></td></tr>");

		  } else {
			$('#printableView #semesterContent #dptable').append("<tr class='semesterRow active'><td nowrap>" + semName + " Semester </td><td></td></tr>");
		  }
		  //if(newYear && set=="1") { 
		  if (newYear) {
			if (!tabs) {
			}
			if (tabs) {
			  for (var m = 0; m < options.length; m++) {//iterate through options again
				var option = options[m];

				var optSet = m + 1;//option.set;
				if (m === 0) {

				  do_goToOption($('#year' + year + '_option' + optSet));

				}
			  }
			}//finished building tabs structure
			$('.tab-pane').hide();
		  }

		  var collections = semester.collections;
		  for (var y = 0; y < collections.length; y++) {//iterate through collections
			var collection = collections[y];
			var type = collection.collectionType;
			var colStatCode = collection.collectionStatusCode;
			collectionFootnote = collection.collectionFootnote;
			if (collectionFootnote !== null && collectionFootnote.length > 0) {
			  footnoteCounter++;
			}
			if (colStatCode.indexOf("E") > -1) {//Optional
			  moduleDivClass = "optionalModules";
			} else {//COMPULSORY
			  moduleDivClass = "compulsoryModules";
			}
			if (type === "CHOICE") {

			  $('#printableView #year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<h4></h4><div class='panel panel-default'></div>");


			}
			collapseOptions = "false";
			moduleOpts = collection.mods;
			if (moduleOpts.length > 1) {
			  collapseOptions = "true";

			}
			collectionId = collection.collectionSemester + collection.collectionOverarchSeqn;

			if (type === "LIST" || type === "CHOICE") {
			  collectionNote = collection.collectionNotes;
			  if (typeof collectionNote === 'undefined') {
				collectionNote = "";
			  }
			  collectionName = collection.collectionName;
			  if (typeof collectionName === 'undefined') {
				collectionName = "";
			  }
			  if (collectionName.length > 0) {
				collectionName = " (" + collectionName + ")";
			  }
			  var size = collection.collectionSize;
			  if (size !== "" && typeof size !== 'undefined') {

				size = size + " choices";
			  } else {
				size = "";
			  }

			  if (collectionNote !== null && collectionNote.length > 0) {
				if (collapseOptions === "true" || type === "CHOICE") {
				  //  $('#printableView #year'+year+' #option'+set + ' #sem'+code + ' .' + moduleDivClass).append("<div class='panel panel-default'><div class='panel-body'><h4 class='list-group-item-heading'>" + collectionNote +  collectionName + "</h4></div></div>");
				  //$('#printableView #semesterContent #dptable tr td').last().append(collectionNote +  collectionName);
				  $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append(collectionNote);
				  if (collectionFootnote !== null && collectionFootnote.length > 0) {
					$('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append("<sup>" + footnoteCounter + "</sup>");
				  }
				  if (y < collections.length - 1) {
					$('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append("  ;  ");
				  }
				}

				/*else {
				 $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append(collectionNote);
				 
				 }*/

			  }
			}


			if (collapseOptions === "true" || type === "CHOICE") {

			  if (collectionFootnote !== null && collectionFootnote.length > 0) {
				$('#footnotes').append("<sup>" + footnoteCounter + "</sup><i>" + collectionFootnote + "</i></br>");

			  }
			} else {
			  for (var z = 0; z < moduleOpts.length; z++) {
				moduleDetail = moduleOpts[z];

				/*if (type == "CHOICE") {
				 
				 $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append(moduleDetail.modCode);
				 if(z < moduleOpts.length-1) {
				 $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append(" OR ");
				 
				 }
				 } else {*/

				$('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append(moduleDetail.modCode);
				if (z < moduleOpts.length - 1) {
				  $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append(" OR ");

				}
				// }
				if (collectionFootnote !== null && collectionFootnote.length > 0) {
				  $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append("<sup>" + footnoteCounter + "</sup>");
				}
				if (z === moduleOpts.length - 1 && y < collections.length - 1) {
				  $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append("  ;  ");
				}

			  }
			  if (collectionFootnote !== null && collectionFootnote.length > 0) {
				//  $('#printableView #year'+year+' #option'+set + ' #sem'+code + ' .' + moduleDivClass).append("<span class='glyphicon glyphicon-info-sign' style='margin-right:5px;margin-left:15px;'></span><i>" + collectionFootnote +"</i></br>" );
				$('#footnotes').append("<sup>" + footnoteCounter + "</sup><i>" + collectionFootnote + "</i></br>");

			  }
			}
		  }
		}
	  }

	}


  }).done(function () {
	//$('#printableView .showYear').show();
	$('.whileLoading').show();
	try {
	  var wnd = window.open("", "PGPrintableView", "scrollbars=1,width=1000,height=800");
	  wnd.document.open();
	  wnd.document.write("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">" +
			  "<html style='overflow-x: hidden'><head><title>Postgraduate Degree Programme Table</title>" +
			  "<link href=\"/javascript/bootstrap/css/bootstrap.min.css\" rel=\"stylesheet\">" +
			  "<link href=\"/javascript/bootstrap/css/bootstrap-theme.min.css\" rel=\"stylesheet\">" +
			  " <script>function printPage() {window.print();}</script>" +
			  "</head><body style='overflow-x: hidden'>" +
			  "</body>" +
			  "</html>");

	  try {
		//write div to new window body - works in IE
		wnd.document.body.innerHTML = $("#printableView").html().trim();
	  } catch (err) {
		try {
		  //write div to new window body - works in everything else
		  wnd.setTimeout(function () {
			wnd.document.body.innerHTML = $('#printableView').html().trim();
		  }, 1000); //wait for window to open then copy div to it
		} catch (err) {
		}
	  }

	  wnd.document.close();
	  //wnd.document.focus();
	  $('.whileLoading').hide(); //hide the loading gif
	} catch (err) {
	  if (isSafari()) {
		$('#printError').html("<div class='row' style='margin-top:10px;'><div class='col-md-6 col-md-offset-6' ><h3 style='color:red;'>On Safari browsers you will need to allow popups (Select Safari > Preferences > Security and untick 'Block pop-up windows'</h3></div></div>");

	  }
	}
  }).error(function (jqXHR, textStatus, errorThrown) {
	$('.whileLoading').hide();
	wnd.document.body.innerHTML = "<h1>" + "</h1><p>Data Not Available</p>";
  });

}

function isSafari() {

  var is_safari = (navigator.userAgent.toLowerCase().indexOf('safari/') > 0 && !(navigator.userAgent.toLowerCase().indexOf('chrome/') > 0));
  return is_safari;

}