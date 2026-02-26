export class Model{
    static children = [];

    static register(elm){
        Model.children.push(elm);
    }

    constructor(name){
        this.name = name;
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

    strategy(opponent){
        throw new Error("strategy() is empty");
    }
}

class TitForTat extends Model{
    constructor(){
        super("Tit For Tat");
    }

    strategy(opponent){
        this.return = opponent;
        return this.return;
    }
}
Model.register(TitForTat);

class Jugador extends Model{
    constructor(){
        super("The Jugador");
        this.delta = 0;
    }

    strategy(opponent){
        if(!opponent) this.delta--;
        else this.delta++;
        
        this.return = (this.delta >= 0);
        return this.return;
    }
}
Model.register(Jugador);

class CinnamonRoll extends Model{
    constructor(){
        super("Cinnamon Roll");
    }

    strategy(opponent){
        return this.return;;
    }
}
Model.register(CinnamonRoll);

class Badass extends Model{
    constructor(){
        super("Badass");
        this.return = 0;
    }

    strategy(opponent){
        return this.return;
    }
}
Model.register(Badass);


