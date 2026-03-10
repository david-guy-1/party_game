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
    ribbons_colors : string[] = [];
    flowers : number[] = [];
    flowers_colors : string[] = []; 
    mode : string = "" // NOT party mode
    constructor(){
        this.balloons = []
        this.balloon_colors = []
        this.ribbons = []
        this.ribbons_colors = []
        
        for(let i=0; i<10; i++){
            this.balloons.push([WIDTH/11 * (i+1), HEIGHT/11 * (i+1), ]);
            this.balloon_colors.push("red")
            
        }   
        for(let i=0; i<6; i++){
            this.ribbons.push(167+184*i)
            this.ribbons_colors.push("blue")
        }
        for(let i=0; i<6; i++){
            this.flowers.push(167+184*i)
            this.flowers_colors.push("blue")
        }
    }
    tick(){

        this.player = moveTo(this.player, this.target, 10) as point;
        return [];
    }
}

export default game; 