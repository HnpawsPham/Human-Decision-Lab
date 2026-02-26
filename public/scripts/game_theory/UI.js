import {sendNoti} from "../notification.js";
import { changeGameSpeed, getModelList, runGame, game } from "./manager.js";

//#region scoreboard handle
// scoreboard animation
const scoreboard = document.getElementById("scoreboard")
const header = scoreboard.querySelector(".scoreboard-header")

header.onclick = () => {
    scoreboard.classList.toggle("collapsed")
}

// add score of each model into scoreboard
const scoreboardDisplay = document.querySelector(".participant-container");
const scoreMap = new Map();
const selectedModels = [];

function cloneModel(type){
    let cnt = 0;
    
    for(const model of selectedModels)
        if(model.type === type.type) cnt++;
    
    const clone = Object.create(type);
    if(cnt != 0) clone.name = `${clone.name} (${cnt})`; 
    return clone;
}

function addScoreboardTag(model){
    let tag = document.createElement("div");
    tag.classList.add("participant");
    
    let name = document.createElement("span");
    name.innerHTML = model.name;
    tag.appendChild(name);

    let modelPts = document.createElement("span");
    modelPts.classList.add("pts");

    let pts = model.point;
    if(pts == 1) modelPts.innerHTML = pts + "pt";
    else modelPts.innerHTML = pts + "pts";
    tag.appendChild(modelPts);

    scoreboardDisplay.appendChild(tag);
    scoreMap.set(model.name, tag);
}
//#endregion

// user input number of round handle
const roundInput = document.getElementById("round-inp");
const randomRoundBtn = document.getElementById("random-round-btn");

randomRoundBtn.addEventListener("click", () => {
    roundInput.value = Math.floor(Math.random() * 100) + 1;
})

// region open model selection
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
        playField.style.left = "0";
    }
})

document.addEventListener("click", (e) => {
    if(modelSelection.contains(e.target) || addModelBtn.contains(e.target)) 
        return;

    if(getComputedStyle(modelSelection).display !== "none") {
        modelSelection.style.display = "none";
        modelSelection.style.width = "60vw";
        playField.style.width = "100%";
        playField.style.left = "0";
    }
});

// load model previews in model selection
const modelSelectionBody = modelSelection.querySelector(".body");

function loadModelPreview(model){
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

const modelList = getModelList();
for(let model of modelList)
    loadModelPreview(model);

//#endregion

//#region playground handle
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

        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const x = cosA * rx;
        const y = sinA * ry;

        const flip = cosA > 0 ? -1 : 1;

        model.style.transform =
            `translate(-50%, -50%) translate(${x}px, ${y}px) scaleX(${flip})`;

        model.style.zIndex = Math.floor(y + 1000);
    });
}

// add models in circle (playground)
function addModelToPlayField(type){
    const model = cloneModel(type);
    selectedModels.push(model);

    // split to 2 for user to see both the circle and the model list
    modelSelection.style.width = "38vw";
    playField.style.width = "50%";
    playField.style.left = "5%";

    let person = document.createElement("div");
    person.className = "model";
    person.dataset.name = model.name;

    let img = document.createElement("img");
    img.src = model.img;
    person.appendChild(img);
    
    playGround.appendChild(person);
    addScoreboardTag(model);
    layoutPosition();
}

function updateScoreBoard(model){
    const tag = scoreMap.get(model.name);
    if(!tag) return;

    const modelPts = tag.querySelector(".pts");

    let pts = model.point;
    if(pts == 1) modelPts.innerHTML = pts + "pt";
    else modelPts.innerHTML = pts + "pts";
}

//#endregion

// change game speed handle
const gameSpeedSlider = document.getElementById("game-speed-inp");
gameSpeedSlider.addEventListener("change", () => {
    changeGameSpeed(gameSpeedSlider.value);
})

//#region start game handle
const startGameBtn = document.getElementById("start-game-btn");
let round = 0;

startGameBtn.addEventListener("click", async () => {
    if(roundInput.value == ""){
        sendNoti("Number of rounds missing!", 2000);
        return;
    }

    if(selectedModels.length < 2){
        sendNoti("Don't be a lone wolf! Select at least 2 models to start.", 3500);
        return;
    }

    randomRoundBtn.disabled = true;
    startGameBtn.disabled = true;
    roundInput.disabled = true;
    
    round = roundInput.value;

    for(let i = 0; i < round; i++)
        await runGame(selectedModels, (self, opponent) => {
            drawConnection(self, opponent);
            updateScoreBoard(self);
        });
    scoreMap.clear();
});

//#endregion

// region LOAD GAME HANDLE
// line between 2 models
const modelConnections = document.getElementById("connect-lines");

function drawConnection(self, opponent) {
    const currentModel = document.querySelector(`.model[data-name="${self.name}"]`);
    const currentOpponent = document.querySelector(`.model[data-name="${opponent.name}"]`);

    if (!currentModel || !currentOpponent) return;

    const svgRect = modelConnections.getBoundingClientRect();

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    const currentModelPos = currentModel.getBoundingClientRect();
    const currentOpponentPos = currentOpponent.getBoundingClientRect();

    const footOffset = 4;

    const x1 = currentModelPos.left + currentModelPos.width / 2;
    const y1 = currentModelPos.bottom - footOffset;

    const x2 = currentOpponentPos.left + currentOpponentPos.width / 2;
    const y2 = currentOpponentPos.bottom - footOffset;

    line.setAttribute("x1", x1 - svgRect.left);
    line.setAttribute("y1", y1 - svgRect.top);
    line.setAttribute("x2", x2 - svgRect.left);
    line.setAttribute("y2", y2 - svgRect.top);

    line.setAttribute("stroke", "var(--blue)");
    line.setAttribute("stroke-width", "3");
    line.style.transition = "stroke 0.3s";

    modelConnections.appendChild(line);

    setTimeout(() => {
        line.setAttribute("stroke", "var(--gray)");
    }, 300);
}
//#endregion

//#region reset handle
// fix: modelConnections k ve lai line khi reset
const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", () => {
    selectedModels.length = 0;

    scoreMap.clear();

    modelConnections.replaceChildren();
    playGround.replaceChildren();

    randomRoundBtn.disabled = false;
    startGameBtn.disabled = false;
    roundInput.disabled = false;
    roundInput.value = null;

    scoreboardDisplay.replaceChildren();
})
//#endregion