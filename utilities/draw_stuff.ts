
import { add_com, d_bezier, d_circle, d_line, d_smoothbezier, d_text, drawLine, drawPolygon, dist, flatten, lincomb, draw_wrap, draw_command, drawBezierCurve_command, drawBezierShape_command, drawCircle_command, drawPolygon_command, fillstyle, point3d, displace_command, scale_command, Mv, scalar_multiple, taxicab_dist, insert_after, drawEllipse_command, d_ellipse2, drawEllipseCR_command, display_total, add_new_shape, add_point, add_unassociated_point, get_closest_point, get_layer, get_point, list_shapes, move_point, move_points_in_shape, named_point, output_draw, point, pop_point_s, screen_to_world, selected_shape_visible, shape, verify, world_to_screen, zoom_scale } from "./a"
import * as _ from "lodash"

/* zod : 
convert.py
copy this file to a.ts 
ts-to-zod a.ts draw_commands_zod.zod.ts
remove all import/export
z -> window.z 
put into js file

*/

let base_display : display_total = {
    "points" : [],
    "layers" : [{"name":"base", "shapes":[]}],
    "zoom" : [0,0,1],
    "layer_visibility" : {"base":true},
    show_points : "all",
    show_labels : false, 
    selected_layer : "base",
    total_points : 0,
    total_shapes : 0,
    message : "",
    true_points : true
}

let display = JSON.parse(JSON.stringify(base_display)) as display_total;

let history  : display_total[] = []
let redo_lst : display_total[] = []; 

function undo(){
    let zoom = JSON.parse(JSON.stringify(display.zoom));
    if(history.length == 0){
        return;
    }
    redo_lst.push(history.pop()!);
    display = history[history.length-1]
    display = JSON.parse(JSON.stringify(display));
    display.zoom = zoom;
}
function redo(){
    if(redo_lst.length == 0){
        return;
    }
    let zoom = JSON.parse(JSON.stringify(display.zoom));
    display = redo_lst.pop()!; 
    history.push(display);
    display = JSON.parse(JSON.stringify(display));
    display.zoom = zoom;
}

function change(canvas_only  : boolean = false){
    

    history.push(JSON.parse(JSON.stringify(display)));  
    if(history.length > 100){
        history.shift();
    }
    redo_lst = [] ; 
    draw_all(canvas_only);
}

function draw_all(canvas_only  : boolean = false ){
    verify(display);
    (document.getElementById("bigc") as HTMLCanvasElement).getContext("2d")?.clearRect(0,0,3333,3333);
    draw_wrap(output_draw(display), (document.getElementById("bigc") as HTMLCanvasElement).getContext("2d")!);
    if(canvas_only){
        return;
    }
    (document.getElementById("outputted total") as HTMLTextAreaElement).value = JSON.stringify(display);
    //side stuff
    (document.getElementById("frames") as HTMLDivElement).innerHTML = "";
    (document.getElementById("frames2") as HTMLDivElement).innerHTML = "";
    (document.getElementById("frames3") as HTMLDivElement).innerHTML = "";

    // layers 
    (document.getElementById("frames") as HTMLDivElement).innerHTML = "<b>LAYER</b><br />"
    for(let [i, layer] of display.layers.entries()){
        (document.getElementById("frames") as HTMLDivElement).innerHTML += `<div ${layer.name
             == display.selected_layer ? "style=\"background-color:lightblue;\"" : ""}><input type="text" style="width:110" value="${layer.name}" onChange="rename_layer(display, '${layer.name}', arguments[0].target.value);change();" /><button onClick="select_layer(display,'${layer.name}');change();">Select</button>
<button onClick="display.layer_visibility['${layer.name}'] = !display.layer_visibility['${layer.name}'] ;change();">${display.layer_visibility[layer.name] ? "vis" : "invis"}</button>${layer.shapes.length}
<br /><button onClick="shift_lst(display.layers, ${i}, false);change()">up</button>
<button onClick="shift_lst(display.layers, ${i}, true);change()">down</button>
<button onClick="move_shape(display, display.selected_shape, '${layer.name}'); display.selected_shape= get_layer(display.layers, display.selected_layer).shapes[${i}]?.name; change(); ">Move shape</button>
<button onClick="display.layers.splice(${i}, 1);delete display.layer_visibility['${layer.name}'];change();">Delete</button>
<button onClick="clone_layer(display, '${layer.name}');change();">Clone</button>
<br /></div>
`;
    }
    (document.getElementById("frames") as HTMLDivElement).innerHTML += `<br />.<br /><input type="text" id="add_new" /> <button onClick="add_layer(display, document.getElementById('add_new').value);change(); ">Add</button>
<br />`;

    //SHAPES IN LAYER
    (document.getElementById("frames2") as HTMLDivElement).innerHTML += `<b>SHAPES IN LAYER ${display.selected_layer}</b>`
    for(let [i, shape] of (get_layer(display.layers, display.selected_layer)?.shapes ?? []).entries() ) {
        (document.getElementById("frames2") as HTMLDivElement).innerHTML += `<div ${shape.name
             == display.selected_shape ? "style=\"background-color:lightblue;\"" : ""}>${shape.name} : ${shape.type} <br /><button onClick="select_shape(display, '${shape.name}') ; change();">Select</button>
<button onClick="clone_shape(display, '${shape.name}');change();">Clone</button>
<button onClick="remove_shape(display, '${shape.name}'); change();">Delete</button>
 
<button onClick="shift_lst(get_layer(display.layers, display.selected_layer)?.shapes, ${i}, false);change()">  up</button>
<button onClick="shift_lst(get_layer(display.layers, display.selected_layer).shapes, ${i}, true);change()">  down</button><button onClick="let x = list_shapes(display)['${shape.name}'][0]; x.visible = !x.visible; change();">${shape.visible ? "visible" : "invisible"}</button> </div><br />`
    }   
    //SELECTED SHAPE
    let points_dict : Record<string, point> = display.points.reduce((prev : Record<string, point>, curr : named_point) => {prev[curr[0]]= [curr[1], curr[2]]; return prev }, {})

    if(display.selected_shape != undefined){
        let selected_shape : shape  =list_shapes(display)[display.selected_shape][0];
        if(selected_shape != undefined){
            //shape stuff
            (document.getElementById("frames3") as HTMLDivElement).innerHTML = `<div><input type="text" id="shape_name" value="${selected_shape.name}" onChange="rename_shape(display, display.selected_shape, document.getElementById('shape_name').value);change();"/> <br /> ${selected_shape.type} <select id="shape_types_dropdown" onChange ="list_shapes(display)[display.selected_shape][0].type = document.getElementById('shape_types_dropdown').selectedOptions[0].innerText; change()" ><option>line</option>
<option>bezier</option>
<option>smooth bezier</option>
<option>polygon</option>
<option>circle</option>
<option>bezier shape</option>
<option>smooth bezier shape</option> </select> <br /> ${selected_shape.visible ? "visible" : "invisible"} <button onClick="let x = list_shapes(display)['${selected_shape.name}'][0]; x.visible =!x.visible;change()">Toggle visible</button><br />`;
            //outline
            (document.getElementById("frames3") as HTMLDivElement).innerHTML  +=`<br /><b> OUTLINE ${selected_shape.outline_visible ? "" : " (invis)"}</b><br />`
            if(selected_shape.outline != undefined){
                (document.getElementById("frames3") as HTMLDivElement).innerHTML  += `<textarea id="${selected_shape.name} outline">${JSON.stringify(selected_shape.outline)}</textarea><br /><button onClick="set_outline(display, '${selected_shape.name}', JSON.parse(document.getElementById('${selected_shape.name} outline').value));change();">Set outline</button>
<br /><button onClick="let x = list_shapes(display)['${selected_shape.name}'][0]; x.outline_visible = !x.outline_visible; change();">Toggle outline</button><button onClick="set_outline(display, '${selected_shape.name}', undefined);change();">Remove outline</button>
`
            } else {
                (document.getElementById("frames3") as HTMLDivElement).innerHTML  += `<button onClick="set_outline(display,'${selected_shape.name}', {'thickness':1,'color':'black'});change();">Add outline</button>
`
            }
            // fillstyle
            (document.getElementById("frames3") as HTMLDivElement).innerHTML  +="<br /><b> FILLSTYLE</b><br />"
            if(selected_shape.fill != undefined){
                (document.getElementById("frames3") as HTMLDivElement).innerHTML  += `<textarea id="${selected_shape.name} fillstyle">${JSON.stringify(selected_shape.fill)}</textarea><br /><button onClick="fillstyle_check('${selected_shape.name}', document.getElementById('${selected_shape.name} fillstyle').value);">Set fillstyle</button>
<br /><button onClick="set_fillstyle(display, '${selected_shape.name}', undefined);change();">Remove fillstyle</button>
`
            } else {
                (document.getElementById("frames3") as HTMLDivElement).innerHTML  += `<button onClick="set_fillstyle(display,'${selected_shape.name}', 'black');change();">Add fillstyle</button>
<br />`;
                (document.getElementById("frames3") as HTMLDivElement).innerHTML  += `<button onClick="set_fillstyle(display,'${selected_shape.name}', 'default1');change();">Add linear fillstyle</button>
<br />`;
                (document.getElementById("frames3") as HTMLDivElement).innerHTML  += `<button onClick="set_fillstyle(display,'${selected_shape.name}', 'default2');change();">Add radial fillstyle</button>
<br />`;
                (document.getElementById("frames3") as HTMLDivElement).innerHTML  += `<button onClick="set_fillstyle(display,'${selected_shape.name}', 'default3');change();">Add conic fillstyle</button>
<br />`;
            }

            (document.getElementById("frames3") as HTMLDivElement).innerHTML  +="<br /><b> TAGS</b><br />";

            //tags
            (document.getElementById("frames3") as HTMLDivElement).innerHTML  +="<br />Separate tags by \"|\"<br />";

            (document.getElementById("frames3") as HTMLDivElement).innerHTML  += `<textarea onChange="change_tags(display, '${selected_shape.name}', document.getElementById('tags_obj').value)" id="tags_obj">${selected_shape.tag.join("|")}</textarea>`; 
            (document.getElementById("frames3") as HTMLDivElement).innerHTML  +="<br /><b> POINTS</b><br />";
            // points
            (document.getElementById("frames3") as HTMLDivElement).innerHTML  += `<br /><textarea id=\"points_text\">${JSON.stringify(selected_shape.points)}</textarea><button onClick="try { let x = JSON.parse(document.getElementById('points_text').value); if(window.z.array(window.z.tuple([window.z.string(),window.z.number(), window.z.number()])).safeParse(x).success == false){throw 'not valid points';}; set_points_s(display,'${selected_shape.name}', x); } catch(e){ display.message = e}; change(); ">Set points</button>`;
            (document.getElementById("frames3") as HTMLDivElement).innerHTML  += "<br />";

            for(let [i, [point, o1, o2]] of selected_shape.points.entries()){
                (document.getElementById("frames3") as HTMLDivElement).innerHTML  += `<span ${selected_shape.insertion_point == point ? "style=\"background-color:lightblue;\"" : (display.selected_point == point ? "style=\"background-color:lightgreen;\"" : "")}>${point} (${points_dict[point][0].toString().substring(0,6)}, ${points_dict[point][1].toString().substring(0,6)}) </span> <button onClick="display.selected_point = '${point}';change();">Select</button>
 <button onClick="list_shapes(display)['${selected_shape.name}'][0].points.splice(${i},1);display.selected_point=undefined;change();">Pop</button>`
                if(point == selected_shape.insertion_point){
                    (document.getElementById("frames3") as HTMLDivElement).innerHTML  += `<button onClick="list_shapes(display)['${selected_shape.name}'][0].insertion_point = undefined;change();">Clear</button>`
                } else {
                    (document.getElementById("frames3") as HTMLDivElement).innerHTML  += `<button onClick="list_shapes(display)['${selected_shape.name}'][0].insertion_point = '${point}';change();">Insert</button>`
                }
                (document.getElementById("frames3") as HTMLDivElement).innerHTML  += "<br />";
            }
            (document.getElementById("frames3") as HTMLDivElement).innerHTML += "</div>";
        }
    
    }

    (document.getElementById("message") as HTMLDivElement).innerHTML = display.message 
}


function click(point : point, control_flag = false){
    point = screen_to_world(point, display.zoom);
    
    // move a point
    if(display.selected_point != undefined){
        if(control_flag == false){ 
            move_point(display, display.selected_point, point);
        } else {
            // displace without moving
            let base_point = get_point(display.points, display.selected_point)
            if(base_point == undefined){
                return;
            }
            let shape = list_shapes(display)[display.selected_shape ?? "adjlkadjaklsdjaslkdj"]
            if(shape == undefined){
                return;
            }
            let index = shape[0].points.map(x => x[0]).indexOf(display.selected_point);
            if(index == -1){
                return undefined;
            }
            shape[0].points[index][1]= lincomb(1, point, -1, base_point)[0];
            shape[0].points[index][2]= lincomb(1, point, -1, base_point)[1];
        }
    }
    // add a point
    if(display.selected_shape != undefined && display.selected_point == undefined){
        add_point(display, point);
    } else {
        display.message = "no shape selected"
    }
    change();
}



//WASD is for scrolling, 123456 is for adding new shapes
//Q : select a point, E : unselect points;
function keypress(point : point, key : string){
    key = key.toLowerCase();
    point = screen_to_world(point, display.zoom);
    display.message = "";
    let canvas_only = false; 
    if(key == "`"){
        document.getElementById("bigc")!.focus();
        canvas_only = true; 
    }
    else if(key == "q"){//select point
        let closest = get_closest_point(display, point, true)
        if(closest != ""){
            display.selected_point = closest; 
        }
    }
    else if(key == "e"){//unselect point 
        if(display.selected_point == undefined){
            display.selected_shape = undefined;
        }
        display.selected_point = undefined;
        canvas_only = true;
        
    }
    else if(key == "r"){// add existing point to shape
        if(!selected_shape_visible(display)){
            display.message = "no shape selected or selected shape is not visible";
            return ; // don't do anything if shape is not visible 
        }
        let closest = display.selected_point ?? get_closest_point(display, point, true)
        if(closest != ""){
            if(display.selected_shape != undefined){
                let [shape, layer] = list_shapes(display)[display.selected_shape];
                shape.points.push([closest,0,0]);
            }
        }
    }
    else if(key == "f"){// pop point from shape
        if(display.selected_shape != undefined){
            pop_point_s(display, display.selected_layer, display.selected_shape);
        }
    }
    else if(key == " "){// focus
        let points_dict : Record<string, point> = display.points.reduce((prev :Record<string, point> , curr : named_point) => {prev[curr[0]]= [curr[1], curr[2]]; return prev }, {})
        if(display.selected_shape == undefined){
            return;
        }
        let shape = list_shapes(display)[display.selected_shape]?.[0];

        if(shape != undefined){
            let pts = shape.points.map(x => points_dict[x[0]]);
            display.zoom = [_.min(pts.map(x => x[0])) ?? 0, _.min(pts.map(x => x[1])) ?? 0, display.zoom[2]];
        }
        canvas_only = true;
    } else if (key == "t" && display.selected_point != undefined && display.selected_shape != undefined){
        list_shapes(display)[display.selected_shape][0].insertion_point = display.selected_point;
    } else if(key == "g" && display.selected_shape != undefined){
        list_shapes(display)[display.selected_shape][0].insertion_point = undefined;
    }
    // fillstyle points
    else if("zxcv".indexOf(key) != -1){
        if(!selected_shape_visible(display)){
            display.message = "selected shape is not visible";
            return;
        }
        if(display.selected_shape == undefined){
            display.message = "no shape selected";
            return;
        }
    
        let [shape, layer] = list_shapes(display)[display.selected_shape]
        if(shape.fill == undefined || typeof(shape.fill) == "string" ){
            display.message = "selected shape fillstyle does not support points";
        } else {
            // end of error checking
            if(key == "z"){
                shape.fill.p0 = add_unassociated_point(display, point);
            }
            if(key == "x"){
                shape.fill.p0 = get_closest_point(display, point);
            }
            if(shape.fill.type != "fill_conic"){
                if(key == "c"){
                    shape.fill.p1 = add_unassociated_point(display, point);
                }
                if(key == "v"){
                    shape.fill.p1 = get_closest_point(display, point);
                }
            }
        }

    }
    // add shapes : 
    else if(key == "1"){
        add_new_shape(display, display.selected_layer,  "line", point)
    }
    else if(key == "2"){
        add_new_shape(display, display.selected_layer,  "bezier", point)
    }
    else if(key == "3"){
        add_new_shape(display, display.selected_layer,  "smooth bezier", point)
    }
    else if(key == "4"){
        add_new_shape(display, display.selected_layer,  "polygon", point)
    }
    else if(key == "5"){
        add_new_shape(display, display.selected_layer,  "circle", point)
    }
    else if(key == "6"){
        add_new_shape(display, display.selected_layer,  "ellipse", point)
    }

    else if(key == "7"){
        add_new_shape(display, display.selected_layer,  "bezier shape", point)
    }
    else if(key == "8"){
        add_new_shape(display, display.selected_layer,  "smooth bezier shape", point)
    }
    else { 
        // nothing changed, don't call change
        return;
    }
    change(canvas_only); 
}

// takes in screen point
function scroll_wheel( point : point ,up : boolean){
    let world_point = screen_to_world([point[0], point[1]], display.zoom);
    zoom_scale( display, up ? 1.2 : 1/1.2 , point);
    let new_point = world_to_screen(world_point, display.zoom)
    if(dist(point, new_point)> 3){
        throw "scrolling failed, not a fixed point";
    }
    draw_all(true);
}

function scroll_key(what : "screen" | "layer" | "shape", direction : point){
    if(what == "screen"){
        display.zoom = lincomb(1, display.zoom, 1, [direction[0], direction[1], 0]) as point3d;
    }
    if(what == "layer"){
        for(let shape of get_layer(display.layers, display.selected_layer)!.shapes){
            move_points_in_shape(display, shape.name, direction);
        }
    }
    if(what == "shape" && display.selected_shape != undefined){
        move_points_in_shape(display, display.selected_shape, direction);
    }
    draw_all(true);
}

