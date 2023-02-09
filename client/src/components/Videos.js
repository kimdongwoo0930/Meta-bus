import styled from "styled-components";
import {useEffect, useRef, useState} from "react";
import Peer from "peerjs";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const Test = styled.div`
  width : 200px;
  height : 150px;
  background-color: blue;
  border-radius: 15px;
  margin-left: 15px;
  margin-top : 10px;
`

export default () => {
    const [peerId, setPeerId] = useState(null);
    const [remotePeerIdValue, setRemotePeerIdValue] = useState(null);
    const remoteVideoRef = useRef(null);
    const peerInstance = useRef(null);
    const currentUserVideoRef = useRef(null);
    const list = {1:123,2:3123,3:4421}


    useEffect(() => {
        const peer = new Peer();
        peer.on("open", (id) => {
            setPeerId(id);
        });

        peer.on("call", (call) => {
            var getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;

            getUserMedia({video: true, audio: true,},  (mediaStream) => {
                currentUserVideoRef.current.srcObject = mediaStream;
                currentUserVideoRef.current.play();
                call.answer(mediaStream);
                call.on("stream", (remoteStream) => {
                    remoteVideoRef.current.srcObjcet = remoteStream;
                    remoteVideoRef.current.play();
                });
            });
        });
        peerInstance.current = peer;
    },[]);

    const call = (remotePeerId) => {
        const getUserMedia =
            navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        try{
            getUserMedia({video: true, audio: true}, (mediaStream) => {
                currentUserVideoRef.current.srcObject = mediaStream;
                currentUserVideoRef.current.play();

                const call = peerInstance.current.call(remotePeerId, mediaStream);

                call.on("stream", (remoteStream) => {
                    remoteVideoRef.current.srcObject = remoteStream;
                    remoteVideoRef.current.play();
                });
            });
        }
        catch (e){
            console.log(e)
        }
    };





    return(
        <Backdrop>
            <div id={"video-grid"}></div>
        </Backdrop>
    );
}
