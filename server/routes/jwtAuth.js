const router = require("express").Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");


//Registering
router.post("/register", validInfo, async (req, res) => {
  try {
    //destructure req.body
    const { firstName, lastName, email, password, dob, college, gy } = req.body;
    //check if user already exists (throw error)
    console.log(firstName + " " + lastName + " " + email.toLowerCase() + " " + password);
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json("User already exists!");
    }

    //Bcrypt user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // enter new user in database

    //We'll See (Possible Error)
    const newUser = await pool.query(
      "INSERT INTO users (first_name, last_name, email, user_password," +
        "date_of_birth, college, grad_year)" +
        "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [firstName, lastName, email.toLowerCase(), bcryptPassword, dob, college, gy]
    );

    
    //Used to return stored data for testing
    //res.json(newUser.rows[0]);

    const user_id = {
      user_id: newUser.rows[0].user_id,
    };

    res.json(user_id);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

//Login

router.post("/login", validInfo, async (req, res) => {
  try {
    //Destructure the req.body

    const { email, password } = req.body;

    //Check if user does not exist

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Email or password is incorrect.");
    }

    //Check if incoming password is same in the database

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    //console.log(validPassword);

    if (!validPassword) {
      return res.status(401).json("Email or password is incorrect.");
    }

    const token = jwtGenerator(user.rows[0].user_id);
    const user_id = user.rows[0].user_id;

    res.json({ token, user_id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

router.get("/verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

module.exports = router;
