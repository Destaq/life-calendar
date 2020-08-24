const pickrContainer = document.querySelector(".pickr-container");
const themeContainer = document.querySelector(".theme-container");

var addedCustom = false;

const themes = [
    [
        "classic",
        {
            swatches: [
                "rgba(244, 67, 54, 1)",
                "rgba(233, 30, 99, 0.95)",
                "rgba(156, 39, 176, 0.9)",
                "rgba(103, 58, 183, 0.85)",
                "rgba(63, 81, 181, 0.8)",
                "rgba(33, 150, 243, 0.75)",
                "rgba(3, 169, 244, 0.7)",
                "rgba(0, 188, 212, 0.7)",
                "rgba(0, 150, 136, 0.75)",
                "rgba(76, 175, 80, 0.8)",
                "rgba(139, 195, 74, 0.85)",
                "rgba(205, 220, 57, 0.9)",
                "rgba(255, 235, 59, 0.95)",
                "rgba(255, 193, 7, 1)",
            ],

            components: {
                preview: true,
                opacity: true,
                hue: true,

                interaction: {
                    hex: true,
                    rgba: true,
                    hsva: true,
                    input: true,
                    clear: true,
                    save: true,
                },
            },
        },
    ],
];

const numericalInputs = [];
let pickr = null;

for (const [theme, config] of themes) {
    const numberInput = document.createElement("input");
    numberInput.classList.add("form-control");
    numberInput.setAttribute("type", "number");
    numberInput.setAttribute("min", 1);
    // TODO: alert if number inputted is too high
    numberInput.setAttribute("value", 1);
    numberInput.id = "shadeDropdown";

    // TODO: add help popup/page
    numericalInputs.push(numberInput);

    numberInput.addEventListener("click", () => {
        const el = document.createElement("p");
        pickrContainer.appendChild(el);

        // Delete previous instance
        if (!pickr) {
            // Apply active class
            for (const btn of numericalInputs) {
                btn.classList[btn === numberInput ? "add" : "remove"]("active");
            }

            // Create fresh instance
            pickr = new Pickr(
                Object.assign(
                    {
                        el,
                        theme,
                        default: "#42445a",
                    },
                    config
                )
            );

            pickr
                .on("init", (instance) => {
                    document
                        .querySelector(".pcr-button")
                        .classList.add("btn", "ml-2", "mt-2");
                    document
                        .querySelector(".pcr-button")
                        .style.setProperty("height", "20px");
                    document
                        .querySelector(".pcr-button")
                        .style.setProperty("width", "20px");
                })
                .on("save", (color, instance) => {
                    try {
                        var clone = document
                            .querySelector("#shadeButtonConfirm")
                            .cloneNode(true);
                        document
                            .querySelector("#shadeButtonConfirm")
                            .replaceWith(clone);
                    } catch (e) {
                        console.log(e);
                    }

                    const rgba = color.toRGBA();
                    document
                        .querySelector("#shadeButtonConfirm")
                        .removeEventListener("click", setupShading);

                    document
                        .querySelector("#shadeButtonConfirm")
                        .addEventListener("click", setupInnerShading);

                    addedCustom = true;

                    function setupInnerShading() {
                        shadeCustomizedButton(rgba);
                    }
                });
        }
    });

    themeContainer.appendChild(numberInput);
}

numericalInputs[0].click();

// add default value
document
    .querySelector("#shadeButtonConfirm")
    .addEventListener("click", setupShading);

function setupShading() {
    shadeCustomizedButton("#42445a");
}

function shadeCustomizedButton(rgba) {
    const buttonToShadeValue = document.querySelector("#shadeDropdown").value;

    // get current view
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get("view") != null) {
        current_view =
            urlParams.get("view").slice(0, 1).toUpperCase() +
            urlParams.get("view").slice(1);
    } else {
        current_view = "Years"; // it is always years by default
    }

    const buttonToShade = document.querySelector(
        `#${current_view}-${buttonToShadeValue}`
    );

    let currentStyle = buttonToShade.style.background.slice(
        0,
        buttonToShade.style.background.length - 1
    );

    let currentStripeValue = parseInt(
        buttonToShade.style.background.slice(
            buttonToShade.style.background.length - 5,
            buttonToShade.style.background.length - 3
        )
    );


    let customStr = currentStyle;
    customStr += `, ${rgba} ${currentStripeValue}px, ${rgba} ${
        currentStripeValue + 10
    }px)`;

    document.querySelector(
        `#${current_view}-${buttonToShadeValue}`
    ).style.background = customStr;
}
