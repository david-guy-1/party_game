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


const balloons : display_total = {"points":[["0",-7.305883765281237,-22.56293443731562],["1",-14.793883765281237,-2.906934437315499],["2",5.798116234718805,-2.906934437315499],["3",0.9199341190712005,-22.607101522003518],["4",-2.5373620586572088,-22.722578013769464],["5",-3.6746305381733464,-3.1265672898014145],["6",-3.220032114206731,-22.538898588464463],["7",25.36024974688854,-70.3008965873438],["8",-3.6094863515652094,-24.0739052748026],["9",-3.4407756161119494,-22.61459168359096],["10",-2.64797533009866,-22.60485375778353],["11",-3.6849223550429713,-22.39079050623735],["12",5.725256579740136,-396.2889918595568],["13",6.793642765119808,-396.21267856060103],["14",6.307696771549007,-424.47781507967784],["15",30.060660586663634,-425.6580345264162],["16",6.581141119151624,-396.99665814561],["17",6.471802077498069,-385.0631849679453],["18",5.229220136528307,-397.204751447025],["19",4.504243796449197,-395.1442923752216],["20",7.86202895049928,-395.1442923752216],["21",7.785715651543745,-397.1665947975472],["22",-3.1007514332051755,-436.8097675093197],["23",23.337410632149897,-380.5583588596287],["24",-1.1319521304660043,-435.4034822930777],["25",24.946034608359412,-388.1341813319473],["26",2.719228003911269,-436.72339810476853],["27",-0.32772329794676125,-433.67644680291016],["28",0.0792196417858193,-436.31122367177215],["29",17.216390126370342,-401.46660745423725]],"layers":[{"name":"base","shapes":[{"parent_layer":"base","type":"polygon","points":[["0",0,0],["1",0,0],["2",0,0],["3",0,0]],"name":"shape 0","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_linear","p0":"4","p1":"5","colorstops":[[0,"#887733"],[1,"#554411"]]}},{"parent_layer":"base","type":"ellipse","points":[["6",0,0],["3",0,0],["8",0,0]],"name":"shape 1","outline_visible":true,"visible":true,"tag":[],"fill":"#887733"},{"parent_layer":"base","type":"ellipse","points":[["9",0,0],["10",0,0],["11",0,0]],"name":"shape 2","outline_visible":true,"visible":true,"tag":[],"fill":"black"}]},{"name":"line","shapes":[{"parent_layer":"line","type":"polygon","points":[["9",0,0],["12",0,0],["13",0,0]],"name":"shape 3","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_linear","p0":"12","p1":"9","colorstops":[[0,"#ff00ff"],[1,"#aa00aa"]]}}]},{"name":"balloon","shapes":[{"parent_layer":"balloon","type":"ellipse","points":[["14",0,0],["15",0,0],["16",0,0]],"name":"balloon round part","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_radial","p0":"28","p1":"28","r0":0,"r1":100,"colorstops":[[0,"white"],[0.28,"yellow"]]}},{"parent_layer":"balloon","type":"polygon","points":[["18",0,0],["12",0,0],["19",0,0],["20",0,0],["13",0,0],["21",0,0]],"name":"balloon base","outline_visible":true,"visible":true,"tag":[],"fill":"#cccc00"}]}],"zoom":[-59.012354648528074,-492.81564694350783,6.191736422399997],"layer_visibility":{"base":true,"line":true,"balloon":true},"show_points":"shape","show_labels":true,"selected_layer":"balloon","total_points":30,"total_shapes":6,"message":"no shape selected","true_points":true,"selected_shape":"balloon round part","selected_point":"28"}

// starts at (0, 0), balloon height is 424
export let draw_fn : draw_fn_type = function(g : game,globalStore : globalStore_type , events : any[] , canvas : string){
    let output : draw_command[] = []; 
    if(canvas == "main"){
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