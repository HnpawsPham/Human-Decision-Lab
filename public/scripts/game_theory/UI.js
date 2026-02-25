import {sendNoti} from "../notification.js";

// scoreboard animation
const scoreboard = document.getElementById("scoreboard")
const header = scoreboard.querySelector(".scoreboard-header")

header.onclick = () => {
    scoreboard.classList.toggle("collapsed")
}

// add score of each model into scoreboard
const scoreboardDisplay = document.querySelector(".participant-container");

export function addScoreTag(model){
    let tag = document.createElement("div");
    tag.classList.add("participant");
    
    let name = document.createElement("span");
    name.innerHTML = model.name;
    tag.appendChild(name);

    let modelPts = document.createElement("span");
    let pts = model.point;
    if(pts == 1) modelPts.innerHTML = pts + "pt";
    else modelPts.innerHTML = pts + "pts";
    tag.appendChild(modelPts);

    scoreboardDisplay.appendChild(tag);
}

// user input number of round handle
const roundInput = document.getElementById("round-inp");
const randomRoundBtn = document.getElementById("random-round-btn");
const startGameBtn = document.getElementById("start-game-btn");
let round = 0;

randomRoundBtn.addEventListener("click", () => {
    roundInput.value = Math.floor(Math.random() * 100) + 1;
})

startGameBtn.addEventListener("click", () => {
    if(roundInput.value == ""){
        sendNoti("Number of rounds missing!", 2000);
        return;
    }

    round = roundInput.value;
    randomRoundBtn.disabled = true;
    startGameBtn.disabled = true;
    roundInput.disabled = true;
});

// open model selection
const addModelBtn = document.getElementById("add-model-btn");
const modelSelection = document.querySelector("#model-selection");
const playField = document.getElementById("play-field");

addModelBtn.addEventListener("click", () => {
    if(getComputedStyle(modelSelection).display === "none")
        modelSelection.style.display = "flex";
    else{
        modelSelection.style.display = "none";
        modelSelection.style.width = "60vw";
        playField.style.width = "100%";
    }
})

document.addEventListener("click", (e) => {
    if(modelSelection.contains(e.target) || addModelBtn.contains(e.target)) 
        return;

    if(getComputedStyle(modelSelection).display !== "none") {
        modelSelection.style.display = "none";
        modelSelection.style.width = "60vw";
        playField.style.width = "100%";
    }
});

// load model previews in model selection
const modelSelectionBody = modelSelection.querySelector(".body");
export function loadModelPreview(model){
    let div = document.createElement("div");
    div.classList.add("model-tab");

    let img = document.createElement("img");
    img.src = model.img;
    div.appendChild(img);

    let name = document.createElement("p");
    name.innerHTML = model.name;
    div.appendChild(name);

    div.onclick = () => {addModelToPlayField(model)};
    modelSelectionBody.appendChild(div);
}

// format players in a circle
const playGround = document.querySelector(".models-circle");

function layoutPosition() {
    const models = playGround.querySelectorAll(".model");

    const w = Number(playGround.dataset.width);
    const h = Number(playGround.dataset.height);
    const char_sz = Number(playGround.dataset.charSz);

    playGround.style.width = w + "px";
    playGround.style.height = h + "px";

    const rx = w / 2 - char_sz / 2;
    const ry = h / 2 - char_sz / 2;

    models.forEach((model, i) => {
        const angle = (2 * Math.PI / models.length) * i - Math.PI / 2;

        const x = Math.cos(angle) * rx;
        const y = Math.sin(angle) * ry;

        model.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        model.style.zIndex = Math.floor(y + 1000);
    });
}

// add models in circle (playground)
function addModelToPlayField(model){
    // split to 2 for user to see both the circle and the model list
    modelSelection.style.width = "40vw";
    playField.style.width = "50%";

    let person = document.createElement("div");
    person.className = "model";
    
    let img = document.createElement("img");
    img.src = model.img;
    person.appendChild(img);
    
    playGround.appendChild(person);
    layoutPosition();
}
