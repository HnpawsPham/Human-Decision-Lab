export class Model{
    static children = [];

    static register(elm){
        Model.children.push(elm);
    }

    constructor(name){
        this.name = name;
        this.point = 0;
        this.moral = 100;
        this.reputation = 100;
        this.memory = [];
        this.firstTry = 1;
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
        return opponent;
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
        
        if(this.delta < 0) return 1;
        return 0;
    }
}
Model.register(Jugador);

class CinnamonRoll extends Model{
    constructor(){
        super("Cinnamon Roll");
    }

    strategy(opponent){
        return 1;
    }
}
Model.register(CinnamonRoll);

class Badass extends Model{
    constructor(){
        super("Badass");
        this.firstTry = 0;
    }

    strategy(opponent){
        return 0;
    }
}
Model.register(Badass);


