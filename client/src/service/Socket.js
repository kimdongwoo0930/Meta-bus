import {io} from "socket.io-client";
import { createContext} from "react";

export default class Socket{
    LOCAL_DOMAINS = ["localhost","192.168.0.140",""]
    socket
    roomId
    constructor() {
        if(this.LOCAL_DOMAINS.includes(window.location.hostname)){
            this.socket = io("localhost:3000")
        }else{
            this.socket = io("211.58.5.66:3000")
        }
    }

    JoinTheRoom(RoomId){
        this.socket.emit("JoinRoom",{ RoomId : RoomId})
        this.roomId = RoomId
    }

    Connected(){
        this.socket.emit("otherPlayer",{RoomId : this.roomId})
        this.socket.emit("JoinNew",{ RoomId : this.roomId})
    }





}