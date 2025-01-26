const express = require("express");
const http = require("http");
const { Server } = require("socket.io"); //importing server class from socket.io module

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json()); //this line parses incoming JSON requests
app.use(express.static("public")); //serve static files from public directory

app.get("/" , (req,res)=>{
     res.sendFile(__dirname + "/public/index.html");
});

server.listen(3000,() => {
    console.log("Server is running");
});

