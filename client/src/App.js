import React , { useEffect, useState, useRef}from "react";
import "./App.css";
import styled from "styled-components";
import {useRecoilState} from "recoil";
import {SelectRoomState} from "./redux/atoms";
import SelectRoom from "./components/SelectRoom";
import { SocketContext, socket } from "./service/Network";

const Backdrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
`




function App() {
    let ui
    const [selectRoom,setSelectRoom] = useRecoilState(SelectRoomState)



    if(selectRoom){
        ui = <SelectRoom/>
    }
    else{
        ui = <></>
    }
return (
    <SocketContext.Provider value={socket}>
    <Backdrop>
        {ui}

        {/*<div*/}
        {/*>*/}
        {/*    <video ref={currentUserVideoRef}/>*/}
        {/*    <video ref={remoteVideoRef}/>*/}
        {/*</div>*/}
        {/*<button onClick={() => call("abc")}>Call</button>*/}
        {/*<h1>Current user id is {peerId}</h1>*/}
        {/*<input*/}
        {/*    type={"text"}*/}
        {/*    value={remotePeerIdValue}*/}
        {/*    onChange={(e) => setRemotePeerIdValue(e.target.value)}*/}
        {/*/>*/}
    </Backdrop>
    </SocketContext.Provider>
);
}

export default App;
