const expectancy = document.querySelector("#years");

const birthdate = document.querySelector("#birthdateInput");

const finished_button = document.querySelector("#finished-input");

if (localStorage.getItem("age-expectancy") != null) {
    document.querySelector("#gen-data-info").style.display = "none";
    // TODO: hide input when loading this...
    generateUserMap();
} else {
    finished_button.addEventListener("click", function (e) {
        createMap(true);
        e.preventDefault();
    });
}

function createMap(is_new, e) {
    if (is_new == true) {
        if (expectancy.value == "" || birthdate.value == "") {
            warningOutput(e);
            const error = setTimeout(warningHide, 3000);
            return;
        }

        const age_expectancy = expectancy.value;
        const birthdate_value = birthdate.value;

        localStorage.setItem("age-expectancy", expectancy.value);
        localStorage.setItem("birthday", birthdate.value);
    } else {
        age_expectancy = localStorage.getItem("age-expectancy");
        birthdate_value = localStorage.getItem("birthday");
    }

    const btnContainer = document.querySelector(".output");
    for (let i = 0; i < age_expectancy; i++) {
        const newBtn = document.createElement("button");
        newBtn.setAttribute("id", `year-${i + 1}`);
        newBtn.setAttribute("type", "button");
        newBtn.setAttribute("class", "mr-1 mb-1 year-button btn");
        newBtn.setAttribute("data-toggle", "modal");
        newBtn.setAttribute("data-target", `#Modal${i}`);
        newBtn.innerHTML = `${i + 1}`;

        const newBtnStyling = document.createElement("span");

        newBtnStyling.innerHTML += `
        <div class="modal fade" id="Modal${i}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" display="inline">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Year ${
                            i + 1
                        }</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <center><label for="what-did-${i}"><strong>Goals/Accomplished</strong></label></center>
                        <div id="user-text-${i}"></div>
                            <textarea class="form-control invisible" id="what-did-${i}" placeholder="Supports Markdown!"></textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary edit" id="submit-year-${i}">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        const saveChanges =
            newBtnStyling.children[0].children[0].children[0].children[2]
                .children[1];
        saveChanges.addEventListener("click", () => {
            rewriteModal(i);
        });
        newBtn.addEventListener("click", () => {
            checkSavedText(i);
        });

        btnContainer.append(newBtn);
        btnContainer.append(newBtnStyling);
    }

    // });
    // prevent submit button from being clicked again
    document.querySelector("#finished-input").style.display = "none";

    shadeButtons(age_expectancy, birthdate_value);
}

function warningOutput(e) {
    let warning = "Please fill out all data!";
    document.querySelector(".get-data").classList.remove("d-none");
    document.querySelector(".get-data").innerHTML = warning;
    e.preventDefault();
}

function warningHide() {
    document.querySelector(".get-data").classList.add("d-none");
}

function shadeButtons(age_expectancy, birthday) {
    function calculateAge() {
        let dob = new Date(birthday);
        dob = Date.now() - dob.getTime();
        ageDate = new Date(dob);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    const age = calculateAge();
    for (let x = 1; x < age; x++) {
        // document.querySelector(`#year-${x}`).style.backgroundColor = "#CD5C5C";
        document.querySelector(`#year-${x}`).classList.add("btn-danger");
    }
    document.querySelector(`#year-${age}`).classList.add("btn-warning");
    // document.querySelector(`#year-${age}`).style.backgroundColor = "yellow";
    for (let x = age + 1; x <= age_expectancy; x++) {
        // document.querySelector(`#year-${x}`).style.backgroundColor = "#32CD32";
        document.querySelector(`#year-${x}`).classList.add("btn-success");
    }
}

// TODO: support rewriting modal multiple times
function rewriteModal(i) {
    console.log("at rewrite modal " + i)
    // change button name and class
    document.querySelector(`#submit-year-${i}`).textContent = "Save changes";

    // allow markdown input + remove invisible class
    document.querySelector(`#what-did-${i}`).classList.remove("invisible");

    // check for save button click
    document
        .querySelector(`#submit-year-${i}`)
        .addEventListener("click", function () {
            // save modal text to local storage
            localStorage.setItem(
                i,
                document.querySelector(`#what-did-${i}`).value
            );

            // change back to edit
            document.querySelector(`#submit-year-${i}`).textContent = "Edit";

            // display changes
            document.querySelector(`#what-did-${i}`).classList.add("invisible");
            var converter = new showdown.Converter(),
                text = document.querySelector(`#what-did-${i}`).value,
                html = converter.makeHtml(text);

            document.querySelector(`#user-text-${i}`).innerHTML = html;

            // clear textarea
            document.querySelector(`#what-did-${i}`).value = "";
        });
}

function generateUserMap() {
    createMap(false);
}

function checkSavedText(i) {
    if (localStorage.getItem(i) != null) {
        const markdown = localStorage.getItem(i);
        var converter = new showdown.Converter(),
            text = markdown,
            html = converter.makeHtml(text);
        document.querySelector(`#user-text-${i}`).innerHTML = html;
    }
}
