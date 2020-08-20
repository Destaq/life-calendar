export function generateBottomBar(age_expectancy, modifier, navbar_view) {
    const bottom_pagination = document.querySelector(
        "#bottom-pagination-navbar"
    );
    // set active bar
    try {
    document.querySelector(".active").classList.remove("active");
    document.querySelector(".active-bottom").classList.remove("active-bottom");
    } catch {}

    // set largest possible view
    document.querySelector(
        "#page-5"
    ).innerHTML = `<a class="page-link" href="#">${Math.floor(
        (age_expectancy * modifier) / 150
    )}</a>`;

    // enable previous clicking if not at 1
    if (navbar_view != 1) {
        document.querySelector("#previous-page").classList.remove("disabled");
    } else {
        document.querySelector("#previous-page").classList.add("disabled");
    }

    // enable next clicking if not at end
    if (navbar_view != Math.floor((age_expectancy * modifier) / 150)) {
        document.querySelector("#next-page").classList.remove("disabled");
    } else {
        document.querySelector("#next-page").classList.add("disabled");
    }

    for (let i = 0; i < 5; i++) {
        document.querySelector(`#page-${i + 1}`).classList.remove("invisible")
    }

    let continue_checking = true;
    if (Math.floor(age_expectancy * modifier) / 150 <= 6) {
        continue_checking = false;
        document.querySelector("#page-1-5").classList.add("invisible")
        document.querySelector("#page-4-5").classList.add("invisible")

        for (let i = 0; i < 5; i++) {
            document.querySelector(`#page-${i + 1}`).classList.add("invisible")
        }

        for (let i = 0; i < Math.floor(age_expectancy * modifier / 150); i++) {
            document.querySelector(`#page-${i + 1}`).classList.remove("invisible")
            document.querySelector(`#page-${i + 1}`).children[0].textContent = i + 1;
        }

        document.querySelector(`#page-${navbar_view}`).classList.add("active")
        document.querySelector(`#page-${navbar_view}`).classList.add("active-bottom")
    }

    // if (Math.floor(age_expectancy * modifier / 150) < )
    if (navbar_view == 1 && continue_checking) {
        // don't modify anything
        document.querySelector("#page-1").classList.add("active");
        document.querySelector("#page-1").classList.add("active-bottom");
        document.querySelector("#page-4-5").classList.remove("invisible");
        document.querySelector("#page-4").classList.add("invisible");
    } else if (navbar_view == 2 && continue_checking) {
        // don't modify anything
        document.querySelector("#page-2").classList.add("active");
        document.querySelector("#page-2").classList.add("active-bottom");
        document.querySelector("#page-4-5").classList.remove("invisible");
        document.querySelector("#page-4").classList.add("invisible");
    }
    if (navbar_view == 3 && continue_checking) {
        // don't modify anything
        document.querySelector("#page-3").classList.add("active");
        document.querySelector("#page-3").classList.add("active-bottom");
        document.querySelector("#page-4-5").classList.remove("invisible");
    }


    // modify ... for distance
    if (
        continue_checking && navbar_view > 3 &&
        Math.floor((age_expectancy * modifier) / 150) - navbar_view >= 3
    ) {
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
    } else if (
        (continue_checking && navbar_view > 3) &&
        Math.floor((age_expectancy * modifier) / 150) - navbar_view < 3
    ) {
        document.querySelector("#page-1-5").classList.remove("invisible");
        document.querySelector("#page-4-5").classList.add("invisible");

        document
            .querySelector(
                `#page-${
                    5 -
                    (Math.floor((age_expectancy * modifier) / 150) -
                        navbar_view)
                }`
            )
            .classList.add("active");
        document
            .querySelector(
                `#page-${
                    5 -
                    (Math.floor((age_expectancy * modifier) / 150) -
                        navbar_view)
                }`
            )
            .classList.add("active-bottom");

        document.querySelector(
            `#page-${
                5 -
                (Math.floor((age_expectancy * modifier) / 150) - navbar_view) -
                1
            }`
        ).children[0].textContent = navbar_view - 1;
        document.querySelector(
            `#page-${
                5 -
                (Math.floor((age_expectancy * modifier) / 150) - navbar_view)
            }`
        ).children[0].textContent = navbar_view;
        try {
            document.querySelector(
                `#page-${
                    5 -
                    (Math.floor((age_expectancy * modifier) / 150) -
                        navbar_view) +
                    1
                }`
            ).children[0].textContent = navbar_view + 1;
        } catch {}
    }

    // if () {
    //     document.querySelector("#page-1-5").classList.add("invisible");
    // }

    if (Math.floor((age_expectancy * modifier) / 150) != 0) {
        bottom_pagination.classList.remove("invisible");
    } else {
        bottom_pagination.classList.add("invisible");
    }
}