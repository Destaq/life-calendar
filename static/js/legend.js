// setup legend modal
document.querySelector("#showLegendModal").addEventListener("click", () => {
    $("#legendModal").modal("show");
});

const legendModalBody = document.querySelector("#legendModalBody");
var dontModify = {};

var legendModalColors = {};
if (localStorage.getItem("legendModalColors") != null) {
    legendModalColors = JSON.parse(localStorage.getItem("legendModalColors"));

    // generate table
    for (let i = 1; i < Object.keys(legendModalColors).length - 2; i++) {
        const newtr = document.createElement("tr");
        const rgb = Object.keys(legendModalColors)[i + 2];
        let hexablergb = rgb.replace("rgb(", "").split(", ");

        for (let x = 0; x < hexablergb.length; x++) {
            hexablergb[x] = parseInt(hexablergb[x]);
        }

        newtr.innerHTML = `
        <th scope="row">${i + 3}</th>
            <td>
                <svg height="25" width="25">
                    <circle cx="12" cy="12" r="10" fill="${rgb}" />
                </svg> 
            </td>
        <td contenteditable="true" id="legend-${i + 3}" class="userMeaning" ></td>
        <td>${rgbToHex(hexablergb[0], hexablergb[1], hexablergb[2])}</td>
        <td>    
            <center><svg width="1em" id="svgCopy${i + 3}" height="1em" viewBox="0 0 16 16" class="bi bi-clipboard" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                <path fill-rule="evenodd" d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
            </svg></center>
        </td>
        `;
        legendModalBody.appendChild(newtr);
    }
}

// setup table values for the legend
if (localStorage.getItem("dontModify") != null) {
    dontModify = JSON.parse(localStorage.getItem("dontModify"))
    for (let i = 4; i < Object.keys(dontModify).length + 4; i++) {
        const tableToModify = Object.keys(dontModify)[i - 4]
        document.querySelector(`#${tableToModify}`).textContent = dontModify[tableToModify][0]
    }
}

for (let i = 0; i < legendModalBody.children.length; i++) {
    if (
        legendModalColors[
            legendModalBody.children[
                i
            ].children[1].children[0].children[0].getAttribute("fill")
        ] != undefined
    ) {
        legendModalColors[
            legendModalBody.children[
                i
            ].children[1].children[0].children[0].getAttribute("fill")
        ] += 1;
    } else {
        legendModalColors[
            legendModalBody.children[
                i
            ].children[1].children[0].children[0].getAttribute("fill")
        ] = 1;
    }
}

// whether to automatically hide values
var dismiss = true;

// legend table values - runs in pickr home file
document.querySelector("#saveEditableLegend").addEventListener("click", function() {
    dismiss = false;

    const dynamicTableValues = document.querySelectorAll(".userMeaning");
    for (let i = 0; i < dynamicTableValues.length; i++) {
       
       dontModify[dynamicTableValues[i].id] = [dynamicTableValues[i].textContent, dynamicTableValues[i].parentElement.children[1].children[0].children[0].getAttribute("fill")];
    }

    setTimeout(function() {
        dismiss = true;
    }, 500);

})

$("#legendModal").on('hidden.bs.modal', async function() {
    if (dismiss == true) {
        const dynamicTableValues = document.querySelectorAll(".userMeaning");
        for (let i = 0; i < dynamicTableValues.length; i++) {
            document.querySelector(`#${dynamicTableValues[i].id}`).textContent = dontModify[dynamicTableValues[i].id][0]
        }
    }
    localStorage.setItem("dontModify", JSON.stringify(dontModify));

    // update database with any new text
    let current_user;

    // grab current user
    await fetch("/api/currentuser/")
        .then((response) => response.text())
        .then((data) => {
            current_user = data;
        });

    // add information to database
    console.log(dontModify, "as unmodifiable")
    if (current_user !== "") {
        await fetch(`/api/update_attr/${current_user}/`,
            {
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({legend_text: {
                    dontModify: dontModify,
                    legendModalColors: legendModalColors
                }})
            })
            .then(res => res.json()).then(data => {
                console.log(data)})
            // .catch(function(res){ console.log(res) })
    }

})

document.querySelector("#cancelEditableLegend").addEventListener("click", function() {
    dismiss = true;

    const dynamicTableValues = document.querySelectorAll(".userMeaning");
    for (let i = 0; i < dynamicTableValues.length; i++) {
        document.querySelector(`#${dynamicTableValues[i].id}`).textContent = dontModify[dynamicTableValues[i].id[0]]
    }
})

// https://stackoverflow.com/a/5624139/12876940
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var legendText = {};
if (localStorage.getItem("legendTableText") != null) {
    legendText = JSON.parse(localStorage.getItem("legendTableText"))
    console.log("btw calc", legendText)
    // TODO: save legend text on exit...
}


// add data to the table when shaded
export async function modifyLegend(rgb, shade, isSecond) {
    let hexablergb = rgb.replace("rgb(", "").split(", ");

    for (let i = 0; i < hexablergb.length; i++) {
        hexablergb[i] = parseInt(hexablergb[i]);
    }

    if (shade == true && isSecond == false) {
        if (Object.keys(legendModalColors).includes(rgb) == false) {
            legendModalColors[rgb] = 1;
            const newtr = document.createElement("tr");
            newtr.innerHTML = `
            <th scope="row">${Object.keys(legendModalColors).length}</th>
                <td>
                    <svg height="25" width="25">
                        <circle cx="12" cy="12" r="10" fill="${rgb}" />
                    </svg> 
                </td>
                <td contenteditable="true" class="userMeaning" id="legend-${Object.keys(legendModalColors).length}"></td>
                <td>${rgbToHex(hexablergb[0], hexablergb[1], hexablergb[2])}</td>
                <td>    
                    <center><svg width="1em" id="svgCopy${Object.keys(legendModalColors).length}" height="1em" viewBox="0 0 16 16" class="bi bi-clipboard" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                        <path fill-rule="evenodd" d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                    </svg></center>
                </td>
            `;
            legendModalBody.appendChild(newtr);
            dontModify[`legend-${Object.keys(legendModalColors).length}`] = [document.querySelector(`#legend-${Object.keys(legendModalColors).length}`).textContent, document.querySelector(`#legend-${Object.keys(legendModalColors).length}`).parentElement.children[1].children[0].children[0].getAttribute("fill")];

        } else {
            legendModalColors[rgb] += 1;
        }
    } else if (shade == false) {
        legendModalColors[rgb] -= 1;
        if (legendModalColors[rgb] == 0) {
            let index = 0;
            for (let i = 0; i < Object.keys(legendModalColors).length; i++) {
                if (Object.keys(legendModalColors)[i] == rgb) {
                    index = i;
                    break;
                }
            }

            delete legendModalColors[rgb];

            legendModalBody.children[index].remove()
        }
    }

    // set values to LS
    localStorage.setItem(
        "legendModalColors",
        JSON.stringify(legendModalColors)
    );

    let current_user;

    // grab current user
    await fetch("/api/currentuser/")
        .then((response) => response.text())
        .then((data) => {
            current_user = data;
        });

    // add information to database
    console.log(dontModify, "as unmodifiable")
    if (current_user !== "") {
        await fetch(`/api/update_attr/${current_user}/`,
            {
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({legend_text: {
                    dontModify: dontModify,
                    legendModalColors: legendModalColors
                }})
            })
            .then(res => res.json()).then(data => {
                console.log(data)})
            // .catch(function(res){ console.log(res) })
    }
}
