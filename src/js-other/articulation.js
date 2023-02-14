
(function() {
    var form = document.getElementById("articulation-finder");
    var reset = form.querySelector('[type="reset"]');
    var degreeCourses  = document.querySelectorAll("#articulation-list tbody tr td:nth-child(1)");
    var collegeCourses = document.querySelectorAll("#articulation-list tbody tr td:nth-child(2)");
    var degreeSelect   = document.querySelector('select[name="degree-course"]');
    var collegeSelect  = document.querySelector('select[name="college-course"]');
    var node;

    // set up the drop-downs:
    columnOptions(nodeListToTextArray(degreeCourses), degreeSelect);
    columnOptions(nodeListToTextArray(collegeCourses), collegeSelect);
    degreeSelect.addEventListener("change", onChangeHandler);
	collegeSelect.addEventListener("change", onChangeHandler);
	form.onsubmit = function(){ return false; };
    reset.addEventListener("click", function(event) {
        event.preventDefault();
        form.reset();
        onChangeHandler();
    });

    function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }

    function nodeListToTextArray(list) {
        var array = [];
        list = Array.prototype.slice.call(list);
        for(var i=0; i<list.length; i++) {
            array.push(list[i].textContent.trim());
        }
        array.sort(); // alphabetical order
        if(typeof(Array.prototype.filter) != "function") {
            console.error("Array.prototype.filter is not available so the articulation course selector may contain duplicate entries.");
            return array;
        }
        return array.filter( onlyUnique );
    }
    
    function columnOptions(courses, select) {
        if(courses.length > 0 && select) {
            for(var i=0; i<courses.length; i++) {
                node = document.createElement("option");
                node.setAttribute("value", courses[i]);
                node.innerHTML = courses[i];
                select.insertAdjacentElement("beforeend", node);
            }
        }
    }

    function rowHider(row, selectedDegreeCourse, selectedCollegeCourse) {
        var degree  = row.querySelector("td:nth-child(1)").textContent.trim();
        var college = row.querySelector("td:nth-child(2)").textContent.trim();
        if(selectedDegreeCourse&&degree!=selectedDegreeCourse){
            row.style.display = 'none';
            return;
        }
        if(selectedCollegeCourse&&college!==selectedCollegeCourse){
            row.style.display = 'none';
            return;
        }
        row.style.display = '';
    }

    function onChangeHandler(e){
        var degreeCourseVal  = degreeSelect.options[degreeSelect.selectedIndex].value.trim();
        var collegeCourseVal = collegeSelect.options[collegeSelect.selectedIndex].value.trim();
        var rows = document.querySelectorAll("table#articulation-list tbody tr");
        if(rows.length > 0) {
            rows = Array.prototype.slice.call(rows);
            for(var i=0; i<rows.length; i++) {
                rowHider(rows[i], degreeCourseVal, collegeCourseVal);
            }
        }
    }

})();