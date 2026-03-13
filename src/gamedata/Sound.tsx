import { useState } from "react"
import { getMuted, setMuted } from "../Sound";


function Sound_el(props : {x : number, y : number }){
    let {x,y} = props; 
    const [sound, setSound] = useState<boolean>( !getMuted()); 
    return <img src={sound ? "sound on.png" : "sound off.png"} style={{position:"absolute", top:y, left: x, zIndex: 9999}} onClick={() => {setMuted(sound);console.log("clicked"); setSound(!getMuted())}} />
}

export default Sound_el