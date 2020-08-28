// table with all colors used by the user
const customColors = document.querySelector("#colorTable");

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
