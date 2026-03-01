export class Model {
    static children = [];

    static register(elm) {
        Model.children.push(elm);
    }

    constructor(name) {
        this.name = name;
        this.description = "This model has no description yet.";
        this.type = name;
        this.point = 0;
        this.moral = 100;
        this.reputation = 100;
        this.delta = 1;
        this.like = 50;
        this.memory = new Map();
        this.self_move = new Map(); // store model last move to each opponent
        this.cache = new Map(); // store model last move cache to update later
        this.firstMove = 1; // model first move
        this.img = "../assets/model_imgs/" + name.toLowerCase().replaceAll(' ', '-') + ".png";
    }

    strategy(opponent){
        throw new Error("strategy() is empty");
    }

    this_move(opponent){
        let res;

        if(!opponent.self_move.has(this.name))
            res = this.firstMove;
        else res = this.strategy(opponent);

        this.cache.set(opponent.name, res);
        return res;
    }

    update(){
        for(let [name, move] of this.cache)
            this.self_move.set(name, move);
        this.cache.clear();
    }
}

class TitForTat extends Model {
    constructor() {
        super("Tit For Tat");
        this.description = "Starts by cooperating, then copies the opponent’s previous move. Cooperation is rewarded, betrayal is immediately returned.";
    }

    strategy(opponent) {
        return opponent.self_move.get(this.name);
    }
}
Model.register(TitForTat);

class CinnamonRoll extends Model {
    constructor() {
        super("Cinnamon Roll");
        this.description = "Always chooses to cooperate, no matter what the opponent does. Simple, friendly, but easily taken advantage of.";
    }

    strategy(opponent) {
        return 1;
    }
}
Model.register(CinnamonRoll);

class Badass extends Model {
    constructor() {
        super("Badass");
        this.firstMove = 0;
        this.description = "Always chooses to betray, no matter what the opponent does. Ruthless and predictable, but effective against overly trusting strategies.";
    }

    strategy(opponent) {
        return 0;
    }
}
Model.register(Badass);

class Jugador extends Model {
    constructor() {
        super("The Jugador");
        this.delta = new Map();
        this.description = "Keeps track of how fair the opponent has been over time. Cooperation increases trust, betrayal reduces it. If the overall balance stays positive, Jugador cooperates — otherwise, it defects.";
    }

    strategy(opponent) {
        if(!this.delta.has(opponent.name))
            this.delta.set(opponent.name, 0);

        if(opponent.self_move.get(this.name) == 1)
            this.delta.set(opponent.name, this.delta.get(opponent.name) + 1);
        else
            this.delta.set(opponent.name, this.delta.get(opponent.name) - 1);

        return this.delta.get(opponent.name) >= 0 ? 1 : 0;
    }
}
Model.register(Jugador);

class TitFor2Tats extends Model {
    constructor() {
        super("Tit For Two Tats");
        this.betrayedCnt = new Map();
        this.description = "Cooperates by default and only defects if the opponent betrays twice in a row. This makes it more forgiving than Tit for Tat and better at handling occasional mistakes.";
    }

    strategy(opponent) {
        if(!this.betrayedCnt.has(opponent.name))
            this.betrayedCnt.set(opponent.name, 0);

        if(opponent.self_move.get(this.name) == 0)
            this.betrayedCnt.set(opponent.name, this.betrayedCnt.get(opponent.name) + 1);
        else
            this.betrayedCnt.set(opponent.name, 0);

        if(this.betrayedCnt.get(opponent.name) >= 2)
            return 0;
        return 1;
    }
}
Model.register(TitFor2Tats);

class GenerousTitForTat extends Model {
    constructor() {
        super("Generous Tit For Tat");
        this.description = "Plays like Tit for Tat — it copies the opponent’s last move — but once in a while (about 10–30%), it chooses to cooperate even after being betrayed. This bit of forgiveness helps break endless retaliation and keeps cooperation going."
    }

    strategy(opponent) {
        if(opponent.self_move.get(this.name) == 0) {
            if (Math.random() < 0.2) return 1;
            return 0;
        }
        return 1;
    }
}
Model.register(GenerousTitForTat);

class GrimTrigger extends Model {
    constructor() {
        super("Grim Trigger");
        this.description = "Starts by cooperating, but if the opponent betrays even once, it will defect forever. One mistake is enough to end cooperation permanently.";
        this.betrayedBy = new Set();
    }

    strategy(opponent) {
        if (opponent.self_move.get(this.name) == 0) 
                this.betrayedBy.add(opponent.name);
        return !this.betrayedBy.has(opponent.name);
    }
}
Model.register(GrimTrigger);