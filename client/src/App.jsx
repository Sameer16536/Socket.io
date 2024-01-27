import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { Container, Typography, TextField, Button, Stack } from '@mui/material'

function App() {

  const socket = useMemo(() => io("http://localhost:3000"), [])

  const [message, setMessage] = useState("")
  const [room,setRoom]= useState("")
  const [socketId,setSockeId]= useState("")
  const [messages, setMessages]=useState([])
  const [roomName,setroomName]= useState("")
  const submitHandler = (e) => {
    e.preventDefault()
    socket.emit("message", {message,room});
    
    setMessage("")
    
  }
  const joinRoom= (e)=>{
    e.preventDefault()
    if(roomName ==""){
      alert("Please enter a room name.")
      return;
    }
    socket.emit("join-room",roomName)
    setroomName("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSockeId(socket.id)
      console.log("Connected", socket.id)
    })
    socket.on("receive-message", (data) => {
      console.log(data)
      setMessages((messages)=>[...messages,data])
    })
    socket.on("welcome", (s) => {
      console.log(s)
    })
    return () => {
      socket.disconnect();
    }
  }, []);


  return (
    <Container maxWidth='sm'>
      <Typography variant='h1' component='div' gutterBottom>
        Welcome To Socket.io
      </Typography>
      <Typography variant='h5' component='div' gutterBottom>{socketId}</Typography>

      <form onSubmit={joinRoom} ><h5>Join room</h5>
      <TextField value={roomName} onChange={e => setroomName(e.target.value)} id="outlined-basic" label="Room Name" variant="outlined" />
      <Button variant="contained" color="primary" type="submit" >Join Room</Button>
      </form>


      <form onSubmit={submitHandler}>
        <TextField value={message} onChange={e => setMessage(e.target.value)} id="outlined-basic" label="Message" variant="outlined" />
        <TextField value={room} onChange={e => setRoom(e.target.value)} id="outlined-basic" label="Room" variant="outlined" />
        <Button variant="contained" color="primary" type="submit" >Send</Button>
      </form>
      <Stack>
        {
          messages.map((m,i)=>(
            <Typography key={i} variant='h6' component='div' gutterBottom>
              {m}
            </Typography>
          ))
        }
      </Stack>
    </Container>
  )
}

export default App