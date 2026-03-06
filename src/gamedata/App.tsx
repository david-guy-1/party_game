import React, { useEffect, useState } from 'react'
import game from './game';

import { globalStore_type } from "./globalStore";
import { anim_fn, button_click, draw_fn, data_obj, init, prop_commands, reset_fn, sound_fn } from './GameData';
import { data_obj as data_obj_2 } from './GameData2';
import { events, set_events } from '../EventManager';
import GameDisplay, { clone_gamedata } from '../GameDisplay';
import { gamedata } from '../interfaces';
import { all_combos } from '../lines';
import Sound_el from './Sound';


function move_canvas(e : MouseEvent, g:game){
    if((e.target as HTMLElement).getAttribute("data-key") == "main"){ // topmost canvas element that is valid - prevent moving char when mouse goes over another element 
        g.target= [e.offsetX, e.offsetY]
    }
}


function App() {

  const [g, setG] = useState<game | undefined>(undefined);
  const [coins, setCoins] = useState<boolean>(true);
  useEffect(function(){
    // componentDidMount
    setTimeout(() =>     setG(new game()), 1000)

  }, [])
  
  // reset coins 
  useEffect(function(){
    g?.reset();
  }, [coins])

  if(g == undefined){
    
    return "loading"
  } else {
    if(coins){
      // get gameData
      let data = clone_gamedata(data_obj); 
      data.g = g;
      g.coin_mode = true;
      data.prop_fns["switch"] =  function(){setCoins(false)};
      // register event listener;
      events["mousemove a"] = [move_canvas, g]
      let store : globalStore_type = {
        display :  {
            "button" : [],
            "canvas" : [["main",[0,0,600,600]]],
            "image" : [],
            "text":[] 
        }
      }
      return <><GameDisplay data={data} globalStore={store}  FPS={60} /> <Sound_el x={0} y={0}/></>
    } else {
      // get gameData
      let data = clone_gamedata(data_obj_2); 
      data.g = g;
      g.coin_mode = false;
      g.t = 0
      data.prop_fns["switch"] =  function(){setCoins(true)};
      // register event listener;
      events["mousemove a"] = [move_canvas, g]
      let store : globalStore_type = {
         display : {
              "button" : [["b1", [0, 600, 100, 650] , "Do something"]],
              "canvas" : [["anim_frame",[0,0,600,600]], ["main",[0,0,600,600]]],
              "image" : [],
              "text":[] 
          }
      }
      return <><GameDisplay data={data} globalStore={store}  FPS={60} /> <Sound_el x={0} y={0}/></>
    }
  } 
}

export default App