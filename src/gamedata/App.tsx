import React, { useState } from 'react'
import game from './game';

import { data_obj as data_obj_deco } from './GameData_deco';

import { data_obj as data_obj_shop, SHOP_SCROLL_SPEED } from './GameData_shop';
import {data_obj as data_obj_stage} from "./GameData_stage";
import {data_obj as data_obj_dressup} from "./GameData_dressup";
import {data_obj as data_obj_drive} from "./GameData_drive";
import {data_obj as data_obj_final} from "./GameData_final";
import { events } from '../EventManager';
import GameDisplay, { clone_gamedata } from '../GameDisplay';
import { gamedata } from '../interfaces';
import { all_combos, dist } from '../lines';
import { globalStore_type } from './globalStore';
import Sound_el from './Sound';
import { changeSound } from '../Sound';
import { loadImage } from '../canvasDrawing';

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

const thirdInts = [
  "I've got the activities, snacks and decorations up. What's next?",
  "I don't know! Oh wait... I just remembered!",
  "I need an outfit!"
]

const fourthInts = [
  "While I was picking my outfit, the bakery just called me.",
  "My cake is ready!",
  "Also, why am I not in that outfit right now?",
  "It's because it's not my birthday yet",
  "And I'll wait until the party to put it on.",
  "Anyways, I'm going to go now!"
]
const fifthInts = ["I've got my cake, it's all done!", "Nothing else needs to be done!", "Time to party!"]
function App() {
  const [g, setG] = useState<game | undefined>(undefined);
  const [intro, setIntro] = useState(0); 
  const [firstInt, setFirstInt] = useState(0);
  const [secondInt, setSecondInt] = useState(0);
  const [thirdInt, setThirdInt] = useState(0);
  const [fourthInt, setFourthInt] = useState(0);
  const [fifthInt, setFifthInt] = useState(0);
  const [image, setImage] = useState("vite.svg");
  const [message, setMessage] = useState(""); 
  const [r, rerender] = useState(false)
  if(g == undefined){
    ['bakery.png', 'box.png', 'cake.png', 'casual_girl.png', 'dance.png', 'friends.png', 'girl side.png', 'intro.png', 'introbox.png', 'just table.png', 'only table.png', 'painting.png', 'painting2.png', 'photobooth.png', 'photobooth2.png', 'room.png', 'room2.png', 'sausage.png', 'sound off.png', 'sound on.png', 'tv screen.png'].forEach(x => loadImage(x));
    return <button onClick={() => setG(new game())}>START</button>
  } else {

//
    // INTRO 
    if(intro < intros.length){
      changeSound("output.mp3");
      return <><Sound_el x={WIDTH} y={0} /> <img src={intro < 5 ? "room.png" : "box.png" } className="topleft"/> {intro < 5 ? <img src={"casual_girl.png"} className="topleft"/>: null}<div className="text">{intros[intro]} </div>  <div className='nextButton'>{intro != 0 ? <button  onClick={() => setIntro(x => x-1)}>Prev</button> : "-------"} <button  onClick={() => setIntro(x => x+1)}>Next</button></div></>
    } else if(intro == intros.length) { // start decorations
      
      changeSound("output2.mp3");
      // get gameData
      let data = clone_gamedata(data_obj_deco); 
      data.g = g;
      
      data.prop_fns["new_game"] =  function(){setG(undefined)};
      data.prop_fns["next"]= function(x,y,img){ setImage(img); setIntro(x => x+1)}
      // register event listener;
      events["mousemove a"] = [move_canvas, g]
      events["mousedown a"] = [dec_down, g]
      events["mouseup a"] = [dec_up, g]
      let store : globalStore_type = {
        display: {
          "button": [["change_mode|Move Balloons", [WIDTH, 0, 100,40], "Move Balloons"], ["change_mode|Color Balloons", [WIDTH, 50, 100,40], "Color Balloons"], ["change_mode|Move Ribbons", [WIDTH, 100, 100,40], "Move Ribbons"], ["change_mode|Color Ribbons", [WIDTH, 150, 100,40], "Color Ribbons"], ["change_mode|Move Flowers", [WIDTH, 200, 100,40], "Move Flowers"], ["change_mode|Color Flowers", [WIDTH, 250, 100,40], "Color Flowers"], ["change_mode|Move Banner", [WIDTH, 300, 100,40], "Move Banner"], ["next", [WIDTH - 400, HEIGHT, 60, 40], "NEXT"]],
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

      }
      g.mode = "decorations"
      return <> <GameDisplay data={data} globalStore={store}  FPS={60}/><Sound_el x={WIDTH} y={0} /> </>
    } else if(firstInt < firstInts.length){
      
      changeSound("output.mp3");
      return <><Sound_el x={WIDTH} y={0} /><img src={"room2.png"} className="topleft"/><img src={"casual_girl.png"} className="topleft"/> <img src={image}  className="decoimage"/> <div className="text">{firstInts[firstInt]} </div>  <div className='nextButton'><button  onClick={() => {if(firstInt == 0){ setIntro(x => x-1) } else {setFirstInt(x => x-1)}}}>Prev</button> <button  onClick={() => setFirstInt(x => x+1)}>Next</button></div></>
    } else if(firstInt == firstInts.length) {
      
      changeSound("output2.mp3");
      let data = clone_gamedata(data_obj_shop);
      data.g = g;
      let store : globalStore_type = {
        display: {
          "button": [["finish", [10, HEIGHT, 140, 40], "FINISH"]],
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

      }

      data.prop_fns["finish"]= function(){ setFirstInt(x => x+1)}
      g.mode = "shopping"
      return <> <GameDisplay data={data} globalStore={store}  FPS={60}/><Sound_el x={WIDTH} y={0} /> </>
    } else if(secondInt < secondInts.length){
      
      changeSound("output.mp3");
      return <><Sound_el x={WIDTH} y={0} /><img src={"room2.png"} className="topleft"/><img src={"casual_girl.png"} className="topleft"/> <img src={image}  className="decoimage"/> <div className="text">{secondInts[secondInt]} </div>  <div className='nextButton'><button  onClick={() => {if(secondInt == 0){ setFirstInt(x => x-1) } else {setSecondInt(x => x-1)}}}>Prev</button> <button  onClick={() => setSecondInt(x => x+1)}>Next</button></div></>
    } else if(secondInt == secondInts.length){
      
      changeSound("output2.mp3");
      // display the images, with a border if they're selected 
      return <>
      <img src="dance.png" style={{"position":"absolute","top":50, "left":50, "border" : (g.dance_selected ? "3px solid green" : "3px solid transparent")}} onMouseOver={() => setMessage("A dance floor with lights")}  onMouseOut={() => setMessage("")} onClick={()  =>{ g.dance_selected = !g.dance_selected; rerender(x => !x)} } />
      <img src="painting.png" style={{"position":"absolute","top":10, "left":450, "border" : (g.paint_selected ? "3px solid green" : "3px solid transparent")}}  onMouseOver={() => setMessage("I like painting. Maybe some of my friends do too.")}  onMouseOut={() => setMessage("")} onClick={()  =>{ g.paint_selected = !g.paint_selected; rerender(x => !x)} } />
      
      <img src="photobooth.png" style={{"position":"absolute","top":300, "left":10, "border" : (g.booth_selected ? "3px solid green" : "3px solid transparent")}} onClick={()  =>{ g.booth_selected = !g.booth_selected; rerender(x => !x)} }  onMouseOver={() => setMessage("A photobooth. We'll be all dressed up and fancy so we need to take good photos!")}  onMouseOut={() => setMessage("")} />
      <img src="tv screen.png" style={{"position":"absolute","top":301, "left":309, "border" : (g.screen_selected ? "3px solid green" : "3px solid transparent")}}  onMouseOver={() => setMessage("Perhaps we can watch a movie together?")}  onMouseOut={() => setMessage("")} onClick={()  =>{ g.screen_selected = !g.screen_selected; rerender(x => !x)} } />
      <div style={{"position":"absolute","top":301, "left":609}}>{message}</div>
      <button onClick={() => {setSecondInt(x => x+1)}} style={{"position":"absolute","top":101, "left":809, width:100, height:100}}> Finish</button>
         </>
    } else if(thirdInt < thirdInts.length ){
      
      changeSound("output.mp3");
      return <><Sound_el x={WIDTH} y={0} /><img src={"room2.png"} className="topleft"/><img src={"casual_girl.png"} className="topleft"/> <img src={image}  className="decoimage"/> <div className="text">{thirdInts[thirdInt]} </div>  <div className='nextButton'><button  onClick={() => {if(thirdInt == 0){ setSecondInt(x => x-1) } else {setThirdInt(x => x-1)}}}>Prev</button> <button  onClick={() => setThirdInt(x => x+1)}>Next</button></div></>
    } else if(thirdInt == thirdInts.length) {
      
      changeSound("output2.mp3");
      let data = clone_gamedata(data_obj_dressup); 
      data.g = g;
      
      data.prop_fns["new_game"] =  function(){setG(undefined)};
      data.prop_fns["next"]= function(){ setThirdInt(x => x+1)}
      // register event listener;
      events["mousemove a"] = [move_canvas, g]
      events["mousedown a"] = [dec_down, g]
      events["mouseup a"] = [dec_up, g]
      let store : globalStore_type = {
        display: {
          "button": [["top", [WIDTH - 300, 100, 100, 40], "top",  undefined, {"zIndex": 4}], ["top color", [WIDTH - 300, 140, 100, 40], "top color",  undefined, {"zIndex": 4}], ["skirt", [WIDTH - 300, 180, 100, 40], "skirt",  undefined, {"zIndex": 4}], ["skirt color", [WIDTH - 300, 220, 100, 40], "skirt color",  undefined, {"zIndex": 4}], ["shoe", [WIDTH - 300, 260, 100, 40], "shoe",  undefined, {"zIndex": 4}], ["shoe color", [WIDTH - 300, 300, 100, 40], "shoe color",  undefined, {"zIndex": 4}], ["necklace", [WIDTH - 300, 3100, 40, 40], "necklace",  undefined, {"zIndex": 4}], ["finish", [WIDTH - 300, 500, 100, 40], "finish",  undefined, {"zIndex": 4}]],
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
      }
      g.mode = "decorations"
      return <> <GameDisplay data={data} globalStore={store}  FPS={60}/><Sound_el x={WIDTH} y={0} /> </>
    } else if(fourthInt < fourthInts.length ) {
      
      changeSound("output.mp3");
      return <><Sound_el x={WIDTH} y={0} /><img src={"room2.png"} className="topleft"/><img src={"casual_girl.png"} className="topleft"/> <img src={image}  className="decoimage"/> <div className="text">{fourthInts[fourthInt]} </div>  <div className='nextButton'><button  onClick={() => {if(fourthInt == 0){ setThirdInt(x => x-1) } else {setFourthInt(x => x-1)}}}>Prev</button> <button  onClick={() => setFourthInt(x => x+1)}>Next</button></div></>
    } else if(fourthInt == fourthInts.length){
      
      changeSound("output2.mp3");
        let data = clone_gamedata(data_obj_drive);
        data.g = g;
        g.t = 0;
        g.progress = 0; 
        let store : globalStore_type = {
        display: {
          "button": [],
          "canvas": [["main", [0, 0, WIDTH, HEIGHT]], ["anim_frame", [0, 0, WIDTH, HEIGHT]]],
          "image": [],
          "text": [["Hold mouse down to drive, don't run red lights", 100, HEIGHT-100]]
        },
        props_to_run: [],
        mouse: [0, 0],
        mousedown: false,
        party_mode: "Move Balloons",
        banner_diff: 0,
        shop_rerender: false,
      }
      events["mousedown a"] = [dec_down, g]
      events["mouseup a"] = [dec_up, g]
      data.prop_fns["finish"]= function(){ setFourthInt(x => x+1)}
      g.mode = "driving"
      return <> <GameDisplay data={data} globalStore={store}  FPS={60}/><Sound_el x={WIDTH} y={0} /> </>
    } else if(fifthInt < fifthInts.length){
      
      changeSound("output.mp3");
      return <><Sound_el x={WIDTH} y={0} /><img src={"cake.png"} className="topleft"/><div className="text">{fifthInts[fifthInt]} </div>  <div className='nextButton'><button  onClick={() => {if(fifthInt == 0){ setFourthInt(x => x-1) } else {setFifthInt(x => x-1)}}}>Prev</button> <button  onClick={() => setFifthInt(x => x+1)}>Next</button></div></>
    } else if (fifthInt == fifthInts.length){

      changeSound("output2.mp3");

      let data = clone_gamedata(data_obj_final);
      data.g = g;
      g.t = 0;
      g.progress = 0; 
      let store : globalStore_type = {
        decoration_image : image,
      display: {
        "button": [],
        "canvas": [["main", [0, 0, WIDTH, HEIGHT]], ["a", [0, 0, WIDTH, HEIGHT]],["b", [0, 0, WIDTH, HEIGHT]],["front", [0, 0, WIDTH, HEIGHT]]],
        "image": [[image, false,154,188,347,309, {zIndex : 1} ]],
        "text": []
      },
      props_to_run: [],
      mouse: [0, 0],
      mousedown: false,
      party_mode: "Move Balloons",
      banner_diff: 0,
      shop_rerender: false,
      }
      return <> <GameDisplay data={data} globalStore={store}  FPS={60}/><Sound_el x={WIDTH} y={0} /> </>

    }
  }
}

export default App

/*
// dress up game
          // get gameData

*/