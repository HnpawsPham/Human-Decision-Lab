import {sendNoti} from "../notification.js";

// scoreboard animation
const scoreboard = document.getElementById("scoreboard")
const header = scoreboard.querySelector(".scoreboard-header")

header.onclick = () => {
    scoreboard.classList.toggle("collapsed")
}

// add score of each model into scoreboard
const playField = document.getElementById("play-field");
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