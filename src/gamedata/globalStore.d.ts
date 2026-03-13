import { display_type, point, props_to_run } from "../interfaces";

export type party_modes = "Move Balloons" | "Color Balloons" | "Move Ribbons" | "Color Ribbons" | "Move Flowers" | "Color Flowers" | "Move Banner";

export type globalStore_type = {
    props_to_run : props_to_run
    display : display_type
    mouse : point
    banner_diff : number
    mousedown : boolean
    clicked_balloon ?: number 
    clicked_ribbon ?: number
    clicked_flower ?: number
    party_mode : party_modes
    shop_rerender : boolean
    decoration_image ?: string;

}
export type events_type = any;