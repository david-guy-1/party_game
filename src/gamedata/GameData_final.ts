/*
game, draw_fn, anim_fn, sound_fn, add_event_listeners, button_click, prop_commands, prop_fns, display, reset_fn

*/

import _ from "lodash";
import { animation } from "../animations";
import { d_image } from "../canvasDrawing";
import GameDisplay from "../GameDisplay";
import { anim_fn_type, button_click_type, display_type, draw_fn_type, gamedata, init_type, point, prop_commands_type, props_to_run, reset_fn_type, sound_fn_type } from "../interfaces";
import game, { food_items } from "./game";
import { globalStore_type } from "./globalStore";
import { display_total, output as display_output, set_hue, apply_matrix3, matrix3, translation_matrix } from "../total_draw";
import { dance, dug_girl, shop_map } from "./full_draws";
import { displace_command } from "../rotation";
import { img_with_center } from "../process_draws";



export let draw_fn : draw_fn_type = function(g : game,globalStore : globalStore_type , events : any[] , canvas : string){
    let output : draw_command[] = []; 
    if(canvas == "main"){
        //draw the background
        output.push(d_image("room2.png", 0,0));
    } if(canvas == "front"){
        // draw the food items , start from 126, 519;
        let food_i = 0;
        for(let item of food_items){
            for(let j=0; j < g.items_total[item]; j++){
                //console.log("got here");
                let drawer = shop_map[item];
                let p = [126 + 30 * Math.floor(food_i/2), 519 + 30 * (food_i%2)]
                if(drawer instanceof img_with_center){
                    output.push(drawer.output(p[0], p[1]));
                } else if ( "layers" in drawer ){
                    output = output.concat(display_output(drawer).map(x => displace_command(x, p as point)));
                } else {
                    output = output.concat(drawer.map(x => displace_command(x, p as point)))
                }
                food_i ++;
            }
        }
        
        if(g.dance_selected){
            let dance_clone = JSON.parse(JSON.stringify(dance)) as display_total;
    
            dance_clone.layers[2].shapes.forEach(function(x,i){
                let seed = g.t/5 + 59*i;
                //move points
                for(let j=0; j < x.points.length; j++){
                    x.points[j][1] += 30 * Math.cos(seed)  
                    x.points[j][2] += 20 * Math.sin(seed * 0.9) + 5 * Math.sin(seed + j)
                }
                //adjust fill 
                x.fill = `hsla(${(seed * 10)%360}, ${80 + Math.sin(seed/2)*10}%, ${80 + Math.sin(seed/2)*10}%, 0.4)`
        
            }) 
            // squares
            dance_clone.layers[1].shapes.forEach(function(x, i){
                let seed = g.t/5 + 59*i;
                let seed2 = seed/3 + 60 * i;
                x.fill = `hsl(${(seed2* 10)%360}, ${80 + Math.sin(seed2)*10}%, ${80 + Math.sin(seed2)*10}%)`
                
            })
            let matrices : matrix3[] = [[[1, 0, -211.24455816117984], [0,1,-573.5731591227718],[0,0,1]],
            [[1,0,0],[0,0.2,0],[0,0,1]],
            [[1, 0, 211.24455816117984], [0,1,573.5731591227718],[0,0,1]], translation_matrix(400, 0)];
            matrices.forEach(x => apply_matrix3(dance_clone,x, "all")); 
            output = output.concat(display_output(dance_clone));
            
        }; 
        if(g.booth_selected){
            output.push(d_image("photobooth2.png",538, 0));
        }
        if(g.screen_selected){
            output.push(d_image("tv screen.png",707, 220));
        }
        if(g.paint_selected){
            output.push(d_image("painting2.png",485, 176));
        }            
        output.push(d_image("just table.png",0,0));
        // draw the girl and her friends
        let girl = JSON.parse(JSON.stringify(dug_girl)) as display_total;
        let selected_top = "top" + (g.selected_top);
        let selected_skirt = "skirt" + (g.selected_skirt);; 
        let selected_shoe = "shoe" + (g.selected_shoe);;
        let selected_necklace = "necklace" + (g.selected_necklace); // no +1 because no necklace is valid 
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
                    shape.visible = true; ``
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
        set_hue(girl, [selected_top], "tags", g.selected_top_color, 1);
        set_hue(girl, [selected_skirt], "tags", g.selected_skirt_color, 1);
        set_hue(girl, [selected_shoe], "tags", g.selected_shoe_color, 1);
        output =output.concat( display_output(girl).map(x => displace_command(x , [420, 0]))); 
        output =output.concat( d_image("friends.png", 0,0)); 

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