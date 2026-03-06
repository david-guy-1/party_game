import _ from "lodash";
import { game_interface, point } from "../interfaces";
import { dist, moveTo } from "../lines";
import { randint } from "../random";
import { events_type } from "./globalStore";

export const CIRCLE_ACTIVATE = 60;
export const CIRCLE_LIFESPAN = 300;
export const CIRCLE_RADIUS = 60; 
export const GAME_DURATION = 1000;

class game implements game_interface{
    player : point = [400,400];
    target : point = [400,400];
    coins : point[] = []; 
    collected : boolean[] = [];
    t = 0;
    coin_mode : boolean = false; 
    circles : [point, number][] = [];  // 
    constructor(){
        this.reset();
    }  
    reset(){
        this.coins = []
        this.collected = [];
        for(let i=0; i < 1; i++){
            this.coins.push([randint(0, 600, "a" + i + Date.now()), randint(0, 600, "b" + i + Date.now())]);
            this.collected.push(false);
        }   
        this.circles = [];
    }  
    tick(){
        console.log(this.t)
        let evts : events_type = []; 
        this.player = moveTo(this.player, this.target, 10) as point;
        if(this.coin_mode){
            // collected coins?
            for(let [i, coin] of this.coins.entries()){
                if(this.collected[i] == false && dist(this.player,coin ) < 10){
                    this.collected[i] = true;
                    evts.push(coin);
                }  else {
                   // console.log([this.player,coin,dist(this.player,coin )])
                }

            }
        }
        else { 
            if(this.t % 60 == 0){
                this.circles.push([[randint(0, 600, "a" + Date.now()), randint(0, 600, "b" + Date.now())], this.t]);
            }
            // if player touched circle, reset
            for(let [circle, birthday] of this.circles){
                if(this.t >= birthday + CIRCLE_ACTIVATE && this.t <= birthday + CIRCLE_LIFESPAN){
                    if(dist(this.player, circle) < CIRCLE_RADIUS){
                        // hit by circle
                        this.circles = [];
                        this.t = 0; 
                    }
                }
            }
        }
        this.t ++; 
        return evts;
    }
}

export default game; 