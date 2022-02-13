/* GET DATA AND DISPLAY */
const data = {
    'Sun, 13 Feb': [
        {
            text: '',
            plusStage: -1,
            done: false,
        },
        {
            text: '4qh2',
            plusStage: 0,
            done: false,
        },
        {
            text: '3qh2',
            plusStage: -1,
            done: false,
        }
    ],
    'Mon, 14 Feb': [
        {
            text: '',
            plusStage: -1,
            done: false,
        },
        {
            text: '4qh1',
            plusStage: 0,
            done: false
        },
        {
            text: '4qh2',
            plusStage: 1,
            done: false
        }
    ],
}

const boxesDiv = document.querySelector('.boxes');
for (let date in data) {
    const newBox = makeBoxHtml(date, data[date]);
    boxesDiv.appendChild(newBox);
}

function makeBoxHtml(date, otherDetails) {
    // makes a box of the format:
    // <ul class="box">
    //     <li class="day">
    //         <!-- Day or Date -->
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
    let element = document.createElement('ul');
    element.classList.add('box')

    let html = "";
    html += `<li class='day'><h4>${date}</h4></li>`;

    for (let i = 0; i < otherDetails.length; i++) {
        html += `<li class='thing-to-learn'><input type='checkbox'`;
        if (otherDetails[i].done) {
            html += ` checked`
        }
        html += `>`
        html += `<span>${otherDetails[i].text.toUpperCase()}`;
        if (otherDetails[i].plusStage >= 0) {
            html += `+${otherDetails[i].plusStage}`;
        }
        html += '</span></li>'
    }

    element.innerHTML = html;

    return element;
}

const thingsToLearn = document.querySelectorAll(".thing-to-learn > span");
thingsToLearn.forEach((thing) => {
    thing.addEventListener("click", (event) => {
        const element = event.target;
        const newValue = prompt("New value", element.textContent);
        if (!newValue) {
            return;
        }
        element.textContent = newValue;
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

function setThingToLearnStatus(checkBoxElem) {
    const thingToLearn = checkBoxElem.parentElement.querySelector("span");
    if (checkBoxElem.checked) {
        thingToLearn.style.color = "gray";
        thingToLearn.style.textDecoration = "line-through";
    } else {
        thingToLearn.style.color = "initial";
        thingToLearn.style.textDecoration = "initial";
    }
}
