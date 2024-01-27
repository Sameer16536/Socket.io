import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser'


const port = 3000;
const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
})

io.on("connection", (socket) => {
    console.log('a user connected');
    console.log("Id", socket.id)
    //Syntax: socket.emit("eventName",eventhandler)
    //Emit: Message to self Socket
    // socket.emit("welcome",`welcome to the Server ${socket.id}`)
    //Broadcast: msg to all other sockets except self
    // socket.broadcast.emit("welcome",` ${socket.id} Joined the server`)

    socket.on("message",({room,message})=>{
        console.log(room,message)
        //io.to(room).emit("receive-message",message) 
        socket.to(room).emit("receive-message",message) 
    })

    socket.on("join-room",(room)=>{
        socket.join(room)
        console.log(`${socket.id} joined room ${room}`);
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
    })
})


app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}))
//Get Req
app.get("/", (req, res) => {
    res.send("Hello World")
})
const secretkey = "abcdefg"
app.get("/login",(req,res)=>{
    jwt.sign({_id:"njnckmckamsddh"},secretkey)
    res
        .cookie("token",token,{httpOnly:true,secure:true,sameSite:"none"})
        .json({
            message:"Login Successful"
        })
})

server.listen(port, () => {
    console.log(`Server is listening at port ${port}`)
})