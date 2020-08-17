document.querySelector("#submitExpectancyQuiz").addEventListener("click", calculateExpectancy)

async function calculateExpectancy() {
    // document.querySelector("#expectancyModal").classList.remove("invisible");
    let genderRadios = document.getElementsByName("genderRadio");
    let gender;
    for (x = 0; x < genderRadios.length; x++) {
        if (genderRadios[x].checked) {
            gender = genderRadios[x].value;
            break;
        }
    }
    let country = document.querySelector("#selectCountry").value;
    let json_data = "empty";

    function loadCustomer() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open("GET", "/data/expectancydata", true);

            xhr.onload = function () {
                if (this.status === 200) {
                    resolve(this.responseText);
                } else {
                    reject("oops!");
                }
            };

            xhr.send();
        });
    }

    json_data = await loadCustomer();
    let expecYear = JSON.parse(json_data).result;
    let goodCountry = false;
    expecYear.forEach((region_info) => {
        if (region_info.Region == country) {
            goodCountry = true;
            if (region_info[gender] != "") {
                document.querySelector(".modalOutput").innerHTML = `
                <br>
                Your age expectancy is: <strong>${region_info[gender]} years</strong>
                <br>
                <br>
                <em>Please note: this is just a rough estimate, life expectancy is determined by much more than nationality/gender.
                    To get a better picture, go to a dedicated website and take the quiz there.
                    A good place to start would be <a href="https://www.blueprintincome.com/tools/life-expectancy-calculator-how-long-will-i-live/">here.</a></em>
                `;
            } else {
                document.querySelector(".modalOutput").innerHTML = `
                <br>
                Your age expectancy is: <strong>${region_info["Overall"]} years</strong>
                <br>
                <br>
                <em>Please note: this is just an estimate, life expectancy is determined by much more than nationality/gender.
                    To get a better picture, go to a dedicated website and take the quiz there.
                    A good place to start would be <a href="https://www.blueprintincome.com/tools/life-expectancy-calculator-how-long-will-i-live/">here.</a></em>
                `;
            }
        }
    });

    if (!goodCountry) {
        document.querySelector(".modalOutput").innerHTML = `
                <br>
                Your age expectancy is: <strong>unavailable</strong>
                <br>
                <br>
                <em>We were unable to find data on your country of origin (as this quiz is only a rought estimate).
                    To get a better picture, go to a dedicated website and take the quiz there.
                    A good place to start would be <a href="https://www.blueprintincome.com/tools/life-expectancy-calculator-how-long-will-i-live/">here.</a></em>
                `;
    }
}
