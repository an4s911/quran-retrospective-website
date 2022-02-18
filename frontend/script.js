const url = "http://localhost:5050/api/getlist";

/* GET DATA AND DISPLAY */
getData().then((data) => {
    const boxesDiv = document.querySelector(".boxes");
    for (let date in data) {
        const newBox = makeHtmlBox(formatDate(date), data[date]);
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
});

/* FUNCTIONS */
async function getData() {
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
    return await fetch(url, {
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
    let element = document.createElement("ul");
    element.classList.add("box");

    let html = "";
    html += `<li class='day'><h4>${date}</h4></li>`;

    for (let i = 0; i < otherDetails.length; i++) {
        html += `<li class='thing-to-learn'><input type='checkbox'`;
        if (otherDetails[i].done) {
            html += ` checked`;
        }
        html += `>`;
        html += `<span>${otherDetails[i].text.toUpperCase()}`;
        if (otherDetails[i].plusStage >= 0) {
            html += `+${otherDetails[i].plusStage}`;
        }
        html += "</span></li>";
    }

    element.innerHTML = html;

    return element;
}

function setThingToLearnStatus(checkBoxElem) {
    const thingToLearn = checkBoxElem.parentElement.querySelector("span");
    if (checkBoxElem.checked) {
        thingToLearn.classList.add("disabled");
    } else {
        thingToLearn.classList.remove("disabled");
    }
}

function formatDate(date) {
    // convert date from format YYYY/MM/DD to ddd, MMM DD
    // where: Y -> year, M -> month, D -> Day of the month, d -> day of the week
    // eg; from `2022/02/12` to `Sat, Feb 12`
    let formattedDate = new Date(date).toDateString();
    return formattedDate.slice(0, 3) + "," + formattedDate.slice(3, -5);
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
