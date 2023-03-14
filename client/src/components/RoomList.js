import styled from "styled-components";
import PhaserGame from "../PhaserGame";
import {useContext, useEffect, useState} from "react";
import {useRecoilState} from "recoil";

import {SocketContext} from "../service/Network";
import {SelectRoomState} from "../redux/atoms";


const ListView = styled.div`
  width: 400px;
  display: flex;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  justify-content: space-between;
  background-color: #61dafb;
  height: 50px;
  border-radius: 10px;
  
  text{
    justify-self: center;
    align-self: center;
  }
  button{
    width : 80px;
    height : 25px;
    background : #222639 ;
    color : #61dafb;
    border-radius: 15px;
    border-color : #61dafb;
  }
`

const RoomLists = styled.div`
  overflow : scroll;
  height : 500px;

  &::-webkit-scrollbar {
    display: none;
  }
`

const RoomList = ({RoomId, Member,setState, socket}) => {

    const Join = () => {
        // if(!RoomId === "") {
        const boot = PhaserGame.scene.keys.boot
        boot.scene.start('boot', {RoomId : RoomId, socket : socket})
        setState(false)
    }
    // }
    return(
        <ListView>
            <text style={{ marginLeft : 15 }}>{RoomId}</text>
            <button onClick={Join}>참가</button>
            <text style={{ marginRight : 15 }}>{Member}명</text>
        </ListView>
    );
}

export default () => {
    const socket = useContext(SocketContext)

    const [selectRoom,setSelectRoom] = useRecoilState(SelectRoomState)
    const [Rooms, setRooms] = useState([])
    const [roomSize, setRoomSize] = useState({})
    const [roomList, setRoomList] = useState([])
    const [connect,setConnect] = useState(false)


    useEffect(()=>{
        socket.emit("RoomList")
        socket.on("RoomListReturn",({ RoomSizes }) => {
            setRoomSize(RoomSizes)
        })
        socket.on("RoomListRefresh",({RoomSizes}) => {
            setRoomSize(RoomSizes)
        })
    },[socket])



    return(

        <RoomLists>
            {Object.entries(roomSize).map(([key,value]) => {
                return(
                    <RoomList RoomId={key} Member={value} setState={setSelectRoom} socket={socket}/>
                );
            })}
        </RoomLists>
    );
}