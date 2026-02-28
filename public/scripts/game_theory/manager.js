import {Model} from "./models.js";
import { pointFloatEffect } from "./UI.js";

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
}

function remember(model, opponent){
    model.memory.set(opponent.name, {
        name: opponent.name,
        behavior: opponent.move
    });
}

// MAIN GAME HANDLE
export async function runGame(models, onMatch) {
    for (let model of models) {
        for (let opponent of models) {
            if (model === opponent) continue;

            let opponentMove = opponent.this_move(model.move);
            let modelMove = model.this_move(opponent.move);

            if(opponentMove < modelMove){
                model.point -= 3;
                pointFloatEffect(model.name, -3);
            }
            else if(opponentMove > modelMove){
                model.point += 3;
                pointFloatEffect(model.name, 3);
            }
            else if(opponentMove + modelMove > 0){ 
                model.point++;
                pointFloatEffect(model.name, 1);
            }

            model.update();
            opponent.update();

            remember(model, opponent);
            remember(opponent, model);
            
            onMatch(model, opponent);
            await sleep(gameSpeed);
        }
    }
}