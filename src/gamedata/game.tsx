import _, { random } from "lodash";
import { game_interface, point } from "../interfaces";
import { dist, moveTo } from "../lines";
import { HEIGHT, WIDTH } from "./App";
import { choice } from "../random";

class game implements game_interface{
    player : point = [400,400];
    target : point = [400,400];
    banner_height : number = 400;
    balloons : point[] = [];
    balloon_colors : string[] = [];
    ribbons : number[] = [];
    mode : string = ""
    constructor(){
        for(let i=0; i<10; i++){
            this.balloons.push([WIDTH/11 * (i+1), HEIGHT/11 * (i+1), ]);
            this.balloon_colors.push(choice(["red","green","blue","yellow","purple"], Math.random().toString()))
        }   
    }
    tick(){

        this.player = moveTo(this.player, this.target, 10) as point;
        return [];
    }
}

export default game; 