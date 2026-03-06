/*
game, draw_fn, anim_fn, sound_fn, add_event_listeners, button_click, prop_commands, prop_fns, display, reset_fn

*/

import _ from "lodash";
import { animation } from "../animations";
import { d_circle, d_image, d_rect2 } from "../canvasDrawing";
import GameDisplay from "../GameDisplay";
import { anim_fn_type, button_click_type, display_type, draw_fn_type, gamedata, init_type, point, prop_commands_type, props_to_run, reset_fn_type, sound_fn_type } from "../interfaces";
import game, { CIRCLE_ACTIVATE, CIRCLE_LIFESPAN, CIRCLE_RADIUS, GAME_DURATION } from "./game";
import { combine_obj, point_to_color, rescale } from "../lines";

import { globalStore_type } from "./globalStore";
import { changeSound } from "../Sound";


export let draw_fn : draw_fn_type = function(g : game,globalStore : globalStore_type , events : any[] , canvas : string){
    let output : draw_command[] = []; 
    output.push(d_image("images/sahher.jpg", 0,0))
    // circles
    for(let item of g.circles){
        let circ = d_circle(item[0], CIRCLE_RADIUS);
        circ.fill = true;
        if(g.t < item[1] + CIRCLE_ACTIVATE){
            // inactive circle
            circ.color = "blue"
            output.push(circ)
        } else if(g.t < item[1] + CIRCLE_LIFESPAN){
            circ.color = "red"
            output.push(circ)
        }
    }
    // duration 
    output.push(combine_obj( d_rect2(0, 0, GAME_DURATION/2, 10), {color:point_to_color([0, 0, 0]), fill:true}) as draw_command); 
    output.push(combine_obj( d_rect2(0, 0, g.t/2, 10), {color:point_to_color([255- rescale(0, GAME_DURATION, 0, 255, g.t) , 255, rescale(0, GAME_DURATION, 0, 255, g.t) ]), fill:true}) as draw_command);
    output.push(d_image("images/player.png", g.player)); 
    return [output,true];
}

export let anim_fn : anim_fn_type = function(g: game, globalStore: globalStore_type, events: any[]) {
    let output : animation<game>[] = []; 
    return output;
}

export let sound_fn : sound_fn_type = function(g : game, globalStore : globalStore_type ,events : any[]){
    return ["no change",[]]
}

export let prop_commands : prop_commands_type = function(g : game,globalStore : globalStore_type, events : any[]){
    let output : props_to_run = []; 
    if(g.t >= GAME_DURATION){
        output.push( ["switch", 0]);
    }
    return output; 
}

export let button_click : button_click_type = function(g : game,globalStore : globalStore_type, name : string){
    if(name == "b1"){
        globalStore.display.text.push(["Hello", 100 + globalStore.display.text.length , 100 + globalStore.display.text.length*30, {zIndex:3}])
        return([["rerender",0]]);
    }
    return []
}

export let reset_fn : reset_fn_type = function() {
    return ; 
}
export let init : init_type = function(g : game, globalStore : globalStore_type){
    changeSound("Frost-Waltz.mp3");
    return ;
}


export let data_obj : gamedata =  {
    draw_fn: draw_fn,
    anim_fn: anim_fn,
    sound_fn: sound_fn,
    init: init,
    button_click: button_click,
    prop_commands: prop_commands,
    reset_fn: reset_fn,
    prop_fns: {}
}