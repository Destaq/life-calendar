document
    .querySelector("#forgotPassword")
    .addEventListener("click", function (e) {
        $("#forgotPasswordModal").modal("show");

        document
            .querySelector("#sendEmail")
            .addEventListener("click", async function (e) {
                if (document.querySelector("#userEmail").value === "") {
                    let child = document.createElement("div");
                    child.classList.add("alert", "alert-info");
                    child.setAttribute("role", "alert");
                    child.textContent = "Please input an email address!";

                    document
                        .querySelector("#addWarning")
                        .insertBefore(
                            child,
                            document.querySelector("#addWarning").children[0]
                        );

                    setTimeout(() => {
                        child.remove();
                    }, 2500);
                } else {
                    // send email with password reset instructions to user
                    await fetch(
                        `/api/forgot_password/${
                            document.querySelector("#userEmail").value
                        }`
                    )
                        .then((res) => res.json())
                        .then((data) => {
                            console.log(data);
                        })
                        .catch((e) => {
                            console.log(e);
                        });

                    $("#forgotPasswordModal").modal('hide');
                }

                e.preventDefault();
            });

        e.preventDefault();
    });
