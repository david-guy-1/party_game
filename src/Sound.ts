import { useEffect, useState } from "react";
import { createContext } from 'react';


var sound_obj : HTMLAudioElement = new Audio(undefined); 
var playing : string | undefined =  undefined;

var playing_sounds : HTMLAudioElement[]= [];
var muted : boolean = false; 

export function playSound(s : string){
    if(!muted){
        var sound = new Audio(s);
        sound.play();
        playing_sounds.push(sound);
    }    
}

export function toggleMute(){
    muted = !muted
    if(muted){
        for(var sound_it of playing_sounds){
            sound_it.pause(); 
        }
        sound_obj.pause();
    } else {
        sound_obj.play();
    }
}

export function setMuted(x : boolean){
    if(x != muted){
        toggleMute();
    }
}

export function changeSound(s : string | undefined){
    if(s == getCurrentTrack()){
        return ; 
    }
    // stop  the current sound
    sound_obj.pause(); 

    // and create a new sound 
    if(s != undefined){ // create a new sound obj
        sound_obj = new Audio(s);
        sound_obj.loop = true;
        if(!muted){
            sound_obj.play();
        }
    } else { 
        sound_obj = new Audio(undefined); ;
    }
    playing = s;
}

export function getCurrentTrack(){
    return playing;
}

export function getMuted(){
    return muted; 
}

