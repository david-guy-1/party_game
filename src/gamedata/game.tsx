import _ from "lodash";
import { game_interface, point } from "../interfaces";
import { dist, moveTo } from "../lines";
import { HEIGHT, WIDTH } from "./App";

class game implements game_interface{
    player : point = [400,400];
    target : point = [400,400];
    banner_height : number = 400;
    balloons : point[] = [];
    ribbons : number[] = [];
    mode : string = ""
    constructor(){
        for(let i=0; i<10; i++){
            this.balloons.push([WIDTH/11 * (i+1), HEIGHT/11 * (i+1), ]);
        }
    }
    tick(){

        this.player = moveTo(this.player, this.target, 10) as point;
        return [];
    }
}

export default game; 