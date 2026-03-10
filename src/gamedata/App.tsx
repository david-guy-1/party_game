import React, { useState } from 'react'
import game from './game';

import { anim_fn, button_click, draw_fn, data_obj, init, prop_commands, reset_fn, sound_fn } from './GameData_deco';
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

export const WIDTH=1000;
export const HEIGHT=700;

const intros = ["Hello, my name is Amy.", 
  "My birthday is in a few days",
  "I need to prepare everything to have the best party ever!",
  "First things first, I need to prepare decorations",
  "Let's see what I have...",
  "A banner, ribbons, balloons, and flowers. I can use these",
  "Now, how do I make these look nice..."
]
function App() {
  const [g, setG] = useState<game | undefined>(undefined);
  const [intro, setIntro] = useState(0); 
  if(g == undefined){
    setG(new game())
  } else {
    // INTRO 
    if(intro < intros.length){
      return <><img src={intro < 5 ? "intro.png" : "introbox.png" } className="topleft"/> <div className="text">{intros[intro]} </div>  <div className='nextButton'>{intro != 0 ? <button  onClick={() => setIntro(x => x-1)}>Prev</button> : "-------"} <button  onClick={() => setIntro(x => x+1)}>Next</button></div></>
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
            "canvas" : [["main",[0,0,WIDTH,HEIGHT]], ["anim_frame",[0,0,WIDTH,HEIGHT]]],
            "image" : [],
            "text":[] 
        },
        props_to_run : []

      }
      g.mode = "decorations"
      return <GameDisplay data={data} globalStore={store}  FPS={60}/>

    }
  }
}

export default App