import _ from "lodash";
import { game_interface, point } from "../interfaces";
import { dist, moveTo } from "../lines";

class game implements game_interface{
    player : point = [400,400];
    target : point = [400,400];
    constructor(){

    }
    tick(){

        this.player = moveTo(this.player, this.target, 10) as point;
        return [];
    }
}

export default game; 