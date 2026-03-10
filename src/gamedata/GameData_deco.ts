/*
game, draw_fn, anim_fn, sound_fn, add_event_listeners, button_click, prop_commands, prop_fns, display, reset_fn

*/

import _ from "lodash";
import { animation } from "../animations";
import { d_image } from "../canvasDrawing";
import GameDisplay from "../GameDisplay";
import { anim_fn_type, button_click_type, display_type, draw_fn_type, gamedata, init_type, point, point3d, prop_commands_type, props_to_run, reset_fn_type, sound_fn_type } from "../interfaces";
import game from "./game";
import { globalStore_type } from "./globalStore";
import { apply_matrix3, display_total, get_shape_d, translation_matrix, output as display_output } from "../total_draw";
import { HEIGHT, WIDTH } from "./App";
import { moveIntoRectangleBR, point_to_color } from "../lines";


const balloons : display_total = {"points":[["0",-7.305883765281237,-22.56293443731562],["1",-14.793883765281237,-2.906934437315499],["2",5.798116234718805,-2.906934437315499],["3",0.9199341190712005,-22.607101522003518],["4",-2.5373620586572088,-22.722578013769464],["5",-3.6746305381733464,-3.1265672898014145],["6",-3.220032114206731,-22.538898588464463],["7",25.36024974688854,-70.3008965873438],["8",-3.6094863515652094,-24.0739052748026],["9",-3.4407756161119494,-22.61459168359096],["10",-2.64797533009866,-22.60485375778353],["11",-3.6849223550429713,-22.39079050623735],["12",5.725256579740136,-396.2889918595568],["13",6.793642765119808,-396.21267856060103],["14",6.307696771549007,-424.47781507967784],["15",30.060660586663634,-425.6580345264162],["16",6.581141119151624,-396.99665814561],["17",6.471802077498069,-385.0631849679453],["18",5.229220136528307,-397.204751447025],["19",4.504243796449197,-395.1442923752216],["20",7.86202895049928,-395.1442923752216],["21",7.785715651543745,-397.1665947975472],["22",-3.1007514332051755,-436.8097675093197],["23",23.337410632149897,-380.5583588596287],["24",-1.1319521304660043,-435.4034822930777],["25",24.946034608359412,-388.1341813319473],["26",2.719228003911269,-436.72339810476853],["27",-0.32772329794676125,-433.67644680291016],["28",0.0792196417858193,-436.31122367177215],["29",17.216390126370342,-401.46660745423725]],"layers":[{"name":"base","shapes":[{"parent_layer":"base","type":"polygon","points":[["0",0,0],["1",0,0],["2",0,0],["3",0,0]],"name":"shape 0","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_linear","p0":"4","p1":"5","colorstops":[[0,"#887733"],[1,"#554411"]]}},{"parent_layer":"base","type":"ellipse","points":[["6",0,0],["3",0,0],["8",0,0]],"name":"shape 1","outline_visible":true,"visible":true,"tag":[],"fill":"#887733"},{"parent_layer":"base","type":"ellipse","points":[["9",0,0],["10",0,0],["11",0,0]],"name":"shape 2","outline_visible":true,"visible":true,"tag":[],"fill":"black"}]},{"name":"line","shapes":[{"parent_layer":"line","type":"polygon","points":[["9",0,0],["12",0,0],["13",0,0]],"name":"shape 3","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_linear","p0":"12","p1":"9","colorstops":[[0,"#ff00ff"],[1,"#aa00aa"]]}}]},{"name":"balloon","shapes":[{"parent_layer":"balloon","type":"ellipse","points":[["14",0,0],["15",0,0],["16",0,0]],"name":"balloon round part","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_radial","p0":"28","p1":"28","r0":0,"r1":100,"colorstops":[[0,"white"],[0.28,"yellow"]]}},{"parent_layer":"balloon","type":"polygon","points":[["18",0,0],["12",0,0],["19",0,0],["20",0,0],["13",0,0],["21",0,0]],"name":"balloon base","outline_visible":true,"visible":true,"tag":[],"fill":"#cccc00"}]}],"zoom":[-59.012354648528074,-492.81564694350783,6.191736422399997],"layer_visibility":{"base":true,"line":true,"balloon":true},"show_points":"shape","show_labels":true,"selected_layer":"balloon","total_points":30,"total_shapes":6,"message":"no shape selected","true_points":true,"selected_shape":"balloon round part","selected_point":"28"}

const ribbon : display_total = {"points":[["0",-3.7857038950172637,3.133333333333269],["1",-5.035703895017264,29.522222222222183],["2",-7.614814239286488,65.14009271288006],["3",-7.112467274265953,89.00157355135741],["4",-5.103079414183583,119.22611594676209],["5",-2.0889976240600845,137.25479035805608],["6",1.9297780961044282,165.88856736422895],["7",4.110187189611622,196.52659092636077],["8",1.8426488058382802,231.14046745131247],["9",-4.6674887791812125,274.9147959287741],["10",-10.992316150437546,318.19657630793995],["11",-11.751697312560282,348.07115031771355],["12",-12.623827460165444,365.74632130917826],["13",-5.660703895017207,347.5083333333332],["14",-3.7857038950172637,330.3555555555555],["15",-3.03039583650866,298.727964633208],["16",-0.5884314232141605,270.00581177207766],["17",2.3768110786434136,253.80357169656838],["18",5.690905639543075,229.86844431229326],["19",8.307296082358562,205.19685147004043],["20",8.089296104982736,181.25833333333333],["21",7.464296104982736,164.1055555555555],["22",3.7142961049827363,135.07777777777767],["23",-0.14217986928753135,118.58203271583318],["24",-1.537588105455825,102.74802536931276],["25",-2.758570312103018,68.87061430233865],["26",3.7142961049827363,50.63333333333327],["27",4.964296104982736,30.841666666666583],["28",5.244174995455296,19.805157924985963],["29",6.09207930562701,15.202248812625328],["30",6.818854428631312,3.1835416859059933],["31",9.410740262456898,3.543818624040739],["32",-5.346204181987616,370.7891889944111]],"layers":[{"name":"base","shapes":[{"parent_layer":"base","type":"bezier shape","points":[["0",0,0],["1",0,0],["2",0,0],["3",0,0],["4",0,0],["5",0,0],["6",0,0],["7",0,0],["8",0,0],["9",0,0],["10",0,0],["11",0,0],["12",0,0],["13",0,0],["14",0,0],["15",0,0],["16",0,0],["17",0,0],["18",0,0],["19",0,0],["20",0,0],["21",0,0],["22",0,0],["23",0,0],["24",0,0],["25",0,0],["26",0,0],["27",0,0],["28",0,0],["29",0,0],["30",0,0]],"name":"shape 0","outline_visible":true,"visible":true,"tag":[],"fill":{"type":"fill_linear","p0":"31","p1":"32","colorstops":[[0,"blue"],[0.2,"white"],[0.4,"blue"],[0.8,"white"],[1,"blue"]]}}]}],"zoom":[150,360,1],"layer_visibility":{"base":true},"show_points":"all","show_labels":false,"selected_layer":"base","total_points":33,"total_shapes":1,"message":"","true_points":true,"selected_shape":"shape 0","selected_point":"19"}


const dance = {"points":[["0",107,299],["1",27,546],["2",386,548],["3",290,335],["4",288,324],["5",287,321],["6",358,305],["7",31,570],["8",390,569],["9",117,315],["10",97,370],["11",160.97337748628274,373.15820687585756],["12",173.99421081961611,315.28783650548723],["13",191.15602994970294,313.34830389803403],["14",187,369],["15",257,368],["16",263.15909493598554,316.69728366483787],["17",290.039435442387,315.7419760230911],["18",281,367],["19",352,365],["20",346.41392818358497,316.57922096479206],["21",94.69698931184291,388.25671867855533],["22",75.69698931184291,443.25671867855533],["23",152.6969893118429,448.25671867855533],["24",159.5266182270235,388.59030564128966],["25",188.7334129759948,382.5411248840882],["26",178.55568201303174,448.06625728738015],["27",250.89364497599473,450.381072102195],["28",253.54822779080962,381.38371747668083],["29",278.06275968381374,383.08767838203056],["30",275.4924104080935,447.5377079046641],["31",350.9810935356655,450.31870070301807],["32",353.21386565089193,382.68580081001414],["33",74.96771905006878,455.0107017318246],["34",53.69698931184291,529.2567186785553],["35",140.93994127229098,527.3486646947875],["36",150.77790423525397,457.32551654663945],["37",175.44097007887535,461.89277477709214],["38",160.491124399863,533.2662315672156],["39",241.50964291838153,530.8549661351169],["40",249.70794538751733,465.75079946845017],["41",273.2402288196162,460.65004978120754],["42",258.6969893118429,535.2567186785553],["43",360.6969893118429,535.2567186785553],["44",354.0176207949248,463.46319278532275],["45",355.6969893118429,463.25671867855533],["46",149.3380426056244,345.0911248840883],["47",175.7380426056244,325.8911248840883],["48",160.13804260562438,382.2911248840883],["49",234.35748705006884,336.41056932853274],["50",252.29730186488368,328.3087174766809],["51",238.4084129759948,369.9753841433475],["52",314.7973018648837,360.7161248840883],["53",327.5287833463651,336.98927303223644],["54",295.7000796426614,331.20223599519943],["55",146.39452408710588,427.2670508100142],["56",157.96859816117995,404.69760636556975],["57",171.27878334636515,441.1559396989031],["58",222.20470927229107,405.27631006927345],["59",191.5334129759948,380.9707545137179],["60",214.10285742043922,397.7531619211253],["61",207.7371166796985,382.1281619211253],["62",189.21859816117995,407.0124211803846],["63",116.3019314945133,496.71149525445867],["64",124.40378334636515,450.41519895816236],["65",169.54267223525403,506.5494582174216],["66",245.35285742043922,480.507791550755],["67",233.20007964266145,451.57260636556975],["68",238.4084129759948,514.0726063655698],["69",343.7324870500688,501.3411248840883],["70",332.7371166796985,456.20223599519943],["71",306.69545001303186,533.7485322914956],["72",278.91767223525403,436.52631006927345],["73",303.5935981611799,412.3853635672158],["74",301.92693149451327,456.5520302338825],["75",271.92693149451327,418.21869690054916],["76",46.92693149451324,404.8853635672158],["77",47.76026482784657,441.5520302338825],["78",-3.906401838820102,403.21869690054916],["79",75.26026482784658,294.8853635672158],["80",68.5935981611799,344.8853635672158],["81",48.5935981611799,269.8853635672158],["82",147.76026482784658,254.8853635672158],["83",166.92693149451324,228.21869690054913],["84",122.76026482784658,286.5520302338825],["85",240.26026482784658,369.0520302338825],["86",229.42693149451327,394.0520302338825],["87",267.7602648278466,341.5520302338825],["88",258.5935981611799,253.21869690054913],["89",214.42693149451327,288.21869690054916],["90",226.0935981611799,234.8853635672158],["91",339.42693149451327,284.8853635672158],["92",339.42693149451327,321.5520302338825],["93",361.92693149451327,247.3853635672158],["94",389.42693149451327,324.0520302338825],["95",406.0935981611799,369.8853635672158],["96",368.5935981611799,335.71869690054916],["97",391.92693149451327,444.0520302338825],["98",397.7602648278466,414.0520302338825],["99",411.0935981611799,462.3853635672158],["100",252.76026482784658,433.21869690054916],["101",258.5935981611799,409.8853635672158],["102",251.92693149451327,462.3853635672158],["103",35.26026482784657,486.5520302338825],["104",28.593598161179898,457.3853635672158],["105",1.9269314945132408,501.5520302338825],["106",95.26026482784658,572.3853635672158],["107",105.26026482784658,532.3853635672158],["108",132.76026482784658,562.3853635672158],["109",195.26026482784658,564.8853635672158],["110",195.26026482784658,545.7186969005492],["111",211.92693149451327,558.2186969005492],["112",281.92693149451327,561.5520302338825],["113",275.2602648278466,533.2186969005492],["114",246.0935981611799,568.2186969005492],["115",212.03055816117984,614.087603567216],["116",200.5416692722909,578.4153813449939],["117",178.31944705006867,620.776492456105],["118",347.6305581611798,618.887603567216],["119",357.23055816117983,568.487603567216],["120",382.4305581611798,622.487603567216],["121",422.03055816117984,551.687603567216],["122",453.2305581611798,558.887603567216],["123",430.4305581611798,509.687603567216],["124",-12.369441838820165,603.287603567216],["125",-20.76944183882017,561.287603567216],["126",-45.96944183882016,610.487603567216],["127",-36.369441838820165,489.287603567216],["128",-62.76944183882016,473.687603567216],["129",-35.16944183882016,446.087603567216],["130",478.4305581611798,400.487603567216],["131",453.2305581611798,434.087603567216],["132",480.8305581611798,425.687603567216],["133",431.63055816117986,390.887603567216],["134",434.03055816117984,351.287603567216],["135",443.63055816117986,422.087603567216]],"layers":[{"name":"base","shapes":[{"parent_layer":"base","type":"polygon","points":[["0",0,0],["1",0,0],["2",0,0],["6",0,0]],"name":"shape 0","outline_visible":true,"visible":true,"tag":[],"fill":"#444444"},{"parent_layer":"base","type":"polygon","points":[["1",0,0],["7",0,0],["8",0,0],["2",0,0]],"name":"shape 1","outline_visible":true,"visible":true,"tag":[],"fill":"black"}]},{"name":"top","shapes":[{"parent_layer":"top","type":"polygon","points":[["9",0,0],["10",0,0],["11",0,0],["12",0,0]],"name":"shape 3","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"top","type":"polygon","points":[["13",0,0],["14",0,0],["15",0,0],["16",0,0]],"name":"shape 4","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"top","type":"polygon","points":[["17",0,0],["18",0,0],["19",0,0],["20",0,0]],"name":"shape 5","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"top","type":"polygon","points":[["21",0,0],["22",0,0],["23",0,0],["24",0,0]],"name":"shape 6","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"top","type":"polygon","points":[["25",0,0],["26",0,0],["27",0,0],["28",0,0]],"name":"shape 7","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"top","type":"polygon","points":[["29",0,0],["30",0,0],["31",0,0],["32",0,0]],"name":"shape 8","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"top","type":"polygon","points":[["33",0,0],["34",0,0],["35",0,0],["36",0,0]],"name":"shape 9","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"top","type":"polygon","points":[["37",0,0],["38",0,0],["39",0,0],["40",0,0]],"name":"shape 10","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"top","type":"polygon","points":[["41",0,0],["42",0,0],["43",0,0],["44",0,0]],"name":"shape 11","outline_visible":true,"visible":true,"tag":[],"fill":"black"}]},{"name":"ellipses","shapes":[{"parent_layer":"ellipses","type":"ellipse","points":[["46",0,0],["47",0,0],["48",0,0]],"name":"shape 13","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["49",0,0],["50",0,0],["51",0,0]],"name":"shape 14","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["51",0,0]],"name":"shape 15","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["52",0,0],["53",0,0],["54",0,0]],"name":"shape 16","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["55",0,0],["56",0,0],["57",0,0]],"name":"shape 17","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["58",0,0],["59",0,0]],"name":"shape 18","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["60",0,0],["61",0,0],["62",0,0]],"name":"shape 19","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["63",0,0],["64",0,0],["65",0,0]],"name":"shape 20","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["66",0,0],["67",0,0],["68",0,0]],"name":"shape 21","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["69",0,0],["70",0,0],["71",0,0]],"name":"shape 22","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["73",0,0],["74",0,0],["75",0,0]],"name":"shape 24","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["76",0,0],["77",0,0],["78",0,0]],"name":"shape 25","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["79",0,0],["80",0,0],["81",0,0]],"name":"shape 26","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["82",0,0],["83",0,0],["84",0,0]],"name":"shape 27","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["85",0,0],["86",0,0],["87",0,0]],"name":"shape 28","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["88",0,0],["89",0,0],["90",0,0]],"name":"shape 29","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["91",0,0],["92",0,0],["93",0,0]],"name":"shape 30","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["94",0,0],["95",0,0],["96",0,0]],"name":"shape 31","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["97",0,0],["98",0,0],["99",0,0]],"name":"shape 32","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["100",0,0],["101",0,0],["102",0,0]],"name":"shape 33","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["103",0,0],["104",0,0],["105",0,0]],"name":"shape 34","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["106",0,0],["107",0,0],["108",0,0]],"name":"shape 35","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["112",0,0],["113",0,0],["114",0,0]],"name":"shape 37","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["115",0,0],["116",0,0],["117",0,0]],"name":"shape 38","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["118",0,0],["119",0,0],["120",0,0]],"name":"shape 39","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["121",0,0],["122",0,0],["123",0,0]],"name":"shape 40","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["124",0,0],["125",0,0],["126",0,0]],"name":"shape 41","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["127",0,0],["128",0,0],["129",0,0]],"name":"shape 42","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["130",0,0],["131",0,0],["132",0,0]],"name":"shape 43","outline_visible":true,"visible":true,"tag":[],"fill":"black"},{"parent_layer":"ellipses","type":"ellipse","points":[["133",0,0],["134",0,0],["135",0,0]],"name":"shape 44","outline_visible":true,"visible":true,"tag":[],"fill":"black"}]}],"zoom":[6.097224827846446,263.83204801166056,1.44],"layer_visibility":{"base":true,"top":true,"ellipses":true},"show_points":"shape","show_labels":false,"selected_layer":"ellipses","total_points":136,"total_shapes":45,"message":"no shape selected","true_points":true,"selected_shape":"shape 38","selected_point":"117"};
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