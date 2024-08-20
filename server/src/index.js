const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => {
        res.send('Hello World');
});

io.on("connection", (socket) => {
    // socket.emit("me", socket.id);
    socket.on("sendOffer", ({callToUserSocketId, callFromUserSocketId, offerSignal}) => {
        
    console.log("sending offer from ", callFromUserSocketId, " to ", callToUserSocketId);
   

    // Logic to send offer to client 2
    io.to(callToUserSocketId).emit("receiveOffer", {callFromUserSocketId, offerSignal});

});



//Listen for sendAnswer Event
socket.on("sendAnswer", ({callFromUserSocketId, callToUserSocketId, answerSignal}) =>{

    console.log("sending answer from ", callToUserSocketId, " to ", callFromUserSocketId );
    //Send answer to callFromUserSocketId
    io.to(callFromUserSocketId).emit("receiveAnswer", {callToUserSocketId, answerSignal})
})
});
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
