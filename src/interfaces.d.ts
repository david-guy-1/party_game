import { animation } from "./animations";


interface game_interface{ // just the model
    tick : () => events_type[],
}
type make_game_type = () => game_interface; 
type point = [number, number];
type point3d = [number, number,number];
type rect = [number, number, number, number]; //all rects are width/height (not tl/br)

// the Record<string, any>? at the end of all these are extra styles

type display_type = {
    refs ?: React.MutableRefObject<Record<string, HTMLCanvasElement>> 
    "canvas" : [string, rect, Record<string, any>?][] // width/height
    "button" : [string, rect, string, string?, Record<string, any>?][] //name, rect (wh), third arg is text to display, fourth is image on button
    "image" : [string, boolean , number, number,number?,number?, Record<string, any>?][] // string - image path, boolean - true = div, false = img element;  x,y,w,h : images are displayed under all buttons and canvases  - w and h must be there if img is a div. to display an image on a canvas use drawImage. 
    "text" : [string, number, number, Record<string, any>? ][]   // text, x, y
}

type props_to_run = [string, any][]

type draw_fn_type = (g : any, globalStore : globalStore_type , events : events_type[] , canvas : string) => [draw_command[], boolean]; // true = should clear the canvas
type anim_fn_type = (g : any, globalStore : globalStore_type ,events : events_type[] ) => animation[]
type sound_fn_type = (g : any, globalStore : globalStore_type ,events : events_type[] ) => [string | undefined, string[]]; // undefined = do not change, "mute" : nothing 
type prop_commands_type = (g : any,globalStore : globalStore_type , events  :events_type[]) => props_to_run; 
type button_click_type = (g : any, globalStore : globalStore_type ,name : string) => props_to_run; 
type reset_fn_type = () => any; 

type init_type = (g : any,globalStore : globalStore_type ) => any; 

type gamedata = {g ?: game_interface,draw_fn : draw_fn_type, anim_fn : anim_fn_type, sound_fn : sound_fn_type, init : init_type, button_click : button_click_type, prop_commands : prop_commands_type, reset_fn : reset_fn_type , prop_fns : Record<string, (g : any,globalStore : globalStore_type,  s : any) => any > }
/*
 top left, top right, width, height
*/

