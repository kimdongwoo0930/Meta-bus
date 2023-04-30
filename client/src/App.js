import React from "react";
import styled from "styled-components";
import { SocketContext, socket } from "./service/Network";
import InGame from "./components/InGame";
import Main from "./components/Main";
import RoomListScreen from "./components/RoomList";
import CreateRoom from "./components/CreateRoom"
import { useSelector } from "react-redux";

const Backdrop = styled.div`
  position: absolute;
  width: 100%;
  height : 100%;
`


function App() {
    let ui
    const JoinGame = useSelector(state => state.roomState.joinGame)
    const RoomList = useSelector(state => state.roomState.roomList)
    const Create = useSelector(state => state.roomState.createRoom)

    if(!JoinGame){
        ui = <Main/>
    }
    else if(!RoomList){
        ui = <RoomListScreen/>
    }
    else if(!Create){
        ui = <CreateRoom/>
    }
    else{
        ui = <InGame/>
    }
    
return (
    <SocketContext.Provider value={socket}>
        <Backdrop>
            {ui}
        </Backdrop>
    </SocketContext.Provider>
);
}

export default App;
