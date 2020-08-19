// TODO - move to the sign-up + settings pages, so that this will only display the calendar

const http = new SimpleHTTP();

const expectancy = document.querySelector("#years");

const birthdate = document.querySelector("#birthdateInput");

const finished_button = document.querySelector("#finished-input");

const current_view_value = parseInt(document.querySelector(".active-bottom").textContent) - 1;

// reset button (will be moved to their settings)
document.querySelector("#reset-stuff").addEventListener("click", tryReset);

// whether or not the clipboard button is displayed
let is_clipboard = false;
let current_view = "Years";

// amount
var amount;

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
        let bdayDate = new Date(birthdate.value);
        if (expectancy.value == "" || birthdate.value == "") {
            warningOutput(e, "Please fill out all data.");
            const error = setTimeout(warningHide, 3000);
            return;
        } else if (Date.parse(birthdate.value) > Date.now()) {
            warningOutput(e, "Please provide a valid birthdate.")
            const error = setTimeout(warningHide, 3000)
        } else if (calculateDays(bdayDate) > expectancy.value * 365) {
            warningOutput(e, "Please set your life expectancy higher or equal to your age.")
            const error = setTimeout(warningHide, 3000)
        }
        else {
            createMap(is_new_user, current_view);
            e.preventDefault();
        }
    });
}

function calculateDays(bday) {
    const current_day = new Date(Date.now())
    const diffTime = Math.abs(current_day - bday)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))  
}

function tryReset() {
    console.log("within the func")
    const serious = confirm(
        "Are you SURE you want to reset? This action is IRREVERSIBLE!"
    );
    if (serious == true) {
        localStorage.clear();
        document.querySelector(".output").innerHTML = "";
        location.reload();
        document.querySelector("#hideOnFormSubmission").style.display = "inline";
    }
}

function createMap(is_new, gran_level, e) {
    console.log(is_new)
    try {
        document
            .querySelector(".dontShowAtStart")
            .classList.remove("dontShowAtStart");
    } catch (e) {
        // this means that they have selected another view
        document.querySelector(".output").innerHTML = "";
    }
    if (is_new == true) {
        var age_expectancy = expectancy.value;
        var birthdate_value = birthdate.value;

        localStorage.setItem("age-expectancy", expectancy.value);
        localStorage.setItem("birthday", birthdate.value);

        calculateAmount(birthdate_value);

    } else {
        var age_expectancy = localStorage.getItem("age-expectancy");
        var birthdate_value = localStorage.getItem("birthday");
        calculateAmount(birthdate_value);
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

    // create all of the buttons from scratch - FIXME: working on only making the first x for pagination...

    // for (let i = current_view_value; i < Math.floor(age_expectancy * modifier); i++) {
    let maximal_amount;
    if ((current_view_value + 1) * 150 > Math.floor(age_expectancy * modifier)) {
        maximal_amount = Math.floor(age_expectancy * modifier);
    } else {
        maximal_amount = (current_view_value + 1) * 150
    }

    for (let i = current_view_value; i < maximal_amount; i++) {
        const newBtn = document.createElement("button");
        newBtn.setAttribute("id", `${gran_level}-${i + 1}`);
        newBtn.setAttribute("type", "button");
        newBtn.setAttribute("class", "mr-1 mb-1 year-button btn btn-lg");
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
                            <textarea class="form-control invisible" rows="8" id="what-did-${
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

    // prevent form from being filled out again
    document.querySelector("#hideOnFormSubmission").style.display = "none";

    // shade buttons based on the person's current journey in life
    shadeButtons(age_expectancy, birthdate_value);
}

// TODO: move to custom message + custom color
function warningOutput(e, msg) {
    document.querySelector(".get-data").classList.remove("d-none");
    document.querySelector(".get-data").innerHTML = msg;
    e.preventDefault();
}

function warningHide() {
    document.querySelector(".get-data").classList.add("d-none");
}

function calculateAmount(birthday) {
    let dob = new Date(birthday);
    let c_time = new Date(Date.now())
    
    function YearDiff(d1, d2) {
        var years;
        years = d2.getFullYear() - d1.getFullYear()
        return years;
    }

    function MonthDiff(d1, d2) {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    switch (current_view) {
        case "Decades":
            amount = Math.floor((YearDiff(dob, c_time) - 1) / 10)
            break;

        case "Years":
            amount = YearDiff(dob, c_time) - 1;
            break;

        case "Months":
            amount = MonthDiff(dob, c_time) - 1;
            break;

        case "Weeks":
            amount = Math.round((Date.now() - dob) / 604800000);
            break;

        case "Days":
            amount = Math.ceil(Math.abs(Date.now() - dob) / (60 * 60 * 24 * 1000)) - 1;
            break;
    
        default:
            amount = 0;
            break;
    }
}

function shadeButtons(age_expectancy, birthday) {
    // supports custom + bootstrap colors
    for (let x = ((current_view_value) * 150) + 1; x < ((current_view_value + 1) * 150) + 1; x++) {
        // document.querySelector(`#year-${x}`).style.backgroundColor = "#CD5C5C";
        // only if lower than amount...
        if (x < amount) {
            document.querySelector(`#${current_view}-${x}`).classList.add("btn-danger");
        }

    }
    // happens because we only make the first 150; we need to stop at 150
    console.log(current_view, amount)
    document.querySelector(`#${current_view}-${amount}`).classList.add("btn-warning");
    console.log(document.querySelector(`#${current_view}-${amount}`))
    // document.querySelector(`#year-${age}`).style.backgroundColor = "yellow";
    for (let x = amount + 1; x <= age_expectancy * modifier; x++) {
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
        .addEventListener("mousedown", generateEditModalBox);

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

        // make all images responsive to width
        let unresponse_images = document.querySelector(`#user-text-${i + 1}`).getElementsByTagName("img")
        for (let x = 0; x < unresponse_images.length; x++) {
            unresponse_images[x].classList.add("img-fluid")
        }

        // clear textarea
        document.querySelector(`#what-did-${i + 1}`).value = "";

        document
            .querySelector(`#submit-year-${i + 1}`)
            .removeEventListener("mousedown", generateEditModalBox);
    }

    function generateEditModalBox() {
        editModalBox(i);
        document
            .querySelector(`#submit-year-${i + 1}`)
            .removeEventListener("mousedown", generateEditModalBox);
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

        let unresponse_images = document.querySelector(`#user-text-${i + 1}`).getElementsByTagName("img")
        for (let x = 0; x < unresponse_images.length; x++) {
            unresponse_images[x].classList.add("img-fluid")
        }
    }
}
