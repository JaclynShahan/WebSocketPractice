const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("../routes/index.js");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let messages = [];

const getApiAndEmit = async socket => {
    try {
        const res = await axios.get(
            "https://api.darksky.net/forecast/06dd88b9314505ee306a39736748221a/33.10317,-96.67055"
        ); //Getting the api from darksky
        socket.emit("FromAPI", res.data); //emitting a new
        //message. It will be consumed by the client
    } catch (error) {
        console.log(`Error: ${error.code}`);
    }
}

app.post('/api/newMsg', (req, res) => {
    messages.push(req.query.message)
    io.emit('msgs', messages)
})

let interval;

io.on("connection", socket => {
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 3000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));