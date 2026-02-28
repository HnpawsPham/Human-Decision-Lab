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
            console.log(opponent.name);
            if (model.name == opponent.name) continue;

            let opponentMove = opponent.strategy(model.move);
            let modelMove = model.strategy(opponent.move);

            if(opponentMove < modelMove)
                model.point -= 3;
            else if(opponentMove > modelMove)
                model.point += 3;
            else if(opponentMove + modelMove > 0) 
                model.point++;

            remember(model, opponent);

            model.update();
            opponent.update();

            onMatch(model, opponent);
            await sleep(gameSpeed);
        }
    }
}