// changes the text are to be fancy
export function execFancy(i) {
    return new Promise((resolve, reject) => {
        tinymce.init({
            selector: `#what-did-${i + 1}`,
            plugins: "link image table",
            menubar: "edit insert view format table",
            // render the textarea, doesn't show up otherwise beyond the first time
            setup: function (ed) {
                ed.on("init", function (args) {
                    const richForm = document.querySelector(".tox-tinymce");
                    const modifiedFormHeight = richForm.style.height;
                    richForm.setAttribute(
                        "style",
                        `visibility: hidden; height: ${modifiedFormHeight};`
                    );

                    document.querySelector(`#fancyLoadingSpinner-${i + 1}`).classList.add("invisible")
                });
            },
        });
        resolve();
    });
}

// changes the text area to be markdown
export function execSimple(i) {
    document.querySelector(`#what-did-${i + 1}`).classList.add("invisible");
    document
        .querySelector(`#what-did-${i + 1}-markdown`)
        .classList.remove("invisible");
}
