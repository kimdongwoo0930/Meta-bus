import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import {SocketContext} from "../service/Network";
import {BallTriangle} from "react-loader-spinner"

import Room from "./Room";
import store from "../store";
import { SET_ROOMLIST } from "../store/roomStateSlice";

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


const ListView = styled.div`
    min-width: 500px;
    background-color: white;
    max-height: 300px;
    margin-bottom: 50px;
    overflow: scroll;
    background-color : #222639;

    &::-webkit-scrollbar {
        display: none;
      }
`


export default () => {
    const socket = useContext(SocketContext)
    const [modal,setModal] = useState(false)
    const [roomListOk,setRoomListOk] = useState(false)
    const [roomList,setRoomList] = useState([])

    useEffect(() => {
        socket.on("RoomListReturn",({ Rooms }) => {
            setRoomList(Rooms)
            setRoomListOk(true)
        })

        socket.on("RoomListRefresh",({ Rooms }) => {
            setRoomList(Rooms)
        })
    },[socket])

    useEffect(() => {
        socket.emit("RoomList")
    },[])

    return(
        <Backdrop>
            <Wrapper>
                <div className="제목 영역" style={{ minWidth : 400, textAlign : "center", marginBottom : 30 }}>
                    <div style={{ color : "white", fontWeight : "bold", fontSize : 30 }}>방 목록</div>
                </div>
                {!roomListOk ? 
                <div style={{ color : "#61dafb", alignItems :"center", justifyContent : "center", display : "flex", marginBottom : 20}}>
                    <div>
                        <div>방 불러오는중....</div>
                        <BallTriangle height={30} color="#61dafb"/> 
                    </div>
                </div> :
                <ListView className="목록 영역"  >
                    {roomList.map((item,index) => {
                        return(
                            <Room RoomName={item.roomId} RoomMaxSize={item.maxsize} RoomSize={item.count} RoomMaker={item.maker} RoomPw={item.password} key={index}/>
                        )
                    })}
                </ListView> 
                }
                <div className="버튼 영역" style={{ justifyContent : "space-between", display : "flex" }}>
                    <div style={{ color : "#61DAFB" ,fontWeight : "bold", fontSize : 20 , cursor : "pointer" }} onClick={()=> store.dispatch(SET_ROOMLIST(true))}>방 만들기</div>
                    <div style={{ color : "#61DAFB" ,fontWeight : "bold", fontSize : 20 , cursor : "pointer" }} onClick={()=> setModal(true)}>ID로 참가하기</div>
                </div>

                { modal ? <Backdrop>
                    <Wrapper>
                        <div className="닫기 버튼 영역" style={{ minWidth : 250 }}>
                            <div style={{ color : "white", fontSize : 15, fontWeight : "bold" , marginLeft : -30, marginTop : -10 , cursor : "pointer"  }} onClick={()=> setModal(false)}>닫기</div>
                        </div>
                        <div className="제목 영역" style={{ textAlign : "center", marginBottom : 10 }}>
                            <div style={{ color : "white" , fontSize : 20, fontWeight : "bold", marginTop : -20}}>ID로 참가하기</div>
                        </div>
                        <div className="입력및 버튼 영역" style={{ minWidth : 300, paddingBottom : 30 }}>
                            <input style={{ backgroundColor : "#222639", borderWidth : 0, borderBottomWidth : 1, borderColor : "#61dafb", width : 200 , color : "white", fontSize : 20, marginRight : 35, outline : "none", }}/>
                            <button style={{ minWidth : 60, minHeight : 60, borderRadius : 20, marginTop : 10, backgroundColor : "#3476DA", fontWeight : "bold", borderWidth : 0 , cursor : "pointer" }}>참가</button>    
                        </div>        
                    </Wrapper>
                </Backdrop>
                    : <></> }
            </Wrapper>
        </Backdrop>
    );
}