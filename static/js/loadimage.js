const http = new SimpleHTTP();
const radios = document.getElementsByName("gridRadios");
const blankMapCheck = document.querySelector("#checkBlankCalendar");

// submit button
document.querySelector("#submitCalendarInfo").addEventListener("click", function(e) {
    document.querySelector(".output").innerHTML = "";
    var image = new Image();
    let interval = "weeks";
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            interval = radios[i].value;
            break;
        }
    }

    let mapType = "full";
    if (blankMapCheck.checked == true) {
        mapType = "blank";
    }
    
    http.get(
        `http://localhost:5000/api/makeimage?username=null&auth=nothing&map_type=${mapType}&interval=${interval}`
    )
        .then((data) => {
            image.src = "data:image/png;base64," + data.result;
        })
        .catch((err) => console.log(err));
    
    // add image preview
    document.querySelector(".output").appendChild(image);

    // embed file for downloading

    // embed file for printing

    e.preventDefault();
})

