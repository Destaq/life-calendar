const http = new SimpleHTTP();

const expectancy = document.querySelector("#years");

const birthdate = document.querySelector("#birthdateInput");

const finished_button = document.querySelector("#finished-input");

// whether or not the clipboard button is displayed
let is_clipboard = false;
let current_view = "Years";

// default modification
let modifier = 50;

// whether or not they are a new user
let is_new_user = true;

// granularity button views
const granularity_decades = document.querySelector("#view-decades");
const granularity_years = document.querySelector("#view-years");
const granularity_months = document.querySelector("#view-months");
const granularity_weeks = document.querySelector("#view-weeks");
const granularity_days = document.querySelector("#view-days");

// current view (defaults to years)

granularity_decades.addEventListener("click", function () {
    current_view = "Decades";
    createMap(is_new_user, current_view);
});

granularity_years.addEventListener("click", function () {
    current_view = "Years";
    createMap(is_new_user, current_view);
});

granularity_months.addEventListener("click", function () {
    current_view = "Months";
    createMap(is_new_user, current_view);
});

granularity_weeks.addEventListener("click", function () {
    current_view = "Weeks";
    createMap(is_new_user, current_view);
});

granularity_days.addEventListener("click", function () {
    current_view = "Days";
    createMap(is_new_user, current_view);
});

// set up the tooltip
$("body").tooltip({
    selector: ".btn",
});

// generate map from localStorage if not empty, else from blank
if (localStorage.getItem("age-expectancy") != null) {
    document.querySelector("#gen-data-info").style.display = "none";
    // TODO: hide input when loading this...
    generateUserMap();
} else {
    finished_button.addEventListener("click", function (e) {
        // warn if they filled out the information incorrectly
        // TODO: don't show the Restart and Granularity buttons if this occurs
        if (expectancy.value == "" || birthdate.value == "") {
            warningOutput(e);
            const error = setTimeout(warningHide, 3000);
            return;
        } else {
            createMap(is_new_user, current_view);
            e.preventDefault();
        }
    });
}

// reset button (will be moved to their settings)
document.querySelector("#reset-stuff").addEventListener("click", tryReset);

function tryReset() {
    const serious = confirm(
        "Are you SURE you want to reset? This action is IRREVERSIBLE!"
    );
    if (serious == true) {
        localStorage.clear();
        location.reload();
    }
}

// checkbox for whether or not they want to add their email (again, link to user signup)
const send_emails = document.querySelector("#send-emails");
send_emails.addEventListener("click", showEmailDialog);
function showEmailDialog() {
    if (send_emails.checked) {
        let invisibles = document.querySelectorAll(".emailDialog");
        invisibles.forEach((invisible) => {
            invisible.classList.remove("invisible");
        });
    } else {
        let invisibles = document.querySelectorAll(".emailDialog");
        invisibles.forEach((invisible) => {
            invisible.classList.add("invisible");
        });
    }
}

function createMap(is_new, gran_level, e) {
    try {
        document
            .querySelector(".dontShowAtStart")
            .classList.remove("dontShowAtStart");
    } catch (e) {
        // this means that they have selected another view
        document.querySelector(".output").innerHTML = "";
    }
    if (is_new == true) {
        const age_expectancy = expectancy.value;
        const birthdate_value = birthdate.value;

        localStorage.setItem("age-expectancy", expectancy.value);
        localStorage.setItem("birthday", birthdate.value);
    } else {
        age_expectancy = localStorage.getItem("age-expectancy");
        birthdate_value = localStorage.getItem("birthday");
    }

    const btnContainer = document.querySelector(".output");

    // find button modifier
    switch (gran_level) {
        case "Days":
            // todo - support leap years
            modifier = 365;
            break;
        case "Months":
            modifier = 12;
            break;
        case "Years":
            modifier = 1;
            break;
        case "Decades":
            modifier = 0.1;
            break;
        default:
            modifier = 52;
            break;
    }

    // create all of the buttons from scratch - FIXME: look into caching HTML
    for (let i = 0; i < age_expectancy * modifier; i++) {
        const newBtn = document.createElement("button");
        newBtn.setAttribute("id", `${gran_level}-${i + 1}`);
        newBtn.setAttribute("type", "button");
        newBtn.setAttribute("class", "mr-1 mb-1 year-button btn");
        newBtn.setAttribute("data-toggle", "modal");
        newBtn.setAttribute("data-target", `#Modal${i + 1}`);
        newBtn.innerHTML = `${i + 1}`;

        const newBtnStyling = document.createElement("span");

        newBtnStyling.innerHTML += `
        <div class="modal fade" id="Modal${
            i + 1
        }" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" display="inline">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">${current_view.slice(start=0, end=current_view.length - 1)} ${
                            i + 1
                        }</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <center><label for="what-did-${
                            i + 1
                        }"><strong><u>Goals/Accomplished</u></strong></label></center>
                        <div id="user-text-${i + 1}" class="smallInput"></div>
                            <textarea class="form-control invisible" id="what-did-${
                                i + 1
                            }" placeholder="Supports Markdown and copying down previous text!"></textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary edit" id="submit-year-${
                                i + 1
                            }">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        // button for saving markdown changes
        const saveChanges =
            newBtnStyling.children[0].children[0].children[0].children[2]
                .children[1];

        saveChanges.addEventListener("mousedown", () => {
            rewriteModal(i);
        });
        newBtn.addEventListener("click", () => {
            checkSavedText(i);
        });

        btnContainer.append(newBtn);
        btnContainer.append(newBtnStyling);
    }

    // prevent submit button from being clicked again
    document.querySelector("#finished-input").style.display = "none";

    // shade buttons based on the person's current journey in life
    shadeButtons(age_expectancy, birthdate_value);
}

// TODO: move to custom message + custom color
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
    // supports custom + bootstrap colors
    for (let x = 1; x < (age * modifier); x++) {
        // document.querySelector(`#year-${x}`).style.backgroundColor = "#CD5C5C";
        document.querySelector(`#${current_view}-${x}`).classList.add("btn-danger");
    }
    document.querySelector(`#${current_view}-${age * modifier}`).classList.add("btn-warning");
    // document.querySelector(`#year-${age}`).style.backgroundColor = "yellow";
    for (let x = (age * modifier) + 1; x <= age_expectancy * modifier; x++) {
        // document.querySelector(`#year-${x}`).style.backgroundColor = "#32CD32";
        document.querySelector(`#${current_view}-${x}`).classList.add("btn-success");
    }
}

function rewriteModal(i) {
    // change button name
    document.querySelector(`#submit-year-${i + 1}`).textContent =
        "Save changes";

    // add clipboard button (although slightly misleading)
    const clipboard_button = document.createElement("button");
    clipboard_button.classList.add("btn");
    clipboard_button.setAttribute("id", `clipboard-copy-${i + 1}`);
    clipboard_button.setAttribute("data-toggle", "tooltip");
    clipboard_button.setAttribute("data-placement", "top");
    clipboard_button.setAttribute("type", "button");
    clipboard_button.setAttribute("title", "Paste old text to input!");
    clipboard_button.innerHTML = `
    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-clipboard" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
        <path fill-rule="evenodd" d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
    </svg>
    `;

    clipboard_button.addEventListener("click", function () {
        copyAboveToTextarea(i + 1);
    });

    if (is_clipboard == false) {
        is_clipboard = true;
        document
            .querySelector(`#submit-year-${i + 1}`)
            .parentElement.insertBefore(
                clipboard_button,
                document.querySelector(`#submit-year-${i + 1}`).parentElement
                    .children[1]
            );
    }

    // allow markdown input + remove invisible class
    document.querySelector(`#what-did-${i + 1}`).classList.remove("invisible");

    // fill textarea with data from localStorage if there
    function copyAboveToTextarea(i) {
        if (localStorage.getItem(`${current_view}-${i}`) != null) {
            document.querySelector(
                `#what-did-${i}`
            ).value = localStorage.getItem(`${current_view}-${i}`);
            console.log(localStorage.getItem(`${current_view}-${i}`));
            document.querySelector(`#what-did-${i}`).value;

            const copy_success = document.createElement("div");
            copy_success.classList.add("alert");
            copy_success.classList.add("alert-success");
            copy_success.setAttribute("role", "alert");
            copy_success.innerHTML = "Copied down!";

            // show copy success
            document
                .querySelector(`#what-did-${i + 1}`)
                .parentElement.insertBefore(
                    copy_success,
                    document.querySelector(`#what-did-${i + 1}`).parentElement
                        .children[0]
                );

            setTimeout(function () {
                copy_success.remove();
            }, 2000);
        }
    }

    // check for save button click
    document
        .querySelector(`#submit-year-${i + 1}`)
        .addEventListener("mouseup", generateEditModalBox);

    function editModalBox(i) {
        // remove clipboard button
        if (is_clipboard == true) {
            document
                .querySelector(`#submit-year-${i + 1}`)
                .parentElement.removeChild(clipboard_button);
            is_clipboard = false;
        }

        // change back to edit
        document.querySelector(`#submit-year-${i + 1}`).textContent = "Edit";

        // display changes
        document.querySelector(`#what-did-${i + 1}`).classList.add("invisible");
        if (
            document.querySelector(`#user-text-${i + 1}`).innerHTML[0] != "<" ||
            document.querySelector(`#what-did-${i + 1}`).value != ""
        ) {
            // converts markdown to HTML
            var converter = new showdown.Converter(),
                text = document.querySelector(`#what-did-${i + 1}`).value,
                html = converter.makeHtml(text);
            localStorage.setItem(
                `${current_view}-${i + 1}`,
                document.querySelector(`#what-did-${i + 1}`).value
            );
        } else {
            html = document.querySelector(`#user-text-${i + 1}`).innerHTML;
        }

        document.querySelector(`#user-text-${i + 1}`).innerHTML = html;

        // clear textarea
        document.querySelector(`#what-did-${i + 1}`).value = "";

        document
            .querySelector(`#submit-year-${i + 1}`)
            .removeEventListener("mouseup", generateEditModalBox);
    }

    function generateEditModalBox() {
        editModalBox(i);
        document
            .querySelector(`#submit-year-${i + 1}`)
            .removeEventListener("mouseup", generateEditModalBox);
    }
}

function generateUserMap() {
    is_new_user = false;
    createMap(is_new_user, current_view);
}

// checks if there is saved markdown text in localStorage
function checkSavedText(i) {
    if (localStorage.getItem(`${current_view}-${i + 1}`) != null) {
        const markdown = localStorage.getItem(`${current_view}-${i + 1}`);
        var converter = new showdown.Converter(),
            text = markdown,
            html = converter.makeHtml(text);
        document.querySelector(`#user-text-${i + 1}`).innerHTML = html;
    }
}
