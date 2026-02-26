import {Model} from "./models.js";

let modelList = Model.children.map(elm => new elm());

export function getModelList() {
    return modelList;
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

let gameSpeed = 300;
export function changeGameSpeed(value){
    gameSpeed = value;
    console.log(gameSpeed);
}

export async function runGame(models, onMatch) {
    for (let model of models) {
        for (let opponent of models) {
            if (model.name == opponent.name) continue;

            let opponentMove = opponent.strategy(model.return);

            if(opponentMove < model.return)
                model.point -= 3;
            else if(opponentMove > model.return)
                model.point += 3;
            else if(opponentMove + model.return > 0) 
                model.point++;

            onMatch(model, opponent);
            await sleep(gameSpeed);
        }
    }
}