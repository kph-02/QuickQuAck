const express = require("express"); //import Express
const router = express(); //create an Express application on the app variable
const authorization = require("../middleware/authorization");
const pool = require("../db");

router.put("/edit-user-info", authorization, async (req, res) => {
  try {
    const { firstName, lastName, email, password, college, gy, currentPassword } = req.body;
    const user_id = req.user;

    if (firstName && lastName) {
      const updateUserName = await pool.query(
        "UPDATE users SET first_name = $1, last_name = $2 WHERE user_id = $3",
        [firstName, lastName, user_id]
      );
    } else if (email) {
      const updateUserEmail = await pool.query(
        "UPDATE users SET email = $1 WHERE user_id = $2",
        [email, user_id]
      );
    } else if (password) {
      //Bcrypt user password
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);

      const updateUserPassword = await pool.query(
        "UPDATE users SET user_password = $1 WHERE user_id = $2",
        [password, user_id]
      );
    } else if (college && gy) {
      const updateUserSchool = await pool.query(
        "UPDATE users SET college = $1, grad_year = $2 WHERE user_id = $3",
        [college, gy, user_id]
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
