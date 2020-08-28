const finished_button = document.querySelector("#finished-input");
const birthdate = document.querySelector("#birthdateInput");
const expectancy = document.querySelector("#years");

// quiz page - for modifying age expectancy; TODO will be moved to /settings/quiz/
finished_button.addEventListener("click", function (e) {
    let bdayDate = new Date(birthdate.value);

    // they are missing data
    if (expectancy.value == "" || birthdate.value == "") {
        warningOutput(e, "Please fill out all data.");
        const error = setTimeout(warningHide, 3000);
        return;

        // birthdate is set in the future
    } else if (Date.parse(birthdate.value) > Date.now()) {
        warningOutput(e, "Please provide a valid birthdate.");
        const error = setTimeout(warningHide, 3000);

        // set an age expectancy lower than their current age
    } else if (calculateDays(bdayDate) > expectancy.value * 365) {
        warningOutput(
            e,
            "Please set your life expectancy higher or equal to your age."
        );
        const error = setTimeout(warningHide, 3000);
    } else {
        // TODO: move to DB for users
        localStorage.setItem("age-expectancy", expectancy.value);
        localStorage.setItem("birthday", birthdate.value);

        // set initial data values for statistics page
        localStorage.setItem("daysLeft", calculateRemaining("days"));
        localStorage.setItem("weeksLeft", calculateRemaining("weeks"));
        localStorage.setItem("monthsLeft", calculateRemaining("months"));
        localStorage.setItem("yearsLeft", calculateRemaining("years"));
        localStorage.setItem("decadesLeft", calculateRemaining("decades"));

        localStorage.setItem("daysPassed", calculatePassed("days"));
        localStorage.setItem("weeksPassed", calculatePassed("weeks"));
        localStorage.setItem("monthsPassed", calculatePassed("months"));
        localStorage.setItem("yearsPassed", calculatePassed("years"));
        localStorage.setItem("decadesPassed", calculatePassed("decades"));

        // set value for life progress bar
        localStorage.setItem(
            "percentageThroughLife", (calculatePassed("days") / 
            (calculatePassed("days") + calculateRemaining("days"))).toFixed(3));

        // initial values for misc. statistics
        if (localStorage.getItem("totalFilled") === null) {
            localStorage.setItem("totalFilled", 0);
        }
        if (localStorage.getItem("totalWords") == null) {
            localStorage.setItem("totalWords", 0);
        }

        location.href = "/?view=months";
        e.preventDefault();
    }
});

function warningOutput(e, msg) {
    document.querySelector(".get-data").classList.remove("d-none");
    document.querySelector(".get-data").innerHTML = msg;
    e.preventDefault();
}

function warningHide() {
    document.querySelector(".get-data").classList.add("d-none");
}

function calculateDays(bday) {
    const current_day = new Date(Date.now());
    const diffTime = Math.abs(current_day - bday);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateRemaining(keyword) {
    const today = new Date(Date.now());
    const expectancy = localStorage.getItem("age-expectancy");
    const yearDiff = expectancy - calculatePassed("years"); // years in the future
    var yearFuture = new Date();
    console.log(yearFuture, "is year... future!");
    yearFuture.setUTCFullYear(yearFuture.getUTCFullYear() + yearDiff);

    let unitDifference;

    if (keyword == "days") {
        unitDifference = Math.floor(
            Math.abs(yearFuture - today) / (1000 * 60 * 60 * 24)
        );
    } else if (keyword == "weeks") {
        unitDifference = Math.round(
            Math.abs(yearFuture - today) / (7 * 24 * 60 * 60 * 1000)
        );
    } else if (keyword == "months") {
        unitDifference =
            (yearFuture.getUTCFullYear() - today.getUTCFullYear()) * 12;
    } else if (keyword == "years") {
        unitDifference = yearFuture.getUTCFullYear() - today.getUTCFullYear();
    } else {
        unitDifference = Math.floor(
            (yearFuture.getUTCFullYear() - today.getUTCFullYear()) / 10
        );
    }

    return unitDifference;
}

function calculatePassed(keyword) {
    const today = new Date(Date.now());
    const userBirthdate = new Date(localStorage.getItem("birthday"));
    let unitDifference;

    if (keyword == "days") {
        unitDifference = Math.floor(
            Math.abs(today - userBirthdate) / (1000 * 60 * 60 * 24)
        );
    } else if (keyword == "weeks") {
        unitDifference = Math.round(
            Math.abs(today - userBirthdate) / (7 * 24 * 60 * 60 * 1000)
        );
    } else if (keyword == "months") {
        unitDifference =
            (today.getUTCFullYear() - userBirthdate.getUTCFullYear()) * 12;
    } else if (keyword == "years") {
        unitDifference =
            today.getUTCFullYear() - userBirthdate.getUTCFullYear();
    } else {
        unitDifference = Math.floor(
            (today.getUTCFullYear() - userBirthdate.getUTCFullYear()) / 10
        );
    }

    return unitDifference;
}
