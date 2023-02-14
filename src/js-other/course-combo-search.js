var stir = stir || {};

stir.courseComboSearch = function(courses) {

    var input = document.createElement('input');
    
    input.setAttribute('type', "search");
    input.setAttribute('name', "course-combo-search");
    input.setAttribute('placeholder', "e.g. Mathematics");
    
    if(!input) return console.error("no input");
    var output = document.createElement("ol"); output.classList.add("course-combos");
    var feedback = document.createElement("p");

    var courseElements = [];

    document.body.insertAdjacentElement("beforeend", input);
    input.insertAdjacentElement("afterend", output);
    input.insertAdjacentElement("afterend", feedback);

    input.addEventListener("keyup", function() {
        matchCourse(this.value);
    });


    var course, link;
    for(var i=0; i<courses.length; i++) {
        course = document.createElement("li");
        link = document.createElement('a');
        link.href = 'https://portal.stir.ac.uk/calendar/calendar.jsp?rouCode=' + courses[i]["rouCode"];
        link.insertAdjacentText("afterbegin", courses[i]["rouName"]);
        course.setAttribute("data-code", courses[i]["rouCode"])
        //course.setAttribute("data-qualification", courses[i]["Qualification"])
        //course.setAttribute("data-faculty", courses[i]["Faculty"])
        //course.setAttribute("data-division", courses[i]["Division"])
        course.insertAdjacentElement("afterbegin", link);
        courseElements.push(course);
        output.appendChild(course);
    }
    matchCourse();
    //stir.getJSON("data/course-combos.json", function(data) { });

    function matchCourse(keyword) {
        var title, match, matches = 0;
        for(var i in courses) {
            title = courses[i]["rouName"];
            match = (new RegExp(keyword, 'i')).test(title);
            if(match) {
                matches++;
                courseElements[i].style.display = '';
            } else {
                courseElements[i].style.display = 'none';
            }
        }

        feedback.innerHTML = matches==0 ? 'No results' : 'Showing ' + matches.toString() + ' courses:';
    }
};

(function(script) {
    script.src = 'https://portal.stir.ac.uk/servlet/CalendarServlet?opt=menu&callback=stir.courseComboSearch'
    document.body.insertAdjacentElement("beforeend", script);
})(document.createElement('script'));