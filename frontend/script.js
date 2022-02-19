const url = "http://localhost:5050";

/* GET DATA AND DISPLAY */
getRemoteData().then((data) => {
    const boxesDiv = document.querySelector(".boxes");
    for (let date in data) {
        const newBox = makeHtmlBox(importFormatDate(date), data[date]);
        boxesDiv.appendChild(newBox);
    }

    const thingsToLearn = document.querySelectorAll(".thing-to-learn > span");
    thingsToLearn.forEach((thing) => {
        thing.addEventListener("click", (event) => {
            const element = event.target;

            if (!Array.from(element.classList).includes("disabled")) {
                const newValue = prompt("New value", element.textContent);

                if (!newValue) {
                    return;
                }
                element.textContent = newValue.toUpperCase();
            }
        });
    });

    const checkBoxes = document.querySelectorAll(".thing-to-learn > input");
    checkBoxes.forEach((check) => {
        check.addEventListener("change", (changeEvent) => {
            const elem = changeEvent.target;
            setThingToLearnStatus(elem);
        });
        setThingToLearnStatus(check);
    });

    const updateBtn = document.querySelector("#update-btn");
    updateBtn.addEventListener("click", () => {
        siteData = parseSiteData();
        if (!deepEqualObjects(data, siteData)) {
            updateRemoteData(siteData).then((response) => {
                if (response.success) {
                    data = siteData;
                    alert("Successfully updated");
                } else {
                    alert("Something's wrong, your changes aren't applied");
                }
            });
        } else {
            alert("No changes!");
        }
    });
});

/* PARSE DATA FROM SITE AND UPDATE DATABASE */

// const parsedData = parseSiteData();

/* FUNCTIONS */
async function getRemoteData(remoteUrl = `${url}/api/getlist`) {
    // the data will be an object where the key is a data
    // and the value is an array of 3 objects, each of them have
    // 3 properties:
    //      1. key -> 'text', value -> the thing to learn eg; '1qh2'
    //      2. key -> 'plusStage', value -> an integer default: -1, here -1 means no plusStage
    //          and other numbers inlucde 0, 1, 3, 7 etc.
    //      3. key -> 'done', value -> a bool, either true or false
    // it looks like this:
    // {
    //    "2022/02/12": [
    //        {
    //            "text": "1hp17",
    //            "plusStage": 2,
    //            "done": False,
    //        },
    //        {
    //            "text": "3qh2",
    //            "plusStage": -1,
    //            "done": True,
    //        },
    //        {
    //            "text": "1qh2",
    //            "plusStage": -1,
    //            "done": False,
    //        },
    //    ], ...
    // }
    return await fetch(remoteUrl, {
        method: "POST",
    }).then((blob) => blob.json());
}

function makeHtmlBox(date, otherDetails) {
    // makes a box of the format:
    // <ul class="box">
    //     <li class="day">
    //         <h4>Sat, 12 Feb</h4>
    //     </li>
    //     <li class="thing-to-learn"><input type="checkbox" name="revised" id="">
    //         <span>1HP19+0</span>
    //     </li>
    //     <li class="thing-to-learn"><input type="checkbox" name="revised" id="">
    //         <span>4HQ58+3</span>
    //     </li>
    //     <li class="thing-to-learn"><input type="checkbox" name="revised" id="">
    //         <span>2HQ1+1</span>
    //     </li>
    // </ul>
    // otherDetails will be an array (size 3) of objects
    // where each object has properties text: String,
    // plusStage: Number and done: bool
    let elementUl = document.createElement("ul");
    elementUl.classList.add("box");

    const boxHeaderLi = document.createElement("li");
    boxHeaderLi.classList.add("day");

    const boxHeaderH4 = document.createElement("h4");
    boxHeaderH4.textContent = date;

    boxHeaderLi.appendChild(boxHeaderH4);
    elementUl.appendChild(boxHeaderLi);

    for (let i = 0; i < otherDetails.length; i++) {
        const thingToLearnLi = document.createElement("li");
        thingToLearnLi.classList.add("thing-to-learn");

        const thingToLearnCheckboxInput = document.createElement("input");
        thingToLearnCheckboxInput.type = "checkbox";

        if (otherDetails[i].done) {
            thingToLearnCheckboxInput.checked = true;
        }

        const thingToLearnSpan = document.createElement("span");
        thingToLearnSpan.textContent = otherDetails[i].text.toUpperCase();

        thingToLearnLi.appendChild(thingToLearnCheckboxInput);

        if (otherDetails[i].plusStage >= 0) {
            thingToLearnSpan.textContent += `+${otherDetails[i].plusStage}`;
        }

        thingToLearnLi.appendChild(thingToLearnSpan);

        elementUl.appendChild(thingToLearnLi);
    }

    return elementUl;
}

function setThingToLearnStatus(checkBoxElem) {
    const thingToLearn = checkBoxElem.parentElement.querySelector("span");
    if (checkBoxElem.checked) {
        thingToLearn.classList.add("disabled");
    } else {
        thingToLearn.classList.remove("disabled");
    }
}

function importFormatDate(date) {
    // convert date from format YYYY/MM/DD to ddd, MMM DD
    // where: Y -> year, M -> month, D -> Day of the month, d -> day of the week
    // eg; from `2022/02/12` to `Sat, Feb 12`
    let formattedDate = new Date(date).toDateString();
    return formattedDate.slice(0, 3) + "," + formattedDate.slice(3, -5);
}

async function updateRemoteData(
    newData = parseSiteData(),
    remoteUrl = `${url}/api/updatedata`
) {
    return await fetch(remoteUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
    }).then((blob) => blob.json());
}

function parseSiteData() {
    // Convert the user's input into an object format as specified
    // in the comment to the getData() function
    const data = {};
    const boxes = document.querySelectorAll("ul.box");
    boxes.forEach((box) => {
        const date = exportFormatDate(
            box.querySelector(".day > h4").textContent
        );
        const currThingsToLearn = [];
        Array.from(box.childNodes)
            .slice(1, 4)
            .forEach((thingToLearn) => {
                let [text, plusStage] = thingToLearn.textContent.split("+");
                if (!plusStage) {
                    plusStage = -1;
                }
                const done = thingToLearn.querySelector("input").checked;
                const thingToLearnObj = { text, plusStage: +plusStage, done };
                currThingsToLearn.push(thingToLearnObj);
            });
        data[date] = currThingsToLearn;
    });

    return data;
}

function exportFormatDate(date) {
    // the opposite of above function
    // convert from 'Sat, Feb 12' to '2022/02/12'
    const year = new Date().getFullYear();
    let formattedDate = new Date(`${date} ${year}`).toLocaleDateString();
    formattedDate = formattedDate.split("/").reverse();
    [formattedDate[1], formattedDate[2]] = [formattedDate[2], formattedDate[1]];
    formattedDate = formattedDate.join("/");

    return formattedDate;
}

function deepEqualObjects(v1, v2) {
    if (v1 === v2) return true;

    if (
        v1 == null ||
        v2 == null ||
        typeof v1 != "object" ||
        typeof v2 != "object"
    ) {
        return false;
    }

    let v1keys = Object.keys(v1);
    let v2keys = Object.keys(v2);

    if (v1keys.length != v2keys.length) {
        return false;
    }

    let i = 3;
    for (let key of v1keys) {
        if (!v2keys.includes(key) || !deepEqualObjects(v1[key], v2[key])) {
            return false;
        }
    }

    return true;
}
