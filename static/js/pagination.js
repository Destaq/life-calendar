export function generateBottomBar(age_expectancy, modifier, navbar_view) {
    const bottom_pagination = document.querySelector(
        "#bottom-pagination-navbar"
    );

    for (let i = 1; i < 5; i++) {
        document.querySelector(`#page-${i + 1}`).classList.remove("invisible");
        document.querySelector(`#page-${i + 1}`).children[0].textContent = "N/A";
    }

    // set active bar
    try {
        // active-bottom is a class, as bootstrap uses the active class for several things
        
        document.querySelector(".active-bottom").classList.remove("active");
        document
            .querySelector(".active-bottom")
            .classList.remove("active-bottom");
    } catch {}

    // set largest possible view
    document.querySelector(
        "#page-5"
    ).innerHTML = `<a class="page-link" href="#">${Math.ceil(
        (age_expectancy * modifier) / 150
    )}</a>`;

    // enable previous clicking if not at 1
    if (navbar_view != 1) {
        document.querySelector("#previous-page").classList.remove("disabled");
    } else {
        document.querySelector("#previous-page").classList.add("disabled");
    }

    // enable next clicking if not at end
    if (navbar_view != Math.ceil((age_expectancy * modifier) / 150)) {
        document.querySelector("#next-page").classList.remove("disabled");
    } else {
        document.querySelector("#next-page").classList.add("disabled");
    }

    let continue_checking = true; // whether or not they should continue with making the navbar
    if (Math.ceil(age_expectancy * modifier) / 150 <= 5) {
        continue_checking = false;
        document.querySelector("#page-1-5").classList.add("invisible"); // the ... at the beginning
        document.querySelector("#page-4-5").classList.add("invisible"); // the ... at the end

        for (let i = 0; i < 5; i++) {
            document.querySelector(`#page-${i + 1}`).classList.add("invisible");
        }

        for (
            let i = 0;
            i < Math.floor((age_expectancy * modifier) / 150);
            i++
        ) {
            document
                .querySelector(`#page-${i + 1}`)
                .classList.remove("invisible");
            document.querySelector(`#page-${i + 1}`).children[0].textContent =
                i + 1;
        }

        document.querySelector(`#page-${navbar_view}`).classList.add("active");
        document
            .querySelector(`#page-${navbar_view}`)
            .classList.add("active-bottom");
    }

    // special cases below for if too close to beginning/end of navbar pagination
    if (navbar_view == 1 && continue_checking) {
        document.querySelector("#page-1").classList.add("active");
        document.querySelector("#page-1").classList.add("active-bottom");
        document.querySelector("#page-2").children[0].textContent = '2';
        document.querySelector("#page-3").children[0].textContent = '3';
        document.querySelector("#page-4-5").classList.remove("invisible");
        document.querySelector("#page-4").classList.add("invisible");
        document.querySelector("#page-1-5").classList.add("invisible");
    } else if (navbar_view == 2 && continue_checking) {
        document.querySelector("#page-2").classList.add("active");
        document.querySelector("#page-2").children[0].textContent = '2';
        document.querySelector("#page-3").children[0].textContent = '3';
        document.querySelector("#page-2").classList.add("active-bottom");
        document.querySelector("#page-4-5").classList.remove("invisible");
        document.querySelector("#page-1-5").classList.add("invisible");
        document.querySelector("#page-4").classList.add("invisible");
    }
    if (navbar_view == 3 && continue_checking) {
        document.querySelector("#page-1-5").classList.add("invisible");
        document.querySelector("#page-2").children[0].textContent = '2';
        document.querySelector("#page-3").children[0].textContent = '3';
        document.querySelector("#page-4").children[0].textContent = '4';
        document.querySelector("#page-3").classList.add("active");
        document.querySelector("#page-3").classList.add("active-bottom");
        document.querySelector("#page-4-5").classList.remove("invisible");
    }
    if (
        navbar_view == Math.ceil((age_expectancy * modifier) / 150) &&
        continue_checking
    ) {
        document.querySelector("#page-5").classList.add("active");
        document.querySelector("#page-5").classList.add("active-bottom");
        document.querySelector("#page-3").children[0].textContent =
            Math.ceil((age_expectancy * modifier) / 150) - 2;
        document.querySelector("#page-2").classList.add("invisible");
    } else if (
        navbar_view == Math.ceil((age_expectancy * modifier) / 150) - 1 &&
        continue_checking
    ) {
        document.querySelector("#page-4").classList.add("active");
        document.querySelector("#page-4").classList.add("active-bottom");
        document.querySelector("#page-3").children[0].textContent =
            Math.ceil((age_expectancy * modifier) / 150) - 2;
        document.querySelector("#page-2").classList.add("invisible");
    }

    if (
        continue_checking &&
        navbar_view > 3 &&
        Math.ceil((age_expectancy * modifier) / 150) - navbar_view >= 3
    ) {
        // modify ... if suitably far away
        document.querySelector("#page-1-5").classList.remove("invisible");

        document.querySelector("#page-4-5").classList.remove("invisible");

        // set ids and textContent based on current position
        document.querySelector("#page-2").children[0].textContent =
            navbar_view - 1;
        document.querySelector("#page-3").children[0].textContent = navbar_view;
        document.querySelector("#page-4").children[0].textContent =
            navbar_view + 1;

        // set active state for current button
        document.querySelector("#page-3").classList.add("active");
        document.querySelector("#page-3").classList.add("active-bottom");

        // case for a large navbar, but close to the right edge
    } else if (
        continue_checking &&
        navbar_view > 3 &&
        Math.ceil((age_expectancy * modifier) / 150) - navbar_view < 3
    ) {
        document.querySelector("#page-1-5").classList.remove("invisible");
        document.querySelector("#page-4-5").classList.add("invisible");
        document
            .querySelector(
                `#page-${
                    5 -
                    (Math.ceil((age_expectancy * modifier) / 150) - navbar_view)
                }`
            )
            .classList.add("active");
        document
            .querySelector(
                `#page-${
                    5 -
                    (Math.ceil((age_expectancy * modifier) / 150) - navbar_view)
                }`
            )
            .classList.add("active-bottom");

        document.querySelector(
            `#page-${
                5 -
                (Math.ceil((age_expectancy * modifier) / 150) - navbar_view) -
                1
            }`
        ).children[0].textContent = navbar_view - 1;
        document.querySelector(
            `#page-${
                5 - (Math.ceil((age_expectancy * modifier) / 150) - navbar_view)
            }`
        ).children[0].textContent = navbar_view;
        try {
            document.querySelector(
                `#page-${
                    5 -
                    (Math.ceil((age_expectancy * modifier) / 150) -
                        navbar_view) +
                    1
                }`
            ).children[0].textContent = navbar_view + 1;
        } catch {}
    }

    // don't show the navbar if there is only one page
    if (Math.ceil((age_expectancy * modifier) / 150) != 0) {
        bottom_pagination.classList.remove("invisible");
    } else {
        bottom_pagination.classList.add("invisible");
    }
}
