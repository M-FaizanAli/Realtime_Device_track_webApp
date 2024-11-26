const express = require('express');
const path = require('path');
const http = require('http');
const app = express();

const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", function (socket) {
    console.log("A user connected:", socket.id);

    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", function () {
        console.log("A user disconnected:", socket.id);
        io.emit("user-disconnected", socket.id);
    });
});

app.get('/', function (req, res) {
    res.render('main');
});

server.listen(8080, () => console.log("Server running on port 8080"));
