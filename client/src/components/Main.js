import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import React from "react";
import {SocketContext} from "../service/Network";
import {BallTriangle} from "react-loader-spinner"
import store from "../store";
import { setting_Nickname, setting_socketId } from "../store/playerInfoSlice";
import { SET_JOINGAME } from "../store/roomStateSlice";


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
    const [Nickname,setNickname] = useState("")
    const [readySocket,setReadySocket] = useState(false)


    const JoinGame = () => {
        if(Nickname.trim() === "") return 0;
        if(Nickname.length < 4) { alert("닉네임은 4글자 이상 10글자 이하만 가능합니다. "); return 0; }
        store.dispatch(setting_Nickname(Nickname))
        store.dispatch(SET_JOINGAME(true))
    }

    useEffect(() => {
        socket.on("connect",() => {
            console.log("소켓 연결")
            setReadySocket(true)
            store.dispatch(setting_socketId(socket.id))
        })
    },[socket])


    return(
       <Backdrop>
        <Wrapper>
            <div className="안내메시지 배경" style={{ textAlign : "center", minWidth : 400, marginBottom : 10 }}>
                <div style={{ color : "red" }}>! 해상도를 800x600 이상으로 플레이 해주세요.</div>
            </div>
            <div className="제목 배경" style={{ minWidth : 400, textAlign : "center", marginBottom : 50 }}>
                <div style={{ color : "#61dafb", fontSize : 40, fontStyle : "italic", fontWeight : "bold" }}>Meta Bus</div>
            </div>
            <div style={{ textAlign : "center", marginBottom : 30  }}>
                <input placeholder="사용할 닉네임을 입력해주세요." maxLength={10} minLength={5} value={Nickname} onChange={(e) => setNickname(e.target.value)} style={{ minWidth : 300, backgroundColor : "#222639", borderWidth : 0, borderBottomWidth : 1, borderColor : "#61dafb" , borderBlockStyle : "solid", textAlign : "center", color : "white", outline : "none"}}/>
            </div>
            <div style={{ alignItems :"center", justifyContent : "center", display : "flex" }}>
                {!readySocket ? 
                <div style={{ color : "#61dafb" }}>
                    <div>서버와 연결중...</div>
                    <BallTriangle height={30} color="#61dafb"/> 
                </div>
                :
                 <button onClick={() => JoinGame()} style={{ minWidth : 200, minHeight : 30, borderRadius : 30 ,backgroundColor: "#3476DA" , borderWidth : 0, color : "#222639", fontWeight : "bold", cursor : "pointer"}}>접속하기</button> 
                }
            </div>
        </Wrapper>
       </Backdrop>
    );
}