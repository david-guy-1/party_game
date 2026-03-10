import React, { useState } from 'react'
import game from './game';

import { anim_fn, button_click, draw_fn, data_obj, init, prop_commands, reset_fn, sound_fn } from './GameData_deco';
import { events } from '../EventManager';
import GameDisplay, { clone_gamedata } from '../GameDisplay';
import { gamedata } from '../interfaces';
import { all_combos, dist } from '../lines';
import { globalStore_type } from './globalStore';

function move_canvas(e : MouseEvent, g:game, s : globalStore_type){
  s.mouse = [e.offsetX, e.offsetY];
}

function dec_down(e : MouseEvent, g:game, s : globalStore_type){
  s.mousedown = true; 
  if(s.party_mode == "Move Balloons"){
    for(let [ i,balloon] of g.balloons.entries()){
      if(dist([e.offsetX, e.offsetY] , balloon) < 30){
        s.clicked_balloon = i;
        break;
      }
    }
  }
  if(s.party_mode == "Color Balloons"){
    for(let [ i,balloon] of g.balloons.entries()){
      if(dist([e.offsetX, e.offsetY] , balloon) < 30){
        let colors = ["red","green","blue","yellow","purple"];
        g.balloon_colors[i] = colors[(colors.indexOf(g.balloon_colors[i]) + 1)%colors.length]; 
        break;
      }
    }
  }
  if(s.party_mode == "Move Ribbons"){
    for(let [ i,ribbon] of g.ribbons.entries()){
      if(Math.abs(e.offsetX- ribbon) < 30){
        s.clicked_ribbon = i;
        break;
      }
    }    
  }
  if(s.party_mode == "Color Ribbons"){
    for(let [ i,ribbon] of g.ribbons.entries()){
      if(Math.abs(e.offsetX- ribbon) < 30){
        let colors = ["red","green","blue","yellow","purple"];
        g.ribbons_colors[i] = colors[(colors.indexOf(g.ribbons_colors[i]) + 1)%colors.length]; 
      }
    }   
  }
    if(s.party_mode == "Move Flowers"){
    for(let [ i,flower] of g.flowers.entries()){
      if(Math.abs(e.offsetX- flower) < 30){
        s.clicked_flower = i;
        break;
      }
    }    
  }
  if(s.party_mode == "Color Flowers"){
    for(let [ i,flower] of g.flowers.entries()){
      if(Math.abs(e.offsetX- flower) < 30){
        let colors = ["red","green","blue","yellow","purple"];
        g.flowers_colors[i] = colors[(colors.indexOf(g.flowers_colors[i]) + 1)%colors.length]; 
      }
    }   
  }
}

function dec_up(e : MouseEvent, g:game, s : globalStore_type){
  s.mousedown = false;
  if(s.party_mode == "Move Balloons"){
    if(s.clicked_balloon != undefined){
      g.balloons[s.clicked_balloon] = s.mouse;
    }
    s.clicked_balloon = undefined 
  }

  if(s.party_mode == "Move Ribbons"){
    if(s.clicked_ribbon != undefined){
      g.ribbons[s.clicked_ribbon] = s.mouse[0];
    }
    s.clicked_ribbon = undefined 
  }

    if(s.party_mode == "Move Flowers"){
    if(s.clicked_flower != undefined){
      g.flowers[s.clicked_flower] = s.mouse[0];
    }
    s.clicked_flower = undefined 
  }
}


export const WIDTH=1000;
export const HEIGHT=650;

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
    } else { // start decorations
      // get gameData
      let data = clone_gamedata(data_obj); 
      data.g = g;
      
      data.prop_fns["new_game"] =  function(){setG(undefined)};
      // register event listener;
      events["mousemove a"] = [move_canvas, g]
      events["mousedown a"] = [dec_down, g]
      events["mouseup a"] = [dec_up, g]
      let store : globalStore_type = {
        display : {
            "button" : [["change_mode|Move Balloons", [0, HEIGHT, 40, 40], ""],["change_mode|Color Balloons", [40, HEIGHT, 40, 40], ""],["change_mode|Move Ribbons", [80, HEIGHT, 40, 40], ""],["change_mode|Color Ribbons", [120, HEIGHT, 40, 40], ""],["change_mode|Move Flowers", [160, HEIGHT, 40, 40], ""],["change_mode|Color Flowers", [200, HEIGHT, 40, 40], ""]],
            "canvas" : [["main",[0,0,WIDTH,HEIGHT]], ["anim_frame",[0,0,WIDTH,HEIGHT]]],
            "image" : [],
            "text":[["Current Mode : Move Balloons", WIDTH-300, HEIGHT+10]] 
        },
        props_to_run : [],
        mouse :[0,0],
        mousedown : false,
        party_mode : "Move Balloons"

      }
      g.mode = "decorations"
      return <GameDisplay data={data} globalStore={store}  FPS={60}/>

    }
  }
}

export default App