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

    // dress up game 
    selected_top : number
    selected_skirt : number
    selected_shoe : number,
    selected_necklace : number,
    selected_top_color : number,
    selected_skirt_color : number,
    selected_shoe_color : number
}
export type events_type = any;