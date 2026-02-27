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
        this.memory = [];
        this.return = 1;
        this.img = "../assets/char.png"
    }

    strategy(opponent) {
        throw new Error("strategy() is empty");
    }
}

class TitForTat extends Model {
    constructor() {
        super("Tit For Tat");
        this.description = "Starts by cooperating, then copies the opponent’s previous move. Cooperation is rewarded, betrayal is immediately returned.";
    }

    strategy(opponent) {
        this.return = opponent;
        return this.return;
    }
}
Model.register(TitForTat);

class CinnamonRoll extends Model {
    constructor() {
        super("Cinnamon Roll");
        this.description = "Always chooses to cooperate, no matter what the opponent does. Simple, friendly, but easily taken advantage of.";
    }

    strategy(opponent) {
        return this.return;;
    }
}
Model.register(CinnamonRoll);

class Badass extends Model {
    constructor() {
        super("Badass");
        this.return = 0;
        this.description = "Always chooses to betray, no matter what the opponent does. Ruthless and predictable, but effective against overly trusting strategies.";
    }

    strategy(opponent) {
        return this.return;
    }
}
Model.register(Badass);

class Jugador extends Model {
    constructor() {
        super("The Jugador");
        this.delta = 0;
        this.description = "Keeps track of how fair the opponent has been over time. Cooperation increases trust, betrayal reduces it. If the overall balance stays positive, Jugador cooperates — otherwise, it defects.";
    }

    strategy(opponent) {
        if (!opponent) this.delta--;
        else this.delta++;

        this.return = (this.delta >= 0);
        return this.return;
    }
}
Model.register(Jugador);

class TitFor2Tats extends Model {
    constructor() {
        super("Tit For Two Tats");
        this.betray_cnt = 0;
        this.description = "Cooperates by default and only defects if the opponent betrays twice in a row. This makes it more forgiving than Tit for Tat and better at handling occasional mistakes.";
    }

    strategy(opponent) {
        if (!opponent) this.betray_cnt++;
        if (this.betray_cnt >= 2)
            this.return = 0;
        else {
            this.return = 1;
            this.betray_cnt = 0;
        }
        return this.return;
    }
}
Model.register(TitFor2Tats);

class GenerousTitForTat extends Model {
    constructor() {
        super("Generous Tit For Tat");
        this.tolerate = 0;
        this.description = "Plays like Tit for Tat — it copies the opponent’s last move — but once in a while (about 10–30%), it chooses to cooperate even after being betrayed. This bit of forgiveness helps break endless retaliation and keeps cooperation going."
    }

    strategy(opponent) {
        const tolerate = Math.random() < (0.1 + Math.random() * 0.2) ? 1 : 0;
        this.return = opponent;
        this.return |= tolerate;
        return this.return;
    }
}
Model.register(GenerousTitForTat);

class GrimTrigger extends Model{
    constructor() {
        super("Grim Trigger");
        this.is_betrayed = 0;
        this.description = "Starts by cooperating, but if the opponent betrays even once, it will defect forever. One mistake is enough to end cooperation permanently.";
    }

    strategy(opponent){
        this.is_betrayed |= !opponent;

        if(this.is_betrayed) 
            this.return = 0;
        return this.return;
    }
}
Model.register(GrimTrigger);