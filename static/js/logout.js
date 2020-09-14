const logoutButton = document.querySelector("#logUserOut");
try {
    var logoutLink = document.querySelector("#logOutLink");
} catch {}
const modalLogout = document.querySelector("#logoutFinalButton");

logoutButton.addEventListener("click", confirmLogout);

try {
    logoutLink.addEventListener("click", function () {
        confirmLogout();
        setTimeout(function () {
            logoutLink.classList.remove("active");
        }, 500);
    });
} catch {}

function confirmLogout() {
    $("#logoutModal").modal("show");

    try {
        modalLogout.removeEventListener("click", performLogout);
    } catch {}

    modalLogout.addEventListener("click", performLogout);
}

function performLogout() {
    // remove info in local storage
    localStorage.clear();

    // log user out from DB
    fetch("/logout/", {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "POST",
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
        })
        .catch(function (res) {
            console.log(res);
        });
}
