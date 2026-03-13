import { animation } from "../animations";
import { d_image } from "../canvasDrawing";
import { game_interface, point3d } from "../interfaces";
import { lerp, moveTo, point_to_color } from "../lines";
import { displace_command } from "../rotation";
import game from "./game";
import { globalStore_type } from "./globalStore";


class X implements animation<game>{
    t : number
    canvas = "anim_frame";
    x : number
    y : number
    constructor(x : number, y : number){
        this.t = 100; 
        this.x = x;
        this.y = y
    }
    update(g: game, globalStore: globalStore_type){
        this.t --; 
        return this.t < 0;
    }
    draw ( g: game, globalStore: globalStore_type){
        console.log("drawing");
        let command : draw_command = {"type":"drawPolygon","points_x":[-11.107122552876326,-15.9522900395717,-5.48672826830969,-16.921323536910776,-10.913315853408513,-0.2539473826786889,13.700134979003977,20.677176159845317,6.529287098694823,17.57626896836028,11.374454585390197,0.5212794151925664],"points_y":[-17.009060241675627,-12.55150615391588,1.402576207766785,16.325692066788534,22.139893050822977,5.27871019712309,21.558472952419535,10.511491082754091,2.371609705105868,-13.520539651254957,-17.59048034007907,-4.7992381752032856],"fill":true,"color":`rgba(255, 0, 0, ${this.t/100})`};
        command = displace_command(command, [this.x,this.y]);
        return [command]; 
    }
    
    
}
export default X;