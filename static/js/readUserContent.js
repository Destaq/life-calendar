var current_user;
var user_data = { result: [] };

export async function callDB() {
    await fetch("/api/currentuser/")
        .then((response) => response.text())
        .then((data) => {
            current_user = data;
        });

    if ((current_user != "")) {
        // read data based on current user
        await fetch(`/api/read/${current_user}/`)
            .then((data) => data.json())
            .then((result) => (user_data = result));
    }

    let acceptable = ["days", "weeks", "months", "years", "decades"];

    // set user data to localstorage
    for (var key in user_data.result) {
        if (acceptable.includes(key)) {
            for (var subkey in Array.from(user_data.result[key])) {
                // set text box **value**
                localStorage.setItem(
                    capitalize(key) + "-" + user_data.result[key][subkey][0],
                    user_data.result[key][subkey][1]
                );

                if (user_data.result[key][subkey][2] != "IGNORE") {
                    // set text box **background**
                    localStorage.setItem(
                        capitalize(key) +
                            "-" +
                            user_data.result[key][subkey][0] +
                            "-background",
                        user_data.result[key][subkey][2]
                    );
                }
            }
        } else if (key === "age_expectancy") {
            localStorage.setItem("age-expectancy", parseFloat(user_data.result[key]));
        } else if (key === "dob") {
            localStorage.setItem("birthday", user_data.result[key]);
        } else if (key === "joined") {
            localStorage.setItem("joined", user_data.result[key]);
        } else if (key === "statistics") {
            // iterate through dictionary
            try {
                let mydict = user_data.result[key];
                let correct_quote_dict = mydict.replace(/'/g, '"');
                let output_obj = JSON.parse(correct_quote_dict);
                
                for (var key in output_obj) {
                    localStorage.setItem(key, output_obj[key]);
                }
            } catch { console.debug(user_data.result[key] )}
        } else if (key === "legend") {
            try {
                let mydict = user_data.result[key];
                let correct_quote_dict = mydict.replace(/'/g, '"');
                let output_obj = JSON.parse(correct_quote_dict);

                localStorage.setItem("dontModify", JSON.stringify(output_obj["dontModify"]));
                localStorage.setItem("legendModalColors", JSON.stringify(output_obj["legendModalColors"]));
            } catch {}
        } else if (key === "goals") {
            let mydict = user_data.result[key];
            let output_obj = JSON.parse(mydict);

            localStorage.removeItem("goals_text");

            localStorage.setItem("goals_text", JSON.stringify(output_obj));
        }
    }
}

// capitalize a string
export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
