const deleteBtn = document.querySelector("#deleteAccount");
const finalizeDeleteBtn = document.querySelector("#trueDeleteBtn");

const oldEmail = document.querySelector("#old-email");
const newEmail = document.querySelector("#new-email");
const emailSubmit = document.querySelector("#email-submit")

const oldPassword= document.querySelector("#old-password");
const newPassword = document.querySelector("#new-password");
const newPasswordConfirm = document.querySelector("#confirm-new-password");
const passwordSubmit = document.querySelector("#password-submit")

deleteBtn.addEventListener("click", function() {
    $("#deleteModal").modal("show");

    finalizeDeleteBtn.addEventListener("click", async function() {
        // grab current user
        let current_user;

        await fetch("/api/currentuser/")
            .then((response) => response.text())
            .then((data) => {
                current_user = data;
            });

        // remove them from the database
        if (current_user != "") {
            await fetch(`/api/delete_user/${current_user}/`,)
                .then(res => res.json()).then(data => {
                    console.log(data)})
                .catch(function(res){ console.log(res) })

            // clear localStorage
            localStorage.clear();

            location.href = "/signup/"
        }
    })
})

emailSubmit.addEventListener("click", async function(e) {
    // make sure that inputted email is correct for user
    let current_user;
    let status;

    await fetch("/api/currentuser/")
        .then((response) => response.text())
        .then((data) => {
            current_user = data;
        });

    // update user email
    await fetch(`/api/update_email/${current_user}/`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            old_email: oldEmail.value,
            new_email: newEmail.value,
        }),
    })
        .then((res) => {
            status = res.status;
        })
        .then((data) => {
            console.log(data.json());
            location.href = "/login/";
        })
        .catch((e) => {
            if (status === 400 || status === 403) {
                // emails do not match
                document
                    .querySelector("#badEmailMatch")
                    .classList.remove("invisible");

                setTimeout(() => {
                    document
                        .querySelector("#badEmailMatch")
                        .classList.add("invisible");
                }, 3000);
            }
        });

    e.preventDefault();
})

passwordSubmit.addEventListener("click", async function(e) {
    // make sure that inputted password is correct for current user
    let current_user;
    let status;

    await fetch("/api/currentuser/")
        .then((response) => response.text())
        .then((data) => {
            current_user = data;
        });

    // make sure that the two passwords match
    if (newPassword.value != newPasswordConfirm.value) {
        document.querySelector("#badPasswordMatch").classList.remove("invisible");

        setTimeout(() => {
            document.querySelector("#badPasswordMatch").classList.add("invisible");
        }, 3000);
    } else {
        await fetch(`/api/update_password/${current_user}/`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                old_password: oldPassword.value,
                new_password: newPassword.value,
            }),
        })
            .then((res) => {
                status = res.status;
            })
            .then((data) => {
                location.href = "/login/";
            }).catch(e => {
                console.log(e);
                
                document.querySelector("#incorrectPassword").classList.remove("invisible");

                setTimeout(() => {
                    document.querySelector("#incorrectPassword").classList.add("invisible");
                }, 3000);
            })
    }

    e.preventDefault();
})