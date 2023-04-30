import socketIo from 'socket.io-client'
import React from 'react'


export const socket = socketIo.connect(process.env.REACT_APP_SOCKET_ADDRESS)
export const SocketContext = React.createContext();