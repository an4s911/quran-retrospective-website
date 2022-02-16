const url = "http://localhost:5050/api/getlist";

/* GET DATA AND DISPLAY */
getData().then((data) => {
    const boxesDiv = document.querySelector(".boxes");
    for (let date in data) {
        const newBox = makeBoxHtml(date, data[date]);
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
    return await fetch(url, {
        method: "POST",
    }).then((blob) => blob.json());
}

function makeBoxHtml(date, otherDetails) {
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
