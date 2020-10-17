// table with all colors used by the user
const customColors = document.querySelector("#colorTable");

import { callDB } from "/static/js/readUserContent.js";

// dynamically generate totalFilled and totalWords values
let counter = 0; // number of boxes modified
let wordcount = 0; // total number of words inputted by user
for (let i = 0; i < window.localStorage.length; i++) {
    let key = window.localStorage.key(i);
    if (
        key.includes("Years-") ||
        key.includes("Decades-") ||
        key.includes("Days-") ||
        key.includes("Weeks-") ||
        key.includes("Months-")
    ) {
        counter += 1;
        wordcount += localStorage.getItem(key).split(" ").length;
    }
}

localStorage.setItem("totalFilled", counter);
localStorage.setItem("totalWords", wordcount);

let statistics_obj = {
    "counter": counter,
    "wordcount": wordcount
}

async function updateDatabase() {
    await callDB();

    let current_user;

    // grab current user
    await fetch("/api/currentuser/")
        .then((response) => response.text())
        .then((data) => {
            current_user = data;
        });

    // update database with new values
    if (current_user !== "") {
        await fetch(`/api/update_attr/${current_user}/`,
            {
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({statistics_text: statistics_obj})
            })
            .then(res => res.json()).then(data => {
                console.log(data)});
            // .catch(function(res){ console.log(res) })
    }
}

async function main() {
    await updateDatabase();

    var modifiableElements = [
        "age-expectancy",
        "birthday",
        "joined",
        "totalFilled",
        "totalWords",
        "percentageThroughLife",
        "daysLeft",
        "weeksLeft",
        "monthsLeft",
        "yearsLeft",
        "decadesLeft",
        "daysPassed",
        "weeksPassed",
        "monthsPassed",
        "yearsPassed",
        "decadesPassed",
    ];
    
    // modify statistics page with custom user info
    function modifyPage(keyword) {
        const toModify = document.querySelector(`#${keyword}`);
        if (localStorage.getItem(keyword) !== null) {
            toModify.innerHTML += localStorage.getItem(keyword); // assumes correct name for HTML element
        } else {
            toModify.innerHTML += "unavailable";
        }
    }
    
    modifiableElements.forEach((el) => {
        modifyPage(el);
    });
    
    // modify life progress bar
    let percentageData = localStorage.getItem("percentageThroughLife");
    document.querySelector(".progress").children[0].style.width = percentageData;
    document
        .querySelector(".progress")
        .setAttribute(
            "aria-valuenow",
            percentageData.slice(0, percentageData.length - 2)
        );
    
    document.querySelector(".progress").children[2].style.width =
        100 - parseInt(percentageData.slice(0, percentageData.length - 2)) + "%";
    document
        .querySelector(".progress")
        .setAttribute(
            "aria-valuenow",
            100 - parseInt(percentageData.slice(0, percentageData.length - 2))
        );
    
    
    // Modify color table at bottom
    var colorTableColors = JSON.parse(localStorage.getItem("legendModalColors"));
    var sortable = [];
    var delcount = 0;
    for (let associatedColor in colorTableColors) {
        if (delcount < 3) {
            delcount += 1;
            delete colorTableColors.associatedColor;
        } else {
            sortable.push([associatedColor, colorTableColors[associatedColor]])
        }
    }
    
    var connectedNames = JSON.parse(localStorage.getItem("dontModify"));
    for (let i = 0; i < Object.keys(connectedNames).length; i++) {
        try {
            sortable[i].push(connectedNames[Object.keys(connectedNames)[i]][0]);
        } catch {
            // an error that is currently being investigated
        }
    }
    
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    })
    
    for (let i = 0; i < sortable.length; i++) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <th scope="row">${i + 1}</th>
            <td><svg height="25" width="25">
                    <circle cx="12" cy="12" r="10" fill="${sortable[i][0]}" />
                </svg> </td>
            <td>${sortable[i][2]}</td>
            <td>${sortable[i][1]} boxes</td>
                       `
        document.querySelector("#colorTable").appendChild(tr);
    }
}    

main();