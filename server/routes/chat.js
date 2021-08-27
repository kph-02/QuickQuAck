const express = require("express"); //import Express
const router = express(); //create an Express application on the app variable
const authorization = require("../middleware/authorization");
const pool = require("../db");

router.post("/create-chatroom", authorization, async (req, res) => {
  try {
    //Reading information contained in request
    const { recipient_id } = req.body;
    const initiator_id = req.user;

    //Deletes chatrooms matching recipient and author that are older than 24 hours.
    const deleteOldChatrooms = await pool.query(
      "DELETE FROM chatrooms WHERE initiator_id = $1 AND recipient_id = $2" +
        " AND created_at < NOW() - INTERVAL'24 HOURS';",
      [initiator_id, recipient_id]
    );

    //Inserts new chatroom into chatrooms if the chatroom doesnt exist with the same 2 participants.
    const newChatroom = await pool.query(
      "INSERT INTO chatrooms (initiator_id, recipient_id, accepted_invite)" +
        " SELECT * FROM (SELECT CAST( $1 AS uuid) AS initiator_id, " +
        "CAST( $2 AS uuid) AS recipient_id, '0' AS accepted_invite) AS tmp " +
        "WHERE NOT EXISTS ( SELECT initiator_id, recipient_id FROM chatrooms" +
        " WHERE initiator_id= CAST( $1 AS uuid) AND recipient_id = $2 LIMIT 1);",
      [initiator_id, recipient_id]
    );

    /*
      const newChatroom = await pool.query(
        "INSERT INTO chatrooms (initiator_id, recipient_id, accepted_invite) VALUES ($1, $2, '0') RETURNING *;",
        [initiator_id, recipient_id]
      );
      */

    res.status(201).json({
      status: "Request Sent, Chatroom created",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: err.message });
  }
});

router.put("/accept-chat", authorization, async (req, res) => {
  try {
    //Reading information contained in request
    const { initiator_id } = req.body;
    const recipient_id = req.user;
    console.log(initiator_id);
    console.log(recipient_id);

    const acceptChatroom = await pool.query(
      "UPDATE chatrooms SET accepted_invite = '1' WHERE initiator_id = $1 " +
        "AND recipient_id = $2;",
      [initiator_id, recipient_id]
    );

    res.status(201).json({
      status: "Chat Accepted",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

router.put("/reject-chat", authorization, async (req, res) => {
  try {
    //Reading information contained in request
    const { recipient_id } = req.body;
    const initiator_id = req.user;

    const acceptChatroom = await pool.query(
      "UPDATE chatrooms SET accepted_invite = '2' WHERE initiator_id = $1 " +
        "AND recipient_id = $2;",
      [initiator_id, recipient_id]
    );

    res.status(201).json({
      status: "Chat Rejected",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

router.get("/requests-and-chatrooms", authorization, async (req, res) => {
  try {
    const user_id = req.user;

    //Gets all accepted chatrooms and pending chatrooms
    const allChatrooms = await pool.query(
      "SELECT * FROM chatrooms WHERE (initiator_id = $1 OR recipient_id = $1)" +
        " AND (accepted_invite = '1' OR accepted_invite = '0') AND created_at" +
        " > NOW() - INTERVAL'24 HOURS';",
      [user_id]
    );

    res.status(201).json({
      data: {
        chatrooms: allChatrooms.rows,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
