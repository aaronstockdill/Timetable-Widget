function createTable(title){
    document.getElementById("container").innerHTML = "<h1>" + title + "</h1><table id='timetable'><tbody id='tbody'></tbody></table>";
}

function createDays(){
    document.getElementById("tbody").innerHTML = "<tr>\
        <td class='time'>&nbsp;</td>\
        <td class='day'>Monday</td>\
        <td class='day'>Tuesday</td>\
        <td class='day'>Wednesday</td>\
        <td class='day'>Thursday</td>\
        <td class='day'>Friday</td>\
        </tr>";
}

function createTimetable(data){
    createTable(data.title)
    createDays();
    
    table = document.getElementById("tbody");
    times = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm"];
    
    for(var h in times){
        newRow = "";
        newRow += "<tr id='" + times[h] + "' class='timerow'><td class='time'>" + times[h] + "</td>";
        for(var i in data.data){
            newRow += "<td>" + data.data[i][times[h]] + "</td>"
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
        time = "3pm";
    } else if(d.getHours() < 9){
        time = "9am";
    }
    
    for(i=0;i < times.length;i++){
        times[i].childNodes[today].style.background = "#ecc";
        console.log(times[i].id);
        console.log(time);
        if(times[i].id == time){
            times[i].childNodes[today].style.background = "#c00";
            times[i].childNodes[today].style.color = "white";
        }
    }
    document.getElementById(time).style.background = "#ecc";
}

createTimetable(timetable);
recolour();