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
export async function runGame(models, onMatch) {
    let n = models.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            let model = models[i];
            let opponent = models[j];

            let modelMove = model.this_move(opponent);
            let opponentMove = opponent.this_move(model);

            if(modelMove == 1 && opponentMove == 1) {
                model.point += 2;
                opponent.point += 2;

                pointFloatEffect(model.name, 2);
                pointFloatEffect(opponent.name, 2);
            } 
            else if(modelMove == 0 && opponentMove == 1) {
                model.point += 3;
                opponent.point -= 3;

                pointFloatEffect(model.name, 3);
                pointFloatEffect(opponent.name, -3);
            } 
            else if(modelMove == 1 && opponentMove == 0) {
                model.point -= 3;
                opponent.point += 3;

                pointFloatEffect(model.name, -3);
                pointFloatEffect(opponent.name, 3);
            }

            // update UI
            onMatch(model, opponent);

            model.update();
            opponent.update();

            await sleep(gameSpeed);
        }
    }
}