const express = require("express"); //import Express
const app = express(); //create an Express application on the app variable
const cors = require("cors"); //import cors

//socket.io related items
const socketPort = 8000;
const { emit } = require("process");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
   cors: {
      origin: "http://localhost:5001",
      methods: ["GET", "POST", "PUT"],
   },
});


// middleware //
app.use(express.json()); //req.body
app.use(cors());

/**Routes**/

//Register and Login User
app.use("/auth", require("./routes/jwtAuth"));

//Dashboard
app.use("/dashboard", require("./routes/dashboard"));

//Main Feed and Posts
app.use("/feed", require("./routes/feed"));

app.use("/chat", require("./routes/chat"));


app.listen(5000, () => {
    console.log("server is running on port 5000");
});



// sends out the 10 most recent messages from recent to old
// const emitMostRecentMessages = () => {
//    db.getSocketMessages()
//       .then((result) => io.emit("chat message", result))
//       .catch(console.log);
// };
// connects, creates message, and emits top 10 messages
// io.on("connection", (socket) => {
//    console.log("a user connected");
//    socket.on("chat message", (msg) => {
//       db.createSocketMessage(JSON.parse(msg))
//          .then((_) => {
//             emitMostRecentMessages();
//          })
//          .catch((err) => io.emit(err));
// });

// close event when user disconnects from app
//    socket.on("disconnect", () => {
//       console.log("user disconnected");
//    });
// });

// Displays in terminal which port the socketPort is running on
// server.listen(socketPort, () => {
//    console.log(`listening on *:${socketPort}`);
// });