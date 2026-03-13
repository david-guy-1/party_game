/*
game, draw_fn, anim_fn, sound_fn, add_event_listeners, button_click, prop_commands, prop_fns, display, reset_fn

*/

import _ from "lodash";
import { animation } from "../animations";
import { d_image } from "../canvasDrawing";
import GameDisplay from "../GameDisplay";
import { anim_fn_type, button_click_type, display_type, draw_fn_type, gamedata, init_type, point, prop_commands_type, props_to_run, reset_fn_type, sound_fn_type } from "../interfaces";
import game from "./game";
import { globalStore_type } from "./globalStore";
import { dug_girl } from "./full_draws";
import { display_total, recolor, set_hue,output as display_output } from "../total_draw";

const N_TOPS = 4;
const N_SKIRTS = 3;
const N_SHOES = 3;
const N_NECKLACES = 3; 

export let draw_fn : draw_fn_type = function(g : game,globalStore : globalStore_type , events : any[] , canvas : string){
    let output : draw_command[] = []; 
    if(canvas == "main"){
        let girl = JSON.parse(JSON.stringify(dug_girl)) as display_total;
        //top1 , skirt3, light pink top, yellow skirt
        let selected_top = "top" + (globalStore.selected_top);
        let selected_skirt = "skirt" + (globalStore.selected_skirt);; 
        let selected_shoe = "shoe" + (globalStore.selected_shoe);;
        let selected_necklace = "necklace" + (globalStore.selected_necklace); // no +1 because no necklace is valid 
        for(let layer of girl.layers){
            for(let shape of layer.shapes){
                if(_.some( shape.tag,x => /^top[0-9]/.test(x))){
                    shape.visible = false; 
                }
                if(shape.tag.indexOf(selected_top) != -1){
                    shape.visible = true; 
                }

                if(_.some( shape.tag,x => /^skirt[0-9]/.test(x))){
                    shape.visible = false; 
                }
                if(shape.tag.indexOf(selected_skirt) != -1){
                    shape.visible = true; 
                }
                if(_.some( shape.tag,x => /^shoe[0-9]/.test(x))){
                    shape.visible = false; 
                }
                if(shape.tag.indexOf(selected_shoe) != -1){
                    shape.visible = true; 
                }

                if(_.some( shape.tag,x => /^necklace[0-9]/.test(x))){
                    shape.visible = false; 
                }
                if(shape.tag.indexOf(selected_necklace) != -1){
                    shape.visible = true; 
                }

            }
        }
        set_hue(girl, [selected_top], "tags", globalStore.selected_top_color, 1);
        set_hue(girl, [selected_skirt], "tags", globalStore.selected_skirt_color, 1);
        set_hue(girl, [selected_shoe], "tags", globalStore.selected_shoe_color, 1);
        console.log(globalStore);
        output = display_output(girl); 
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
    switch(name){
        case "top":
            globalStore.selected_top ++; 
            if(globalStore.selected_top == N_TOPS + 1){
                globalStore.selected_top = 1; 
            }
            break;
        case "skirt":
            globalStore.selected_skirt ++; 
            if(globalStore.selected_skirt == N_SKIRTS + 1){
                globalStore.selected_skirt = 1; 
            }
            break;
        case "shoe":
            globalStore.selected_shoe ++; 
            if(globalStore.selected_shoe == N_SHOES + 1){
                globalStore.selected_shoe = 1; 
            }
            break;
        case "necklace":
            globalStore.selected_necklace ++; 
            if(globalStore.selected_necklace == N_NECKLACES + 1){
                globalStore.selected_necklace = 0; 
            }
            break;
        case "top color":
            globalStore.selected_top_color += 30;
            break;
        case "skirt color":
            globalStore.selected_skirt_color += 30;
            break;
        case "shoe color":
            globalStore.selected_shoe_color += 30;
            break;
                    
        
    }
    return []
}

export let reset_fn : reset_fn_type = function() {
    return ; 
}
export let init : init_type = function(g : game, globalStore : globalStore_type){
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