import {Model} from "./models.js";
import {addScoreTag, loadModelPreview} from "./UI.js";

let modelList = Model.children.map(elm => new elm());

for(let model of modelList)
    for(let opponent of modelList){
        let opponentMove = opponent.strategy(model.firstTry);
        
        if(opponentMove < model.firstTry)
            model.point--;
        else model.point++;
    }

for(let model of modelList){
    addScoreTag(model);
    loadModelPreview(model);
}