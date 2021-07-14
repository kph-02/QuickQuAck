const express = require("express"); //import Express
const app = express(); //create an Express application on the app variable
const cors = require("cors"); //import cors

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
