import React, { useState } from 'react'
import game from './game';

import { anim_fn, button_click, display, draw_fn, data_obj, init, prop_commands, reset_fn, sound_fn } from './GameData';
import { events } from '../EventManager';
import GameDisplay, { clone_gamedata } from '../GameDisplay';
import { gamedata } from '../interfaces';
import { all_combos } from '../lines';




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
    
    let store : globalStore_type = {
    }

    return <GameDisplay data={data} globalStore={store} />
  }
}

export default App