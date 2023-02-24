import React , { useEffect, useState, useRef}from "react";
import "./App.css";
import styled from "styled-components";
import Peer from "peerjs";

import Videos from "./components/Videos"
import SelectRoom from "./components/SelectRoom";
import Socket from "./service/Socket";

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;




function App() {

    // const [peerId, setPeerId] = useState(null);
    // const [remotePeerIdValue, setRemotePeerIdValue] = useState(null);
    // const remoteVideoRef = useRef(null);
    // const peerInstance = useRef(null);
    // const currentUserVideoRef = useRef(null);
    // const list = {1:123,2:3123,3:4421}
    //
    //
    // useEffect(() => {
    //     const peer = new Peer();
    //     peer.on("open", (id) => {
    //         setPeerId(id);
    //     });
    //
    //     peer.on("call", (call) => {
    //         var getUserMedia =
    //             navigator.getUserMedia ||
    //             navigator.webkitGetUserMedia ||
    //             navigator.mozGetUserMedia;
    //
    //         getUserMedia({video: true, audio: true,},  (mediaStream) => {
    //             currentUserVideoRef.current.srcObject = mediaStream;
    //             currentUserVideoRef.current.play();
    //             call.answer(mediaStream);
    //             call.on("stream", (remoteStream) => {
    //                 remoteVideoRef.current.srcObjcet = remoteStream;
    //                 remoteVideoRef.current.play();
    //             });
    //         });
    //     });
    //     peerInstance.current = peer;
    // },[]);
    //
    // const call = (remotePeerId) => {
    //     const getUserMedia =
    //         navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    //
    //     try{
    //         getUserMedia({video: true, audio: true}, (mediaStream) => {
    //             currentUserVideoRef.current.srcObject = mediaStream;
    //             currentUserVideoRef.current.play();
    //
    //             const call = peerInstance.current.call(remotePeerId, mediaStream);
    //
    //             call.on("stream", (remoteStream) => {
    //                 remoteVideoRef.current.srcObject = remoteStream;
    //                 remoteVideoRef.current.play();
    //             });
    //         });
    //     }
    //     catch (e){
    //         console.log(e)
    //     }
    // };

return (
    <Backdrop>
        <SelectRoom socket={Socket}/>

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
);
}

export default App;
