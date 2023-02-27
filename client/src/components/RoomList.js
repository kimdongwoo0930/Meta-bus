import styled from "styled-components";
import item from "./data.json";
import PhaserGame from "../PhaserGame";
import {useState} from "react";
import {useRecoilState} from "recoil";
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

const RoomList = ({RoomId, Member,setState}) => {

    const Join = () => {
        // if(!RoomId === "") {
        const boot = PhaserGame.scene.keys.boot
        boot.scene.start('boot', {RoomId : RoomId})
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
    const [selectRoom,setSelectRoom] = useRecoilState(SelectRoomState)


    return(

        <RoomLists>
        {item.data.map((Item) => {
                return(
                    <RoomList RoomId={Item.RoomId} Member={Item.Member} setState={setSelectRoom}/>
                );
            })}
        </RoomLists>
    );
}