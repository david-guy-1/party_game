import _, { random } from "lodash";
import { game_interface, point } from "../interfaces";
import { dist, moveTo } from "../lines";
import { HEIGHT, WIDTH } from "./App";
import { choice } from "../random";

export type food_items = "Plain Cookies" | "Chocolate Chip Cookies"
const food_items : food_items[] = ["Plain Cookies" , "Chocolate Chip Cookies"]


export type game_states = "decorations" | "shopping"
class game implements game_interface{
    banner_height : number = 0;
    balloons : point[] = [];
    balloon_colors : string[] = [];
    ribbons : number[] = [];
    ribbons_colors : string[] = [];
    flowers : number[] = [];
    flowers_colors : string[] = []; 
    mode : game_states = "decorations" // NOT party mode
    t = 0; 
    shop_items : [food_items, number, number][] = []; //type, position (y), spawn time, 
    shop_last_spawn : number = -99999;
    constructor(){
        this.balloons = []
        this.balloon_colors = []
        this.ribbons = []
        this.ribbons_colors = []
        for(let i=0; i<10; i++){
            this.balloons.push([WIDTH/11 * (i+1), HEIGHT/11 * (i+1), ]);
            this.balloon_colors.push("red")
            
        }   
        for(let i=0; i<9; i++){
            this.ribbons.push(167+84*i)
            this.ribbons_colors.push("blue")
        }
        for(let i=0; i<6; i++){
            this.flowers.push(132+140*i)
            this.flowers_colors.push("blue")
        }
    }
    tick(){
        this.t++;
        if(this.mode == "shopping"){
            let time_since_last_spawn : number = this.t - this.shop_last_spawn
            if((Math.random() < 0.01 &&  time_since_last_spawn > 60) || time_since_last_spawn > 300){
                this.shop_items.push([choice(food_items, Math.random().toString()), Math.floor(Math.random()*4), this.t]); ;
                this.shop_last_spawn = this.t
            }
        }
        return [];
    }
}

export default game; 