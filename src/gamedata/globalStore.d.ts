import { display_type, point, props_to_run } from "../interfaces";

export type globalStore_type = {
    props_to_run : props_to_run
    display : display_type
    mouse : point
    mousedown : boolean
    clicked_balloon ?: number 
}
export type events_type = any;