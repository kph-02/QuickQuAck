const express = require("express"); //import Express
const router = express(); //create an Express application on the app variable
const authorization = require("../middleware/authorization");
const pool = require("../db");
const e = require("cors");

const randomNameGenerator = () => {
  const nameAdjectives = [
    "Red",
    "Orange",
    "Yellow",
    "Green",
    "Blue",
    "Purple",
    "Pink",
    "Gray",
    "Turquoise",
    "Brown",
  ];
  const nameAnimals = [
    "Dog",
    "Cat",
    "Raccoon",
    "Giraffe",
    "Elephant",
    "Panda",
    "Koala",
    "Rabbit",
    "Turtle",
    "Fox",
  ];

  const adjIndex = parseInt(Math.random() * 10);
  const animalIndex = parseInt(Math.random() * 10);

  let anonAdj = nameAdjectives[adjIndex];
  let anonAnimal = nameAnimals[animalIndex];
  const anonName = {name : anonAdj + " " + anonAnimal, color : anonAdj};

  return anonName;
};

router.post("/create-chatroom", authorization, async (req, res) => {

  const name = randomNameGenerator();
  const initiator_anon_name = name.name;
  const initiator_color = name.color;

  try {
    //Reading information contained in request
    const { recipient_id, message_preview } = req.body;
    const { recipient_anon_name, recipient_color} = req.body;
    const {initiator_name, recipient_name} = req.body;
    const initiator_id = req.user;

    //Deletes chatrooms matching recipient and author that are older than 24 hours.
    const deleteOldChatrooms = await pool.query(
      "DELETE FROM chatrooms WHERE initiator_id = $1 AND recipient_id = $2" +
        " AND created_at < NOW() - INTERVAL'24 HOURS';",
      [initiator_id, recipient_id]
    );

    //Inserts new chatroom into chatrooms if the chatroom doesnt exist with the same 2 participants.
    const newChatroom = await pool.query(
      "INSERT INTO chatrooms (initiator_id, recipient_id, initiator_reveal, recipient_reveal, initiator_color, initiator_anon_name, recipient_color, recipient_anon_name, initiator_name, recipient_name, message_preview)" +
        " SELECT * FROM (SELECT CAST( $1 AS uuid) AS initiator_id, " +
        "CAST( $2 AS uuid) AS recipient_id, '0' AS initiator_reveal, '0' AS recipient_reveal, $3 AS initiator_color,  $4 AS initiator_anon_name, $5 AS recipient_color,  $6 AS recipient_anon_name, $7 AS initiator_name, $8 AS recipient_name, $9 AS message_preview) AS tmp " +
        "WHERE NOT EXISTS ( SELECT initiator_id, recipient_id FROM chatrooms" +
        " WHERE initiator_id= CAST( $1 AS uuid) AND recipient_id = $2 LIMIT 1);",
      [initiator_id, recipient_id, initiator_color, initiator_anon_name, recipient_color, recipient_anon_name, initiator_name, recipient_name, message_preview]
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

//Delete chatroom from database
router.delete("/delete-chatroom", authorization, async (req,res) => {
  const {chatroom_id} = req.body;

  try {

    const deletedChat = await pool.query("DELETE FROM chatrooms WHERE chatroom_id = $1", [chatroom_id]);
    res.status(201).json({status: "Chatroom Deleted"});
  }
  catch(err) {
    console.log(err.message)
    res.status(500).json({status: err.message});
  }
});

router.put("/update-preview", authorization, async (req, res) => {
  const { message_preview } = req.body;
  const { chatroom_id } = req.body;

  try {
    const messagePreview = await pool.query(
      "UPDATE chatrooms SET message_preview = $1 WHERE chatroom_id = $2",
      [message_preview, chatroom_id]
    );

    res.status(201).json({ status: "Preview Updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: err.message });
  }
});

router.put("/reveal-chat", authorization, async (req,res) => {

  const {chatroom_id, initiator, reveal} = req.body;

  try{
    //user was initiator of the chat, update accordingly
    if( initiator === true){

      const initiatorReveal = await pool.query("UPDATE chatrooms SET initiator_reveal = $1 WHERE chatroom_id = $2",
      [reveal, chatroom_id]);
    }
    //user was recipient of chat, update accordingly
    else {
      const recipientReveal = await pool.query("UPDATE chatrooms SET recipient_reveal = $1 WHERE chatroom_id = $2",
      [reveal, chatroom_id]);
    }

    res.status(201).json({
      status: "Value Updated"
    })
  }
  catch(err) {
    
    console.log(err.message)
    res.status(500).json({status : err.message})
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
        " AND created_at > NOW() - INTERVAL'24 HOURS';",
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
