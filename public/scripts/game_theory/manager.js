import { Model } from "./models.js";
import { pointFloatEffect } from "./UI.js";

let modelList = Model.children.map(elm => new elm());

export function getModelList() {
    return modelList;
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

let gameSpeed = 300;
export function changeGameSpeed(value) {
    gameSpeed = value;
}

// RUN GAME SUPPORT FUNCS

// MAIN GAME HANDLE
export async function runGame(skip, models, onMatch) {
    let n = models.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            let model = models[i];
            let opponent = models[j];

            let modelMove = model.this_move(opponent);
            let opponentMove = opponent.this_move(model);

            let modelDelta = 0, opponentDelta = 0;
            if(modelMove == 1 && opponentMove == 1) {
                model.point += (modelDelta = 2);
                opponent.point += (opponentDelta = 2);
            } 
            else if(modelMove == 0 && opponentMove == 1) {
                model.point += (modelDelta = 3);
                opponent.point += (opponentDelta = -3);
            } 
            else if(modelMove == 1 && opponentMove == 0) {
                model.point += (modelDelta = -3);
                opponent.point += (opponentDelta = 3);   
            }

            if(!skip()){
                pointFloatEffect(model.name, modelDelta);
                pointFloatEffect(opponent.name, opponentDelta);

                // update UI
                onMatch(model, opponent);
                await sleep(gameSpeed);
            }

            model.update();
            opponent.update();
        }
    }
}