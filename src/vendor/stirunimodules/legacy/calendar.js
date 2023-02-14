var do_goToOption_click = function(e) {
    e.preventDefault();
    do_goToOption($(this));
}
var do_goToOption = function(activeTab) {
    var year = $(activeTab).data("year");
    var opt = $(activeTab).data("option");
    $('#tabContent').show();
    $('#tabContent #year' + year + ' .tab-pane').hide();
    $('#tabContent #year' + year + ' #option' + opt).show();
}
var do_groupProg_click = function(e) {
    e.preventDefault();
    do_groupProg(e);
}
var do_groupProg = function(groupOrg) {
    if (!$(groupOrg).hasClass("active")) {
        var allActiveGroups = $('#sidebar .groupProg.active');
        allActiveGroups.removeClass("active");
        allActiveGroups.next('div').collapse('hide');
        $(groupOrg).addClass("active");
        setTimeout(function() {
            $(groupOrg).next('div').collapse('show');
        });
    } else {
        $(groupOrg).removeClass("active");
    }
}
buildHTML = function(tag, html, attrs) {
    if (typeof(html) != 'string') {
        attrs = html;
        html = null;
    }
    var h = '<' + tag;
    for (attr in attrs) {
        if (attrs[attr] === false) continue;
        print
        h += ' ' + attr + '="' + attrs[attr] + '"';
    }
    return h += html ? ">" + html + "</" + tag + ">" : "/>";
}
var ver = "";
var showAvailabilityBtn = false;
var showUnavailableModules = false;
$(document).ready(function() {
    $body = $("body");
    $("#searchModulePanel").hide();
    $("#searchStudyAbroadModulePanel").hide();
    $("#prgSearch").hide();
    $(document).on({
        ajaxStart: function() {
            $body.addClass("loading");
        },
        ajaxStop: function() {
            $body.removeClass("loading");
        }
    });
    $(document.body).on('click', '#versions div a', function(e) {
        if (undefined != $('#mainContent').data("rc")) {
            e.preventDefault();
            location.href = $(this).attr("href") + "&rouCode=" + $('#mainContent').data("rc");
        }
    });
    $(document.body).on('click', '#sidebar > a.school', function(e) {
        if (!$(this).hasClass("active")) {
            var allActive = $('#sidebar .school.active');
            allActive.removeClass("active");
            allActive.next('div').collapse('hide');
            var allActiveGroups = $('#sidebar .groupProg.active');
            allActiveGroups.removeClass("active");
            allActiveGroups.next('div').collapse('hide');
            $(this).addClass("active");
            setTimeout(function() {
                $(this).next('div').collapse('show');
            });
            if ($(this).next('div').children('div').length == 1) {
                do_groupProg($(this).next('div').children('div a.groupProg'));
            }
        } else {
            $(this).removeClass("active");
        }
    });
    $('#detailsModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget)
        var detailsContent = $("#" + button.attr('data-id')).html();
        var modal = $(this);
        modal.find('.modal-body').html(detailsContent);
    })
    $('#shareLinkModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget)
        var shareLinkContent = $("#" + button.attr('data-id')).html();
        var modal = $(this);
        modal.find('.modal-body').html(shareLinkContent);
    })
    $('#shareLinkModal').on('shown.bs.modal', function() {
        $('.modal #shareLinkTxt').focus();
        $('.modal #shareLinkTxt').select();
    })
    $(document.body).on('click', '#sidebar  a.groupProg', function(e) {
        do_groupProg_click(e);
    });
    $(document.body).on('click', '#sidebar  a.indProg', function(e) {
        e.preventDefault();
        var currentId = $(this).attr('id');
        if (currentId !== "" && typeof currentId !== 'undefined') {
            $('#semesterContent').empty();
            $('#tabContent').empty();
            $('#detailsContent').empty();
            $('#moduleContent').empty();
            $('#versionWarning').hide();
            $('#shareLinkContent').empty();
            loadProgramme(currentId, 1);
        }
        $('#sidebar a.indProg').removeClass("active");
        $(this).addClass("active");
        return false;
    });
    $(document.body).on('click', '#sidebar  a.indMod', function(e) {
        e.preventDefault();
        var currentId = $(this).attr('id');
        if (currentId !== "" && typeof currentId !== 'undefined') {
            $('#semesterContent').empty();
            $('#tabContent').empty();
            $('#detailsContent').empty();
            $('#moduleContent').empty();
            loadModule(currentId, 1);
        }
        $('#sidebar a.indMod').removeClass("active");
        $(this).addClass("active");
        return false;
    });
    $(document.body).on('click', '#searchPrg_chzn', function(e) {
        var allActiveNodes = $('#sidebar .active');
        allActiveNodes.removeClass("active");
        allActiveNodes.next('div').collapse('hide');
    });
    $('.chooseYear').on('click', 'a.goToYear', function(e) {
        e.preventDefault();
        var currentId = $(this).text();
        var tabs = $(this).data("tabs");
        $('.chooseYear').find('li.active').removeClass("active");
        $('.yearlink' + currentId).parent().addClass("active");
        $('.showYear').hide();
        $('#year' + currentId).show();
        if (tabs == "false") {
            $('#tabContent').hide();
        } else {
            $('#tabContent').show();
            $('.tab-pane').hide();
            $('#year' + currentId + ' .tab-pane#option1').show();
            $('#tab_option1').addClass("active");
            $('#tab_option2').removeClass("active");
        }
        $('#introContent').focus();
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
    ver = params.versionId;
    var verPassed = true;
    if (ver == null) {
        ver = -1;
        verPassed = false;
    }
    view = params.view;
    var sharedLink = params.share;
    if (view !== undefined && view !== null && view === "visiting") {
        $("#ugRegulations").hide();
        $("#vistingRegulations").show();
        $("#ugSearchInstructions").hide();
        $("#visitingSearchInstructions").show();
        $("#visitingDisclaimer").show();
        $("#visitingInfo").show();
        $("#fullCalLink").show();
    } else {
        $("#ugRegulations").show();
        $("#vistingRegulations").hide();
        $("#ugSearchInstructions").show();
        $("#visitingSearchInstructions").hide();
        $("#visitingDisclaimer").hide();
        $("#visitingInfo").hide();
        $("#fullCalLink").hide();
    }
    var activeVersionName;
    var activeVersionLabel;
    $.getJSON("/servlet/CalendarServlet?opt=version-menu&callback=?", null, function(versions) {
        $("#versions").empty();
        var latestVersionId = "";
        var shareParam = "";
        if (sharedLink !== undefined && sharedLink !== null && sharedLink === "true") {
            shareParam = "&share=true";
        }
        for (i in versions) {
            version = versions[i];
            versionId = version.versionId;
            versionName = version.versionName;
            minorVersion = version.minorVersion;
            versionLabel = version.versionLabel;
            versionActive = version.versionActive;
            if (versionActive == "Y") {
                if (parseInt(versionId) >= ver) {
                    if (!verPassed) {
                        ver = parseInt(versionId);
                    }
                }
                if (parseInt(versionId) >= latestVersionId) {
                    latestVersionId = parseInt(versionId);
                }
                if (view !== undefined && view !== null && view === "visiting") {
                    $("#versions").append("<div id='version" + versionId + "'><a href='/calendar/calendar.jsp?versionId=" + versionId + "&view=" + view + "' class='list-group-item'>" + versionLabel + "<div id='active-badge' style='float:right'></div></a></div>");
                } else {
                    $("#versions").append("<div id='version" + versionId + "'><a href='/calendar/calendar.jsp?versionId=" + versionId + shareParam + "' class='list-group-item'>" + versionLabel + "<div id='active-badge' style='float:right'></div></a></div>");
                }
                $("#version" + versionId).data("versionName", versionName);
                $("#version" + versionId).data("versionLabel", versionLabel);
            }
        }
        $("#versions #version" + ver).addClass("active");
        $("#versions #version" + ver + " #active-badge").append("<span class='label label-success' style='padding:2px'>ACTIVE</span>");
        activeVersionName = $("#version" + ver).data("versionName");
        activeVersionLabel = $("#version" + ver).data("versionLabel");
        if (view !== undefined && view !== null && view === "visiting") {
            $("#pageTitle").html("<h1>Undergraduate Modules (Incoming Study Abroad) " + activeVersionName + "</h1><h3 style='font-family:Verdana, Geneva, sans-serif;'>" + activeVersionLabel + "</h3>");
        } else {
            var versionWarning = "";
            if (sharedLink !== undefined && sharedLink !== null && sharedLink === "true") {
                if (ver.toString() !== latestVersionId.toString()) {
                    versionWarning = "<span id='versionWarning' class='label label-warning' style='margin-left:5px;'>Click <a href='/calendar/calendar.jsp?versionId=" + latestVersionId.toString().trim() + "&rouCode=" + rouCodeParam + "'>here</a> to view the current published version</label>";
                }
            }
            $("#pageTitle").html("<h1>Undergraduate Degree Programme Tables " + activeVersionName + "</h1><h3 style='font-family:Verdana, Geneva, sans-serif;'>" + activeVersionLabel + versionWarning + "</h3>");
        }
        if ($("#versions div:first-child").hasClass("active") || ver == "0") {
            if (sitsAvailable === "Y") {
                showAvailabilityBtn = true;
            }
        }
    }).done(function() {
        $.getJSON("/servlet/CalendarServlet?opt=menu&ver=" + ver + "&callback=?", null, function(menu) {
            if (view === undefined || view === null || view !== "visiting") {
                $("#searchPrg").empty();
                $("#searchPrg").append(new Option()).trigger("liszt:updated");
                for (i in menu) {
                    menuItem = menu[i];
                    opt = "<option value='" + menuItem.rouCode + "'>" + menuItem.rouName + " (" + menuItem.rouCode + ")</option>";
                    $("#searchPrg").append(opt);
                }
                $("#searchPrg").trigger("liszt:updated");
                $("#prgSearch").show();
            }
        }).done(function() {
            $.getJSON("/servlet/CalendarServlet?opt=school-menu&ver=" + ver + "&callback=?", null, function(menu) {
                $("#sidebar").empty();
                for (i in menu) {
                    var school = menu[i];
                    var schoolCode = school.schoolCode;
                    var schoolName = school.schoolName;
                    if (view === undefined || view === null || view !== "visiting") {
                        $("#sidebar").append("<a href='#" + schoolCode + "' class='list-group-item school' data-toggle='collapse'>" + schoolName + "</a>" + "<div id='" + schoolCode + "' class='list-group subitem collapse'></div>");
                        var divisions = school.divisions;
                        for (j in divisions) {
                            var division = divisions[j];
                            var divCode = division.divCode;
                            var divName = division.divName;
                            $("#" + schoolCode).append("<a href='#" + divCode + "' class='list-group-item groupProg' data-toggle='collapse'><span class='glyphicon glyphicon-chevron-right'></span>" + divName + "</a>" + "<div id='" + divCode + "' class='list-group subitem collapse'></div>");
                            var programmes = division.programmes;
                            for (k in programmes) {
                                var programme = programmes[k];
                                var rouCode = programme.rouCode;
                                var rouName = programme.rouName;
                                $("#" + divCode).append("<a href='#' id='" + rouCode + "' class='list-group-item indProg'>" + "<span class='glyphicon glyphicon-book'></span> " + rouName + " <small>(" + rouCode + ")</small></a>");
                            }
                        }
                    } else {
                        var schoolOpt = "<a href='#" + schoolCode + "' class='list-group-item school' data-toggle='collapse'>" + schoolName + "</a>" + "<div id='" + schoolCode + "' class='list-group subitem collapse'></div>";
                        $("#sidebar").append(schoolOpt);
                    }
                }
            }).done(function() {
                $.getJSON("/servlet/CalendarServlet?opt=mod-menu&ver=" + ver + "&callback=?", null, function(modMenu) {
                    $("#searchModule").empty();
                    $("#searchStudyAbroadModule").empty();
                    $("#searchModule").append(new Option()).trigger("liszt:updated");
                    $("#searchStudyAbroadModule").append(new Option()).trigger("liszt:updated");
                    for (i in modMenu) {
                        modMenuItem = modMenu[i];
                        modOpt = "<option value='" + modMenuItem.modCode + "'>" + modMenuItem.modName + " (" + modMenuItem.modCode + ")</option>";
                        if (view !== undefined && view !== null && view === "visiting") {
                            if (modMenuItem.availToExchStud !== undefined && modMenuItem.availToExchStud !== null && modMenuItem.availToExchStud !== "" && modMenuItem.availToExchStud !== "N") {
                                $("#searchStudyAbroadModule").append(modOpt);
                            }
                        } else {
                            $("#searchModule").append(modOpt);
                        }
                    }
                    if (view !== undefined && view !== null && view === "visiting") {
                        var uniqueDpts = new Array();
                        $.each(modMenu, function(index, value) {
                            if (value.availToExchStud !== undefined && value.availToExchStud !== null && value.availToExchStud !== "" && value.availToExchStud !== "N") {
                                var result = $.grep(uniqueDpts, function(e) {
                                    return e.dptCode === value.dptCode;
                                });
                                if (result.length === 0) {
                                    uniqueDpts.push(this);
                                }
                            }
                        });
                        var sortedUniqueDpts = uniqueDpts.sort(function(a, b) {
                            if (a.dptName === b.dptName) {
                                return 0;
                            } else {
                                return (a.dptName < b.dptName) ? -1 : 1;
                            }
                        });
                        $("#searchModulePanel").hide();
                        $.each(sortedUniqueDpts, function(x, item) {
                            dptValues = item.dptName.split('-');
                            if (dptValues[1] !== undefined && dptValues[1] !== null && dptValues[1] !== "") {
                                departmentName = dptValues[1].trim();
                                if (dptValues[2] !== undefined && dptValues[2] !== null && dptValues[2] !== "") {
                                    departmentName += " " + dptValues[2].trim();
                                }
                            } else {
                                departmentName = dptValues[0].trim();
                            }
                            var dptOpt = "<a href='#" + item.dptCode + "' class='list-group-item school' data-toggle='collapse'><span class='glyphicon glyphicon-chevron-right'></span>" + departmentName + "</a>" + "<div id='" + item.dptCode + "' class='list-group subitem collapse'></div>";
                            $("#sidebar #" + item.dptCode.substr(0, 3)).append(dptOpt);
                        });
                        sortedModMenu = modMenu.sort(function(a, b) {
                            if (a.modName === b.modName) {
                                return 0;
                            } else {
                                return (a.modName < b.modName) ? -1 : 1;
                            }
                        });
                        $.each(sortedModMenu, function(x, item) {
                            if (item.availToExchStud !== undefined && item.availToExchStud !== null && item.availToExchStud !== "" && item.availToExchStud !== "N") {
                                var modOpt = "<a href='#' id='" + item.modCode + "' class='list-group-item indMod'>" + "<span class='glyphicon glyphicon-book'></span> " + item.modName + " <small>(" + item.modCode + ")</small></a>";
                                $("#sidebar #" + item.dptCode).append(modOpt);
                            }
                        });
                        if ($("#searchStudyAbroadModule option").length > 1) {
                            $("#searchStudyAbroadModulePanel").show();
                        }
                        $("#searchStudyAbroadModule").trigger("liszt:updated");
                        $("#prgSearch").hide();
                    } else {
                        $("#searchModule").trigger("liszt:updated");
                        $("#searchModulePanel").show();
                        $("#prgSearch").show();
                    }
                }).always(function() {
                    if (rouCodeParam != null && rouCodeParam.length > 0) {
                        $('#semesterContent').empty();
                        $('#introContent').empty();
                        $('#tabContent').empty();
                        $('#detailsContent').empty();
                        $('#moduleContent').empty();
                        $('#shareLinkContent').empty();
                        loadProgramme(rouCodeParam, 1);
                    } else if (modCodeParam != null && modCodeParam.length > 0) {
                        $('#semesterContent').empty();
                        $('#introContent').empty();
                        $('#tabContent').empty();
                        $('#detailsContent').empty();
                        $('#moduleContent').empty();
                        loadModule(modCodeParam, 1);
                    }
                })
            })
        })
    })
    $('#menu a').click(function() {
        $('#semesterContent').empty();
        $('#introContent').empty();
        $('#tabContent').empty();
        $('#detailsContent').empty();
        $('#moduleContent').empty();
        $('#versionWarning').hide();
        $('#shareLinkContent').empty();
        loadProgramme($(this).attr('id'), 1);
    });
    $("#searchPrg").change(function() {
        $('#semesterContent').empty();
        $('#introContent').empty();
        $('#tabContent').empty();
        $('#detailsContent').empty();
        $('#moduleContent').empty();
        $('#versionWarning').hide();
        $('#shareLinkContent').empty();
        loadProgramme($(this).val(), 1);
    });
    $("#searchModule").change(function() {
        $('#mainContent').children().empty();
        loadModule($(this).val(), 1);
    });
    $("#searchStudyAbroadModule").change(function() {
        $('#mainContent').children().empty();
        console.log($(this));
        loadModule($(this).val(), 1);
    });
    $(document.body).on('click', '.closepanel', function(e) {
        e.preventDefault();
        var collapsePanel = $(this).closest('.panel-collapse')
        collapsePanel.collapse('hide');
        collapsePanel.focus();
    });
    $(document.body).on('click', '.checkAvailabilityBtn', function(e) {
        e.preventDefault();
        var spanElem = $(this).parent();
        var spanId = spanElem.attr("id");
        var moduleCode = spanElem.data("moduleCode");
        var mavOccurrence = spanElem.data("mavOccurrence");
        var mavSemCode = spanElem.data("mavSemCode");
        var mavSemSession = spanElem.data("mavSemSession");
        $.getJSON("/servlet/CalendarServlet?opt=places&mod=" + moduleCode + "&sess=" + mavSemSession + "&sem=" + mavSemCode + "&occ=" + mavOccurrence + "&callback=?", null, function(result) {
            var spaces = result.modSpaces;
            if (spaces > 100) {
                $("#" + spanId).html("<span class='badge badge-info'>Space Available</span>");
            } else if (spaces < 5) {
                $("#" + spanId).html("<span class='badge badge-info'>Module Full</span>");
            } else if (spaces == -999) {
                $("#" + spanId).html("<span class='badge badge-info'>Error</span>");
            } else {
                $("#" + spanId).html("<span class='badge badge-info'>Available Places: " + result.modSpaces + " </span>");
            }
        })
    })
})

function loadModule(moduleCode) {
    $('#introContent').html("<h1>Module Details</h1>");
    $('#versionWarning').hide();
    $.getJSON("/servlet/CalendarServlet?opt=module&mod=" + moduleCode + "&ver=" + ver + "&callback=?", null, function(moduleDetail) {
        $('#moduleContent').html("<div class='panel panel-success'></div>");
        $('#moduleContent .panel-success').append("<div class='panel-heading'><h3 class='panel-title'>" + moduleDetail.modName + " (" + moduleDetail.modCode + ")</h3></div>");
        $('#moduleContent .panel-success').append("<div class='panel-body'></div>");
        $('#moduleContent .panel-body').append("<div class='row'><div class='col-md-4'><strong>Division:</strong></div><div class='col-md-8'>" + moduleDetail.dptName + "</div></div>");
        $('#moduleContent .panel-body').append("<div class='row'><div class='col-md-4'><strong>Semester:</strong></div><div class='col-md-8'>" + moduleDetail.mavSemSemester + "</div></div>");
        $('#moduleContent .panel-body').append("<div class='row'><div class='col-md-4'><strong>Credits:</strong></div><div class='col-md-8'>" + moduleDetail.modCredit + "</div></div>");
        $('#moduleContent .panel-body').append("<div class='row'><div class='col-md-4'><strong>Level:</strong></div><div class='col-md-8'>" + moduleDetail.modLevel + "</div></div>");
        if (moduleDetail.mavPrsTitle != "[n]" && moduleDetail.mavPrsName != "[n]") {
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
    }).error(function(jqXHR, textStatus, errorThrown) {
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
    if (moduleDetail.mavPrsTitle != "[n]" && moduleDetail.mavPrsName != "[n]") {
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

function loadProgramme(routeCode, activeYear) {
    $('#mainContent').data("rc", routeCode);
    var envUrl = $(location).attr('protocol') + "//" + $(location).attr('host') + $(location).attr('pathname');
    var semesters_per_year = 2;
    if (routeCode.substring(0, 9) === "UXX28-CWP" || routeCode.substring(0, 9) === "UXX19-EYP" || routeCode === "UHC12-TRNINT") {
        semesters_per_year = 3;
    }
    $('.chooseYear').html("<h4>Year</h4><ul class='pagination pagination-lg pageYear'></ul>");
    $.getJSON("/servlet/CalendarServlet?opt=runcode&rouCode=" + routeCode + "&ver=" + ver + "&callback=?", null, function(json) {
        $('#tabContent').empty();
        var prgName = json.rouPrgName;
        var progDirector = json.progDirector;
        if (progDirector != null && progDirector != '') {
            progDirector = "<div class='row' ><div class='col-md-3' ><strong>Adviser of Studies:</strong></div> <div class='col-md-9'>" + progDirector + "</div></div>";
        } else {
            progDirector = "<div class='row' ><div class='col-md-3' ><strong>Adviser of Studies:</strong> </div><div class='col-md-9'>Please consult the <a target='_blank' href='http://www.stir.ac.uk/registry/advisers/'>Faculty Adviser List</a></div></div>";
        }
        var owningSchool = json.dptName;
        if (owningSchool != '') {
            owningSchool = "<div class='row' ><div class='col-md-3' ><strong>Owning Division:</strong> </div><div class='col-md-9'>" + owningSchool + "</div></div>";
        }
        var pdttRept = $.trim(json.pdttRept);
        if (pdttRept != null && pdttRept.length > 0) {
            pdttRept = "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + pdttRept + "</div></div>";
        }
        var name = json.rouName;
        var honsgen = $.trim(json.rouHonsGen);
        if (honsgen === "Hons") {
            honsgen = "Hons";
        } else {
            honsgen = "";
        }
        var uhlp = "";
        var initialText = json.initialText;
        var entryCriteria = json.entryCriteria;
        var trailingText = json.trailingText;
        if (initialText != null && initialText.length > 0) {
            uhlp += "<div class='row' style='margin-top:10px;'> <div class='col-md-12'>" + initialText + "</div></div>"
        }
        style = 'margin-top:20px;'
        if (entryCriteria != null && entryCriteria.length > 0) {
            uhlp += "<div class='row' style='margin-top:10px;'> <div class='col-md-12'>" + entryCriteria + "</div></div>"
        }
        if (trailingText != null && trailingText.length > 0) {
            uhlp += "<div class='row' style='margin-top:10px;'> <div class='col-md-12'>" + trailingText + "</div></div>"
        }
        $('#introContent').html("<h1>" + prgName + " " + honsgen + " " + name + " <span style='font-size: small; font-family:Verdana, Geneva, sans-serif;'>(" + routeCode + ")</span></h1>");
        $('#introContent').append(progDirector + owningSchool + pdttRept + uhlp);
        var showUnavailableLink = "";
        if (showUnavailableModules === false) {
            showUnavailableLink = "<a href='#' id='toggleShowUnavailable' onclick='toggleShowUnavailable()' title='Modules which are not currently available are currently hidden.  Click here to show them.'><span class='glyphicon glyphicon-transfer' style='margin-right:5px;' ></span>Show Unavailable Modules</a>";
        } else {
            showUnavailableLink = "<a href='#' id='toggleShowUnavailable' onclick='toggleShowUnavailable()' title='Modules which are not currently available are currently shown.  Click here to hide them.'><span class='glyphicon glyphicon-transfer' style='margin-right:5px;' ></span>Hide Unavailable Modules</a>";
        }
        $('#introContent').append("<h4><div class='row' style='margin-top:10px;'><div id='toggleShowUnavailableContainer' class='col-md-5'>" + showUnavailableLink + "</div><div id='toggleMsg' class='col-md-2'><div class='label label-success' ></div></div><div class='col-md-3' ><a href='#' onclick='printableView(&#39;" + routeCode + "&#39;);' title='View a one-page, printable summary of this programme'> <span class='glyphicon glyphicon-print' style='margin-right:5px;' ></span> Printable View</a></div><div class='col-md-2'  ><a href='#' id='shareLink' data-id='shareLinkContent'  data-toggle='modal' data-target='#shareLinkModal' title='Share link to this programme' > <span class='glyphicon glyphicon-share' style='margin-right:5px;' ></span>Share</a></div></div></h4>");
        $('#introContent').append("<div class='row'><div id='printError' class='col-md-offset-2 '></div>");
        var shareLinkContent = " The URL for this programme is below.  Copy it to share with others.<input type='text' class='form-control' id='shareLinkTxt' value='" + envUrl + "?rouCode=" + routeCode + "&versionId=" + ver + "&share=true' style='margin-top:10px;'></input>";
        $('#shareLinkContent').append(shareLinkContent);
        var semesterGroups = json.semesterGroupBeans;
        var newYear = false;
        var year = 0;
        var group = 0;
        var compModuleClass = "list-group-item-success";
        var optModuleClass = "list-group-item-info";
        for (var i = 0; i < semesterGroups.length; i++) {
            var semesterGroup = semesterGroups[i];
            group++;
            var options = semesterGroup.groupOptions;
            var tabs = false;
            if (options.length > 1) {
                tabs = true;
            }
            var set = 0;
            for (var j = 0; j < options.length; j++) {
                var option = options[j];
                set++;
                var semesters = option.semestersInOption;
                for (var k = 0; k < semesters.length; k++) {
                    var semester = semesters[k];
                    var code = parseInt(semester.semesterCode);
                    var pdmNote = semester.pdmNote;
                    year = getYear(code, semesters_per_year);
                    if (i == 0 && j == 0 && k == 0) {
                        newYear = true;
                    } else {
                        newYear = isNewYear(code, semesters_per_year);
                    }
                    if (newYear && set == "1") {
                        $('.chooseYear .pageYear').append("<li><a href='#year_" + year + "' class='goToYear yearlink" + year + "'>" + year + "</a></li>");
                        $('#semesterContent').append("<div id='year" + year + "' style='display:none' class='showYear'></div>");
                        if (!tabs) {
                            $('.chooseYear .pageYear li a.yearlink' + year).data("tabs", "false");
                            $('#semesterContent #year' + year).append("<div id='option" + set + "'></div></div>");
                        }
                        if (tabs) {
                            $('.chooseYear .pageYear li a.yearlink' + year).data("tabs", "true");
                            $('#semesterContent #year' + year).append("<div class='alert alert-danger'> <strong>There are " + options.length + " alternative paths in year " + year + ".  Please review all options carefully.</strong></div>");
                            $('#semesterContent #year' + year).append("<ul class='nav nav-tabs' id='group" + group + "' data-tabs='tabs'  ></ul>");
                            $('#tabContent').append("<div id='year" + year + "'></div>");
                            for (var m = 0; m < options.length; m++) {
                                var option = options[m];
                                var optSet = m + 1;
                                $('#semesterContent #group' + group).append("<li id='tab_option" + optSet + "' ><a href='#' id='year" + year + "_option" + optSet + "' data-toggle='tab' class='goToOption'>Option " + optSet + "</a></li>");
                                $('#year' + year + '_option' + optSet).data("year", year);
                                $('#year' + year + '_option' + optSet).data("option", optSet);
                                if (m == 0) {
                                    do_goToOption($('#year' + year + '_option' + optSet));
                                }
                                $('#tabContent #year' + year).append("<div class='tab-pane' id='option" + optSet + "'></div>");
                            }
                        }
                        $('.tab-pane').hide();
                    }
                    $('#semesterContent #year' + year + ' #option' + set).append("<div id='sem" + code + "' ></div>");
                    $('#tabContent #year' + year + ' #option' + set).append("<div id='sem" + code + "' ></div>");
                    $('#year' + year + ' #option' + set + ' #sem' + code).append("<h2>Semester " + code + "</h2>");
                    $('#year' + year + ' #option' + set + ' #sem' + code).append("<div class='compulsoryModules'></div>");
                    $('#year' + year + ' #option' + set + ' #sem' + code).append("<div class='optionalModules'></div>");
                    var collections = semester.collections;
                    for (var y = 0; y < collections.length; y++) {
                        var collection = collections[y];
                        var type = collection.collectionType;
                        var status = collection.collectionStatusCode;
                        if (status.indexOf("E") > -1) {
                            modulePanelClass = optModuleClass;
                            moduleDivClass = "optionalModules";
                            moduleDivTitle = "Option Module ";
                            $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<br /><br />");
                            $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<h4><span class='glyphicon glyphicon-list' style='margin-right:5px;'></span>" + moduleDivTitle + "</h4>");
                        } else {
                            modulePanelClass = compModuleClass;
                            moduleDivClass = "compulsoryModules";
                            moduleDivTitle = "Compulsory Module ";
                            if (status === "D") {
                                moduleDivTitle = "Dissertation ";
                            }
                            $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<br /><br />");
                            if (type === "CHOICE") {
                                $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<h4><span class='glyphicon glyphicon-star-empty' style='margin-right:5px;'></span>" + moduleDivTitle + "</h4>");
                            } else {
                                $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<h4><span class='glyphicon glyphicon-star' style='margin-right:5px;'></span>" + moduleDivTitle + "</h4>");
                            }
                        }
                        collapseOptions = "false";
                        moduleOpts = collection.mods;
                        if (moduleOpts.length > 4) {
                            collapseOptions = "true";
                        }
                        collectionId = collection.collectionSemester + collection.collectionOverarchSeqn;
                        if (type == "LIST" || type == "CHOICE") {
                            var accordStyle = "background-image:linear-gradient(to bottom, #DFECF3 0, #B4D5E6 100%)";
                            if (status === "C" || status === "CLC" || status === "D" || status === "R") {
                                accordStyle = "background-image:linear-gradient(to bottom, #CCF2BC 0, #EBEFE9 100%)";
                            }
                            collectionNote = collection.collectionNotes;
                            var size = collection.collectionSize;
                            if (size !== "" && typeof size !== 'undefined') {
                                size = size + " choices";
                            } else {
                                size = "";
                            }
                            if (collectionNote != null && collectionNote.length > 0) {
                                if (collapseOptions == "true") {
                                    $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<div class='panel-group' id='" + collectionId + "_group'><div class='panel panel-default' id='panel_y" + year + "_o" + set + "_s" + code + "_" + collectionId + "'><div class='panel-heading' style='" + accordStyle + "'> <h4 class='panel-title'><a class='accordion-toggle' data-toggle='collapse' data-parent='#" + collectionId + "_group' href='#y" + year + "_o" + set + "_s" + code + "_" + collectionId + "'>" + collectionNote + "</a> <span class='label choice_size'>" + size + "</span></h4></div></div></div>");
                                } else {
                                    $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass + " h4").last().append("<span class='badge choice_label'>" + collectionNote + "</span>");
                                }
                            }
                        }
                        collectionFootnote = collection.collectionFootnote;
                        if (collapseOptions == "true") {
                            var obj1 = $('#panel_y' + year + '_o' + set + '_s' + code + '_' + collectionId);
                            obj1.append("<div id='y" + year + "_o" + set + "_s" + code + "_" + collectionId + "' class='panel-collapse collapse'><div class='panel-body'>" + "</div></div>");
                            var panelObj = $('#y' + year + '_o' + set + '_s' + code + '_' + collectionId + ' .panel-body');
                            for (var z = 0; z < moduleOpts.length; z++) {
                                moduleDetail = moduleOpts[z];
                                escapedModNote = moduleDetail.modNote.replace(/'/g, "&#39;");
                                dataContent = "<div id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_popover" + z + "'>" + getModuleDetails(moduleDetail, "#y" + year + "_o" + set + "_s" + code + "_c" + y + "_button" + z, "#y" + year + "_o" + set + "_s" + code + "_c" + y + "_popover" + z) + "</div>";
                                if (showAvailabilityBtn && (moduleDetail.mavSemSemester != null && moduleDetail.mavSemSemester.length > 0 && moduleDetail.mavSemSemester != "[n]") && (moduleDetail.mavSemSession != null && moduleDetail.mavSemSession.length > 0 && moduleDetail.mavSemSession != "[n]")) {
                                    checkAvailabilityBtn = "<a href='#'  class='checkAvailabilityBtn' >Check Availability</a>";
                                } else {
                                    if (sitsAvailable === "N") {
                                        checkAvailabilityBtn = "Space Availability Check Offline";
                                    } else {
                                        checkAvailabilityBtn = "";
                                    }
                                }
                                var modAvailableClass = "";
                                if (moduleDetail.mavSemSemester === null || moduleDetail.mavSemSemester.length === 0 || moduleDetail.mavSemSemester === "[n]" || moduleDetail.mavSemSemester === "Not Available") {
                                    modAvailableClass = "notAvailable"
                                }
                                panelContent = "<span class='list-group-item " + modulePanelClass + " " + modAvailableClass + "'>" + "<h4 class='list-group-item-heading'>" + moduleDetail.modName + "</h4>" + "<span class='badge'>" + moduleDetail.mavSemSemester + "</span>" + "<span class='badge'>" + moduleDetail.modCredit + " Credits</span>" + "<p class='list-group-item-text'>" + moduleDetail.modCode + "</p>" + "<p><button id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_button" + z + "' data-id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_popover" + z + "' class='btn btn-primary' data-toggle='modal' data-target='#detailsModal' >Further Info</button>" + "<span id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z + "' style='float: right'>" + checkAvailabilityBtn + "</span>" + "</p>" + "</span>";
                                panelObj.append(panelContent);
                                $('#detailsContent').append(dataContent);
                                $("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("moduleCode", moduleDetail.modCode);
                                $("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("mavOccurrence", moduleDetail.mavOccurrence);
                                $("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("mavSemCode", moduleDetail.mavSemCode);
                                $("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("mavSemSession", moduleDetail.mavSemSession);
                            }
                            panelObj.append("<div style='text-align:center;'><br /><button type='button' class='btn closepanel'>Close Collection <span class=' glyphicon glyphicon-chevron-up' ></span></button></div>");
                            if (collectionFootnote != null && collectionFootnote.length > 0) {
                                $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<span class='glyphicon glyphicon-info-sign' style='margin-right:5px;margin-left:15px;'></span><i>" + collectionFootnote + "</i>");
                            }
                        } else {
                            for (var z = 0; z < moduleOpts.length; z++) {
                                moduleDetail = moduleOpts[z];
                                escapedModNote = moduleDetail.modNote.replace(/'/g, "&#39;");
                                dataContent = "<div id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_popover" + z + "'>" + getModuleDetails(moduleDetail, "#y" + year + "_o" + set + "_s" + code + "_c" + y + "_button" + z, "#y" + year + "_o" + set + "_s" + code + "_c" + y + "_popover" + z) + "</div>";
                                if (showAvailabilityBtn && (moduleDetail.mavSemSemester != null && moduleDetail.mavSemSemester.length > 0 && moduleDetail.mavSemSemester != "[n]") && (moduleDetail.mavSemSession != null && moduleDetail.mavSemSession.length > 0 && moduleDetail.mavSemSession != "[n]")) {
                                    checkAvailabilityBtn = "<a href='#'  class='checkAvailabilityBtn' >Check Availability</a>";
                                } else {
                                    if (sitsAvailable === "N") {
                                        checkAvailabilityBtn = "Space Availability Check Offline";
                                    } else {
                                        checkAvailabilityBtn = "";
                                    }
                                }
                                var modAvailableClass = "";
                                if (moduleDetail.mavSemSemester === null || moduleDetail.mavSemSemester.length === 0 || moduleDetail.mavSemSemester === "[n]" || moduleDetail.mavSemSemester === "Not Available") {
                                    modAvailableClass = "notAvailable"
                                }
                                $('#year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<span class='list-group-item " + modulePanelClass + " " + modAvailableClass + "'>" + "<h4 class='list-group-item-heading'>" + moduleDetail.modName + "</h4>" + "<span class='badge'>" + moduleDetail.mavSemSemester + "</span>" + "<span class='badge'>" + moduleDetail.modCredit + " Credits</span>" + "<p class='list-group-item-text'>" + moduleDetail.modCode + "</p>" + "<p><button id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_button" + z + "' data-id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_popover" + z + "' class='btn btn-primary' data-toggle='modal' data-target='#detailsModal' >Further Info</button>" + "<span id='y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z + "' style='float: right'>" + checkAvailabilityBtn + "</span>" + "</p>" + "</span>");
                                $("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("moduleCode", moduleDetail.modCode);
                                $("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("mavOccurrence", moduleDetail.mavOccurrence);
                                $("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("mavSemCode", moduleDetail.mavSemCode);
                                $("#y" + year + "_o" + set + "_s" + code + "_c" + y + "_availabilitycheck" + z).data("mavSemSession", moduleDetail.mavSemSession);
                                $('#detailsContent').append(dataContent);
                            }
                            if (collectionFootnote != null && collectionFootnote.length > 0) {
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
    }).done(function() {
        $('.btn-primary').popover();
        $('#semesterContent div').first().show();
        $('.chooseYear li:first-child').addClass("active");
        if (showUnavailableModules === false) {
            $(".notAvailable").hide();
        } else {
            $(".notAvailable").show();
        }
    }).error(function(jqXHR, textStatus, errorThrown) {
        $('#introContent').html("<h1>" + "</h1><p>Data Not Available</p>");
        $('#chooseSem').empty();
    });
}

function getPrerequisiteTypeInfoWithOperandRules(mods, defaultTitle, defaultDescr, popoverBtnSelector, popoverSelector) {
    var prerequisiteTypeInfo = "";
    var mod;
    var bracketsOpened = false;
    for (var count = 0; count < mods.length; count++) {
        mod = mods[count];
        if (count == 0) {
            var modsTitle = mod.preReqTitle != null ? mod.preReqTitle : defaultTitle;
            var modsDescr = mod.preReqDescr != null ? mod.preReqDescr : defaultDescr;
            prerequisiteTypeInfo += "<Strong>" + modsTitle + "</strong><br/>" + modsDescr + "<ul>";
        }
        var elementsCount = parseInt(mod.elementsCount);
        var label = mod.label != null ? mod.label : "";
        var mmbApply = mod.mmbApply != null && mod.mmbApply.length > 0 ? mod.mmbApply : "N";
        if (elementsCount <= 1) {
            if (mmbApply === "I" && bracketsOpened === false) {
                bracketsOpened = true;
                prerequisiteTypeInfo += "<li>" + mod.label + " [" + mod.descr + " (" + mod.code + ")";
            } else if (bracketsOpened === false) {
                prerequisiteTypeInfo += "<li>" + mod.label + mod.descr + " (" + mod.code + ")</li>";
            } else if (mmbApply === "N" && bracketsOpened === true) {
                bracketsOpened = false;
                prerequisiteTypeInfo += mod.label + mod.descr + " (" + mod.code + ")]</li>";
            } else {
                prerequisiteTypeInfo += mod.label + mod.descr + " (" + mod.code + ")";
            }
        } else {
            if (typeof popoverBtnSelector !== "undefined" && typeof popoverSelector !== "undefined") {
                prerequisiteTypeInfo += "<li>" + mod.label + mod.descr + "<span class='" + mod.code + "'>" + "<span class='showCollectionlink'> (<a href=\"javascript:loadCollection(&#39;" + mod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\" >Show Details</a>)</span>" + "<span class='hideCollectionlink'> (<a href=\"javascript:hideCollection(&#39;" + mod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\" >Hide Details</a>)</span>" + "<span class='collectionContent'></span> </span></li>";
            } else {
                prerequisiteTypeInfo += "<li class='collDetails_" + mod.code + "'>" + mod.label + " " + mod.descr + "</li>";
                getCollection(mod.code, "collDetails_" + mod.code);
            }
        }
    }
    prerequisiteTypeInfo += "</ul>";
    return prerequisiteTypeInfo;
}

function getPrerequisiteTypeInfoWithoutOperandRules(mods, defaultTitle, defaultDescr, popoverBtnSelector, popoverSelector) {
    var prerequisiteTypeInfo = "";
    var mod;
    for (var count = 0; count < mods.length; count++) {
        mod = mods[count];
        if (count == 0) {
            var modsTitle = mod.preReqTitle != null ? mod.preReqTitle : defaultTitle;
            var modsDescr = mod.preReqDescr != null ? mod.preReqDescr : defaultDescr;
            prerequisiteTypeInfo += "<Strong>" + modsTitle + "</strong><br/>" + modsDescr + "<ul>";
        }
        var elementsCount = parseInt(mod.elementsCount);
        if (elementsCount <= 1) {
            prerequisiteTypeInfo += "<li>" + mod.label + mod.descr + " (" + mod.code + ")</li>";
        } else {
            if (typeof popoverBtnSelector !== "undefined" && typeof popoverSelector !== "undefined") {
                prerequisiteTypeInfo += "<li>" + mod.label + mod.descr + "<span class='" + mod.code + "'>" + "<span class='showCollectionlink'> (<a href=\"javascript:loadCollection(&#39;" + mod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\" >Show Details</a>)</span>" + "<span class='hideCollectionlink'> (<a href=\"javascript:hideCollection(&#39;" + mod.code + "&#39;,&#39;" + popoverBtnSelector + "&#39;,&#39;" + popoverSelector + "&#39;)\" >Hide Details</a>)</span>" + "<span class='collectionContent'></span> </span></li>";
            } else {
                prerequisiteTypeInfo += "<li class='collDetails_" + mod.code + "'>" + mod.label + " " + mod.descr + "</li>";
                getCollection(mod.code, "collDetails_" + mod.code);
            }
        }
    }
    prerequisiteTypeInfo += "</ul>";
    return prerequisiteTypeInfo;
}

function getPrerequisiteTypeInfo(mods, defaultTitle, defaultDescr, popoverBtnSelector, popoverSelector) {
    var beanVer = mods[0].BEAN_VER != null ? mods[0].BEAN_VER : 1;
    if (beanVer > 1) {
        return getPrerequisiteTypeInfoWithOperandRules(mods, defaultTitle, defaultDescr, popoverBtnSelector, popoverSelector);
    } else {
        return getPrerequisiteTypeInfoWithoutOperandRules(mods, defaultTitle, defaultDescr, popoverBtnSelector, popoverSelector);
    }
}

function getPrerequisiteInfo(moduleDetail, popoverBtnSelector, popoverSelector) {
    var preMods = moduleDetail.preMods;
    var preTakenMods = moduleDetail.preTakenMods;
    var recoMods = moduleDetail.recoMods;
    var nonMods = moduleDetail.nonMods;
    var coMods = moduleDetail.coMods;
    var prerequisiteInfo = "";
    if (preMods != null && preMods.length > 0) {
        prerequisiteInfo += getPrerequisiteTypeInfo(preMods, "Compulsory Pass Prerequisites", "Before taking this module you must pass:", popoverBtnSelector, popoverSelector);
    }
    if (preTakenMods != null && preTakenMods.length > 0) {
        prerequisiteInfo += getPrerequisiteTypeInfo(preTakenMods, "Module Content Prerequisites", "Before taking this module you must have taken:", popoverBtnSelector, popoverSelector);
    }
    if (recoMods != null && recoMods.length > 0) {
        prerequisiteInfo += getPrerequisiteTypeInfo(recoMods, "Recommended Prerequisites", "Before taking this module it is advised that you should have passed:", popoverBtnSelector, popoverSelector);
    }
    if (nonMods != null && nonMods.length > 0) {
        prerequisiteInfo += getPrerequisiteTypeInfo(nonMods, "Prohibited Combinations", "You may not take this module if you have previously passed:", popoverBtnSelector, popoverSelector);
    }
    if (coMods != null && coMods.length > 0) {
        prerequisiteInfo += getPrerequisiteTypeInfo(coMods, "Co-requisite combinations", "You must also take modules:", popoverBtnSelector, popoverSelector);
    }
    return prerequisiteInfo;
}

function loadCollection(fmcCode, popoverBtnSelector, popoverSelector) {
    var collectionList = $(popoverSelector.trim() + " ." + fmcCode + " .collectionContent");
    var collectionListHtml = "<ul class='list-group'>";
    $.getJSON("/servlet/CalendarServlet?opt=collection&fmcc=" + fmcCode + "&ver=" + ver + "&callback=?", null, function(collection) {
        for (i in collection) {
            moduleInfo = collection[i];
            collectionListHtml += "<li class='list-group-item'>" + moduleInfo[1] + " (" + moduleInfo[0] + ")</li>";
        }
        collectionListHtml += "</ul>";
        collectionList.html(collectionListHtml);
        var hideLink = $(popoverSelector.trim() + " ." + fmcCode + " .hideCollectionlink");
        var showLink = $(popoverSelector.trim() + " ." + fmcCode + " .showCollectionlink");
        hideLink.show();
        showLink.hide();
    });
}

function getCollection(fmcCode, listClass) {
    var collectionListHtml = "";
    $.getJSON("/servlet/CalendarServlet?opt=collection&fmcc=" + fmcCode + "&ver=" + ver + "&callback=?", null, function(collection) {
        collectionListHtml = "<ul class='list-group'>";
        for (i in collection) {
            moduleInfo = collection[i];
            if (moduleInfo[1] != null && moduleInfo[1] != "Module not currently available") {
                collectionListHtml += "<li class='list-group-item'>" + moduleInfo[1] + " (" + moduleInfo[0] + ")</li>";
            } else {
                collectionListHtml += "<li class='list-group-item'>" + moduleInfo[0] + "</li>";
            }
        }
        collectionListHtml += "</ul>";
    }).done(function() {
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
}

function getYear(code, semesters_per_year) {
    var year = 1;
    if (semesters_per_year == 3) {
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
    if (semesters_per_year == 3) {
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
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
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

function toggleShowUnavailable() {
    var showUnavailableLink = "";
    if (showUnavailableModules === false) {
        showUnavailableModules = true;
        $(".notAvailable").show();
        showUnavailableLink = "<a href='#' id='toggleShowUnavailable' onclick='toggleShowUnavailable()'><span class='glyphicon glyphicon-transfer' style='margin-right:5px;' title='Modules which are not currently available are currently shown.  Click here to hide them.'></span>Hide Unavailable Modules</a>";
        displayToggleModulesMessage("Shown");
    } else {
        showUnavailableModules = false;
        $(".notAvailable").hide();
        showUnavailableLink = "<a href='#' id='toggleShowUnavailable' onclick='toggleShowUnavailable()'><span class='glyphicon glyphicon-transfer' style='margin-right:5px;' title='Modules which are not currently available are currently hidden.  Click here to show them.'></span>Show Unavailable Modules</a>";
        displayToggleModulesMessage("Hidden");
    }
    $("#toggleShowUnavailableContainer").html(showUnavailableLink);
}

function printableView(routeCode) {
    var semesters_per_year = 2;
    var footnoteCounter = 0;
    if (routeCode.substring(0, 9) === "UXX28-CWP" || routeCode.substring(0, 9) === "UXX19-EYP" || routeCode === "UHC12-TRNINT") {
        semesters_per_year = 3;
    }
    $.getJSON("/servlet/CalendarServlet?opt=runcode&rouCode=" + routeCode + "&ver=" + ver + "&callback=?", null, function(json) {
        try {
            $('#printableView').children().empty();
            $('#printableView').hide();
            var prgName = json.rouPrgName;
            var progDirector = json.progDirector;
            if (progDirector != null && progDirector != '') {
                progDirector = "<div class='row'><div class='col-md-3'><strong>Adviser of Studies:</strong></div><div class='col-md-9'>" + progDirector + "</div></div>";
            }
            var owningSchool = json.dptName;
            if (owningSchool != '') {
                owningSchool = "<div class='row'><div class='col-md-3'><strong>Owning Division:</strong> </div><div class='col-md-9'>" + owningSchool + "</div></div>"
            }
            var pdttRept = $.trim(json.pdttRept);
            if (pdttRept != null && pdttRept.length > 0) {
                pdttRept = "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + pdttRept + "</div></div>";
            }
            var name = json.rouName;
            var honsgen = $.trim(json.rouHonsGen);
            if (honsgen === "Hons") {
                honsgen = "Hons";
            } else {
                honsgen = "";
            }
            var uhlp = "";
            var initialText = json.initialText;
            var entryCriteria = json.entryCriteria;
            var trailingText = json.trailingText;
            if (initialText != null && initialText.length > 0) {
                uhlp += "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + initialText + "</div></div>"
            }
            if (entryCriteria != null && entryCriteria.length > 0) {
                uhlp += "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + entryCriteria + "</div></div>"
            }
            if (trailingText != null && trailingText.length > 0) {
                uhlp += "<div class='row' style='margin-top:10px;'><div class='col-md-12'>" + trailingText + "</div></div>"
            }
            $('#printableView #introContent').html("<h1>" + prgName + " " + honsgen + " " + name + " <span style='font-size: small; font-family:Verdana, Geneva, sans-serif'>(" + routeCode + ")</span></h1>" + progDirector + owningSchool + " " + "<a href='#' onClick='printPage();' id='printTable'><span class='glyphicon glyphicon-print'></span>Print</a>" + pdttRept + uhlp);
            var semesterGroups = json.semesterGroupBeans;
            var newYear = false;
            var year = 0;
            var group = 0;
            var compModuleClass = "list-group-item-success";
            var optModuleClass = "list-group-item-info";
            $('#printableView #semesterContent').append("<table id='dptable' class='table table-bordered table-condensed'></table><div id='footnotes'></div>")
            var warningClass = "";
            for (var i = 0; i < semesterGroups.length; i++) {
                if (warningClass != "warning") {
                    warningClass = "warning";
                } else {
                    warningClass = "danger";
                }
                var semesterGroup = semesterGroups[i];
                group++;
                var options = semesterGroup.groupOptions;
                var tabs = false;
                if (options.length > 1) {
                    tabs = true;
                }
                var set = 0;
                for (var j = 0; j < options.length; j++) {
                    var option = options[j];
                    set++;
                    var semesters = option.semestersInOption;
                    for (var k = 0; k < semesters.length; k++) {
                        var semester = semesters[k];
                        var code = parseInt(semester.semesterCode);
                        var pdmNote = semester.pdmNote;
                        year = getYear(code, semesters_per_year);
                        if (i == 0 && j == 0 && k == 0) {
                            newYear = true;
                        } else {
                            newYear = isNewYear(code, semesters_per_year);
                        }
                        if (newYear) {
                            if (options.length > 1) {
                                $('#printableView #semesterContent #dptable').append("<tr class='yearRow info'><td colspan='2'>Year " + year + " Option " + (j + 1) + "</td></tr>");
                            } else {
                                $('#printableView #semesterContent #dptable').append("<tr class='yearRow info'><td colspan='2'>Year " + year + "</td></tr>");
                            }
                        }
                        if (options.length > 1) {
                            $('#printableView #semesterContent #dptable').append("<tr class='semesterRow " + warningClass + "'><td>Semester " + code + "</td><td></td></tr>");
                        } else {
                            $('#printableView #semesterContent #dptable').append("<tr class='semesterRow active'><td nowrap>Semester " + code + "</td><td></td></tr>");
                        }
                        if (newYear && set == "1") {
                            if (!tabs) {}
                            if (tabs) {
                                for (var m = 0; m < options.length; m++) {
                                    var option = options[m];
                                    var optSet = m + 1;
                                    if (m == 0) {
                                        do_goToOption($('#year' + year + '_option' + optSet));
                                    }
                                }
                            }
                            $('.tab-pane').hide();
                        }
                        var collections = semester.collections;
                        for (var y = 0; y < collections.length; y++) {
                            var collection = collections[y];
                            var type = collection.collectionType;
                            var status = collection.collectionStatusCode;
                            collectionFootnote = collection.collectionFootnote;
                            if (collectionFootnote != null && collectionFootnote.length > 0) {
                                footnoteCounter++;
                            }
                            if (type == "CHOICE") {
                                $('#printableView #year' + year + ' #option' + set + ' #sem' + code + ' .' + moduleDivClass).append("<h4></h4><div class='panel panel-default'></div>");
                            }
                            collapseOptions = "false";
                            moduleOpts = collection.mods;
                            if (moduleOpts.length > 4) {
                                collapseOptions = "true";
                            }
                            if (status.indexOf("E") > -1) {
                                moduleDivClass = "optionalModules";
                            } else {
                                moduleDivClass = "compulsoryModules";
                            }
                            collectionId = collection.collectionSemester + collection.collectionOverarchSeqn;
                            if (type == "LIST" || type == "CHOICE") {
                                collectionNote = collection.collectionNotes;
                                if (typeof collectionNote == 'undefined') {
                                    collectionNote = "";
                                }
                                collectionName = collection.collectionName;
                                if (typeof collectionName == 'undefined') {
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
                                if (collectionNote != null && collectionNote.length > 0) {
                                    if (collapseOptions == "true" || type == "CHOICE") {
                                        $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append(collectionNote);
                                        if (collectionFootnote != null && collectionFootnote.length > 0) {
                                            $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append("<sup>" + footnoteCounter + "</sup>");
                                        }
                                        if (y < collections.length - 1) {
                                            $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append("  ;  ");
                                        }
                                    }
                                }
                            }
                            if (collapseOptions == "true" || type == "CHOICE") {
                                if (collectionFootnote != null && collectionFootnote.length > 0) {
                                    $('#footnotes').append("<sup>" + footnoteCounter + "</sup><i>" + collectionFootnote + "</i></br>");
                                }
                            } else {
                                for (var z = 0; z < moduleOpts.length; z++) {
                                    moduleDetail = moduleOpts[z];
                                    $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append(moduleDetail.modCode);
                                    if (z < moduleOpts.length - 1) {
                                        $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append(" OR ");
                                    }
                                    if (collectionFootnote != null && collectionFootnote.length > 0) {
                                        $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append("<sup>" + footnoteCounter + "</sup>");
                                    }
                                    if (z == moduleOpts.length - 1 && y < collections.length - 1) {
                                        $('#printableView #semesterContent #dptable tr.semesterRow:last td:last').append("  ;  ");
                                    }
                                }
                                if (collectionFootnote != null && collectionFootnote.length > 0) {
                                    $('#footnotes').append("<sup>" + footnoteCounter + "</sup><i>" + collectionFootnote + "</i></br>");
                                }
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }).done(function() {
        $('#printableView .showYear').show();
        var wnd;
        try {
            wnd = window.open("", "PrintableView", "scrollbars=1,width=1000, height=800");
            wnd.document.open();
            wnd.document.write("<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/html4/strict.dtd'>" + "<html style='overflow-x: hidden'><head><title>printable View</title>" + "<link href='/javascript/bootstrap/css/bootstrap.min.css' rel='stylesheet'>" + "<link href='/javascript/bootstrap/css/bootstrap-theme.min.css' rel='stylesheet'>" + " <script>function printPage() {window.print();}</script>" + "</head><body style='overflow-x: hidden'>" + "</body>" + "</html>");
            setTimeout(writePVContent, 500, wnd);
            wnd.document.close();
        } catch (err) {
            if (isSafari()) {
                $('#printError').html("<div class='alert alert-warning ' style='margin-top:10px;'>On Safari browsers you will need to allow popups (Select Safari > Preferences > Security and untick 'Block pop-up windows'</div>");
            }
        }
    }).error(function(jqXHR, textStatus, errorThrown) {
        wnd.document.body.innerHTML = "<h1>" + "</h1><p>Data Not Available</p>";
    });
}

function writePVContent(wnd) {
    wnd.document.body.innerHTML = $('#printableView').html();
}

function isSafari() {
    var is_safari = (navigator.userAgent.toLowerCase().indexOf('safari/') > 0 && !(navigator.userAgent.toLowerCase().indexOf('chrome/') > 0));
    return is_safari;
}

function sortArray(arr) {
    cmp = function(x, y) {
        return x > y ? 1 : x < y ? -1 : 0;
    };
    arr.sort(function(a, b) {
        return cmp([cmp(a.dtpName, b.dtpName), -cmp(a.modCode, b.modCode)], [cmp(b.dtpName, a.dtpName), -cmp(b.modCode, a.modCode)]);
    });
    return arr;
}

function displayToggleModulesMessage(msg) {
    setTimeout(showToggleModulesMessage, 200, msg);
    setTimeout(hideToggleModulesMessage, 2000);
}

function showToggleModulesMessage(msg) {
    $("#toggleMsg .label").text(msg);
}

function hideToggleModulesMessage() {
    $("#toggleMsg .label").text("");
}
