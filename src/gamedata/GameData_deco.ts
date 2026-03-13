/*
game, draw_fn, anim_fn, sound_fn, add_event_listeners, button_click, prop_commands, prop_fns, display, reset_fn

*/

import _ from "lodash";
import { animation } from "../animations";
import { d_image } from "../canvasDrawing";
import GameDisplay from "../GameDisplay";
import { anim_fn_type, button_click_type, display_type, draw_fn_type, gamedata, init_type, point, point3d, prop_commands_type, props_to_run, reset_fn_type, sound_fn_type } from "../interfaces";
import game from "./game";
import { globalStore_type, party_modes } from "./globalStore";
import { apply_matrix3, display_total, get_shape_d, translation_matrix, output as display_output } from "../total_draw";
import { HEIGHT, WIDTH } from "./App";
import { moveIntoRectangleBR, point_to_color } from "../lines";
import { balloons, flower_draw, ribbon_draw , banner, banner_image, wall} from "./full_draws";


export let draw_fn : draw_fn_type = function(g : game,globalStore : globalStore_type , events : any[] , canvas : string){
    let output : draw_command[] = []; 
    if(canvas == "main"){
        output = display_output(wall);
        // banner
        let banner_being_moved = (globalStore.party_mode == "Move Banner" && globalStore.mousedown  == true); 
        output.push(banner_image.output(30, banner_being_moved ? globalStore.mouse[1] - globalStore.banner_diff : g.banner_height ));
        g.banner_height = moveIntoRectangleBR(g.banner_height, 0, 0, 1, HEIGHT-395, 0)[0]
        //balloons
        for(let [i,balloon] of g.balloons.entries()){
            let pt = balloon; 
            if(globalStore.clicked_balloon == i){
                pt = globalStore.mouse;
            }
            let b = JSON.parse(JSON.stringify(balloons)) as display_total;
            b.selected_layer = "balloon"
            apply_matrix3(b, translation_matrix(pt[0],HEIGHT) ,"all");
            apply_matrix3(b, translation_matrix(0,pt[1] -HEIGHT+ 424), "layer");

            let shape = get_shape_d(b,"balloon round part");
            if(shape?.fill && typeof shape.fill === "object" && "colorstops" in shape.fill){
                shape.fill.colorstops[1][1] = g.balloon_colors[i];
            }
            output=output.concat(display_output(b))
            g.balloons[i] = moveIntoRectangleBR(g.balloons[i],0, 0, WIDTH,HEIGHT) as point;
        }
        //ribbons
        for(let [i,[ribbon, color]] of _.zip(g.ribbons, g.ribbons_colors).entries()){
            if(i == globalStore.clicked_ribbon){
                ribbon = globalStore.mouse[0];
            }
            let b = JSON.parse(JSON.stringify(ribbon_draw)) as display_total;
            apply_matrix3(b, translation_matrix(ribbon!, 0) ,"all");
            let shape = get_shape_d(b,"shape 0");
            if(shape?.fill && typeof shape.fill === "object" && "colorstops" in shape.fill){
                shape.fill.colorstops[0][1] = color!;
                shape.fill.colorstops[2][1] = color!;
                shape.fill.colorstops[4][1] = color!;
            }
            output=output.concat(display_output(b))   
            g.ribbons[i] = moveIntoRectangleBR(g.ribbons[i],0,0, 1, WIDTH, 0)[0];         
        }
        
        //flowers
        for(let [i,[flower, color]] of _.zip(g.flowers, g.flowers_colors).entries()){
            if(i == globalStore.clicked_flower){
                flower = globalStore.mouse[0];
            }
            let b = JSON.parse(JSON.stringify(flower_draw)) as display_total;
            apply_matrix3(b, translation_matrix(0, HEIGHT) ,"all");
            apply_matrix3(b, translation_matrix(flower!, 0) ,"all");
            let shape = get_shape_d(b,"shape 4");
            if(shape?.fill && typeof shape.fill === "object" && "colorstops" in shape.fill){
                shape.fill.colorstops[2][1] = color!;
            }
            output=output.concat(display_output(b))     
            
            g.flowers[i] = moveIntoRectangleBR(g.flowers[i],0,0, 1, WIDTH, 0)[0];       
        }
/*
        // dance floor
        let b = JSON.parse(JSON.stringify(dance)) as display_total;
        let random_color = () => [Math.random()*180+76,Math.random()*180+76,Math.random()*180+76] ;
        for(let shape of b.layers[1].shapes){
            shape.fill = point_to_color(random_color() as point3d);
        }
        for(let shape of b.layers[2].shapes){
            let c = random_color();
            shape.fill = `rgba(${c[0]},${c[1]},${c[2]},0.5)`;
        }
        apply_matrix3(b, translation_matrix(100, -100),"all");
        output=output.concat(display_output(b))
*/
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
    if(name.indexOf("change_mode")!=-1){
        globalStore.party_mode = name.split("|")[1] as party_modes; 
        globalStore.display.text[0] = [`Current Mode : ${globalStore.party_mode}`, WIDTH-300, HEIGHT+10]
        return [["rerender", 0]];
    }
    if(name == "next" && globalStore.display.refs ){
        let canvas =  globalStore.display.refs.current["main"];
        let s = canvas.toDataURL('image/png');
        return [["next", s]];
    }
    // catch all , in case all else fails
    return [[name, ""]]
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