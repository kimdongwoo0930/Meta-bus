import { useContext } from "react";
import { BsFillUnlockFill, BsFillLockFill } from "react-icons/bs";
import {SocketContext} from "../service/Network";
import PhaserGame from "../PhaserGame";
import store from "../store";
import { SET_CREATEROOM, SET_ROOMLIST } from "../store/roomStateSlice";
import { useSelector } from "react-redux";
import { setting_RoomId } from "../store/playerInfoSlice";

export default ({RoomName,RoomMaxSize, RoomSize, RoomMaker, RoomPw }) => {
    const socket = useContext(SocketContext)
    const nickname = useSelector(state => state.playerInfo.nickname)

    const JoinGame = () => {
        if( RoomPw.trim() !== "" ) { 
            const pw = prompt("비밀번호를 입력해주세요.")
            if( pw !== RoomPw ){ alert("비밀번호가 틀렸습니다."); return 0; }
        }
        if( RoomMaxSize <= RoomSize) { alert("가득찬 방입니다."); return 0; }
        const boot = PhaserGame.scene.keys.boot
        boot.scene.start('boot', {RoomId : RoomName, socket : socket, nickname : nickname})
        store.dispatch(setting_RoomId(RoomName))
        store.dispatch(SET_CREATEROOM(true))
        store.dispatch(SET_ROOMLIST(true))
    }
    return(
        <div onClick={() => JoinGame()} style={{ backgroundColor : "#61DAFB", marginBottom : 5, cursor : "pointer"}}>
            <div className="방 이름과 인원 영역" style={{ justifyContent : "space-between", display : "flex", fontWeight : "bold" , color : "white", paddingLeft : 20, paddingTop : 10, paddingRight : 20}}>
                <div>{RoomName}</div>
                <div>{RoomSize} / {RoomMaxSize}</div>
            </div>
            <div className="자물쇠 및 방 생성자 영역" style={{ justifyContent : "space-between", display : "flex" , fontWeight : "bold", paddingLeft : 20, paddingTop : 10, paddingRight : 20, paddingBottom : 5}}>
                {
                    RoomPw === "" ? <BsFillUnlockFill/> : <BsFillLockFill/>
                }
                <div style={{ color : "white", fontSize : 13 }}>방 생성자 : {RoomMaker}</div>
            </div>
        </div>
    );
}