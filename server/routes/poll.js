const express = require("express"); // import Express
const router = express(); // create an Express application on the app variable
const authorization = require("../middleware/authorization");
const pool = require("../db");
const bcrypt = require("bcrypt");


/**
 * Create a poll (which cannot be edited once created)
 */
router.post("/create-poll", authorization, async (req, res) => {
  try {
    const {
      pollQuestion,
      pollOptions,
      pollTag,
      num_comments,
      num_upvotes,
      latitude,
      longitude,
    } = req.body;
    const is_poll = 1;
    const author_id = req.user;
    console.log('req.bod');

    console.log(req.body);

    if (latitude !== null) {
      console.log("not undefined");
      var newPoll = await pool.query(
        "INSERT INTO post (post_text, user_id, num_comments, num_upvotes, is_poll, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
        [
          pollQuestion,
          author_id,
          num_comments,
          num_upvotes,
          is_poll,
          parseFloat(latitude),
          parseFloat(longitude),
        ]
      );
    } else {
      var newPoll = await pool.query(
        "INSERT INTO post (user_id, num_comments, post_text, num_upvotes, is_poll) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [author_id, num_comments, pollQuestion, num_upvotes, is_poll]
      );
    }

    const postID = newPoll.rows[0].post_id;

    for (const i of pollOptions) {
      const pollChoices = await pool.query(
        "INSERT INTO poll_choices (choice_id, post_id) VALUES ($1, $2) RETURNING *;",
        [i, postID]
      );
    }

    for (const i of pollTag) {
      const pollTags = await pool.query(
        "INSERT INTO post_tags (tag_id, post_id) VALUES ($1, $2) RETURNING *;",
        [i, postID]
      );
    }

    const anonName = randomNameGenerator();

    const createAnonName = await pool.query(
      "INSERT INTO anon_names (anon_name_id) VALUES ($1) ON CONFLICT DO NOTHING;",
      [anonName]
    );

    const postName = await pool.query(
      "INSERT INTO post_names (user_id, anon_name_id, post_id) VALUES ($1, $2, $3) RETURNING *;",
      [author_id, anonName, postID]
    );

    res.status(201).json({
      status: "Post Success",
      data: {
        poll: newPoll.rows[0],
        tags: pollTag,
        pollChoices: pollOptions,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

/**
 * Vote on a poll in database
 */
router.post("/post-poll-vote", authorization, async (req, res) => {
  try {
    const { post_id, choice_id, user_id } = req.body;
      const insertPollVote = await pool.query(
        "INSERT INTO poll_votes VALUES($1, $2, $3) RETURNING *;",
        [user_id, choice_id, post_id]
      );
    res.status(201).send({status: "Complete"});
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

/**
 * Get all poll votes from a user and their corresponding post
 */
router.get("/user-poll-vote", authorization, async(req, res) => {
  try{
    const {post_id, user_id } = req.query;
    const pollVote = await pool.query(
      "SELECT * FROM poll_votes WHERE post_id = $1 AND user_id = $2;",
      [post_id, user_id]
    );
    res.status(201).json(pollVote.rows)
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});

/**
 * Get all votes for each poll choice from a single poll
 */
router.get("/get-poll-votes", authorization, async (req, res) => {
  try {
    const {post_id} = req.query;
    
    const pollVotes = await pool.query(
      "SELECT choice_id, COUNT (choice_id) FROM poll_votes WHERE (post_id = $1) GROUP BY choice_id;",
      [post_id]
    );

    const totalVotes = await pool.query(
      "SELECT COUNT(*) FROM poll_votes WHERE (post_id = $1);",
      [post_id]
    );
    res.status(201).json({
      total_votes: totalVotes.rows[0].count,
      poll_votes: pollVotes.rows
    });
    // res.status(201).json(pollVotes.rows);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
