import React from "react";
import { useState } from 'react';
import { Socket } from "socket.io-client"

function MessageInput( {socket}: {socket: Socket}) {
    const [value, setValue] = useState("")

    const send = (value: string) => {
        socket?.emit("message", value)
    }
    
    const changeTime = (value: number) => {
        socket?.emit("updateTimer", value)
    }

    const changeClient1 = (value: number) => {
        socket?.emit("updateClient1", value)
    }

    return (
        <>
            <div>
                <input onChange={(e) => setValue(e.target.value)} placeholder="Type your message" value={value} />
                <button onClick={() => send(value)}>SEND</button>
            </div>
            <div>
                <button onClick={() => changeTime(5000)}>5secondes</button>
                <button onClick={() => changeTime(1000)}>1seconde</button>
            </div>
            <div>
                <button onClick={() => changeClient1(5)}>bonjour</button>
            </div>        
        </>
    )
}
export default MessageInput