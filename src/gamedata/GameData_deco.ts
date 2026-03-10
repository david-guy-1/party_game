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
import { HEIGHT, WIDTH } from "./App";
import { moveIntoRectangleBR } from "../lines";


const balloons : display_total = {"points":[["0",-7.305883765281237,-22.56293443731562],["1",-14.793883765281237,-2.906934437315499],["2",5.798116234718805,-2.906934437315499],["3",0.9199341190712005,-22.607101522003518],["4",-2.5373620586572088,-22.722578013769464],["5",-3.6746305381733464,-3.1265672898014145],["6",-3.220032114206731,-22.538898588464463],["7",25.36024974688854,-70.3008965873438],["8",-3.6094863515652094,-24.0739052748026],["9",-3.4407756161119494,-22.61459168359096],["10",-2.64797533009866,-22.60485375778353],["11",-3.6849223550429713,-22.39079050623735],["12",5.725256579740136,-396.2889918595568],["13",6.793642765119808,-396.21267856060103],["14",6.307696771549007,-424.47781507967784],["15",30.060660586663634,-425.6580345264162],["16",6.581141119151624,-396.99665814561],["17",6.471802077498069,-385.0631849679453],["18",5.229220136528307,-397.204751447025],["19",4.504243796449197,-395.1442923752216],["20",7.86202895049928,-395.1442923752216],["21",7.785715651543745,-397.1665947975472],["22",-3.1007514332051755,-436.8097675093197],["23",23.337410632149897,-380.5583588596287],["24",-1.1319521304660043,-435.4034822930777],["25",24.946034608359412,-388.1341813319473],["26",2.719228003911269,-436.72339810476853],["27",-0.32772329794676125,-433.67644680291016],["28",0.0792196417858193,-436.31122367177215],["29",17.216390126370342,-401.46660745423725]],"layers":[{"name":"base","shapes":[{"parent_layer":"base","type":"polygon","points":[["0",0,0],["1",0,0],["2",0,0],["3",0,0]],"name":"shape 0","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_linear","p0":"4","p1":"5","colorstops":[[0,"#887733"],[1,"#554411"]]}},{"parent_layer":"base","type":"ellipse","points":[["6",0,0],["3",0,0],["8",0,0]],"name":"shape 1","outline_visible":true,"visible":true,"tag":[],"fill":"#887733"},{"parent_layer":"base","type":"ellipse","points":[["9",0,0],["10",0,0],["11",0,0]],"name":"shape 2","outline_visible":true,"visible":true,"tag":[],"fill":"black"}]},{"name":"line","shapes":[{"parent_layer":"line","type":"polygon","points":[["9",0,0],["12",0,0],["13",0,0]],"name":"shape 3","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_linear","p0":"12","p1":"9","colorstops":[[0,"#ff00ff"],[1,"#aa00aa"]]}}]},{"name":"balloon","shapes":[{"parent_layer":"balloon","type":"ellipse","points":[["14",0,0],["15",0,0],["16",0,0]],"name":"balloon round part","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_radial","p0":"28","p1":"28","r0":0,"r1":100,"colorstops":[[0,"white"],[0.28,"yellow"]]}},{"parent_layer":"balloon","type":"polygon","points":[["18",0,0],["12",0,0],["19",0,0],["20",0,0],["13",0,0],["21",0,0]],"name":"balloon base","outline_visible":true,"visible":true,"tag":[],"fill":"#cccc00"}]}],"zoom":[-59.012354648528074,-492.81564694350783,6.191736422399997],"layer_visibility":{"base":true,"line":true,"balloon":true},"show_points":"shape","show_labels":true,"selected_layer":"balloon","total_points":30,"total_shapes":6,"message":"no shape selected","true_points":true,"selected_shape":"balloon round part","selected_point":"28"}

const ribbon : display_total = {"points":[["0",-3.7857038950172637,3.133333333333269],["1",-5.035703895017264,29.522222222222183],["2",-7.614814239286488,65.14009271288006],["3",-7.112467274265953,89.00157355135741],["4",-5.103079414183583,119.22611594676209],["5",-2.0889976240600845,137.25479035805608],["6",1.9297780961044282,165.88856736422895],["7",4.110187189611622,196.52659092636077],["8",1.8426488058382802,231.14046745131247],["9",-4.6674887791812125,274.9147959287741],["10",-10.992316150437546,318.19657630793995],["11",-11.751697312560282,348.07115031771355],["12",-12.623827460165444,365.74632130917826],["13",-5.660703895017207,347.5083333333332],["14",-3.7857038950172637,330.3555555555555],["15",-3.03039583650866,298.727964633208],["16",-0.5884314232141605,270.00581177207766],["17",2.3768110786434136,253.80357169656838],["18",5.690905639543075,229.86844431229326],["19",8.307296082358562,205.19685147004043],["20",8.089296104982736,181.25833333333333],["21",7.464296104982736,164.1055555555555],["22",3.7142961049827363,135.07777777777767],["23",-0.14217986928753135,118.58203271583318],["24",-1.537588105455825,102.74802536931276],["25",-2.758570312103018,68.87061430233865],["26",3.7142961049827363,50.63333333333327],["27",4.964296104982736,30.841666666666583],["28",5.244174995455296,19.805157924985963],["29",6.09207930562701,15.202248812625328],["30",6.818854428631312,3.1835416859059933],["31",9.410740262456898,3.543818624040739],["32",-5.346204181987616,370.7891889944111]],"layers":[{"name":"base","shapes":[{"parent_layer":"base","type":"bezier shape","points":[["0",0,0],["1",0,0],["2",0,0],["3",0,0],["4",0,0],["5",0,0],["6",0,0],["7",0,0],["8",0,0],["9",0,0],["10",0,0],["11",0,0],["12",0,0],["13",0,0],["14",0,0],["15",0,0],["16",0,0],["17",0,0],["18",0,0],["19",0,0],["20",0,0],["21",0,0],["22",0,0],["23",0,0],["24",0,0],["25",0,0],["26",0,0],["27",0,0],["28",0,0],["29",0,0],["30",0,0]],"name":"shape 0","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_linear","p0":"31","p1":"32","colorstops":[[0,"blue"],[0.2,"white"],[0.4,"blue"],[0.8,"white"],[1,"blue"]]}}]}],"zoom":[150,360,1],"layer_visibility":{"base":true},"show_points":"all","show_labels":false,"selected_layer":"base","total_points":33,"total_shapes":1,"message":"","true_points":true,"selected_shape":"shape 0","selected_point":"19"}

// starts at (0, 0), balloon height is 424

export let draw_fn : draw_fn_type = function(g : game,globalStore : globalStore_type , events : any[] , canvas : string){
    let output : draw_command[] = []; 
    if(canvas == "main"){
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
        let i=167;
        while(i < WIDTH){
            
            let b = JSON.parse(JSON.stringify(ribbon)) as display_total;
            apply_matrix3(b, translation_matrix(i, 0) ,"all");
            let color = ["red", "yellow", "green", "blue"][i%4];
            let shape = get_shape_d(b,"shape 0");
            if(shape?.fill && typeof shape.fill === "object" && "colorstops" in shape.fill){
                shape.fill.colorstops[0][1] = color;
                shape.fill.colorstops[2][1] = color
                shape.fill.colorstops[4][1] = color
            }
            output=output.concat(display_output(b))
            i+=185
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