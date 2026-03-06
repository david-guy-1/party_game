import React, { useState } from 'react'
import game from './game';

import { anim_fn, button_click, draw_fn, data_obj, init, prop_commands, reset_fn, sound_fn } from './GameData';
import { events } from '../EventManager';
import GameDisplay, { clone_gamedata } from '../GameDisplay';
import { gamedata } from '../interfaces';
import { all_combos } from '../lines';
import { globalStore_type } from './globalStore';

function move_canvas(e : MouseEvent, g:game){
    if((e.target as HTMLElement).getAttribute("data-key") == "anim_frame"){ // topmost canvas element that is valid - prevent moving char when mouse goes over another element 
        g.target= [e.offsetX, e.offsetY]
    }
}


function App() {

  const [g, setG] = useState<game | undefined>(undefined);
  if(g == undefined){
    
    return <button onClick={() => setG(new game())}>Click to start</button>
  } else {
    // get gameData
    let data = clone_gamedata(data_obj); 
    data.g = g;
    data.prop_fns["new_game"] =  function(){setG(undefined)};
    // register event listener;
    events["mousemove a"] = [move_canvas, g]
    let store : globalStore_type = {
      display : {
          "button" : [],
          "canvas" : [["main",[0,0,600,600]], ["anim_frame",[0,0,600,600]], ["collect", [600, 0, 100, 100]]],
          "image" : [],
          "text":[] 
      },
      props_to_run : []

    }

    return <GameDisplay data={data} globalStore={store}  FPS={60}/>
  }
}

export default App