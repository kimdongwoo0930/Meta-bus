import socketIo from 'socket.io-client'
import React from 'react'

export const socket = socketIo.connect("211.58.5.66:3000");
export const SocketContext = React.createContext();