const http = new SimpleHTTP();
var image = new Image();
image.onload = function () {
    console.log(image.width); // image is loaded and we have image width
};

http.get(
    "http://localhost:5000/makeimage?username=null&auth=nothing&map_type=full&interval=weeks"
)
    .then((data) => {
        image.src = "data:image/png;base64," + data.result;
        console.log("success!");
    })
    .catch((err) => console.log(err));

document.querySelector(".output").appendChild(image);
