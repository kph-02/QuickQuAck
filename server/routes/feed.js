const express = require("express"); //import Express
const router = express(); //create an Express application on the app variable
const authorization = require("../middleware/authorization");
const pool = require("../db");
const bcrypt = require("bcrypt");


//

/*
Post functionality CRUD Operations
Create Post(POST)
Retrieve main feed(GET)
Retrieve Home (filtered) feed (GET)
Create Comment (POST)
Delete Post (DELETE)
Update Post(PUT)
Update Comment(PUT)
Upvote/Downvote a post (POST)
*/

router.post("/create-post", authorization, async (req, res) => {
  try {
    //Reading information contained in post
    const { postText, postTag, num_comments, num_upvotes } = req.body;
    const author_id = req.user;
    //Name of the dropdown of the post tag tagdropdown
    //var postTag = req.body.tagdropdown;

    console.log("Upvotes: " + num_upvotes);

    const newPost = await pool.query(
      "INSERT INTO post (post_text, user_id, num_comments, num_upvotes) VALUES ($1, $2, $3, $4) RETURNING *;",
      [postText, author_id, num_comments, num_upvotes]
    );

    const postID = newPost.rows[0].post_id;

    for (const i of postTag) {
      console.log("Console says " + i);
      const postTags = await pool.query(
        "INSERT INTO post_tags (tag_id, post_id) VALUES ($2, $1) RETURNING *;",
        [postID, i]
      );
    }

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
    const anonName = anonAdj + " " + anonAnimal;

    const createAnonName = await pool.query(
      "INSERT INTO anon_names (anon_name_id) VALUES ($1) ON CONFLICT DO NOTHING;",
      [anonName]
    );

    const postName = await pool.query(
      "INSERT INTO post_names (user_id, anon_name_id, post_id) VALUES ($1, $2, $3) RETURNING *;",
      [author_id, anonName, postID]
    );

    ///postTags is declared in a loop so it is not defined here

    res.status(201).json({
      status: "Post Success",
      data: {
        post: newPost.rows[0],
        tags: postTag,
        anonName: postName.rows[0],
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

router.post("/user-tag-selection", async (req, res) => {
  try {
    //Reading information contained in post
    const { postTag } = req.body;
    const { user_id } = req.body;

    const selectedTags = await pool.query(
      "SELECT user_id, ARRAY_AGG(tag_id) as tagArray FROM user_tags WHERE user_id = $1 GROUP BY user_id",
      [user_id]
    );

    if (selectedTags) {
      const DeleteTags = await pool.query(
        "DELETE FROM user_tags WHERE user_id = $1 RETURNING *;",
        [user_id]
      );
    }
    
    for (const i of postTag) {
      console.log("Console says " + i);
      const postTags = await pool.query(
        "INSERT INTO user_tags (tag_id, user_id) VALUES ($2, $1) RETURNING *;",
        [user_id, i]
      );
      console.log(i);
    }

    ///postTags is declared in a loop so it is not defined here
    res.status(201).json({
      status: "Tag's have been inserted",
      data: {
        tags: postTag,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// This renders a page of posts based upon filtering of tags selected during user creation sorted in ascending order of time posted

//
router.get("/home-feed", authorization, async (req, res) => {
  const user_id = req.user;

  try {
    // add a date time filter so its only last 24 hrs
    console.log("This is UID " + user_id);
    const homeFeed = await pool.query(
      "SELECT * FROM (SELECT DISTINCT ON (P.post_id) P.post_id, UT.tag_id, P.post_text, P.time_posted, p.num_comments, p.num_upvotes, AGE(NOW(), p.time_posted) AS post_age, tar.ARRAY_AGG AS tagArray, post_names.anon_name_id AS anon_name FROM User_Tags AS UT Inner Join Post_Tags AS PT ON (UT.tag_id = PT.tag_id) Inner Join Post AS P ON (PT.post_id = P.Post_id) INNER JOIN post_names ON P.user_id = post_names.user_id AND P.post_id = post_names.post_id INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = P.post_id WHERE UT.User_id = $1) AS SB ORDER BY SB.time_posted DESC;",
      [user_id]
    );

    // const homeFeed = await pool.query(
    //   "SELECT * FROM (SELECT DISTINCT ON (P.post_id) P.post_id, UT.tag_id, P.post_text, P.time_posted, p.num_comments, p.num_upvotes, AGE(NOW(), p.time_posted) AS post_age, post_names.anon_name_id AS anon_name FROM User_Tags AS UT Inner Join Post_Tags AS PT ON (UT.tag_id = PT.tag_id) Inner Join Post AS P ON (PT.post_id = P.Post_id) INNER JOIN post_names ON P.user_id = post_names.user_id AND P.post_id = post_names.post_id WHERE UT.User_id = $1 AND time_posted BETWEEN NOW() - INTERVAL'24 HOURS' AND NOW()) AS SB ORDER BY SB.time_posted DESC;",
    //   [user_id]
    // );

    res.status(201).json({
      data: {
        post: homeFeed.rows,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// update a post
router.put("/update-post", authorization, async (req, res) => {
  try {
    const { post_id, postText, num_comments, num_upvotes } = req.body;

    //Only update if postText is not empty
    if (postText) {
      const updatePost = await pool.query(
        "UPDATE post SET post_text = $1 where post_id = $2",
        [postText, post_id]
      );
    }

    //Only update if num_comments is not empty
    if (num_comments) {
      const updatePost = await pool.query(
        "UPDATE post SET num_comments = $1 where post_id = $2",
        [num_comments, post_id]
      );
    }

    //Only update if num_upvotes is not empty
    if (num_upvotes) {
      const updatePost = await pool.query(
        "UPDATE post SET num_upvotes = $1 where post_id = $2",
        [num_upvotes, post_id]
      );
    }

    res.status(201).json({
      status: "Update Success",
    });
  } catch (err) {
    res.status(500).json("Server error");
  }
});

// delete a post
router.delete("/delete-post", authorization, async (req, res) => {
  try {
    const { postId } = req.body;

    const selectedPost = await pool.query(
      "DELETE FROM post WHERE post_id = $1",
      [postId]
    );

    res.status(201).json({
      status: "Delete Success",
    });
  } catch (err) {
    res.status(500).json("Server error");
  }
});

// post a comment
router.post("/create-comment", authorization, async (req, res) => {
  try {
    const { commentText, post_id, num_upvotes } = req.body;
    const user_id = req.user;
    const newComment = await pool.query(
      "INSERT INTO comment (text, user_id, post_id, num_upvotes) VALUES ($1, $2, $3, $4) RETURNING *",
      [commentText, user_id, post_id, num_upvotes]
    );
    res.status(201).json({
      status: "Comment Success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Server error");
  }
});

//Get comments from given post_id as a query parameter
router.get("/post-comments", authorization, async (req, res) => {
  try {
    const { post_id } = req.query;

    const allComment = await pool.query(
      "SELECT *, AGE(NOW(), time_posted) AS comment_age FROM comment INNER JOIN "
    + "post_names ON comment.post_id = "
    + "post_names.post_id WHERE comment.post_id = $1 AND time_posted BETWEEN NOW() - INTERVAL'24 HOURS' "
    + "AND NOW() ORDER BY time_posted DESC;",
      [post_id]
    );

    /* For future reference, this is how to order by upvotes. */
    // const allFeed = await pool.query
    // ("SELECT * FROM post WHERE time_posted BETWEEN NOW() - INTERVAL" +
    // "'24 HOURS' AND NOW() ORDER BY votevalue DESC;");

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

//This renders all-posts in the past 24 hours sorted in Ascending order
router.get("/all-posts", authorization, async (req, res) => {
  try {
    const allFeed = await pool.query(
      "SELECT * FROM (SELECT DISTINCT ON (post.post_id) post.post_id AS post_id, tar.ARRAY_AGG as tagArray, PT.tag_id, post.user_id AS user_id, post_text, num_comments, num_upvotes, AGE(NOW(), time_posted) AS post_age, post_names.anon_name_id AS anon_name FROM post INNER JOIN post_names ON post.user_id = post_names.user_id AND post.post_id = post_names.post_id  INNER JOIN post_tags AS PT ON (post.post_id = PT.post_id) INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = post.post_id WHERE time_posted BETWEEN NOW() - INTERVAL'24 HOURS' AND NOW()) AS SB ORDER BY SB.post_age;"
    );

    /* For future reference, this is how to order by upvotes. */
    // const allFeed = await pool.query
    // ("SELECT * FROM post WHERE time_posted BETWEEN NOW() - INTERVAL" +
    // "'24 HOURS' AND NOW() ORDER BY votevalue DESC;");

    console.log(allFeed.rows[0]);

    res.status(201).json({
      data: {
        post: allFeed.rows,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

//This renders all the posts a user has submitted in the past 24 hours sorted in Ascending order
router.get("/user-posts", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const userFeed = await pool.query(
      "SELECT * FROM (SELECT DISTINCT ON (post.post_id) post.post_id AS post_id, tar.ARRAY_AGG as tagArray, PT.tag_id, post.user_id AS user_id, post_text, num_comments, num_upvotes, AGE(NOW(), time_posted) AS post_age, post_names.anon_name_id AS anon_name FROM post INNER JOIN post_names ON post.user_id = post_names.user_id AND post.post_id = post_names.post_id INNER JOIN post_tags AS PT ON (post.post_id = PT.post_id) INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = post.post_id WHERE (time_posted BETWEEN NOW() - INTERVAL'24 HOURS' AND NOW()) AND post.user_id = $1) AS SB ORDER BY SB.post_age;",
      [user_id]
    );


    res.status(201).json({
      data: {
        post: userFeed.rows,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// delete a comment
router.delete("/delete-comment", authorization, async (req, res) => {
  try {
    const { comment_id } = req.body;
    // code to select any single comment
    const deletedComment = await pool.query(
      "DELETE FROM comment WHERE comment_id = $1 RETURNING *",
      [comment_id]
    );
    res.status(201).json({
      status: "Deleted comment",
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// edit a comment

// get post votes
router.get("/post-votes", authorization, async (req, res) => {
  try {
    const { post_id, user_id } = req.query;
    const postVotes = await pool.query(
      "SELECT * FROM post_votes WHERE post_id = $1 AND user_id = $2",
      [post_id, user_id]
    );
    res.status(201).json(postVotes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get comment votes
router.get("/comment-votes", authorization, async (req, res) => {
  try {
    const { comment_id } = req.body;
    const commentVotes = await pool.query(
      "SELECT * FROM comment_votes WHERE comment_id = $1",
      [comment_id]
    );
    res.status(201).send(commentVotes.rows);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// add/undo post vote
router.post("/post-vote", authorization, async (req, res) => {
  try {
    const { user_id, post_id, vote_value } = req.body;
    // if the same vote from the same person on the same post exists
    const exactDuplicate = await pool.query(
      "SELECT * FROM post_votes WHERE (user_id = $1 AND post_id = $2 AND vote_value = $3)",
      [user_id, post_id, vote_value]
    );
    if (exactDuplicate.rows.length > 0) {
      // const deleteVote = await pool.query(
      //   "DELETE FROM post_votes WHERE (user_id = $1 AND post_id = $2 AND vote_value = $3)",
      //   [user_id, post_id, vote_value]
      // );
    } else {
      try {
        const insertVote = await pool.query(
          "INSERT INTO post_votes VALUES($1, $2, $3) RETURNING *",
          [user_id, post_id, vote_value]
        );
      } catch (err) {
        const updateVote = await pool.query(
          "UPDATE post_votes SET vote_value = $1 WHERE (user_id = $2 AND post_id = $3) RETURNING *",
          [vote_value, user_id, post_id]
        );
      }
    }
    res.status(201).json("Complete");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//iltering by selecting a singular tag on the main feed
router.get("/tag-filter", authorization, async (req, res) => {
  const tag_id = req.body;

  try {
    const tagFeed = await pool.query(
      "SELECT * FROM (SELECT DISTINCT ON (post.post_id) post.post_id AS post_id, tar.ARRAY_AGG as tagArray, PT.tag_id, post.user_id AS user_id, post_text, num_comments, num_upvotes, AGE(NOW(), time_posted) AS post_age, post_names.anon_name_id AS anon_name FROM post INNER JOIN post_names ON post.user_id = post_names.user_id AND post.post_id = post_names.post_id INNER JOIN post_tags AS PT ON (post.post_id = PT.post_id) INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = post.post_id WHERE time_posted BETWEEN NOW() - INTERVAL'24 HOURS' AND NOW()) AS SB WHERE $1 = ANY(SB.tagArray) ORDER BY SB.post_age;",
      [tag]
    );

    res.status(201).json({
      data: {
        post: tagFeed.rows,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// add/undo comment votes
router.post("/comment-vote", authorization, async (req, res) => {
  try {
    const { user_id, comment_id, vote_value } = req.body;
    // if the same vote from the same person on the same post exists
    const exactDuplicate = await pool.query(
      "SELECT * FROM comment_votes WHERE (user_id = $1 AND comment_id = $2 AND vote_value = $3)",
      [user_id, comment_id, vote_value]
    );
    if (exactDuplicate.rows.length > 0) {
      const deleteVote = await pool.query(
        "DELETE FROM comment_votes WHERE (user_id = $1 AND comment_id = $2 AND vote_value = $3)",
        [user_id, comment_id, vote_value]
      );
    } else {
      try {
        const insertVote = await pool.query(
          "INSERT INTO comment_votes VALUES($1, $2, $3) RETURNING *",
          [user_id, comment_id, vote_value]
        );
      } catch (err) {
        const updateVote = await pool.query(
          "UPDATE comment_votes SET vote_value = $1 WHERE (user_id = $2 AND comment_id = $3) RETURNING *",
          [vote_value, user_id, comment_id]
        );
      }
    }
    res.status(201).send("Complete");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


router.put("/edit-user-info", authorization, async (req, res) => {
  try {
    const { firstName, lastName, email, password, college, gy } = req.body;
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
        [bcryptPassword, user_id]
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
