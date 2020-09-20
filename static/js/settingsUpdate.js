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

            location.href = "/signup/"
        }
    })
})

emailSubmit.addEventListener("click", async function(e) {
    // make sure that inputted email is correct for user
    let current_user;
        
    await fetch("/api/currentuser/")
        .then((response) => response.text())
        .then((data) => {
            current_user = data;
        });


    // update user email with simple_update

    e.preventDefault();
})

passwordSubmit.addEventListener("click", function(e) {
    // make sure that inputted password is correct for current user

    // make sure that the two passwords match

    e.preventDefault();
})