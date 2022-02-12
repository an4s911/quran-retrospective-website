const thingsToLearn = document.querySelectorAll(".thing-to-learn");
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
