const express = require("express"); //import Express
const app = express(); //create an Express application on the app variable
const cors = require("cors"); //import cors
const cron = require("node-cron"); //import cron for schedule-based code
const pool = require("./db");
const chatSockets = require("./routes/chatSockets");
const serverPort = 5000;

/** WebSocket Declarations **/
const { emit } = require("process");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5001",
    methods: ["GET", "POST"],
  },
});

/** Middleware **/
app.use(express.json()); //req.body
app.use(cors());

/**RESTFUL API Routes**/

//Register and Login User
app.use("/auth", require("./routes/jwtAuth"));

//Dashboard
app.use("/dashboard", require("./routes/dashboard"));

//Main Feed and Posts
app.use("/feed", require("./routes/feed"));

//Chat Server Routes
app.use("/chat", require("./routes/chat"));

// Displays in terminal which port the socketPort is running on
server.listen(serverPort, () => {
  console.log(`Server started and listening on Port:${serverPort}`);
});

/** CRON DELETE FUNCTIONS **/
//Used to delete posts older than 24 hrs every morning
// cron documentation: https://www.npmjs.com/package/node-cron
cron.schedule("0 * * * *", async () => {
  try {
    const deletedPosts = await pool.query(
      "DELETE FROM post WHERE time_posted < NOW() - '1 day'::INTERVAL RETURNING *;"
    );

    //Deletes chatrooms matching recipient and author that are older than 24 hours.
    const deletedChatrooms = await pool.query(
      "DELETE FROM chatrooms WHERE initiator_id = $1 AND recipient_id = $2" +
        " AND created_at < NOW() - INTERVAL'24 HOURS';",
      [initiator_id, recipient_id]
    );

    console.log("Old Posts Deleted: ");
    console.log(deletedPosts.rows);
    console.log("Old Chatrooms Deleted: ");
    console.log(deletedChatrooms.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//Increasing a posts age by 24 hrs to test
//UPDATE post SET time_posted = time_posted - interval '24 hours' WHERE post_id = 52;

/** WEBSOCKET API Socket.io Methods **/

// connects, creates message, and emits all messages
io.on("connection", (socket) => {
  // console.log("User connected: " + socket.id);

  socket.on("room-messages", (chatroom_id) => {

    chatSockets
      .getSocketMessages(chatroom_id)
      .then((result) => socket.emit("chat-messages", result))
      .catch(console.log);
  });

  socket.on('join-room', chatroom_id => {
    // console.log("Joined Room: " + chatroom_id);
    socket.join(chatroom_id);
  })

  socket.on("send-message", (text, author_id, chatroom_id) => {
    // console.log(
    //   "Text: " +
    //     text +
    //     " Author: " +
    //     author_id +
    //     " Chatroom Id: " +
    //     chatroom_id +
    //     " Socket: " +
    //     socket.id
    // );

    chatSockets
      .createSocketMessage(text, author_id, chatroom_id)
      .then((result) => {
        // console.log('Emitting: ' + JSON.stringify(result));
        socket.to(chatroom_id).emit("chat-messages", result);
      })
      .catch((err) => socket.to(chatroom_id).emit(err));
  });

  // close event when user disconnects from app
  socket.on("disconnect", () => {
    // console.log("User Disconnected: " + socket.id);
  });
});
