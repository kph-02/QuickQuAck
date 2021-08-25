const express = require("express"); //import Express
const app = express(); //create an Express application on the app variable
const cors = require("cors"); //import cors
const bodyParser = require('body-parser');
const db = require('./routes/chatQueries');
const socketPort = 8000;

const { emit } = require("process");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
   cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
   },
});
const cron = require("node-cron"); //import cron for schedule-based code
const pool = require("./db");

// middleware //
app.use(express.json()); //req.body
app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

/**Routes**/

//Chat Routes
app.get("/messages", db.getMessages);
app.post("/messages", db.createMessage);

//Register and Login User
app.use("/auth", require("./routes/jwtAuth"));

//Dashboard
app.use("/dashboard", require("./routes/dashboard"));

//Main Feed and Posts
app.use("/feed", require("./routes/feed"));

app.listen(5000, () => {
  console.log("server is running on port 5000");
});

//Used to delete posts older than 24 hrs every morning
// cron documentation: https://www.npmjs.com/package/node-cron
cron.schedule("0 * * * *", async () => {
  try {
    const deletedPosts = await pool.query(
      "DELETE FROM post WHERE time_posted < NOW() - '1 day'::INTERVAL RETURNING *;"
    );
    console.log("Old Posts Deleted: ");
    console.log(deletedPosts.rows);
  } catch (err) {
    console.log(err.message);
  }
});


/* Socket.io Methods */

// sends out the 10 most recent messages from recent to old
const emitMostRecentMessges = () => {
    db.getSocketMessages()
       .then((result) => io.emit("chat message", result))
       .catch(console.log);
 };
 // connects, creates message, and emits top 10 messages
 io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("chat message", (msg) => {
       db.createSocketMessage(JSON.parse(msg))
          .then((_) => {
             emitMostRecentMessges();
          })
          .catch((err) => io.emit(err));
 });
 
 // close event when user disconnects from app
    socket.on("disconnect", () => {
       console.log("user disconnected");
    });
 });
 
 // Displays in terminal which port the socketPort is running on
 server.listen(socketPort, () => {
    console.log(`listening on *:${socketPort}`);
 });
