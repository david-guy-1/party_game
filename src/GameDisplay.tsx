import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { clear, draw, draw_wrap, fade } from "./process_draws";
import { animation, update_and_draw } from "./animations";
import { toggleMute, getMuted, changeSound, getCurrentTrack, playSound} from "./Sound"; 

import React from "react";
import { display_type, gamedata, props_to_run } from "./interfaces";
import { set_events } from "./EventManager";
import { combine_obj } from "./lines";
import { events_type, globalStore_type } from "./gamedata/globalStore";



//let globalStore : globalStore_type = {};

let interval : number = -1; 
let last_tick : number = Date.now(); 



//does NOT clone any functions
export function clone_gamedata(x : gamedata) : gamedata{
    let y : gamedata =  {...x};
    y.prop_fns = {}
    return y; 
}



function GameDisplay( props : {data  : gamedata, globalStore : globalStore_type, FPS : number}){
    let {g ,draw_fn , anim_fn , sound_fn , init , button_click , prop_commands  , reset_fn  , prop_fns}  = props.data;
    let globalStore = props.globalStore;
    let display = globalStore.display; 
    let FPS = props.FPS;
    console.log("rendering");
//    const globalStore = useState<globalStore_type>(props.store)[0];
    
    if(g == undefined){
        throw "no game found"; 
    }
    async function reset(){

        last_tick = Date.now();
        clearInterval(interval);
        interval = -1; 
        reset_fn(); 
        console.log("g cleared");
    }
    console.log("refreshed");
    const [r, refresh] = useState<boolean>(false);
    const refs = useRef<Record<string, HTMLCanvasElement>>({});
    globalStore.display.refs = refs; 

    let anim_lst : animation<typeof g>[] = []; 
    function handle_prop(s : string, t : any){
        if(s == "rerender"){
            refresh(!r);
        }            
        if(s == "reset"){
            anim_lst = [];
            reset();
            refresh(!r);
        }
        if(prop_fns[s] != undefined){
            prop_fns[s](g,globalStore, t)
        }
    }

    useEffect(function(){
        // componentDidMount;
        init(g, globalStore);
        set_events(g, globalStore);

        
        // game loop
        if(interval == -1) {  
            last_tick = Date.now() //
            interval = window.setInterval(function(){
                //console.log(g);
                if(g == undefined){
                    return;
                }
                let new_tick = Date.now(); 
                //tick the game once 
                let evtlst : events_type[] = [];
                let ticked = false; 
                while(last_tick < new_tick){
                    let new_events = g.tick();
                    evtlst = evtlst.concat(new_events);
                    last_tick += 1000/FPS 
                    ticked = true;
                } 
                if(ticked == false){
                    return; 
                }
                for(let [s,t] of prop_commands(g, globalStore, evtlst)){
                    handle_prop(s, t); 
                }

                // handle sound
                let [newsound, playsounds] =  sound_fn(g, globalStore, evtlst)
                if(newsound != "no change"){
                    changeSound(newsound);
                }
                for(let item of playsounds){
                    playSound(item);
                }
                // drawings and animations 
                for(let [item, unused] of display.canvas){
                    let [cmds, should_clear] = draw_fn(g, globalStore, evtlst, item);
                    let canvas = refs.current[item];
                    if(canvas != undefined){
                        if(should_clear){
                            let ctx= canvas.getContext("2d")
                            if(ctx){
                                clear(ctx)
                            }
                        }
                        let ctx= canvas.getContext("2d")
                        if(ctx){    
                            draw_wrap(cmds, ctx);
                        }                    
                    }
                }
                // animations 
                anim_lst = anim_lst.concat(anim_fn(g, globalStore, evtlst));
                update_and_draw(anim_lst, g,globalStore,refs.current)

            }, 1000/FPS) 


        }
        return function(){
            //componentWillUnmount
            console.log("unmounting");
            clearInterval(interval); 
            interval = -1;
        }
    },[g,r,props])

    const button_click_disp = function(s : string){
        let lst  = button_click(g, globalStore, s);
        for(let [s,t] of lst){
            handle_prop(s,t);
        }
    }

    var return_lst : any[] = []
    let z_counter = 0
    for(let item of display.canvas){
        let name = item[0]; 
        let [x,y,w,h] = item[1]; 
        let s = item[2]
        return_lst.push(<canvas style={combine_obj({position:"absolute", top : y + "px", left : x + "px", zIndex : z_counter + (name.indexOf("background") == -1 ? 0 : -1000)},s ?? {})} width={w} height={h} ref={a => { if(a != null){ refs.current[name] = a}}} key={name + " canvas"} data-key={name}></canvas>)
        z_counter++; 
    }
    for(let item of display.button){
        let name = item[0]; 
        let [x,y,w,h] = item[1]; 
        let text = item[2];
        let image = item[3]
        let s = item[4] 
        if(image !== undefined){
            //@ts-ignore
            return_lst.push(<img src={image} style={combine_obj({position:"absolute", top : y + "px", left : x + "px", width:w + "px", height : h + "px"},s ?? {})} onClick={() =>button_click_disp(name) }  ref={refs[name]} key = {image + " image btn" + `${x} ${y} ${w} ${h} ${text}`}/>)
        } else { 
            return_lst.push(<button key = {image + " btn "+ `${x} ${y} ${w} ${h} ${text}`} style={combine_obj({position:"absolute", top : y + "px", left : x + "px", width:w + "px", height : h + "px" },s ?? {})} onClick={() => button_click_disp(name)} >{text}</button>)
        }
    }
    for(let item of display.image){
        let [name,img_el, x,y,w,h,s] = item;
        console.log(name)
        if(img_el){
            return_lst.push(<div style={combine_obj({backgroundImage:`url(${name})`, position:"absolute", top : y + "px", left : x + "px", "zIndex" : -1,"width":w,"height":h}, s ?? {}) } key={name + " image" + x + " " + y} tabIndex={1}></div>)
        } else {
            return_lst.push(<img src={name} style={combine_obj({ position:"absolute", top : y + "px", left : x + "px", "zIndex" : -1,"width":w,"height":h, userSelect : "none"}, s ?? {})}  key={name + " div image"  + x + " " + y} tabIndex={1} />)
        }

    }
    for(let item of display.text){
        let [name,x,y,extra_style] = item;
        let style : Record<string, any>= { position:"absolute", top : y + "px", left : x + "px"};
        if(extra_style){
            combine_obj(style, extra_style);
        }
        return_lst.push(<div style={style} tabIndex={1} key = {name  + ` ${x} ${y} ${JSON.stringify(extra_style)} `}>{name}</div>)
    }
    return return_lst
}

export default GameDisplay