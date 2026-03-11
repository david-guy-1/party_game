/*
game, draw_fn, anim_fn, sound_fn, add_event_listeners, button_click, prop_commands, prop_fns, display, reset_fn

*/

import _, { floor } from "lodash";
import { animation } from "../animations";
import { d_image } from "../canvasDrawing";
import GameDisplay from "../GameDisplay";
import { anim_fn_type, button_click_type, display_type, draw_fn_type, gamedata, init_type, point, prop_commands_type, props_to_run, reset_fn_type, sound_fn_type } from "../interfaces";
import game from "./game";
import { globalStore_type } from "./globalStore";
import { shelves, shop_map, shopping_floor, wall_img } from "./full_draws";

import { apply_matrix3, display_total, get_shape_d, translation_matrix, output as display_output } from "../total_draw";
import { displace_command } from "../rotation";
import { HEIGHT, WIDTH } from "./App";

export const SHOP_SCROLL_SPEED = 3;

export let draw_fn : draw_fn_type = function(g : game,globalStore : globalStore_type , events : any[] , canvas : string){
    let output : draw_command[] = []; 
    if(canvas == "main"){
        // wall and floor
        output.push(wall_img.output(0,0)); 
        output = output.concat(display_output(shopping_floor).map( x => displace_command(x, [0, HEIGHT-129])))
        //shelf , stands are 900 apart
        let amount = g.t*SHOP_SCROLL_SPEED; 
        while(amount > 1800){
            amount -= 900
        }
        output = output.concat(display_output(shelves).map( x => displace_command(x, [-amount, 0])))
        
        // food items
        for(let [item, height, t] of g.shop_items){
            let time_diff = g.t-t;
            let food_output = display_output(shop_map[item]);
            output = output.concat(food_output.map(x => displace_command(x, [WIDTH + 100 - time_diff *  SHOP_SCROLL_SPEED , 174 + 100 * height])));
        }
        //cleanup
        for(let i = g.shop_items.length-1; i >= 0; i--){
            let [item, height, t] = g.shop_items[i];
            let time_diff = g.t-t;
            if(time_diff * SHOP_SCROLL_SPEED > WIDTH + 200){
                g.shop_items.splice(i, 1);
            }
        }
    }
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
    let output : props_to_run =  ([] as props_to_run).concat(globalStore.props_to_run); 
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
    g.t = 0; 
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