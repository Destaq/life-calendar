import { generateBottomBar } from "/static/js/pagination.js";
import { execFancy, execSimple } from "/static/js/userInput.js";

var age_expectancy;
var birthdate_value;

import { callDB } from "/static/js/readUserContent.js";
async function readFromServer() {
    await callDB();
}

// whether or not the clipboard button is displayed
let is_clipboard = false;

// set weeks as default view
var current_view = "Weeks";
var current_view_value;

// setup fancy mode for editing by default
var editingType = "fancy";

// default modifier, used for calculations
var modifier = 12;

// Prevent bootstrap dialog from blocking focusin
$(document).on('focusin', function(e) {
    if ($(e.target).closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root").length) {
		e.stopImmediatePropagation();
	}
});

// read the current view (months, weeks, years, etc.) and the current page (for pagination) - from the URL
function readFromUrl() {
    let urlGoTo = false; // modify current page if "page" not in URL

    const urlParams = new URLSearchParams(location.search);

    if (urlParams.get("page") != null) {
        current_view_value = parseInt(urlParams.get("page")) - 1;
    } else {
        current_view_value = 0;
        urlGoTo = true;
    }

    // make sure that a negative number was not provided
    if (current_view_value < 0) {
        current_view_value = 0;
    }

    if (urlParams.get("view") != null) {
        current_view =
            urlParams.get("view").slice(0, 1).toUpperCase() +
            urlParams.get("view").slice(1);

        modifier = calculateModifier(current_view)
    }

    if (urlGoTo == true) {
        calculateDefaultView();
    }
}

function calculateDefaultView() {
    current_view_value = Math.floor(modifier * age_expectancy) - (Math.floor(modifier * age_expectancy) - calculateAmount(birthdate_value, current_view));
    current_view_value = Math.floor(current_view_value / 150)
}

readFromUrl();

var amount;

// whether or not they are a new user
let is_new_user = false;

// granularity button views
const granularity_decades = document.querySelector("#view-decades");
const granularity_years = document.querySelector("#view-years");
const granularity_months = document.querySelector("#view-months");
const granularity_weeks = document.querySelector("#view-weeks");
const granularity_days = document.querySelector("#view-days");

// get information from server
async function runGetServer() {
    await readFromServer();
    readFromUrl();

    age_expectancy = localStorage.getItem("age-expectancy");
    birthdate_value = localStorage.getItem("birthday");

    if (age_expectancy == null || birthdate_value == null || age_expectancy === 0 || birthdate_value === "") {
        // they need to head over to /quiz to find out!
        document.querySelector("#missingData").innerHTML = `
        <p><strong>You haven't filled out your data!</strong> Please head over to the <a href="/quiz/">quiz page</a> to submit your life expectancy so that we can generate your life calendar.</p><p>You'll then be able to access your own calendar, similar to the one below!</p><img class="img-fluid rounded mx-auto d-block d-small" alt="Life Calendar home page preview" src="/static/images/videopreview.png" style="max-width: 80%">
        `;
    } else {
        // TODO: if registered user, use XOR with data from DB
        readFromUrl();
        createMap(is_new_user, current_view);

        // show the granularity + restart buttons
        try {
            document
                .querySelector(".dontShowAtStart")
                .classList.remove("dontShowAtStart");
        } catch {}
    }
}

runGetServer();

// Event Listener for home page - go to current point in life
document.querySelector("#centerPage").addEventListener("click", function() {
    window.history.pushState("", "Life Calendar", `?view=${current_view.toLowerCase()}`)
    readFromUrl()
    createMap(is_new_user, current_view)
})

// EVENT LISTENERS FOR GRANULARITIES

granularity_decades.addEventListener("click", function () {
    current_view = "Decades";
    window.history.pushState(
        "",
        "Life Calendar",
        `?view=decades`
    );
    readFromUrl();
    createMap(is_new_user, current_view);
});

granularity_years.addEventListener("click", function () {
    current_view = "Years";
    window.history.pushState(
        "",
        "Life Calendar",
        `?view=years`
    );
    readFromUrl();
    createMap(is_new_user, current_view);
});

granularity_months.addEventListener("click", function () {
    current_view = "Months";
    window.history.pushState(
        "",
        "Life Calendar",
        `?view=months`
    );
    readFromUrl();
    createMap(is_new_user, current_view);
});

granularity_weeks.addEventListener("click", function () {
    current_view = "Weeks";
    window.history.pushState(
        "",
        "Life Calendar",
        `?view=weeks`
    );
    readFromUrl();
    createMap(is_new_user, current_view);
});

granularity_days.addEventListener("click", function () {
    current_view = "Days";
    window.history.pushState(
        "",
        "Life Calendar",
        `?view=days`
    );
    readFromUrl();
    createMap(is_new_user, current_view);
});

// main function that creates all of the buttons + markdown for that view
async function createMap(is_new, gran_level, e) {
    try {
        document
            .querySelector(".dontShowAtStart")
            .classList.remove("dontShowAtStart");
    } catch (e) {
        // this means that they have selected another view - reset the innerHTML while we load the new buttons
        document.querySelector(".output").innerHTML = "";
    }

    amount = calculateAmount(birthdate_value, current_view);

    const btnContainer = document.querySelector(".output");

    // find button modifier - used for calculating what "number" a button should have and the number to be generated
    modifier = calculateModifier(gran_level);

    let maximal_amount; // the highest number of the button to be displayed
    if (current_view_value === -1) {
        current_view_value += 1; // support those who have yet to reach their first year
    }
    let navbar_view = current_view_value + 1; // the active button for the pagination navigation bar
    if (
        (current_view_value + 1) * 150 >
        Math.floor(age_expectancy * modifier)
    ) {
        if (
            Math.floor(age_expectancy * modifier) % 150 != 0 &&
            current_view_value >= Math.floor((age_expectancy * modifier) / 150)
        ) {
            maximal_amount = Math.floor(age_expectancy * modifier);
        }
    } else {
        maximal_amount = (current_view_value + 1) * 150;
    }
    let minimal_amount; // the smallest number of the button being displayed
    if (current_view_value * 150 < maximal_amount) {
        minimal_amount = current_view_value * 150;
    } else {
        // they entered a number that was too high
        minimal_amount = Math.floor((maximal_amount - 1) / 150) * 150;
        current_view_value = Math.floor(age_expectancy * modifier / 150);
        navbar_view = current_view_value + 1;
    }

    // generate the pagination bar from pagination.js if applicable
    if (maximal_amount > 149) {
        if (navbar_view === 1 || navbar_view === 0) {
            // support 0-day
            minimal_amount -= 1;
        }
        generateBottomBar(age_expectancy, modifier, navbar_view);
    } else {
        document
            .querySelector("#bottom-pagination-navbar")
            .classList.add("invisible");
        // support for 0-day in years and decades
        minimal_amount -= 1;
    }

    // make navbar previous + next clickable
    document.querySelector(
        "#previous-page"
    ).children[0].href = `/?view=${current_view.toLowerCase()}&page=${
        navbar_view - 1
    }`;
    document.querySelector(
        "#next-page"
    ).children[0].href = `/?view=${current_view.toLowerCase()}&page=${
        navbar_view + 1
    }`;

    // make individual navbar buttons clickable
    let arr = [].slice.call(document.querySelector(".pagination").children);
    arr.forEach((nav_item) => {
        if (nav_item.classList.contains("page-number")) {
            nav_item.children[0].href = `/?view=${current_view.toLowerCase()}&page=${parseInt(
                nav_item.children[0].textContent
            )}`;
        }
    });

    // update number input with new values
    const numberInput = document.querySelector("#shadeDropdown");
    numberInput.setAttribute("min", minimal_amount + 1);
    numberInput.setAttribute("max", maximal_amount);
    numberInput.setAttribute("value", minimal_amount + 1);
    numberInput.value = minimal_amount + 1;
    numberInput.setAttribute("style", "width: 5.5em");
    // create the buttons for that page
    for (let i = minimal_amount; i < maximal_amount; i++) {
        const newBtn = document.createElement("button");
        newBtn.setAttribute("id", `${gran_level}-${i + 1}`);
        newBtn.setAttribute("type", "button");
        newBtn.setAttribute("class", "mr-1 mb-1 year-button btn btn-lg");
        newBtn.setAttribute("data-toggle", "modal");
        newBtn.setAttribute("data-target", `#Modal${i + 1}`);
        newBtn.innerHTML = `${i + 1}`;

        // shrink text size if text too big
        if ((i + 1).toString().length == 5) {
            newBtn.innerHTML = `<span style="font-size:smaller;">${i + 1}</span>`
        }
        
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
                        <div id="switchInputType-${i + 1}" class="invisible"></div>

                        <div class="d-flex justify-content-center">
                            <div class="spinner-border invisible mt-5" id="fancyLoadingSpinner-${i + 1}" role="status" style="width: 3rem; height: 3rem;">
                            <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                        
                            <textarea class="form-control invisible pt-2" rows="10" id="what-did-${
                                i + 1
                            }-markdown" placeholder="Supports Markdown and copying down previous text!"></textarea>

                        <textarea class="form-control invisible pt-2" rows="10" id="what-did-${
                            i + 1
                        }" placeholder="What happened? What are you planning to achieve?"></textarea>
                        </div>

                        <div class="modal-footer">

                            <button type="button" class="btn btn-primary edit" id="submit-year-${
                                i + 1
                            }">Edit</button>

                            <button type="button" class="btn btn-danger" id="clear-contents-${i + 1}">Delete</button>

                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        // button for saving markdown changes
        const saveChanges =
            newBtnStyling.children[0].children[0].children[0].children[2]
                .children[0];

        // button for deleting everything
        const deleteButton = 
            newBtnStyling.children[0].children[0].children[0].children[2]
                .children[1];

        saveChanges.addEventListener("mousedown", () => {
            rewriteModal(i); // edit the modal box
        });
        deleteButton.addEventListener("click", () => {
            deleteConfirmation(i);
        })
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
function calculateAmount(birthday, cview) {
    let dob = new Date(birthday);
    let c_time = new Date(Date.now());
    let th_amount;

    function YearDiff(d1, d2) {
        var ageDifMs = Date.now() - dob.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    function MonthDiff(d1, d2) {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    switch (cview) {
        case "Decades":
            th_amount = Math.floor(YearDiff() / 10);
            break;

        case "Years":
            th_amount = YearDiff();
            break;

        case "Months":
            th_amount = MonthDiff(dob, c_time) - 1;
            break;

        case "Weeks":
            th_amount = Math.round((Date.now() - dob) / 604800000);
            break;

        case "Days":
            th_amount =
                Math.ceil(Math.abs(Date.now() - dob) / (60 * 60 * 24 * 1000)) -
                1;
            break;

        default:
            th_amount = 0; // TODO: will cause the code to break;
            break;
    }

    return th_amount;
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
            if (x < amount && (localStorage.getItem(`${current_view}-${x}-background`) == null)) {

                    document
                        .querySelector(`#${current_view}-${x}`)
                        .style.background = "repeating-linear-gradient(45deg, #dc3545, #dc3545 10px)"
            } else if (localStorage.getItem(`${current_view}-${x}-background`) != null) {
                document
                    .querySelector(`#${current_view}-${x}`)
                    .style.background = localStorage.getItem(`${current_view}-${x}-background`)
            }
        } catch {}
    }
    // support for *very* small ages
    if (amount === -1) {
        amount += 1;
    }
    if (amount <= (current_view_value + 1) * 150) {
        try {
            if ((localStorage.getItem(`${current_view}-${amount}-background`) != null)) {
                // error to be avoided: yellow is highlighted two times for days
                document
                    .querySelector(`#${current_view}-${amount}`)
                    .style.background = localStorage.getItem(`${current_view}-${amount}-background`)
            } else {
                document
                    .querySelector(`#${current_view}-${amount}`)
                    .style.background = "repeating-linear-gradient(45deg, #ffc107, #ffc107 10px)"; // current point in life
            }
        } catch {};
        for (
            let x = current_view_value * 150;
            x < (current_view_value + 1) * 150 + 1;
            x++
        ) {
            try {
                if (document
                        .querySelector(`#${current_view}-${x}`)
                        .style.background == "" && (localStorage.getItem(`${current_view}-${x}-background`) != null) && localStorage.getItem(`${current_view}-${x}-background`) != "repeating-linear-gradient(45deg, rgb(255, 193, 7), rgb(255, 193, 7) 10px") {
                        document
                            .querySelector(`#${current_view}-${x}`)
                            .style.background = localStorage.getItem(`${current_view}-${x}-background`)
                } else if (document
                    .querySelector(`#${current_view}-${x}`)
                    .style.background == "") {
                    document
                        .querySelector(`#${current_view}-${x}`)
                        .style.background = "repeating-linear-gradient(45deg, #28a745, #28a745 10px)"
                }
            } catch {}
        }
    }
}

async function rewriteModal(i) {
    // rewrites the Markdown modal box
    // change button name
    document.querySelector(`#submit-year-${i + 1}`).textContent =
        "Save changes";

    // hides clipboard when modal is closed

    $(`#Modal${i + 1}`).on('hide.bs.modal', function() {

        if (is_clipboard === true) {
            editModalBox(i);
        }

    })

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

        document.querySelector(`#switchInputType-${i + 1}`).classList.remove("invisible")
        if (editingType == "fancy") {
            try {
                document.querySelector(`#switchInputType-${i + 1}`).removeEventListener("click", function(e) {
                    is_clipboard = true;
                    generateEditModalBox();
                    editingType = "simple";
                    rewriteModal(i);
                    e.preventDefault();
                })
            } catch {}
            document.querySelector(`#switchInputType-${i + 1}`).innerHTML = "<p><hr>Switch to <a href='#'>Markdown Mode</a>.</p>"
            document.querySelector(`#switchInputType-${i + 1}`).addEventListener("click", function(e) {
                is_clipboard = true;
                generateEditModalBox();
                editingType = "simple";
                rewriteModal(i);
                e.preventDefault();
            })
        } else {
            try {
                document.querySelector(`#switchInputType-${i + 1}`).removeEventListener("click", function(e) {
                    is_clipboard = true;
                    generateEditModalBox();
                    editingType = "fancy";
                    rewriteModal(i);
                    e.preventDefault();
                })
            } catch {}
            document.querySelector(`#switchInputType-${i + 1}`).innerHTML = "<p><hr>Switch to <a href='#'>Fancy Mode</a>.</p>"
            document.querySelector(`#switchInputType-${i + 1}`).addEventListener("click", function(e) {
                is_clipboard = true;
                generateEditModalBox();
                editingType = "fancy";
                rewriteModal(i);
                e.preventDefault();
            })
        }

        // allow markdown input + remove invisible class
        if (editingType == "simple") {
            document
                .querySelector(`#what-did-${i + 1}-markdown`)
                .classList.remove("invisible");
            execSimple(i);
        } else {
            document
                .querySelector(`#what-did-${i + 1}`)
                .classList.remove("invisible");
            document.querySelector(`#fancyLoadingSpinner-${i + 1}`).classList.remove("invisible")
            execFancy(i);
        }

        // check for save button click
        document
            .querySelector(`#submit-year-${i + 1}`)
            .addEventListener("mousedown", generateEditModalBox);
    }

    // fill textarea with data from localStorage if there - TODO: from DB if registered
    function copyAboveToTextarea(i) {
        if (localStorage.getItem(`${current_view}-${i}`) != null) {
            const oldUserText = localStorage.getItem(`${current_view}-${i}`)
            if (editingType == "simple") {


                if (oldUserText.slice(0, 1) != "<") {
                    document.querySelector(
                        `#what-did-${i}-markdown`
                    ).value = oldUserText;
                } else {
                    var converter = new showdown.Converter({tables: true, strikethrough: true, tasklists: true, simpleLineBreaks: true, emoji: true}),
                    htmlText = document.querySelector(`#user-text-${i}`)
                        .innerHTML,
                    markdown = converter.makeMarkdown(htmlText);

                    document.querySelector(
                        `#what-did-${i}-markdown`
                    ).value = markdown;
                }



            } else {
                tinymce.get(`what-did-${i}`).setContent(oldUserText)
            }

            const copy_success = document.createElement("div");
            copy_success.classList.add("alert");
            copy_success.classList.add("alert-success");
            copy_success.setAttribute("role", "alert");
            copy_success.innerHTML = "Copied down!";

            // show copy success for 2 secs
            if (editingType == "simple") {
                document
                    .querySelector(`#what-did-${i + 1}-markdown`)
                    .parentElement.insertBefore(
                        copy_success,
                        document.querySelector(`#what-did-${i + 1}-markdown`)
                            .parentElement.children[0]
                    );
            } else {
                document
                    .querySelector(`#what-did-${i + 1}`)
                    .parentElement.insertBefore(
                        copy_success,
                        document.querySelector(`#what-did-${i + 1}`).parentElement
                            .children[0]
                    );
            }

            setTimeout(function () {
                copy_success.remove();
            }, 2000);
        }
    }

    async function editModalBox(i) {
        // remove clipboard button
        if (is_clipboard == true) {
            try {
                document
                    .querySelector(`#submit-year-${i + 1}`)
                    .parentElement.removeChild(clipboard_button);

                document.querySelector(`#switchInputType-${i + 1}`).classList.add("invisible")
                
                is_clipboard = false;
            } catch (e) {
                // happens due to too much/quick switching
            }
        }

        // change back to edit
        document.querySelector(`#submit-year-${i + 1}`).textContent = "Edit";

        var outputText;

        // display changes
        if (editingType == "simple") {
            document
                .querySelector(`#what-did-${i + 1}-markdown`)
                .classList.add("invisible");

            // setting value of the above
            if (
                document.querySelector(`#user-text-${i + 1}`).innerHTML[0] !=
                    "<" ||
                document.querySelector(`#what-did-${i + 1}-markdown`).value !=
                    ""
            ) {
                // converts markdown to HTML
                var converter = new showdown.Converter({tables: true, strikethrough: true, tasklists: true, simpleLineBreaks: true, emoji: true}),
                    text = document.querySelector(`#what-did-${i + 1}-markdown`)
                        .value,
                    html = converter.makeHtml(text);

                outputText = document.querySelector(`#what-did-${i + 1}-markdown`).value;

                // NOTE - implement DB storage for users...
                localStorage.setItem(
                    `${current_view}-${i + 1}`,
                    document.querySelector(`#what-did-${i + 1}-markdown`).value
                );
            } else {
                html = document.querySelector(`#user-text-${i + 1}`).innerHTML;
                outputText = document.querySelector(`#what-did-${i + 1}-markdown`).innerHTML;
            }

            document.querySelector(`#user-text-${i + 1}`).innerHTML = html;

            // clear textarea
            document.querySelector(`#what-did-${i + 1}-markdown`).value = "";

        } else {
            // set tinyMCE content to local Storage
            // TODO - to DB too

            try {
                let myContent = tinymce.get(`what-did-${i + 1}`).getContent();

                outputText = tinymce.get(`what-did-${i + 1}`).getContent();

                if (myContent != "") {
                    document.querySelector(`#user-text-${i + 1}`).innerHTML = myContent

                    localStorage.setItem(`${current_view}-${i + 1}`, myContent);
            }

            document.querySelector(".tox-tinymce").remove();
            tinymce.get(`what-did-${i + 1}`).remove();
            document
                .querySelector(`#what-did-${i + 1}`)
                .classList.add("invisible");

            document.querySelector(`#what-did-${i + 1}`).value = "";
            } catch {
                // switched too many times, too quickly. have nothing happen
            }
        }

        let current_user;

        // grab custom email
        await fetch("/api/currentuser/")
            .then((response) => response.text())
            .then((data) => {
                current_user = data;
            });

        // make request to server to create/update box
        if (current_user != "") {
            await fetch(`/api/update/${current_user}/`, // first try to modify
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({view_level: current_view, number: i + 1, text: outputText, colors: "IGNORE"})
                })
                .then(res => res.json()).then(data => {
                        console.log(data)})
                .catch(function(res){ 
                    // otherwise create box
                    fetch("/api/addbox/",
                    {
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                        method: "POST",
                        body: JSON.stringify({user_email: current_user, view_level: current_view, box_number: i + 1, text_content: outputText, color_details: "IGNORE"})
                    })
                    .then(res => res.json()).then(data => {
                        console.log(data)})
                    .catch(function(res){ console.log(res) })
                })
        }
            
        // make all images responsive to width
        let unresponse_images = document
            .querySelector(`#user-text-${i + 1}`)
            .getElementsByTagName("img");

        for (let x = 0; x < unresponse_images.length; x++) {
            unresponse_images[x].classList.add("img-fluid");
    }

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
        var converter = new showdown.Converter({tables: true, strikethrough: true, tasklists: true, simpleLineBreaks: true, emoji: true}),
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

// deletes everything from a modal, removes it from statistics
async function deleteConfirmation(i) {
    let confirmation = confirm("Are you sure that you would like to permanently delete all info associated with this box?\n\nThis action is irreversible!");
    if (confirmation == true) {
        let current_user; 

        localStorage.removeItem(`${current_view}-${i + 1}`);
        document.querySelector(`#user-text-${i + 1}`).innerHTML = "";

        // grab custom email
        await fetch("/api/currentuser/")
            .then((response) => response.text())
            .then((data) => {
                current_user = data;
            });

        // delete from database; TODO: custom email
        if (current_user != "") {
            await fetch(`/api/delete/${current_user}/`,
                {
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({view_level: current_view, number: i + 1})
                })
                .then(res => res.json()).then(data => {
                    console.log(data)})
                .catch(function(res){ console.log(res) })
        }
    
        const delete_success = document.createElement("div");
        delete_success.classList.add("alert");
        delete_success.classList.add("alert-success");
        delete_success.setAttribute("role", "alert");
        delete_success.innerHTML = "Data successfully deleted!";

        // show copy success for 2 secs

        document
            .querySelector(`#what-did-${i + 1}-markdown`)
            .parentElement.insertBefore(
                delete_success,
                document.querySelector(`#what-did-${i + 1}-markdown`)
                    .parentElement.children[0]
            );


        setTimeout(function () {
            delete_success.remove();
        }, 2000);
    }
}

function calculateModifier(gran_level) {
    let modification;
    switch (gran_level) {
        case "Days":
            modification = 365.2422;
            break;
        case "Months":
            modification = 12;
            break;
        case "Years":
            modification = 1;
            break;
        case "Decades":
            modification = 0.1;
            break;
        default:
            modification = 52.1429;
            break;
    }

    return modification;
}