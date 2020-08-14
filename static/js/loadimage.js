// http://localhost:5000/api/make_image?username=nothing&auth=nothing&map_type=nothing
const http = new SimpleHTTP();
var image = new Image();
image.onload = function () {
    console.log(image.width); // image is loaded and we have image width
};

http.get(
    "http://localhost:5000/api/make_image?username=nothing&auth=nothing&map_type=blank&interval=years"
)
    .then((data) => {
        image.src = "data:image/png;base64," + data.result;
    })
    .catch((err) => console.log(err));

document.querySelector(".container").appendChild(image);
