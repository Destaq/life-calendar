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
    // LS - TODO - set cookie for whether logged in/out
    localStorage.clear();

    location.href = "/login";
}
