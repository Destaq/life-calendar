const http = new SimpleHTTP();
const radios = document.getElementsByName("gridRadios");
const blankMapCheck = document.querySelector("#checkBlankCalendar");

// submit button
document
    .querySelector("#submitCalendarInfo")
    .addEventListener("click", function (e) {
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

        // TODO: take from DB for registered
        const url = `http://localhost:5000/api/makeimage?bday=${localStorage.getItem("birthday")}&expectancy=${localStorage.getItem("age-expectancy")}&auth=nothing&map_type=${mapType}&interval=${interval}`;

        // embed file for downloading
        const myBtn = document.createElement("a");
        myBtn.classList.add("btn");
        myBtn.classList.add("btn-success");
        myBtn.classList.add("mr-2");
        myBtn.setAttribute("type", "button");
        myBtn.setAttribute("download", "life_calendar");
        myBtn.innerHTML = "Download Image"

        http.get(url)
            .then((data) => {
                image.src = "data:image/png;base64," + data.result;
                image.style.width = "45%";
                // image.style.height = "20%";
                myBtn.setAttribute("href", image.src)
            })
            // TODO: note that something went wrong
            .catch((err) => console.log(err));

        // add another hr
        document.querySelector(".output").innerHTML +=
            '<hr><div class="row"><div class="col" id="imageCol"></div><div class="col" id="textCol"></div></div>';

        // add image preview
        document.querySelector("#imageCol").appendChild(image);

        // add special printing message
        document.querySelector("#textCol").innerHTML += `
        <p>You can view a preview of your calendar to the left.</p>

        <p>Likewise, you can download it as a PNG image to your device or print it out immediately.</p>

        <em>
            <p>NB (for print button): Because not all browsers are the same, <strong>to print the image on one page you will need to modify print settings.</strong></p>

            <ol>

                <li>When you click on the print button, go to "More Settings" at the bottom.</li>

                <li>Click on the "Scale" button and select "Custom".</li>

                <li>Increase/decrease the scale of the image until it fits on one page (or however many pages you want).</li>
                
            </ol>
            
        </em>
        
        <center><div class="btn-group" id="textColBtns"></div></center>
        `;

        document.querySelector("#textColBtns").appendChild(myBtn);

        // embed file for printing
        const printBtn = document.createElement("button");
        printBtn.classList.add("btn");
        printBtn.classList.add("btn-primary");
        printBtn.setAttribute("id", "printingButton");

        printBtn.innerHTML = "Print";

        document.querySelector("#textColBtns").appendChild(printBtn);

        printBtn.addEventListener("click", function (e) {
            PrintImage(image.src);
        });

        function PrintImage(source) {
            var myWindow = window.open("", "Image");
            myWindow.document.write(`<img src='${source}'>`);
            myWindow.print();
        }

        e.preventDefault();
    });
