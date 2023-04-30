import React, { useState, useEffect, useRef, useContext} from "react";
import {SocketContext} from "../service/Network";
import { Peer } from 'peerjs'
import Video from "./Video";
import styled from "styled-components";
import { MdVideocam, MdVideocamOff } from "react-icons/md";
import { BsFillDoorClosedFill, BsFillDoorOpenFill } from "react-icons/bs";
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { useSelector, useDispatch } from "react-redux";
import store from "../store";
import { setting_peerId, setting_socketId } from "../store/playerInfoSlice"

const VideoGrid = styled.div`
  display: flex;
  overflow: auto;
  justify-content: center;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export default () => {
    const socket = useContext(SocketContext)
    const [microphone,setMicrophone] = useState(true);
    const [camera, setCamera] = useState(true)

    const [otherStream,setOtherStream] = useState({});

    const currentUserVideoRef = useRef(null);
    const peerInstance = useRef();

    const [peerId,setPeerId] = useState({})


    const [quit,setQuit] = useState(false)

    const closePlayerList = useSelector(state => state.closePlayerList.value)
    const roomId = useSelector(state => state.playerInfo.roomId)



  // const TranVideo = () => {
  //   const videoTrack = currentUserVideoRef.current.srcObject.getVideoTracks();
  //     videoTrack[0].enabled = !camera
  //     setCamera(!camera)
  // }

  // useEffect(() => {
  //   const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // 자신의 카메라 권한및 마이크 권한 받아오기
  //   getUserMedia({ video : camera, audio : microphone }, (mediaStream) => {
  //     currentUserVideoRef.current.srcObject = mediaStream
  //   })
  // },[camera, microphone])

  useEffect(() => {
    console.log(peerId)
  },[peerId])



  useEffect(() => {
    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // 자신의 카메라 권한및 마이크 권한 받아오기
    const peer = new Peer()
    peerInstance.current = peer;
    
    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      // 내 카메라 stream을 자신의 Ref에 넣어준다
      currentUserVideoRef.current.srcObject = mediaStream  
    });

    peer.on('open', (id) => {
      console.log("전송됨?")
      socket.emit("Join-Peer",{ socketId : socket.id , PeerId : id, RoomId : roomId});
      store.dispatch(setting_peerId(id))
    });
    

    peer.on('call', (call) => {
      console.log("?")
      // call 이오면 답을 해주고 stream 안에 영상을 나올수 있게 추가를 해준다.
        const peerID = call.peer;
            call.answer(currentUserVideoRef.current.srcObject)
            call.on('stream',(remoteStream) => {
              setOtherStream(preState => ({
                ...preState,
                [peerID] : remoteStream
              }))
              setPeerId(preState => (
                { ...preState, [peerID] : call.metadata.socketId }
              ))
            });
        })
  },[]);

  useEffect(()=>{
    socket.on("disconnect-peer",({ peerId })=>{
      setOtherStream(preState => {
        const { [peerId] : removed,  ...newPerson } = preState;
        return newPerson;
      })  
    })


    socket.on("New-Player", ({ socketId , peerId }) => {
      console.log(socketId, peerId)
      setPeerId(preState => (
        { ...preState, [peerId] : socketId }
      ))
      const metadata = { socketId : socket.id }
      const call = peerInstance.current.call(peerId, currentUserVideoRef.current.srcObject, { metadata })
      
      call.on('stream', (remoteStream) => {
        setOtherStream(preState => ({
          ...preState,
          [call.peer] : remoteStream
        }))
      });
    })

    // socket.on("close-User-Return",({ List, Nicks }) => {
    //   console.log(Nicks)
    //     setCloseList(List)
    //     setNicks(Nicks)
    // })
  },[socket])

  return (
    <Container>
      <VideoGrid>
        <div style= {{ position : "absolute", bottom : 10, right : 10}}>
          <video ref={currentUserVideoRef} muted  autoPlay style={{ width : 200, height : 150, margin : 10, borderRadius : 30 }}/>
          <div style={{ position : "absolute", top : 15, right : 25, color : "white", backgroundColor : "black", borderRadius : 5 }}>You</div>
        </div>
        {
          Object.entries(otherStream).map(([key, value]) => {
            console.log(closePlayerList)
            console.log(peerId[key])
            if(value && closePlayerList.includes(peerId[key])){ 
            return <Video stream={value} key={key}></Video> 
          }
          })
        }
      </VideoGrid>
    
      <div style={{ position : "absolute",width : "100vw",height : "5%", bottom : 0 , textAlign : "center"}}>
        <div className="Menu-Bar" style={{width : "50%", backgroundColor: "#61dafb", height : "70%" , borderRadius : 30, justifyContent : "space-between", flexDirection : "row", display :"inline-flex", maxWidth : 500}}>
          <div className="Mike-Cam" style={{ display : "flex" , marginLeft : 15, marginTop : 5}}>
          {microphone ? <FaMicrophone size={28} onClick={() => setMicrophone(false)}  style={{ paddingRight : 20 }}/> : <FaMicrophoneSlash size={28} onClick={() => setMicrophone(true)} style={{ paddingRight : 20 }}/>}
          {camera ? <MdVideocam size={28} onClick={() => setCamera(false)}/> : <MdVideocamOff size={28} onClick={() => setCamera(true)}/>}
          </div>
          <div className="Quit" style={{ marginRight : 15, marginTop : 5 }}>
            <div onMouseEnter={() => setQuit(true)} onMouseLeave={()=> setQuit(false)} onClick={() =>  window.location.reload() }>
              {quit ? < BsFillDoorOpenFill size={28} /> : <BsFillDoorClosedFill size={28}/>}
            </div>
          </div>
        </div>
      </div>
      </Container>
      
  );
};