const express = require("express"); //import Express
const app = express(); //create an Express application on the app variable
const cors = require("cors"); //import cors
const cron = require("node-cron"); //import cron for schedule-based code
const pool = require("./db");

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

//Increasing a posts age by 24 hrs to test
//UPDATE post SET time_posted = time_posted - interval '24 hours' WHERE post_id = 52;
