import { modifyLegend } from "/static/js/legend.js";

const pickrContainer = document.querySelector(".pickr-container");
const themeContainer = document.querySelector(".theme-container");

var addedCustom = false;

// details for colors in the legend
const legendModalBody = document.querySelector("#legendModalBody");

// add initial event listeners for legend - copying to pickr
for (let i = 4; i < legendModalBody.children.length + 1; i++) {

    let svgIcon = document.querySelector(`#legend-${i}`).parentElement.children[4].children[0];

    let tableclone = svgIcon.cloneNode(true)

    svgIcon.replaceWith(tableclone)
    
    document.querySelector(`#legend-${i}`).parentElement.children[4].children[0].children[0].addEventListener("click", function() {
        setPickrColor(document.querySelector(`#legend-${i}`).parentElement.children[1].children[0].children[0].getAttribute("fill"))
    })
}

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

    // NOTE: change with JS based on view
    numberInput.setAttribute("min", 1);
    numberInput.setAttribute("max", 100);
    numberInput.setAttribute("value", 1);
    numberInput.classList.add("mr-1")
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
                        default: "#000099",
                    },
                    config
                )
            );

            pickr
                .on("init", (instance) => {
                    document
                        .querySelector(".pcr-button")
                        .classList.add("btn", "mt-2", "ml-3");
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

                        var clone2 = document
                            .querySelector("#unshadeButtonConfirm")
                            .cloneNode(true);
                        document
                            .querySelector("#unshadeButtonConfirm")
                            .replaceWith(clone2);
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

                    document
                        .querySelector("#unshadeButtonConfirm")
                        .removeEventListener("click", setupInnerUnshading);
                    document
                        .querySelector("#unshadeButtonConfirm")
                        .addEventListener("click", setupInnerUnshading);

                    addedCustom = true;

                    function setupInnerShading() {
                        shadeCustomizedButton(rgba, true);
                    }

                    function setupInnerUnshading() {
                        shadeCustomizedButton(rgba, false);
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

document
    .querySelector("#unshadeButtonConfirm")
    .addEventListener("click", setupUnshading);

function setupShading() {
    shadeCustomizedButton("rgb(0, 0, 153)", true);
}

function setupUnshading() {
    shadeCustomizedButton("rgb(0, 0, 153)", false);
}

async function shadeCustomizedButton(rgba, shade) {
    const buttonToShadeValue = document.querySelector("#shadeDropdown").value;

    // get current view
    const urlParams = new URLSearchParams(location.search);
    var current_view;
    if (urlParams.get("view") != null) {
        current_view =
            urlParams.get("view").slice(0, 1).toUpperCase() +
            urlParams.get("view").slice(1);
    } else {
        current_view = "Weeks"; // it is always weeks by default
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

    const alreadyStriped = document.querySelector(`#${current_view}-${buttonToShadeValue}`).style.background.includes(RGBAtoRGB(rgba.toString()))

    // modify legend with new colors if applicable
    modifyLegend(RGBAtoRGB(rgba.toString()), shade, alreadyStriped);

    // add event listeners for changing pickr
    for (let i = 4; i < legendModalBody.children.length + 1; i++) {
        let svgIcon = document.querySelector(`#legend-${i}`).parentElement.children[4].children[0];

        let tableclone = svgIcon.cloneNode(true)

        svgIcon.replaceWith(tableclone)
        
        document.querySelector(`#legend-${i}`).parentElement.children[4].children[0].children[0].addEventListener("click", function() {
            setPickrColor(document.querySelector(`#legend-${i}`).parentElement.children[1].children[0].children[0].getAttribute("fill"))
        })
    }
    
    let customStr = currentStyle;

    // if they are adding a stripe
    if (shade == true) {
        customStr += `, ${rgba} ${currentStripeValue}px, ${rgba} ${
            currentStripeValue + 10
        }px)`;
    } else {
        let replace;
        rgba = rgba.toString();

        let rgb = RGBAtoRGB(rgba);
    

        replace = `, ${rgb}.*${rgb}\\s\\d{2,}px`;

        replace = replace.split(")").join("\\)")
        replace = replace.split("(").join("\\(")

        replace = new RegExp(replace, "g");

        customStr = customStr.split(replace).join('');
    }

    document.querySelector(
        `#${current_view}-${buttonToShadeValue}`
    ).style.background = customStr;

    // update locastorage - TODO: DB w/ button stripes
    localStorage.setItem(`${current_view}-${buttonToShadeValue}-background`, customStr);

    let current_user;

    // grab custom email
    await fetch("/api/currentuser/")
        .then((response) => response.text())
        .then((data) => {
            current_user = data;
        });

    // make request to server to create/update box; TODO: custom email
    if (current_user != "") {
        await fetch(`/api/update/${current_user}/`, // first try to modify
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({view_level: current_view, number: buttonToShadeValue, text: "IGNORE", colors: customStr})
        })
        .then(res => res.json()).then(data => {
                console.log(data)})
        .catch(function(res){
            fetch("/api/addbox/",
                {
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({user_email: current_user, view_level: current_view, box_number: buttonToShadeValue, text_content: "", color_details: customStr})
                })
                .then(res => res.json()).then(data => {
                    console.log(data)})
                .catch(function(res){ console.log(res) })
            })
    }
}

function RGBAtoRGB(rgba) {
    // calculate r, g, and b
    let re = /\d{1,3}\.?.*/g
    let results = rgba.match(re);

    let r = Math.round(parseFloat(results[0].split(", ")[0]))
    let g = Math.round(parseFloat(results[0].split(", ")[1]))
    let b = Math.round(parseFloat(results[0].split(", ")[2]))

    let rgb = `rgb(${r}, ${g}, ${b})`

    return rgb;
}

function setPickrColor(newColor) {
    pickr.setColor(newColor, true);
    pickr.applyColor();
}