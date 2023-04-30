import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import {SocketContext} from "../service/Network";
import PhaserGame from "../PhaserGame";
import store from "../store";
import { SET_CREATEROOM, SET_ROOMLIST } from "../store/roomStateSlice";
import { useSelector } from "react-redux";
import { setting_RoomId } from "../store/playerInfoSlice";

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

const Wrapper = styled.div`
  background: #222639;
  border-radius: 16px;
  padding: 20px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`

export default () => {
    const socket = useContext(SocketContext)
    const [usePassword,setUsePassword] = useState(false)
    const [password,setPassword] = useState("")
    const [roomName,setRoomName] = useState("")
    const [maxSize,setMaxSize] = useState(2)

    const nickname = useSelector(state => state.playerInfo.nickname)
    const roomId = useSelector(state => state.playerInfo.roomId)



    useEffect(() => {
        socket.on("RoomCreateReturn",({ result, name }) => {
            if (result) { 
                store.dispatch(SET_CREATEROOM(true))
                store.dispatch(setting_RoomId(name))
                const boot = PhaserGame.scene.keys.boot
                boot.scene.start('boot', {RoomId : name, socket : socket, nickname : nickname })
             }
            else { alert("이미 존재하는 방이름입니다.\n ") }
        })
    },[socket])

    const CreateRoom = () => {
        if(roomId.trim() === ""){ alert("방 이름을 확인해주세요."); return 0 }
        else if(usePassword && password.trim() === ""){ alert("비밀번호를 입력해주세요."); return 0 } 
        // else if (!OKpassword) { socket.emit("CheckRoomName",{RoomName : roomName}); return 0 }
        else { 
            socket.emit("CreateRoom",{ Name : roomId, Password : (usePassword) ? password : "", MaxSize : maxSize, Maker : nickname })
        }
    }
    

    return(
        <Backdrop>
            <Wrapper>
                <div className="뒤로가기 버튼 영역" style={{ position : "absolute", top : 10, left : 10, cursor : "pointer" }}>
                    <div style={{ color : "white", fontWeight : "bold" }} onClick={() => { store.dispatch(SET_ROOMLIST(false)) }}>뒤로가기</div>
                </div>
                <div className="제목 영역" style={{ minWidth : 300, textAlign : "center"}}>
                    <div style={{ color : "white", fontWeight : "bold", fontSize : 25, marginTop : -10, marginBottom : 50 }}>방 만들기</div>
                </div>
                <div className="아이디 비밀번호 입력 영역" style={{ maxWidth : 300, textAlign : "center"}}>
                    <input placeholder="방 이름을 입력해주세요." value={roomId}   onChange={(e) => {store.dispatch(setting_RoomId(e.target.value))}} style={{ borderWidth : 0, borderBottomWidth : 1, backgroundColor : "#222639", borderColor : "#61dafb", minWidth : 300 , textAlign : "center", marginBottom : 30, outline : "none", color : "white"}}/>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} disabled={!usePassword} placeholder={!usePassword ? "" : "비밀번호를 입력해주세요."} style={{ borderWidth : 0, borderBottomWidth : 1, backgroundColor : "#222639", borderColor : "#61dafb", minWidth : 300 , textAlign : "center", outline : "none" , color : "white"}}/>
                </div>
                <div className="비밀번호 사용 체크박스 영역" style={{ display : "flex", marginTop : 10}}>
                    <input type={"checkbox"} checked={usePassword} onChange={({ target: { checked } }) =>setUsePassword(checked)}/>
                    <div style={{ color : "gray", fontSize : 11, marginTop : 4, marginLeft : 5}}>비밀번호 사용하기</div>
                </div>
                <div className="최대 인원 선택 영역" style={{ marginTop : 30, minWidth : 300, display : "flex" }}>
                    <div style={{ color : "white", fontWeight : "bold", marginRight : 10}}>최대인원 : </div>
                    <input type={"number"} value={maxSize} onChange={(e) => setMaxSize(e.target.value)} min={2} max={10} style={{ width : 50, marginRight : 20 }}/>
                    <div style={{ color : "#61DAFB" }}>( 2 ~ 10 )</div>
                </div> 
                <div className="생성 버튼 영역" style={{ minWidth : 300, textAlign : "center", marginTop : 30 }}> 
                    <button onClick={() => CreateRoom()} style={{ width : 250, height : 40, borderRadius : 30, backgroundColor : "#3476DA" , borderWidth : 0, fontWeight : "bold", cursor:"pointer" }}>생성</button>
                </div>
            </Wrapper>
        </Backdrop>
    );   
}