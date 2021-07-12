const router = require("express").Router();
const bcrypt = require("bcrypt");
const pool = require("./db");


//Registering
router.post("/register", async (req, res) => {
    try {
        //destructure req.body
        const { firstName, lastName, email, password, dob, college, gy } = req.body;
        //check if user already exists (throw error)
        console.log(firstName + " " + lastName + " " + email + " " + password);
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [
            email
        ]);

        if (user.rows.length !== 0) {
            return res.status(401).send("User already exists!");
        }

        //Bcrypt user password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);


        // enter new user in database

        //We'll See (Possible Error)
        const newUser = await pool.query
            ("INSERT INTO users (first_name, last_name, email, user_password," +
                "date_of_birth, college, grad_year)" +
                "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [firstName, lastName, email, bcryptPassword, dob, college, gy]
            );

        //Used to return stored data for testing
        res.json(newUser.rows[0])


        //generate jwt token

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;