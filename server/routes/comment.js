const express = require("express"); // import Express
const router = express(); // create an Express application on the app variable
const authorization = require("../middleware/authorization");
const pool = require("../db");
const bcrypt = require("bcrypt");

/**
 * Creates a comment and adds it to the database
 */
router.post("/create-comment", authorization, async (req, res) => {
    try {
    const { commentText, post_id, num_upvotes } = req.body;
    const user_id = req.user;
    const newComment = await pool.query(
        "INSERT INTO comment (text, user_id, post_id, num_upvotes) VALUES ($1, $2, $3, $4) RETURNING *",
        [commentText, user_id, post_id, num_upvotes]
    );
    const newVote = await pool.query(
        "INSERT INTO comment_votes (comment_id, user_id, post_id, vote_value) VALUES ($1, $2, $3, $4) RETURNING *",
        [newComment.rows[0].comment_id, user_id, post_id, 1]
    );

    const anonName = randomNameGenerator();

    const createAnonName = await pool.query(
        "INSERT INTO anon_names (anon_name_id) VALUES ($1) ON CONFLICT DO NOTHING;",
        [anonName]
    );

    const commentName = await pool.query(
        "INSERT INTO post_names (user_id, anon_name_id, post_id) SELECT * FROM " +
        "(SELECT CAST( $1 AS uuid) AS user_id, $2 AS anon_name_id, CAST( $3 AS INTEGER) " +
        "AS post_id) AS tmp WHERE NOT EXISTS ( SELECT user_id, post_id FROM post_names " +
        "WHERE user_id= CAST( $1 AS uuid) AND post_id = $3 LIMIT 1);",
        [user_id, anonName, post_id]
    );

    res.status(201).json({
        status: "Comment Success",
        comment_id: newComment.rows[0].comment_id,
    });
  } catch (err) {
      console.log(err.message);
      res.status(500).json("Server error");
  }
});

/**
 * Gets all post comments given the post_id as a query parameter
 */
router.get("/post-comments", authorization, async (req, res) => {
  try {
    const { post_id } = req.query;

    const allComment = await pool.query(
        "SELECT comment_id, comment.post_id, num_upvotes, text, comment.user_id, " +
        "anon_name_id, time_posted, AGE(NOW(), time_posted) AS comment_age FROM " +
        "comment INNER JOIN post_names ON comment.post_id = post_names.post_id " +
        "AND comment.user_id = post_names.user_id WHERE comment.post_id = $1 AND " +
        "time_posted BETWEEN NOW() - INTERVAL'24 HOURS'  AND NOW() ORDER BY " +
        "num_upvotes DESC;",
        [post_id]
    );

    res.status(201).json({
        data: {
            comment: allComment.rows,
        },
    });
  } catch (err) {
      console.error(err.message);
      res.status(500).json("Server Error");
    }
});

/**
 * Deletes a comment from the database
 */
router.delete("/delete-comment", authorization, async (req, res) => {
    try {
        const { comment_id } = req.body;
        const deletedComment = await pool.query(
            "DELETE FROM comment WHERE comment_id = $1 RETURNING *",
            [comment_id]
        );
        res.status(201).json({
            status: "Deleted comment",
        });
    } catch (err) {
        res.status(500).json("Server error");
    }
});

/**
 * Edits a comment from the database
 */
router.put("/update-comment", authorization, async (req, res) => {
    try {
        const { commentText, comment_id } = req.body;
        const updateText = await pool.query(
            "UPDATE comment SET text = $1 where comment_id = $2",
            [commentText, comment_id]
        );
        res.status(201).json({
            status: "Update Success",
        });
    } catch (err) {
        res.status(500).json("Server error");
    }
});
