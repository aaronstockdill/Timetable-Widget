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

createTimetable(timetable);
recolour();