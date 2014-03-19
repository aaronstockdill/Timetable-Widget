Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};

function createTable(title){
    document.getElementById("container").innerHTML = "<h1>" + title + "</h1><table id='timetable'><tbody id='tbody'></tbody></table>";
}

function createDays(data){
    toadd = "<tr><td class='time'>&nbsp;</td>";
    days = Object.keys(data.data);
    for(var day in days){
        this_day = days[day][0].toUpperCase() + days[day].substring(1);
        toadd += "<td class='time'>" + this_day + "</td>";
    }
    toadd += "</tr>"
    document.getElementById("tbody").innerHTML = toadd
}

function createTimetable(data){
    createTable(data.title)
    createDays(data);
    
    table = document.getElementById("tbody");
    times = Object.keys(data.data.monday);
    
    for(var h in times){
        newRow = "";
        newRow += "<tr id='" + times[h] + "' class='timerow'><td class='time'>" + times[h] + "</td>";
        for(var i in data.data){
            newRow += "<td onmouseover='showMore(\"" + times[h] + "\", \"" + i + "\", this)'>" + data.data[i][times[h]].title + "</td>"
        }
        newRow += "</tr>";
        table.innerHTML += newRow;
    }
}

function recolour(){
    var d = new Date();
    var today = d.getDay();
    times = document.getElementsByClassName("timerow");
    var time = (d.getHours() > 12)? d.getHours() - 12 + "pm": d.getHours() + "am";
    
    if(d.getHours() > 15){
        time = "4pm";
    } else if(d.getHours() < 9){
        time = "8am";
    }
    
    for(i=0;i < times.length;i++){
        times[i].childNodes[today].style.background = "#ecc";
        if(times[i].id == time){
            times[i].childNodes[today].style.background = "#c00";
            times[i].childNodes[today].style.color = "white";
        }
    }
    document.getElementById(time).style.background = "#ecc";
}

function showMore(time, day, cell){
    oldBG = cell.style.background;
    oldCol = cell.style.color;
    cell.addEventListener("mouseout", function(){
        cell.innerHTML = timetable.data[day][time].title;
        cell.style.background = oldBG;
        cell.style.color = oldCol;
    }, false)
    cell.innerHTML = timetable.data[day][time].more;
    cell.style.background = "gold";
    cell.style.color = "black";
}

function showError(text){
    document.getElementById("container").innerHTML = "<div id='alert'>WARNING: " + text + "</div>";
}

function retrieveTimetable(token){
    var url = "https://mytimetable.canterbury.ac.nz/aplus/student?ss=" + token;
    var method = "GET";
    var async = false;
    
    var request = new XMLHttpRequest();
    request.onload = function () {
       if(request.readyState == 4 && request.status == 200){
           var data = request.responseText.split("\n");
           var LINE = 379 - 1;
           logTimetable(data[LINE]);
       } else {
           showError("Login Failed.");
           return;
       }
   }
   
   request.open(method, url, async);
   request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   request.send(null);
}


function canterburyLogin(username, password){
    if(username == "" || password == ""){
        showError("Username or Password Invalid");
        return;
    }
    var url = "https://mytimetable.canterbury.ac.nz/aplus/rest/student/login";
    var method = "POST";
    var postData = "username=" + username + "&password=" + password;
    var async = false;
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
       if(request.readyState == 4 && request.status == 200){
           var data = JSON.parse(request.responseText);
           if(data['success']){
               console.log(data['token'])
               retrieveTimetable(data['token']);
           } else {
               showError("Login Failed.");
               return;
           }
       }
    }

    request.open(method, url, async);

    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(postData);
}

function logTimetable(info){
    var tt = JSON.parse(info.substring(5).replace(/\\"/g, '"'));
    var courses = tt['student']['allocated']
    var d = new Date();
    var w = d.getWeekNumber() - 1;

    for(var key in courses){
        // Replace this bit with code to create timetable, rather than just log it.
        var active = (courses[key]["week_pattern"][w] == "1")? "YES" : "NO";
        console.log(courses[key]["subject_code"].split("-")[0],
                    courses[key]["activityType"],
                    courses[key]["location"],
                    courses[key]["day_of_week"],
                    courses[key]["start_time"],
                    (parseInt(courses[key]["duration"]) / 60).toString() + "h",
                    active
                )
    }
}


usercode = "YOUR_USER_CODE";
password = "YOUR_PASSWORD";
canterburyLogin(usercode, password)

createTimetable(timetable);
recolour();