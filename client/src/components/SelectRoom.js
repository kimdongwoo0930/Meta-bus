import styled from "styled-components";
import {useState} from "react";
import PhaserGame from "../PhaserGame";
import Boot from "../scenes/Boot"
import RoomList from "./RoomList";
import item from "./data.json";
import {useRecoilState, useSetRecoilState} from "recoil";
import {SelectRoomState} from "../redux/atoms";


const Wrapper = styled.div`
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`
const TitleWrapper = styled.div`
  display: grid;
  width: 100%;
  
  h1{
    grid-column: 1;
    grid-row: 1;
    justify-self: center;
    align-self: center;
    color: #61dafb;
  }
`

const JoinButton = styled.button`
  width: 150px;
  height: 30px;
  border-radius: 35px;
  margin: 0px 10px;
`




export default () => {
    const [selectRoom,setSelectRoom] = useRecoilState(SelectRoomState)


    const [RoomId,setRoomId] = useState("");
    const [RoomJoin,setRoomJoin] = useState(false);
    const [RoomLists,setRoomLists] = useState(false);




    const Join = () => {
        // if(!RoomId === "") {
            if (!RoomJoin) {
                const boot = PhaserGame.scene.keys.boot
                boot.scene.start('boot', {RoomId : RoomId})
                setSelectRoom(false)
            }
        // }
    }
    const JoinPublic = () => {
        // if(!RoomId === "") {
        if (!RoomJoin) {
            const boot = PhaserGame.scene.keys.boot
            boot.scene.start('boot', {RoomId : 'public'})
            setSelectRoom(false)
        }
        // }
    }






    return(
        <>
        { !RoomJoin ? (
            <Wrapper>
                <TitleWrapper>
                    <h1>메타버스</h1>
                </TitleWrapper>

                <div style={{ width : "100%", alignItems : 'center', justifyItems : "center", flexDirection : 'row' }}>
                    <JoinButton onClick={() => setRoomJoin(true)}>방 참가 / 생성</JoinButton>
                    <JoinButton onClick={JoinPublic}>public 참가</JoinButton>
                </div>
            </Wrapper>) : !RoomLists ? (
                <Wrapper>
                    <TitleWrapper>
                        <h1>방 목록</h1>
                    </TitleWrapper>
                    <RoomList />

        </Wrapper>
        ) : (<></>)
        }
        </>
    );
}