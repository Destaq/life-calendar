import { generateBottomBar } from "/static/js/pagination.js";

const http = new SimpleHTTP();

var age_expectancy = localStorage.getItem("age-expectancy");
var birthdate_value = localStorage.getItem("birthday");

// reset button (will be moved to their settings)
document.querySelector("#reset-stuff").addEventListener("click", tryReset);

// whether or not the clipboard button is displayed
let is_clipboard = false;
var current_view = "Years";
var current_view_value;
var applicableString;

// read the current view (months, weeks, years, etc.) and the current page (for pagination) - from the URL
function readFromUrl() {
    const urlParams = new URLSearchParams(location.search);

    if (urlParams.get("page") != null) {
        current_view_value = parseInt(urlParams.get("page")) - 1;
        applicableString = `page=${current_view_value + 1}&`;
    } else {
        current_view_value = 0;
        applicableString = "";
    }

    // make sure that a negative number was not provided
    if (current_view_value < 0) {
        current_view_value = 0;
    }

    if (urlParams.get("view") != null) {
        current_view =
            urlParams.get("view").slice(0, 1).toUpperCase() +
            urlParams.get("view").slice(1);
    }
}

readFromUrl();


var amount;

// default modifier, used for calculations
let modifier = 12;

// whether or not they are a new user
let is_new_user = false;

// granularity button views
const granularity_decades = document.querySelector("#view-decades");
const granularity_years = document.querySelector("#view-years");
const granularity_months = document.querySelector("#view-months");
const granularity_weeks = document.querySelector("#view-weeks");
const granularity_days = document.querySelector("#view-days");

if (age_expectancy == null || birthdate_value == null) {
    // they need to head over to /quiz to find out!
    document.querySelector("#missingData").innerHTML = `
    <strong>You haven't filled out your data!</strong> Please head over to the <a href="/quiz/">quiz page</a> to submit your life expectancy so that we can generate your life calendar!
    `;
} else {
    // TODO: check if regisered user, use data from DB

    // show the granularity + restart buttons
    document
        .querySelector(".dontShowAtStart")
        .classList.remove("dontShowAtStart");
    createMap(is_new_user, current_view);
}

// EVENT LISTENERS FOR GRANULARITIES

granularity_decades.addEventListener("click", function () {
    current_view = "Decades";
    window.history.pushState(
        "",
        "Life Calendar",
        `?${applicableString}view=decades`
    );
    readFromUrl();
    createMap(is_new_user, current_view);
});

granularity_years.addEventListener("click", function () {
    current_view = "Years";
    window.history.pushState(
        "",
        "Life Calendar",
        `?${applicableString}view=years`
    );
    readFromUrl();
    createMap(is_new_user, current_view);
});

granularity_months.addEventListener("click", function () {
    current_view = "Months";
    window.history.pushState(
        "",
        "Life Calendar",
        `?${applicableString}view=months`
    );
    readFromUrl();
    createMap(is_new_user, current_view);
});

granularity_weeks.addEventListener("click", function () {
    current_view = "Weeks";
    window.history.pushState(
        "",
        "Life Calendar",
        `?${applicableString}view=weeks`
    );
    readFromUrl();
    createMap(is_new_user, current_view);
});

granularity_days.addEventListener("click", function () {
    current_view = "Days";
    window.history.pushState(
        "",
        "Life Calendar",
        `?${applicableString}view=days`
    );
    readFromUrl();
    createMap(is_new_user, current_view);
});

// if the user chooses to restart entirely
function tryReset() {
    const serious = confirm(
        "Are you SURE you want to reset? This action is IRREVERSIBLE!"
    );
    if (serious == true) {
        localStorage.clear();
        // NOTE: implement removing from DB too - nuke their email
        document.querySelector(".output").innerHTML = "";
        location.href = "/quiz";
        document.querySelector("#hideOnFormSubmission").style.display =
            "inline";
    }
}

// main function that creates all of the buttons + markdown for that view
function createMap(is_new, gran_level, e) {
    try {
        document
            .querySelector(".dontShowAtStart")
            .classList.remove("dontShowAtStart");
    } catch (e) {
        // this means that they have selected another view - reset the innerHTML while we load the new buttons
        document.querySelector(".output").innerHTML = "";
    }

    calculateAmount(birthdate_value);

    const btnContainer = document.querySelector(".output");

    // find button modifier - used for calculating what "number" a button should have and the number to be generated
    switch (gran_level) {
        case "Days":
            modifier = 365.25;
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
            // NOTE: weeks isn't accurate
            modifier = 52;
            break;
    }


    let maximal_amount; // the highest number of the button to be displayed
    let navbar_view = current_view_value + 1; // the active button for the pagination navigation bar
    if (
        (current_view_value + 1) * 150 >
        Math.floor(age_expectancy * modifier)
    ) {
        if (Math.floor(age_expectancy * modifier) % 150 != 0 && current_view_value == Math.floor(age_expectancy * modifier / 150)) {
            maximal_amount = Math.floor(age_expectancy * modifier);
        }
    } else {
        maximal_amount = (current_view_value + 1) * 150;
    }

    let minimal_amount; // the smallest number of the button being displayed
    if (current_view_value * 150 < maximal_amount) {
        minimal_amount = current_view_value * 150;
    } 
    else {
        minimal_amount = 0;
        navbar_view = 1;
        current_view_value = 0;
    }

    // generate the pagination bar from pagination.js if applicable
    console.log(maximal_amount)
    if (maximal_amount > 149) {
        generateBottomBar(age_expectancy, modifier, navbar_view)
    } else {
        document.querySelector("#bottom-pagination-navbar").classList.add("invisible")
    }

    // make navbar previous + next clickable
    document.querySelector("#previous-page").children[0].href = `/?view=${current_view.toLowerCase()}&page=${navbar_view - 1}`
    document.querySelector("#next-page").children[0].href = `/?view=${current_view.toLowerCase()}&page=${navbar_view + 1}`

    // make individual navbar buttons clickable
    let arr = [].slice.call(document.querySelector(".pagination").children)
    arr.forEach(nav_item => {
        if (nav_item.classList.contains("page-number")) {
            nav_item.children[0].href = `/?view=${current_view.toLowerCase()}&page=${parseInt(nav_item.children[0].textContent)}`
        }
    })

    // lower maximal amount if user incorrectly entered page
    if (maximal_amount > 150 && minimal_amount == 0) {
        maximal_amount = 150;
    }

    // create the buttons for that page
    for (let i = minimal_amount; i < maximal_amount; i++) {
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
                        <h5 class="modal-title" id="exampleModalLabel">${current_view.slice(
                            0,
                            current_view.length - 1
                        )} ${i + 1}</h5>
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
            rewriteModal(i); // edit the modal box
        });
        newBtn.addEventListener("click", () => {
            checkSavedText(i); // check if the user already has written text there
        });

        btnContainer.append(newBtn);
        btnContainer.append(newBtnStyling);
    }

    // shade buttons based on the person's current position in life
    shadeButtons(age_expectancy, birthdate_value);
}

// calculates the amount of units in time the user has left until the end of their (assumed) life
function calculateAmount(birthday) {
    let dob = new Date(birthday);
    let c_time = new Date(Date.now());

    function YearDiff(d1, d2) {
        var years;
        years = d2.getFullYear() - d1.getFullYear();
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
            amount = Math.floor((YearDiff(dob, c_time) - 1) / 10);
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
            amount =
                Math.ceil(Math.abs(Date.now() - dob) / (60 * 60 * 24 * 1000)) -
                1;
            break;

        default:
            amount = 0; // TODO: will cause the code to break;
            break;
    }
}

function shadeButtons(age_expectancy, birthday) {
    // for the current 150 buttons
    for (
        let x = current_view_value * 150;
        x < (current_view_value + 1) * 150 + 1;
        x++
    ) {
        // only if lower than the amount of x units left till end of life...
        try {
            if (x < amount) {
                document
                    .querySelector(`#${current_view}-${x}`)
                    .classList.add("btn-danger");
            }
        } catch {}
    }

    if (amount <= (current_view_value + 1) * 150) {
        try {
            document
                .querySelector(`#${current_view}-${amount}`)
                .classList.add("btn-warning"); // current point in life
        } catch {}
        for (
            let x = current_view_value * 150;
            x < (current_view_value + 1) * 150 + 1;
            x++
        ) {
            try {
                document
                    .querySelector(`#${current_view}-${x}`)
                    .classList.add("btn-success"); // units left/unused
            } catch {}
        }
    }
}

function rewriteModal(i) { // rewrites the Markdown modal box
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

    // copy the current text down to the text being edited
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

    // fill textarea with data from localStorage if there - TODO: from DB if registered
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

            // show copy success for 2 secs
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

            // NOTE - implement DB storage for users...
            localStorage.setItem(
                `${current_view}-${i + 1}`,
                document.querySelector(`#what-did-${i + 1}`).value
            );
        } else {
            html = document.querySelector(`#user-text-${i + 1}`).innerHTML;
        }

        document.querySelector(`#user-text-${i + 1}`).innerHTML = html;

        // make all images responsive to width
        let unresponse_images = document
            .querySelector(`#user-text-${i + 1}`)
            .getElementsByTagName("img");
        for (let x = 0; x < unresponse_images.length; x++) {
            unresponse_images[x].classList.add("img-fluid");
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

// checks if there is saved markdown text in localStorage
function checkSavedText(i) {
    if (localStorage.getItem(`${current_view}-${i + 1}`) != null) {
        const markdown = localStorage.getItem(`${current_view}-${i + 1}`);
        var converter = new showdown.Converter(),
            text = markdown,
            html = converter.makeHtml(text);
        document.querySelector(`#user-text-${i + 1}`).innerHTML = html;

        // resize images so that they fit in the bootstrap modal
        let unresponse_images = document
            .querySelector(`#user-text-${i + 1}`)
            .getElementsByTagName("img");
        for (let x = 0; x < unresponse_images.length; x++) {
            unresponse_images[x].classList.add("img-fluid");
        }
    }
}
