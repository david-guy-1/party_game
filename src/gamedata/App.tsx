import React, { useState } from 'react'
import game from './game';

import { data_obj as data_obj_deco } from './GameData_deco';

import { data_obj as data_obj_shop, SHOP_SCROLL_SPEED } from './GameData_shop';
import {data_obj as data_obj_stage} from "./GameData_stage";
import {data_obj as data_obj_dressup} from "./GameData_dressup";
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
  if(g.mode == "decorations"){
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

    if(s.party_mode == "Move Banner"){
      s.banner_diff = e.offsetY - g.banner_height;
    }    
  }
  if(g.mode == "shopping"){
    // see if click is within distance
    for(let i = g.shop_items.length-1; i >= 0; i--){
      let [item, height, t] = g.shop_items[i];
      let time_diff = g.t-t;
      let coords = [WIDTH + 100 - time_diff *  SHOP_SCROLL_SPEED , 174 + 100 * height]; 
      if(dist(coords, [e.offsetX, e.offsetY] )< 50){
        g.shop_items.splice(i, 1);
        g.items_total[item] ++; 
        s.shop_rerender = true;
      } 
    }    
  }
  
}

// given end mouse position we have : new height - old height = new y - old y 

// banner_diff = old y - old height

// compute new height given banner_diff, new y

// new height  = new y - banner_diff

function dec_up(e : MouseEvent, g:game, s : globalStore_type){
  s.mousedown = false;
  if(g.mode == "decorations"){
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
    if(s.party_mode == "Move Banner"){
      g.banner_height = e.offsetY - s.banner_diff;
      s.banner_diff = 0;
    }
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

const firstInts = [
  "Now that I finished decorating, I want to go shopping",
  "Let's see what I'm missing?",
  "Oh! Better get some snacks for the party!",
]

const secondInts = [
  "What's next... Oh yes! I still need to have some activities!",
  "I can't have a real party without things to do!",
  "Let's see what I can get..."
]
function App() {
  const [g, setG] = useState<game | undefined>(undefined);
  const [intro, setIntro] = useState(0); 
  const [firstInt, setFirstInt] = useState(0);
  const [secondInt, setSecondInt] = useState(0);
  if(g == undefined){
    setG(new game())
  } else {

          // get gameData
          let data = clone_gamedata(data_obj_dressup); 
          data.g = g;
          
          data.prop_fns["new_game"] =  function(){setG(undefined)};
          data.prop_fns["next"]= function(){ setIntro(x => x+1)}
          // register event listener;
          events["mousemove a"] = [move_canvas, g]
          events["mousedown a"] = [dec_down, g]
          events["mouseup a"] = [dec_up, g]
          let store : globalStore_type = {
            display: {
              "button": [["top", [0, HEIGHT, 40, 40], ""], ["top color", [40, HEIGHT, 40, 40], ""], ["skirt", [80, HEIGHT, 40, 40], ""], ["skirt color", [120, HEIGHT, 40, 40], ""], ["shoe", [160, HEIGHT, 40, 40], ""], ["shoe color", [200, HEIGHT, 40, 40], ""], ["necklace", [240, HEIGHT, 40, 40], ""]],
              "canvas": [["main", [0, 0, WIDTH, HEIGHT]], ["anim_frame", [0, 0, WIDTH, HEIGHT]]],
              "image": [],
              "text": [["Current Mode : Move Balloons", WIDTH - 300, HEIGHT + 10]]
            },
            props_to_run: [],
            mouse: [0, 0],
            mousedown: false,
            party_mode: "Move Balloons",
            banner_diff: 0,
            shop_rerender: false,

            selected_top: 1,
            selected_skirt: 1,
            selected_shoe: 1,
            selected_necklace: 0,
            selected_top_color: 30,
            selected_skirt_color: 120,
            selected_shoe_color: 180
          }
          g.mode = "decorations"
          return <GameDisplay data={data} globalStore={store}  FPS={60}/>


    // INTRO 
    if(intro < intros.length){
      return <><img src={intro < 5 ? "room.png" : "box.png" } className="topleft"/> {intro < 5 ? <img src={"casual_girl.png"} className="topleft"/>: null}<div className="text">{intros[intro]} </div>  <div className='nextButton'>{intro != 0 ? <button  onClick={() => setIntro(x => x-1)}>Prev</button> : "-------"} <button  onClick={() => setIntro(x => x+1)}>Next</button></div></>
    } else if(intro == intros.length) { // start decorations
      // get gameData
      let data = clone_gamedata(data_obj_deco); 
      data.g = g;
      
      data.prop_fns["new_game"] =  function(){setG(undefined)};
      data.prop_fns["next"]= function(){ setIntro(x => x+1)}
      // register event listener;
      events["mousemove a"] = [move_canvas, g]
      events["mousedown a"] = [dec_down, g]
      events["mouseup a"] = [dec_up, g]
      let store : globalStore_type = {
        display: {
          "button": [["change_mode|Move Balloons", [0, HEIGHT, 40, 40], ""], ["change_mode|Color Balloons", [40, HEIGHT, 40, 40], ""], ["change_mode|Move Ribbons", [80, HEIGHT, 40, 40], ""], ["change_mode|Color Ribbons", [120, HEIGHT, 40, 40], ""], ["change_mode|Move Flowers", [160, HEIGHT, 40, 40], ""], ["change_mode|Color Flowers", [200, HEIGHT, 40, 40], ""], ["change_mode|Move Banner", [240, HEIGHT, 40, 40], ""], ["next", [WIDTH - 400, HEIGHT, 40, 40], ""]],
          "canvas": [["main", [0, 0, WIDTH, HEIGHT]], ["anim_frame", [0, 0, WIDTH, HEIGHT]]],
          "image": [],
          "text": [["Current Mode : Move Balloons", WIDTH - 300, HEIGHT + 10]]
        },
        props_to_run: [],
        mouse: [0, 0],
        mousedown: false,
        party_mode: "Move Balloons",
        banner_diff: 0,
        shop_rerender: false,
        selected_top: 0,
        selected_skirt: 0,
        selected_shoe: 0,
        selected_necklace: 0,
        selected_top_color: 0,
        selected_skirt_color: 0,
        selected_shoe_color: 0
      }
      g.mode = "decorations"
      return <GameDisplay data={data} globalStore={store}  FPS={60}/>
    } else if(firstInt < firstInts.length){
      return <><img src={"room.png"} className="topleft"/><img src={"casual_girl.png"} className="topleft"/> <div className="text">{firstInts[firstInt]} </div>  <div className='nextButton'><button  onClick={() => {if(firstInt == 0){ setIntro(x => x-1) } else {setFirstInt(x => x-1)}}}>Prev</button> <button  onClick={() => setFirstInt(x => x+1)}>Next</button></div></>
    } else if(firstInt == firstInts.length) {
      
      let data = clone_gamedata(data_obj_shop);
      data.g = g;
      let store : globalStore_type = {
        display: {
          "button": [["finish", [10, HEIGHT, 40, 40], "FINISH"]],
          "canvas": [["main", [0, 0, WIDTH, HEIGHT]], ["anim_frame", [0, 0, WIDTH, HEIGHT]]],
          "image": [],
          "text": []
        },
        props_to_run: [],
        mouse: [0, 0],
        mousedown: false,
        party_mode: "Move Balloons",
        banner_diff: 0,
        shop_rerender: false,
        selected_top: 0,
        selected_skirt: 0,
        selected_shoe: 0,
        selected_necklace: 0,
        selected_top_color: 0,
        selected_skirt_color: 0,
        selected_shoe_color: 0
      }

      data.prop_fns["finish"]= function(){ setFirstInt(x => x+1)}
      g.mode = "shopping"
      return <GameDisplay data={data} globalStore={store}  FPS={60}/>
    } else if(secondInt < secondInts.length){
      return <><img src={"room.png"} className="topleft"/><img src={"casual_girl.png"} className="topleft"/> <div className="text">{secondInts[secondInt]} </div>  <div className='nextButton'><button  onClick={() => {if(secondInt == 0){ setFirstInt(x => x-1) } else {setSecondInt(x => x-1)}}}>Prev</button> <button  onClick={() => setSecondInt(x => x+1)}>Next</button></div></>
    } else {
      let data = clone_gamedata(data_obj_stage);
      data.g = g;
      let store : globalStore_type = {
        display: {
          "button": [["finish", [10, HEIGHT, 40, 40], "FINISH"]],
          "canvas": [["main", [0, 0, WIDTH, HEIGHT]], ["anim_frame", [0, 0, WIDTH, HEIGHT]]],
          "image": [],
          "text": [["Current Mode : Move Balloons", WIDTH - 300, HEIGHT + 10]]
        },
        props_to_run: [],
        mouse: [0, 0],
        mousedown: false,
        party_mode: "Move Balloons",
        banner_diff: 0,
        shop_rerender: false,
        selected_top: 0,
        selected_skirt: 0,
        selected_shoe: 0,
        selected_necklace: 0,
        selected_top_color: 0,
        selected_skirt_color: 0,
        selected_shoe_color: 0
      }
      return <GameDisplay data={data} globalStore={store}  FPS={60}/>
    }
  }
}

export default App

/*



*/