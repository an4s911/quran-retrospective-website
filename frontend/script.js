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
        const thingToLearn = elem.parentElement.querySelector("span");
        if (elem.checked) {
            thingToLearn.style.color = "gray";
            thingToLearn.style.textDecoration = "line-through";
        } else {
            thingToLearn.style.color = "initial";
            thingToLearn.style.textDecoration = "initial";
        }
    });
});
