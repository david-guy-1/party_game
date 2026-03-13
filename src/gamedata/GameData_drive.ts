/*
game, draw_fn, anim_fn, sound_fn, add_event_listeners, button_click, prop_commands, prop_fns, display, reset_fn

*/

import _ from "lodash";
import { animation } from "../animations";
import { add_com, d_circle, d_image } from "../canvasDrawing";
import GameDisplay from "../GameDisplay";
import { anim_fn_type, button_click_type, display_type, draw_fn_type, gamedata, init_type, point, prop_commands_type, props_to_run, reset_fn_type, sound_fn_type } from "../interfaces";
import game from "./game";
import { globalStore_type } from "./globalStore";
import { dist, lerp, lincomb } from "../lines";
import { display_total, output as display_output } from "../total_draw";
import { displace_command, rotate_command } from "../rotation";
import X from "./animations";


/*math problem : 
    given a set of points, and a total distance travelled, get the index of the previous point, and the current location 
*/

function get_position(points : point[], distance : number ) : [number, point ] | "end" {
    let current = 0;
    let path_length = 0
    while(true){
        path_length = dist(points[current], points[current + 1]);
        if(path_length < distance){
            current++;
            if(current+1 == points.length){
                return "end";
            }
            distance = distance - path_length; 
        } else {
            break; 
        }
    }
    return [current, lerp(points[current], points[current+1], 1 -distance/path_length) as point]
}
const points :point[]= [[-1,84], [643,119],[637, 264], [87, 273], [84, 496],[686,542]]

// 2160 total distance 

const lights  : number[] = [300, 700, 1200, 1450, 1800]; // odd numbers : to the right, even numbers : above

const red_light  : display_total = {"points":[["0",-7,28],["1",19.85403806584364,29.310185185185176],["2",21.46154835390948,-0.026877572016474005],["3",21.079678173257246,-26.14325852381006],["4",21.863425925925938,-45.84092078189302],["5",-6.669881687242793,-44.63528806584363],["6",-2.831497534296121,-30.66067934152373],["7",-3.9219094558132124,-27.85676297190835],["8",-2.5199512710055227,-25.52016599722887],["9",-0.1833542963260424,-28.557742064312194],["10",6.0475709694859106,-29.803927117474586],["11",11.51146933507641,-29.630084302558423],["12",15.952872864547171,-28.149616459401503],["13",18.10628063641178,-25.861620701795356],["14",19.36617372515896,-30.42701964405578],["15",16.222048836030243,-33.12937193183841],["16",11.032311182135473,-35.0223270275921],["17",3.974542133550276,-34.87901574647841],["18",-1.1958796520204835,-32.76361661873526],["19",-2.831497534296121,-10.660679341523728],["20",-3.9219094558132124,-7.856762971908349],["21",-2.5199512710055227,-5.520165997228869],["22",-0.1833542963260424,-8.557742064312194],["23",6.0475709694859106,-9.803927117474586],["24",11.51146933507641,-9.630084302558423],["25",15.952872864547171,-8.149616459401503],["26",18.10628063641178,-5.861620701795356],["27",19.36617372515896,-10.427019644055779],["28",16.222048836030243,-13.129371931838413],["29",11.032311182135473,-15.022327027592098],["30",3.974542133550276,-14.879015746478409],["31",-1.1958796520204835,-12.763616618735263],["32",-2.831497534296121,9.339320658476272],["33",-3.9219094558132124,12.14323702809165],["34",-2.5199512710055227,14.479834002771131],["35",-0.1833542963260424,11.442257935687806],["36",6.0475709694859106,10.196072882525414],["37",11.51146933507641,10.369915697441577],["38",15.952872864547171,11.850383540598497],["39",18.10628063641178,14.138379298204644],["40",19.36617372515896,9.572980355944221],["41",16.222048836030243,6.8706280681615866],["42",11.032311182135473,4.977672972407902],["43",3.974542133550276,5.120984253521591],["44",-1.1958796520204835,7.236383381264737],["45",7.365461510607258,-21.937707977500814],["46",-3.065107384361948,-22.162021287070047],["47",7.253304855822645,-28.21848064543926],["48",14.377495567741398,-22.337882921772312]],"layers":[{"name":"base","shapes":[{"parent_layer":"base","type":"polygon","points":[["0",0,0],["1",0,0],["2",0,0],["3",0,0],["4",0,0],["5",0,0]],"name":"shape 0","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"base","type":"bezier shape","points":[["6",0,0],["7",0,0],["8",0,0],["9",0,0],["10",0,0],["11",0,0],["12",0,0],["13",0,0],["14",0,0],["15",0,0],["16",0,0],["17",0,0],["18",0,0]],"name":"shape 1","outline_visible":true,"visible":true,"tag":[],"fill":"#444444"},{"parent_layer":"base","type":"bezier shape","points":[["19",0,0],["20",0,0],["21",0,0],["22",0,0],["23",0,0],["24",0,0],["25",0,0],["26",0,0],["27",0,0],["28",0,0],["29",0,0],["30",0,0],["31",0,0]],"name":"shape 1 (clone)","outline_visible":true,"visible":true,"tag":[],"fill":"#444444"},{"parent_layer":"base","type":"bezier shape","points":[["32",0,0],["33",0,0],["34",0,0],["35",0,0],["36",0,0],["37",0,0],["38",0,0],["39",0,0],["40",0,0],["41",0,0],["42",0,0],["43",0,0],["44",0,0]],"name":"shape 1 (clone) (clone)","outline_visible":true,"visible":true,"tag":[],"fill":"#444444"},{"parent_layer":"base","type":"ellipse","points":[["45",0,0],["46",0,0],["47",0,0]],"name":"shape 2","outline_visible":true,"visible":true,"tag":[],"fill":"red"}]}],"zoom":[-54.56564875498063,-76.3309937883243,5.159780351999999],"layer_visibility":{"base":true},"show_points":"shape","show_labels":false,"selected_layer":"base","total_points":49,"total_shapes":3,"message":"no shape selected","true_points":true,"selected_shape":"shape 2","selected_point":"47"}
const green_light : display_total = {"points":[["0",-7,28],["1",19.85403806584364,29.310185185185176],["2",21.46154835390948,-0.026877572016474005],["3",21.079678173257246,-26.14325852381006],["4",21.863425925925938,-45.84092078189302],["5",-6.669881687242793,-44.63528806584363],["6",-2.831497534296121,-30.66067934152373],["7",-3.9219094558132124,-27.85676297190835],["8",-2.5199512710055227,-25.52016599722887],["9",-0.1833542963260424,-28.557742064312194],["10",6.0475709694859106,-29.803927117474586],["11",11.51146933507641,-29.630084302558423],["12",15.952872864547171,-28.149616459401503],["13",18.10628063641178,-25.861620701795356],["14",19.36617372515896,-30.42701964405578],["15",16.222048836030243,-33.12937193183841],["16",11.032311182135473,-35.0223270275921],["17",3.974542133550276,-34.87901574647841],["18",-1.1958796520204835,-32.76361661873526],["19",-2.831497534296121,-10.660679341523728],["20",-3.9219094558132124,-7.856762971908349],["21",-2.5199512710055227,-5.520165997228869],["22",-0.1833542963260424,-8.557742064312194],["23",6.0475709694859106,-9.803927117474586],["24",11.51146933507641,-9.630084302558423],["25",15.952872864547171,-8.149616459401503],["26",18.10628063641178,-5.861620701795356],["27",19.36617372515896,-10.427019644055779],["28",16.222048836030243,-13.129371931838413],["29",11.032311182135473,-15.022327027592098],["30",3.974542133550276,-14.879015746478409],["31",-1.1958796520204835,-12.763616618735263],["32",-2.831497534296121,9.339320658476272],["33",-3.9219094558132124,12.14323702809165],["34",-2.5199512710055227,14.479834002771131],["35",-0.1833542963260424,11.442257935687806],["36",6.0475709694859106,10.196072882525414],["37",11.51146933507641,10.369915697441577],["38",15.952872864547171,11.850383540598497],["39",18.10628063641178,14.138379298204644],["40",19.36617372515896,9.572980355944221],["41",16.222048836030243,6.8706280681615866],["42",11.032311182135473,4.977672972407902],["43",3.974542133550276,5.120984253521591],["44",-1.1958796520204835,7.236383381264737],["45",7.365461510607258,17.65348892381339],["46",-3.065107384361948,17.42917561424416],["47",7.253304855822645,11.372716255874959],["48",14.377495567741398,-22.337882921772312]],"layers":[{"name":"base","shapes":[{"parent_layer":"base","type":"polygon","points":[["0",0,0],["1",0,0],["2",0,0],["3",0,0],["4",0,0],["5",0,0]],"name":"shape 0","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"base","type":"bezier shape","points":[["6",0,0],["7",0,0],["8",0,0],["9",0,0],["10",0,0],["11",0,0],["12",0,0],["13",0,0],["14",0,0],["15",0,0],["16",0,0],["17",0,0],["18",0,0]],"name":"shape 1","outline_visible":true,"visible":true,"tag":[],"fill":"#444444"},{"parent_layer":"base","type":"bezier shape","points":[["19",0,0],["20",0,0],["21",0,0],["22",0,0],["23",0,0],["24",0,0],["25",0,0],["26",0,0],["27",0,0],["28",0,0],["29",0,0],["30",0,0],["31",0,0]],"name":"shape 1 (clone)","outline_visible":true,"visible":true,"tag":[],"fill":"#444444"},{"parent_layer":"base","type":"bezier shape","points":[["32",0,0],["33",0,0],["34",0,0],["35",0,0],["36",0,0],["37",0,0],["38",0,0],["39",0,0],["40",0,0],["41",0,0],["42",0,0],["43",0,0],["44",0,0]],"name":"shape 1 (clone) (clone)","outline_visible":true,"visible":true,"tag":[],"fill":"#444444"},{"parent_layer":"base","type":"ellipse","points":[["45",0,0],["46",0,0],["47",0,0]],"name":"shape 2","outline_visible":true,"visible":true,"tag":[],"fill":"green"}]}],"zoom":[-12.789865137066823,-8.122528893680848,12.839184645488636],"layer_visibility":{"base":true},"show_points":"shape","show_labels":false,"selected_layer":"base","total_points":49,"total_shapes":3,"message":"","true_points":true,"selected_shape":"shape 2","selected_point":"47"}

const car : display_total = {"points":[["0",12,8],["1",-13.427771604938187,6.893759259259291],["2",2.677184541903678,-10.067826279657298],["3",12.61389506172847,-9.98509876543207],["4",10.434686497839557,-9.413579126747043],["5",0.15365980924983802,-10.161290158644476],["6",-4.426070261121943,-9.693970763708581],["7",-10.781614032250136,-10.067826279657298],["8",-13.772458159839871,-8.198548699913712],["9",-17.88486883527576,-6.235807241182947],["10",-18.539115988186015,-3.9926741454906445],["11",-18.819507625147555,0.21320040893242265],["12",-18.819507625147555,2.643261262599083],["13",-18.912971504134735,5.727569269175998],["14",-16.015591255532176,8.531485638791377],["15",-13.118211006929617,10.868082613470857],["16",-10.033903000352701,11.428865887393933],["17",-3.958750866186051,12.083113040304188],["18",6.789595217339567,12.643896314227266],["19",11.369325287711348,11.802721403342652],["20",19.29132367066466,7.32019376711753],["21",22.252259356978506,3.686318152096007],["22",22.656023314203118,-1.2934373203409066],["23",20.50261554233851,-4.254373006654745],["24",16.19579999860928,-7.48448466445166],["25",-10.280647640878854,-4.747862287707051],["26",-10.280647640878854,6.280875432780103],["27",-16.07540813808397,4.5050617320236945],["28",-15.701552622135253,-3.0655124659378252],["29",10.094477978326225,-4.560934529732695],["30",10.001014099339045,6.280875432780103],["31",17.268765329382106,3.7386579243288267],["32",16.595825400674414,-3.1253293484896183],["33",-10.725685247064174,-3.636165525481946],["34",-7.26752172453854,-5.318515347251175],["35",0.4899802313973396,-5.318515347251175],["36",6.7520601235383495,-5.318515347251175],["37",9.18212097720501,-5.318515347251175],["38",11.33179019391013,-3.729629404469126],["39",10.957934677961418,5.242902978300084],["40",6.938987881512709,6.831788921082129],["41",0.30305247342298003,6.831788921082129],["42",-5.77209966074367,7.205644437030848],["43",-9.230263183269308,6.271005647159054],["44",-11.473396278961609,5.149439099312904],["45",-1.4731558526002644,-6.202205938199516],["46",-1.4731558526002644,-8.084464612246876],["47",-8.807474134233084,-8.538802912878998],["48",-10.105583564610574,-6.072394995161767],["49",1.8370231948623328,-6.461827824275014],["50",1.9668341379000829,-8.214275555284626],["51",9.301152419532901,-8.2791810268035],["52",9.430963362570651,-6.267111409718391],["53",3.9139982834663165,8.271714210509497],["54",3.65437639739082,10.608311185188981],["55",11.378127508136888,9.829445526962484],["56",10.534356378391518,7.363037609245254],["57",-2.7712652829777547,8.46643062506612],["58",-3.030887169053255,10.478500242151231],["59",-9.586339792459578,9.894350998481361],["60",-9.910867150053951,7.622659495320754]],"layers":[{"name":"base","shapes":[{"parent_layer":"base","type":"bezier shape","points":[["4",0,0],["5",0,0],["6",0,0],["7",0,0],["8",0,0],["9",0,0],["10",0,0],["11",0,0],["12",0,0],["13",0,0],["14",0,0],["15",0,0],["16",0,0],["17",0,0],["18",0,0],["19",0,0],["20",0,0],["21",0,0],["22",0,0],["23",0,0],["24",0,0],["4",0,0]],"name":"shape 1","outline_visible":true,"visible":true,"tag":[],"fill":"#444444"},{"parent_layer":"base","type":"polygon","points":[["33",0,0],["34",0,0],["35",0,0],["36",0,0],["37",0,0],["38",0,0],["39",0,0],["40",0,0],["41",0,0],["42",0,0],["43",0,0],["44",0,0]],"name":"shape 4","outline_visible":true,"visible":true,"tag":[],"fill":"#888888"},{"parent_layer":"base","type":"polygon","points":[["25",0,0],["26",0,0],["27",0,0],["28",0,0]],"name":"shape 2","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"base","type":"polygon","points":[["29",0,0],["30",0,0],["31",0,0],["32",0,0]],"name":"shape 3","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"base","type":"polygon","points":[["45",0,0],["46",0,0],["47",0,0],["48",0,0]],"name":"shape 5","outline_visible":true,"visible":true,"tag":[],"fill":"#888888"},{"parent_layer":"base","type":"polygon","points":[["49",0,0],["50",0,0],["51",0,0],["52",0,0]],"name":"shape 6","outline_visible":true,"visible":true,"tag":[],"fill":"#888888"},{"parent_layer":"base","type":"polygon","points":[["53",0,0],["54",0,0],["55",0,0],["56",0,0]],"name":"shape 7","outline_visible":true,"visible":true,"tag":[],"fill":"#888888"},{"parent_layer":"base","type":"polygon","points":[["57",0,0],["58",0,0],["59",0,0],["60",0,0]],"name":"shape 8","outline_visible":true,"visible":true,"tag":[],"fill":"#888888"}]}],"zoom":[-40.17166724973297,-43.29075607495164,7.430083706879999],"layer_visibility":{"base":true},"show_points":"all","show_labels":false,"selected_layer":"base","total_points":61,"total_shapes":9,"message":"","true_points":true,"selected_shape":"shape 8"};

function get_light_at(g : game, i : number){ // true = red, false = green 
    return g.lights[i] % 200 > 100
}

export let draw_fn : draw_fn_type = function(g : game,globalStore : globalStore_type , events : any[] , canvas : string){
    let output : draw_command[] = []; 
    if(canvas == "main"){
        output.push(d_image("bakery.png",0,0))
        let pos = get_position(points, g.progress);
        if(pos != "end"){
            let diff = lincomb(1, points[pos[0]+1], -1, points[pos[0]])
            let angle = Math.atan2(diff[1], diff[0]);
            let car_disp = display_output(car);
            output = output.concat(car_disp.map(x => displace_command(rotate_command(x, [0,0], angle) , pos[1])));
        }
        for(let [i,light] of lights.entries()){
            let pos = get_position(points, light);
            if(pos != "end"){
                let color = get_light_at(g, i);
                let display : draw_command[] = []
                if(color){
                    display = display_output(red_light);
                } else {
                    display = display_output(green_light);
                }
                let display_point : point = [0,0];
                if(i%2 == 0){
                    display_point = lincomb(1, pos[1], 1, [0, -60]) as point;;
                } else {
                    display_point = lincomb(1, pos[1], 1, [40, 0]) as point;;
                }
                output = output.concat(display.map(x => displace_command(x, display_point)));
                output.push(add_com(d_circle(pos[1], 5),{"fill":true, "color":"black"}) );
            }
        }
    }
    return [output,true];
}

export let anim_fn : anim_fn_type = function(g: game, globalStore: globalStore_type, events: any[]) {
    let output : animation<game>[] = []; 

    if(globalStore.mousedown){
        g.progress +=1; 
    }
    // check if ran a red light;
    for(let [i, light] of lights.entries()){
        if(Math.abs(g.progress - light) < 3 ){
            if(get_light_at(g, i)){
                g.progress = 0;
                let location = get_position(points, lights[i]);
                if(location != "end"){ 
                    //console.log(["ran red light", points[i], i, points])
                    output.push(new X(location[1][0], location[1][1]) )
                }
            }
        }
    }
    return output;
}

export let sound_fn : sound_fn_type = function(g : game, globalStore : globalStore_type ,events : any[]){
    return ["no change",[]]
}

export let prop_commands : prop_commands_type = function(g : game,globalStore : globalStore_type, events : any[]){
    let output : props_to_run =  ([] as props_to_run).concat(globalStore.props_to_run); 
    globalStore.props_to_run = [];
    let pos = get_position(points, g.progress);
    if(pos == "end"){
        return [["finish", 0]];
    }
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