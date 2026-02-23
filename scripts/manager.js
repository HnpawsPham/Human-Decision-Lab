import {Model} from "./models.js";

let modelList = Model.children.map(elm => new elm());

for(let model of modelList)
    for(let opponent of modelList){
        let opponentMove = opponent.strategy(model.firstTry);
        
        if(opponentMove < model.firstTry)
            model.point--;
        else model.point++;
    }

console.log(modelList);