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
import { fade_wrap } from '../process_draws';


function move_canvas(e : MouseEvent, g:game){
    if((e.target as HTMLElement).getAttribute("data-key") == "fade"){ // topmost canvas element that is valid - prevent moving char when mouse goes over another element 
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
  

  if(g == undefined){
    
    return "loading"
  } else {
    if(coins){
      // get gameData
      let data = clone_gamedata(data_obj); 
      data.g = g;
      g.coin_mode = true;
      data.prop_fns["switch"] =    function(game : game, globalStore : globalStore_type){
        let c = globalStore.display.refs?.current?.["fade"]?.getContext("2d")
        if(c && globalStore.fading == false){
            globalStore.fading = true;
            fade_wrap([], c, () => {globalStore.fading = false; setCoins(false)}, [], "black", 1, [1000,1000], false); // fade away
        }
      };
      
      //function(){setCoins(false)};
      // register event listener;
      events["mousemove a"] = [move_canvas, g]
      let store : globalStore_type = {
        display :  {
            "button" : [],
            "canvas" : [["main",[0,0,600,600]],["fade",[0,0,600,600]]],
            "image" : [],
            "text":[] 
        },
        fading : false
      }
      return <><GameDisplay data={data} globalStore={store}  FPS={60} /> <Sound_el x={0} y={0}/></>
    } else {
      // get gameData
      let data = clone_gamedata(data_obj_2); 
      data.g = g;
      g.coin_mode = false;
      data.prop_fns["switch"] =  function(game : game, globalStore : globalStore_type){
        let c = globalStore.display.refs?.current?.["fade"]?.getContext("2d")
        if(c && globalStore.fading == false){
            globalStore.fading = true;
            fade_wrap([], c, () => {globalStore.fading = false; setCoins(true)}, [], "black", 1, [1000,1000], false); // fade away
        }
      };
      // register event listener;
      events["mousemove a"] = [move_canvas, g]
      let store : globalStore_type = {
         display : {
              "button" : [["b1", [0, 600, 100, 650] , "Do something"]],
              "canvas" : [["anim_frame",[0,0,600,600]], ["main",[0,0,600,600]],["fade",[0,0,600,600]]],
              "image" : [],
              "text":[] 
          },
          fading : false
      }
      return <><GameDisplay data={data} globalStore={store}  FPS={60} /> <Sound_el x={0} y={0}/></>
    }
  } 
}

export default App