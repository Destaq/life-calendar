const expectancy = document.querySelector("#years");

const birthdate = document.querySelector("#birthdateInput");

const finished_button = document.querySelector("#finished-input");

finished_button.addEventListener("click", createMap);

function createMap(e) {
    if (expectancy.value == "" || birthdate.value == "") {
        warningOutput(e);
        const error = setTimeout(warningHide, 3000);
        return;
    }
    let ageArray = [];
    for (let i = 0; i < expectancy.value; i++) {
        ageArray.push(i);
    }
    ageArray.forEach(function (arrayElement) {
        document.querySelector(".output").innerHTML += `
        <button type="button" class="mr-1 mb-1 year-button btn" data-toggle="modal" id="year-${
            arrayElement + 1
        }" data-target="#Modal${arrayElement}">
          ${arrayElement + 1}
        </button>

        <div class="modal fade" id="Modal${arrayElement}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Year ${
                    arrayElement + 1
                }</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <center><label for="what-did-${arrayElement}"><strong>Goals/Accomplished</strong></label></center>
                <p id="user-text-${arrayElement}"></p>
                <textarea class="form-control invisible" id="what-did-${arrayElement}" placeholder="Supports Markdown!"></textarea>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary edit" id="submit-year-${arrayElement}">Edit</button>
                </div>
            </div>
          </div>
        </div>`;

        // add event listeners for each button
        console.log(arrayElement + "added rewrite");
        document.querySelector(`#submit-year-${arrayElement}`).addEventListener(
            "click",
            function (e) {
                rewriteModal(arrayElement);
                e.preventDefault();
            },
            false
        );
    });
    // prevent submit button from being clicked again
    document.querySelector("#finished-input").style.display = "none";

    shadeButtons();
    e.preventDefault();
}

function warningOutput(e) {
    let warning = "Please fill out all data!";
    document.querySelector(".get-data").classList.remove("d-none");
    document.querySelector(".get-data").innerHTML = warning;
    e.preventDefault();
}

function warningHide() {
    document.querySelector(".get-data").classList.add("d-none");
}

function shadeButtons() {
    function calculateAge() {
        let dob = new Date(birthdate.value);
        dob = Date.now() - dob.getTime();
        ageDate = new Date(dob);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    const age = calculateAge();
    for (let x = 1; x < age; x++) {
        // document.querySelector(`#year-${x}`).style.backgroundColor = "#CD5C5C";
        document.querySelector(`#year-${x}`).classList.add("btn-danger");
    }
    document.querySelector(`#year-${age}`).classList.add("btn-warning");
    // document.querySelector(`#year-${age}`).style.backgroundColor = "yellow";
    for (let x = age + 1; x <= expectancy.value; x++) {
        // document.querySelector(`#year-${x}`).style.backgroundColor = "#32CD32";
        document.querySelector(`#year-${x}`).classList.add("btn-success");
    }
}

function rewriteModal(i) {
    console.log("within rewrite modal i is" + i);
    // change button name and class
    document.querySelector(`#submit-year-${i}`).textContent = "Save changes";

    // allow markdown input + remove invisible class
    document.querySelector(`#what-did-${i}`).classList.remove("invisible");

    // check for save button click
    document
        .querySelector(`#submit-year-${i}`)
        .addEventListener("click", function () {
            // save modal text to local storage
            localStorage.setItem(
                i,
                document.querySelector(`#what-did-${i}`).value
            );
        });
}
