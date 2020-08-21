// changes the text are to be fancy
export function execFancy(i) {
    console.log("initializing tinymce");
    tinymce.init({
        selector: `#what-did-${i + 1}`,
        plugins: "link image table",
        menubar: "edit insert view format table",
    });
}

// changes the text area to be markdown
export function execSimple(i) {
    document.querySelector(`#what-did-${i + 1}`).classList.add("invisible")
    document.querySelector(`#what-did-${i + 1}-markdown`).classList.remove("invisible")
}