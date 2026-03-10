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
import { apply_matrix3, display_total, get_shape_d, translation_matrix, output as display_output } from "../total_draw";
import { HEIGHT } from "./App";


const balloons : display_total = {"points":[["0",-9.169330183550187,-40.82869940179944],["1",-24.145330183550186,-1.516699401799201],["2",17.038669816449897,-1.516699401799201],["3",7.282305585154688,-40.91703357117524],["4",0.3677132296978698,-41.14798655470713],["5",-1.9068237293344055,-1.955965106771032],["6",-0.9976268814011746,-40.78062770409713],["7",25.36024974688854,-70.3008965873438],["8",-1.7765353561181314,-43.8506410767734],["9",-1.4391138852116114,-40.93201389435012],["10",0.14648668681496702,-40.912538042735264],["11",-1.9274073630736552,-40.484411539642906],["12",6.225696834062603,-383.85691573958184],["13",7.751962813176419,-383.7478967410736],["14",7.057754250932419,-424.12666319689754],["15",40.990559701096174,-425.81269097795234],["16",7.448389033221872,-384.8678675768007],["17",6.471802077498069,-385.0631849679453],["18",5.517073343759989,-385.1651437216792],["19",4.48139285793269,-382.2216307619601],["20",9.278228792289951,-382.2216307619601],["21",9.169209793782045,-385.11063422242523],["22",-3.1007514332051755,-436.8097675093197],["23",23.337410632149897,-380.5583588596287],["24",-1.1319521304660043,-435.4034822930777],["25",24.946034608359412,-388.1341813319473],["26",2.719228003911269,-436.72339810476853],["27",-0.32772329794676125,-433.67644680291016],["28",-1.5886315684617216,-448.8601431330344],["29",22.641601900677188,-391.25350944626814]],"layers":[{"name":"base","shapes":[{"parent_layer":"base","type":"polygon","points":[["0",0,0],["1",0,0],["2",0,0],["3",0,0]],"name":"shape 0","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_linear","p0":"4","p1":"5","colorstops":[[0,"#887733"],[1,"#554411"]]}},{"parent_layer":"base","type":"ellipse","points":[["6",0,0],["3",0,0],["8",0,0]],"name":"shape 1","outline_visible":true,"visible":true,"tag":[],"fill":"#887733"},{"parent_layer":"base","type":"ellipse","points":[["9",0,0],["10",0,0],["11",0,0]],"name":"shape 2","outline_visible":true,"visible":true,"tag":[],"fill":"black"}]},{"name":"line","shapes":[{"parent_layer":"line","type":"polygon","points":[["9",0,0],["12",0,0],["13",0,0]],"name":"shape 3","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_linear","p0":"12","p1":"9","colorstops":[[0,"#ff00ff"],[1,"#aa00aa"]]}}]},{"name":"balloon","shapes":[{"parent_layer":"balloon","type":"ellipse","points":[["14",0,0],["15",0,0],["16",0,0]],"name":"balloon round part","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_radial","p0":"28","p1":"29","r0":0,"r1":100,"colorstops":[[0,"white"],[0.08,"yellow"]]}},{"parent_layer":"balloon","type":"polygon","points":[["18",0,0],["12",0,0],["19",0,0],["20",0,0],["13",0,0],["21",0,0]],"name":"balloon base","outline_visible":true,"visible":true,"tag":[],"fill":"#cccc00"}]}],"zoom":[0,0,1],"layer_visibility":{"base":true,"line":true,"balloon":true},"show_points":"shape","show_labels":true,"selected_layer":"balloon","total_points":30,"total_shapes":6,"message":"","true_points":true,"selected_shape":"balloon round part"};

// starts at (0, 0), balloon height is 424
export let draw_fn : draw_fn_type = function(g : game,globalStore : globalStore_type , events : any[] , canvas : string){
    let output : draw_command[] = []; 
    if(canvas == "main"){
        for(let balloon of g.balloons){
            let b = JSON.parse(JSON.stringify(balloons)) as display_total;
            b.selected_layer = "balloon"
            apply_matrix3(b, translation_matrix(balloon[0],HEIGHT) ,"all");
            apply_matrix3(b, translation_matrix(0,balloon[1] -HEIGHT+ 424), "layer");

            let shape = get_shape_d(b,"balloon round part");
            if(shape?.fill && typeof shape.fill === "object" && "colorstops" in shape.fill){
                shape.fill.colorstops[1][1] = Math.random() < 0.5 ? "red" : "yellow"
            }
            output=output.concat(display_output(b))
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