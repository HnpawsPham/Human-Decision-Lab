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

// RUN GAME SUPPORT FUNCS
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
            if(model === opponent) continue;

            let modelMove = model.this_move(opponent.move);
            let opponentMove = opponent.strategy(model.move);

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

            model.update(opponent);
            remember(model, opponent);
            
            onMatch(model, opponent);
            await sleep(gameSpeed);
        }
    }
}