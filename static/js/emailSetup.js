import { callDB } from "/static/js/readUserContent.js";

const card = document.querySelector("#template-card");

var dueDate = document.querySelector("#goalFinish");
var dueTime = document.querySelector("#goalFinishExact");
var finishCard = document.querySelector("#addCard");
var goalTitle = document.querySelector("#goalTitle");
var goalSubtitle = document.querySelector("#goalSubtitle");
var goalText = document.querySelector("#goalText");

const outputArea = document.querySelector("#user-goals");

var cardCount = 0;

// setup event listeners for cards already there
var preCards = document.querySelectorAll(".user-card");
preCards.forEach((preCard) => {
    setupEv(preCard);
    setupRadioBackground(preCard);
});

// read all data and store in LS from DB
async function main() {
    await callDB();

    // create cards if any in LS
    for (var key in JSON.parse(localStorage.getItem("goals_text"))) {
        cardCount = parseInt(key);
        await createCard(true);
    }
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

async function createCard(readFromDB=false) {
    const userCard = document.createElement("div");
    userCard.classList.add("card", "bg-light", "col-sm-4", "user-card");
    userCard.id = `userCard-${cardCount}`;
    userCard.setAttribute("editing", "false");
    if (readFromDB === true) {
        goalTitle.textContent = JSON.parse(localStorage.getItem("goals_text"))[cardCount].title;
        goalSubtitle.textContent = JSON.parse(localStorage.getItem("goals_text"))[cardCount].subtitle;
        goalText.textContent = JSON.parse(localStorage.getItem("goals_text"))[cardCount].text;
        dueDate.textContent = JSON.parse(localStorage.getItem("goals_text"))[cardCount].duedate;
        dueTime.textContent = JSON.parse(localStorage.getItem("goals_text"))[cardCount].duetime;

        switch (JSON.parse(localStorage.getItem("goals_text"))[cardCount].radio) {
            case "unstarted":
                userCard.classList.add("border-dark")
                break;
            case "progress":
                userCard.classList.add("border-warning")
                break;
            case "cancelled":
                userCard.classList.add("border-danger")
                break;
            case "complete":
                userCard.classList.add("border-success")
                break;
        
            default:
                userCard.classList.add("border-dark")
                break;
        }
    }
    userCard.innerHTML = `
    <div class="card-body d-flex flex-column">
        <h5 class="card-title">${goalTitle.textContent}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${goalSubtitle.textContent}</h6>
        <center>
            <div>
                <strong>Due: <span>${dueDate.value}</span> at <span>${dueTime.value}</span></strong>
            </div>
        </center>
        <p class="card-text">${goalText.textContent}</p>
            <div class="mt-auto special-background">
                <hr>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio0-${cardCount}" value="unstarted" checked>
                    <label class="form-check-label" for="inlineRadio0-${cardCount}">Not Started</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1-${cardCount}" value="progress">
                    <label class="form-check-label" for="inlineRadio1-${cardCount}">In Progress</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2-${cardCount}" value="complete">
                    <label class="form-check-label" for="inlineRadio2-${cardCount}">Complete</Complete>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3-${cardCount}" value="cancelled">
                    <label class="form-check-label" for="inlineRadio3-${cardCount}">Cancelled</label>
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
        if (readFromDB === false) {
            previousDict[cardCount] = goals_obj[cardCount];
        }
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
        await fetch(`/api/simple_update/${current_user}/`,
            {
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({goals_text: finalGoalObj})
            })
            .then(res => res.json()).then(data => { })
            // .catch(function(res){ console.log(res) })
    }

    // add event listeners
    userCard.children[0].children[4].children[6].children[0].children[0].addEventListener(
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

    // clear values
    goalTitle.textContent = "Goal Title";
    goalSubtitle.textContent = "Goal Subtitle";
    goalText.textContent =
        "This is a goal card. You can have any number of them! Fill this out however you want - it's editable - with a goal of yours, and then save it to add it to the list!";
    dueDate.value = "";
    dueTime.value = "23:59";

    cardCount += 1;
}

function setupEv(someCard) {
    someCard.children[0].children[4].children[6].children[0].children[1].addEventListener(
        "click",
        function (e) {
            if (someCard.getAttribute("editing") === "false") {
                someCard.children[0].children[4].children[6].children[0].children[1].textContent =
                    "Save Changes";
                someCard.children[0].children[0].setAttribute(
                    "contenteditable",
                    "true"
                );
                someCard.children[0].children[1].setAttribute(
                    "contenteditable",
                    "true"
                );
                // due date
                someCard.children[0].children[2].children[0].children[0].children[0].setAttribute(
                    "contenteditable",
                    "true"
                );
                console.log(someCard.children[0].children[2].children[0].children[0].children[0])
                // due time
                someCard.children[0].children[2].children[0].children[0].children[1].setAttribute(
                    "contenteditable",
                    "true"
                );
                someCard.children[0].children[3].setAttribute(
                    "contenteditable",
                    "true"
                );

                someCard.setAttribute("editing", "true");

                someCard.children[0].children[4].children[6].children[0].children[1].addEventListener(
                    "click",
                    async function () {
                        if (someCard.getAttribute("editing") === "true") {
                            someCard.children[0].children[4].children[6].children[0].children[1].textContent =
                                "Edit";
                            someCard.children[0].children[0].setAttribute(
                                "contenteditable",
                                "false"
                            );
                            someCard.children[0].children[1].setAttribute(
                                "contenteditable",
                                "false"
                            );
                            // due date
                            someCard.children[0].children[2].children[0].children[0].children[0].setAttribute(
                                "contenteditable",
                                "false"
                            );
                            // due time
                            someCard.children[0].children[2].children[0].children[0].children[1].setAttribute(
                                "contenteditable",
                                "false"
                            );
                            someCard.children[0].children[3].setAttribute(
                                "contenteditable",
                                "false"
                            );
                        }

                        someCard.setAttribute("editing", "false");

                        // clone element to remove listeners
                        let clone = someCard.cloneNode(true);
                        someCard.replaceWith(clone);
                        setupEv(clone);

                        // TODO: LS + DB magic
                        let copydict = JSON.parse(localStorage.getItem("goals_text"))
                        for (var key in JSON.parse(localStorage.getItem("goals_text"))) {
                            if (parseInt(key) === parseInt(someCard.id.slice(9))) {
                                // update local storage
                                let updated_key = JSON.parse(localStorage.getItem("goals_text"))[key];
                                updated_key.title = someCard.children[0].children[0].textContent;
                                updated_key.subtitle = someCard.children[0].children[1].textContent;
                                updated_key.text = someCard.children[0].children[3].textContent;
                                updated_key.duedate = someCard.children[0].children[2].children[0].children[0].children[0].textContent;
                                updated_key.duetime = someCard.children[0].children[2].children[0].children[0].children[1].textContent;

                                copydict[key] = updated_key;
                            }
                        }

                        localStorage.setItem("goals_text", JSON.stringify(copydict));

                        // update database
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
                            await fetch(`/api/simple_update/${current_user}/`,
                                {
                                    headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                    },
                                    method: "POST",
                                    body: JSON.stringify({goals_text: JSON.stringify(JSON.parse(localStorage.getItem("goals_text")))})
                                })
                                .then(res => res.json()).then(data => { console.log("complete, go check." )})
                                // .catch(function(res){ console.log(res) })
                        }
                    }
                );
            }

            e.preventDefault();
        }
    );
}

function setupRadioBackground(someCard) {
    someCard.querySelectorAll(".form-check-input").forEach((child) => {
        child.addEventListener("change", function() {
            shadeBackground(someCard, child);
        })
    })
}

async function shadeBackground(someCard, child) {
    if (child.checked) {
        let updateDB;

        const re = /^border-/;
        for (const name of someCard.classList) {
            if (re.test(name) === true) {
                someCard.classList.remove(name);
            }
        }

        updateDB = child.value;

        if (child.value == "progress") {
            someCard.classList.add("border-warning");
        } else if (child.value == "complete") {
            someCard.classList.add("border-success");
        } else if (child.value == "cancelled") {
            someCard.classList.add("border-danger");
        } else {
            someCard.classList.add("border-dark");
        }

        // update database
        let current_user;

        // grab custom email
        await fetch("/api/currentuser/")
            .then((response) => response.text())
            .then((data) => {
                current_user = data;
            });

        // read current database
        let userGoals;

        await fetch(`/api/return_goals/${current_user}`)
            .then(res => res.json())
            .then(data => { 
                userGoals = JSON.parse(data.result) });

        
        let cardNumber = parseInt(someCard.id.replace("userCard-", ""));
        
        for (var key in userGoals) {
            if (key === cardNumber.toString()) {
                userGoals[key].radio = updateDB;
            }
        }

        cardNumber += 1;

        let tosend = JSON.stringify({goals_text: userGoals});

        // update database
        if (current_user !== null) {
            await fetch(`/api/simple_update/${current_user}/`,
                {
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: tosend
                })
                .then(res => res.json()).then(data => { })
                .catch(function(res){ console.log("some error here") })
        }

    } else {
        child.checked = false;
    }
}