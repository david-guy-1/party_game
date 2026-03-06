/*
game, draw_fn, anim_fn, sound_fn, add_event_listeners, button_click, prop_commands, prop_fns, display, reset_fn

*/

import _ from "lodash";
import { animation } from "../animations";
import { d_image } from "../canvasDrawing";
import GameDisplay from "../GameDisplay";
import { anim_fn_type, button_click_type, display_type, draw_fn_type, gamedata, init_type, point, prop_commands_type, props_to_run, reset_fn_type, sound_fn_type } from "../interfaces";
import game from "./game";
import { lincomb, point_to_color, unit_vector } from "../lines";
import star from "./animations";
import { globalStore_type } from "./globalStore";
import { changeSound } from "../Sound";
import { fade_wrap } from "../process_draws";




export let draw_fn : draw_fn_type = function(g : game,globalStore : globalStore_type , events : any[] , canvas : string){
    let output : draw_command[] = []; 
    if(canvas == "fade"&& globalStore.fading){
        return [[], false]
    }
    else if(canvas == "main"){ 
        output.push(d_image("images/katy.webp", 0,0))
        // coins
        for(let [i, item] of g.coins.entries()){
            if(g.collected[i] == false){
                output.push(d_image("images/coin1.png", item))
            }
        }
        output.push(d_image("images/player.png", g.player)); 
        return [output,true];
    }
    return [output,true];
}

export let anim_fn : anim_fn_type = function(g: game, globalStore: globalStore_type, events: any[]) {
    let output : animation<game>[] = [];
    for(let item of events ){
        for(let i = 0; i < 25; i++){
            item = item as point; 
            let p = lincomb(1, [0,0], Math.random() * 3 +2, unit_vector(Math.random() * 2 * Math.PI))
            output.push(new star(10, 5, item[0], item[1], p[0], p[1] , 0, Math.random(), [Math.random() * 128 + 128,Math.random() * 128 + 128,Math.random() * 128 + 128] , 60 + Math.random() * 60)); 
        }
    } 
    return output;
}

export let sound_fn : sound_fn_type = function(g : game, globalStore : globalStore_type ,events : any[]){
    if(events.length > 0){
        return [undefined, ["bang.mp3"]];
    }
    return ["no change",[]]
}

export let prop_commands : prop_commands_type = function(g : game,globalStore : globalStore_type, events : any[]){
    let output : props_to_run = ([] as props_to_run).concat(globalStore.props_to_run); 
    
    if(_.every(g.collected, x => x == true)){
        output.push(["switch", 0])
    }
            
    globalStore.props_to_run = [];
    return output; 
}

export let button_click : button_click_type = function(g : game,globalStore : globalStore_type, name : string){
    return []
}

export let reset_fn : reset_fn_type = function() {
    return ; 
}
export let init : init_type = function(g : game, globalStore : globalStore_type){
    changeSound("song.mp3");
    g.reset();
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