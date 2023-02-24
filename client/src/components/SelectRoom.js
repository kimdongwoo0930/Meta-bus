import styled from "styled-components";
import {useState} from "react";
import PhaserGame from "../PhaserGame";
import Boot from "../scenes/Boot"


const BackDrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Wrapper = styled.div`
  background-color: #222639;
  border-radius: 15px;
  padding: 30px;
`

const Title = styled.h1`
  font-size: 24px;
  color: #eee;
  text-align: center;
`

const RoomIdInput = styled.input`
  background-color: gray;
  border-radius: 15px;
  width: 100%;
  height: 30px;
  font-size: 20px;
  margin-bottom: 30px;
`
const JoinButton = styled.button`
  width: 150px;
  height: 30px;
  border-radius: 35px;
`




export default () => {
    const [RoomId,setRoomId] = useState("");
    const [RoomJoin,setRoomJoin] = useState(false);



    const Join = () => {
        // if(!RoomId === "") {
            if (!RoomJoin) {
                const boot = PhaserGame.scene.keys.boot
                boot.scene.start('boot', {RoomId : RoomId})
                setRoomJoin(true)
            }
        // }
    }
    const JoinPublic = () => {
        // if(!RoomId === "") {
        if (!RoomJoin) {
            const boot = PhaserGame.scene.keys.boot
            boot.scene.start('boot', {RoomId : 'public'})
            setRoomJoin(true)
        }
        // }
    }




    return(
        <>
        { !RoomJoin ? (
            <BackDrop>
            <Wrapper>
                <Title>방 번호를 입력해주세요</Title>
                <RoomIdInput
                    type={"text"}
                    value={RoomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
                <div style={{ width : "100%", alignItems : 'center', justifyItems : "center", flexDirection : 'row' }}>
                    <JoinButton onClick={Join}>이름으로 참가</JoinButton>
                    <JoinButton onClick={JoinPublic}>public 참가</JoinButton>
                </div>
            </Wrapper>
        </BackDrop>) : (<></>)
        }
        </>
    );
}