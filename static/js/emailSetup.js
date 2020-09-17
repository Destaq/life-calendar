import { callDB } from "/static/js/readUserContent.js";

const card = document.querySelector("#template-card");

const dueDate = document.querySelector("#goalFinish");
const dueTime = document.querySelector("#goalFinishExact");
const finishCard = document.querySelector("#addCard");
const goalTitle = document.querySelector("#goalTitle");
const goalSubtitle = document.querySelector("#goalSubtitle");
const goalText = document.querySelector("#goalText");

const outputArea = document.querySelector("#user-goals");

var cardCount = 0;

// setup event listeners for cards already there
const preCards = document.querySelectorAll(".user-card");
preCards.forEach((preCard) => {
    setupEv(preCard);
    setupRadioBackground(preCard);
});

// read all data and store in LS from DB
async function main() {
    await callDB();
}

main();

// read from LS and create card objs

finishCard.addEventListener("click", function (e) {
    if (dueTime.value === "" || dueDate.value === "") {
        const alert = document.createElement("div");
        alert.classList.add("alert", "alert-warning");
        alert.setAttribute("role", "alert");
        alert.textContent = "Please fill out all data!";
        card.children[0].insertBefore(alert, card.children[0].children[0]);

        setTimeout(function () {
            alert.remove();
        }, 2000);
    } else {
        createCard();
    }
    e.preventDefault();
});

async function createCard() {
    const userCard = document.createElement("div");
    userCard.classList.add("card", "bg-light", "col-sm-4", "user-card", "border-dark");
    userCard.id = `userCard-${cardCount}`;
    userCard.setAttribute("editing", "false");
    userCard.innerHTML = `
    <div class="card-body d-flex flex-column">
        <h5 class="card-title">${goalTitle.textContent}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${goalSubtitle.textContent}</h6>
        <p class="card-text">${goalText.textContent}</p>
            <div class="mt-auto special-background">
                <hr>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio0" value="unstarted" checked>
                    <label class="form-check-label" for="inlineRadio0">Not Started</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="progress">
                    <label class="form-check-label" for="inlineRadio1">In Progress</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="complete">
                    <label class="form-check-label" for="inlineRadio2">Complete</Complete>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="cancelled">
                    <label class="form-check-label" for="inlineRadio3">Cancelled</label>
                </div>
            <hr>
            <div class="btn-group">
                <center>
                    <button class="btn btn-danger mr-2" id="deleteBtn-${cardCount}">Delete</button>
                    <button class="btn btn-secondary" id="editBtn-${cardCount}">Edit</button>
                </center>
            </div>
        </div>
    </div>
    `;
    cardCount += 1;

    if ((cardCount - 1) % 3 !== 0) {
        outputArea.children[Math.floor((cardCount - 1) / 3)].appendChild(
            userCard
        );
    } else {
        const newRow = document.createElement("div");
        newRow.className = "row";
        outputArea.insertBefore(newRow, document.querySelector("#last"));
        newRow.appendChild(userCard);
    }

    // send info to localStorage
    let goals_obj = {
        [cardCount]: {
            "title": goalTitle.textContent,
            "subtitle": goalSubtitle.textContent,
            "text": goalText.textContent,
            "duedate": dueDate.value,
            "duetime": dueTime.value,
            "radio": "unstarted"
        }
    }
    
    let finalGoalObj;

    if (localStorage.getItem("goals_text") === null) {
        localStorage.setItem("goals_text", JSON.stringify(goals_obj));
        finalGoalObj = JSON.stringify(goals_obj);
    } else {
        let previousDict = JSON.parse(localStorage.getItem("goals_text"));

        previousDict[cardCount] = goals_obj[cardCount];
        localStorage.setItem("goals_text", JSON.stringify(previousDict));

        finalGoalObj = JSON.stringify(previousDict);
    }
    
    // send info to database
    let current_user;

    // grab custom email
    await fetch("/api/currentuser/")
        .then((response) => response.text())
        .then((data) => {
            current_user = data;
        });

    // update database
    if (current_user !== null) {
        await fetch(`/api/update_attr/${current_user}/`,
            {
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({goals_text: {
                    res: finalGoalObj
                }})
            })
            .then(res => res.json()).then(data => {
                console.log(data)})
            // .catch(function(res){ console.log(res) })
    }

    // clear values
    goalTitle.textContent = "Goal Title";
    goalSubtitle.textContent = "Goal Subtitle";
    goalText.textContent =
        "This is a goal card. You can have any number of them! Fill this out however you want - it's editable - with a goal of yours, and then save it to add it to the list!";
    dueDate.value = "";
    dueTime.value = "23:59";

    // add event listeners
    userCard.children[0].children[3].children[6].children[0].children[0].addEventListener(
        "click",
        function (e) {
            userCard.remove();
            // TODO: DB magic
            // TODO: reshuffle cards
            e.preventDefault();
        }
    );

    setupEv(userCard);
    setupRadioBackground(userCard);
}

function setupEv(someCard) {
    someCard.children[0].children[3].children[6].children[0].children[1].addEventListener(
        "click",
        function (e) {
            if (someCard.getAttribute("editing") === "false") {
                someCard.children[0].children[3].children[6].children[0].children[1].textContent =
                    "Save Changes";
                someCard.children[0].children[0].setAttribute(
                    "contenteditable",
                    "true"
                );
                someCard.children[0].children[1].setAttribute(
                    "contenteditable",
                    "true"
                );
                someCard.children[0].children[2].setAttribute(
                    "contenteditable",
                    "true"
                );

                someCard.setAttribute("editing", "true");

                someCard.children[0].children[3].children[6].children[0].children[1].addEventListener(
                    "click",
                    function () {
                        if (someCard.getAttribute("editing") === "true") {
                            someCard.children[0].children[3].children[6].children[0].children[1].textContent =
                                "Edit";
                            someCard.children[0].children[0].setAttribute(
                                "contenteditable",
                                "false"
                            );
                            someCard.children[0].children[1].setAttribute(
                                "contenteditable",
                                "false"
                            );
                            someCard.children[0].children[2].setAttribute(
                                "contenteditable",
                                "false"
                            );
                        }

                        someCard.setAttribute("editing", "false");

                        // clone element to remove listeners
                        let clone = someCard.cloneNode(true);
                        someCard.replaceWith(clone);
                        setupEv(clone);

                        // TODO: DB magic
                    }
                );
            }

            e.preventDefault();
        }
    );
}

function setupRadioBackground(someCard) {
    someCard.querySelectorAll(".form-check-input").forEach((child) => {
        child.addEventListener("click", function() {
            shadeBackground(someCard, child);
        })
    })
}

function shadeBackground(someCard, child) {
    if (child.checked) {
        const re = /^border-/;
        for (const name of someCard.classList) {
            if (re.test(name) === true) {
                someCard.classList.remove(name);
            }
        }
        if (child.value == "progress") {
            someCard.classList.add("border-warning");
        } else if (child.value == "complete") {
            someCard.classList.add("border-success");
        } else if (child.value == "cancelled") {
            someCard.classList.add("border-danger");
        } else {
            someCard.classList.add("border-dark");
        }
    } else {
        child.checked = false;
    }
}