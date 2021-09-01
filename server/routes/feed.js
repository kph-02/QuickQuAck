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
  const anonName = anonAdj + " " + anonAnimal;

  return anonName;
};

router.post("/create-post", authorization, async (req, res) => {
  try {
    //Reading information contained in post
    console.log(req.body);
    const {
      postText,
      postTag,
      num_comments,
      num_upvotes,
      latitude,
      longitude,
    } = req.body;
    const author_id = req.user;
    console.log(latitude);
    //Name of the dropdown of the post tag tagdropdown
    //var postTag = req.body.tagdropdown;

    console.log("Upvotes: " + num_upvotes);

    if (latitude !== null) {
      console.log("not undefined");
      var newPost = await pool.query(
        "INSERT INTO post (post_text, user_id, num_comments, num_upvotes, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
        [
          postText,
          author_id,
          num_comments,
          num_upvotes,
          parseFloat(latitude),
          parseFloat(longitude),
        ]
      );
    } else {
      console.log("wowee");
      var newPost = await pool.query(
        "INSERT INTO post (post_text, user_id, num_comments, num_upvotes) VALUES ($1, $2, $3, $4) RETURNING *;",
        [postText, author_id, num_comments, num_upvotes]
      );
    }
    const postID = newPost.rows[0].post_id;

    for (const i of postTag) {
      console.log("Console says " + i);
      const postTags = await pool.query(
        "INSERT INTO post_tags (tag_id, post_id) VALUES ($2, $1) RETURNING *;",
        [postID, i]
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

//Getting User Information to display in profile page
router.get("/user-information", authorization, async (req, res) => {
  const { user_id } = req.query;

  try {
    const userInformation = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );

    res.status(201).json(userInformation.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      // console.log("Console says " + i);
      const postTags = await pool.query(
        "INSERT INTO user_tags (tag_id, user_id) VALUES ($2, $1) RETURNING *;",
        [user_id, i]
      );
      // console.log(i);
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
    //This checks to see if there are any blocked users.
    const blockedList = await pool.query(
      "SELECT array_length(blocked_users, 1) FROM users WHERE user_id = $1;",
      [user_id]
    );

    const blockedListUsers = await pool.query(
      "SELECT blocked_users FROM users WHERE user_id = $1;",
      [user_id]
    );

    // console.log(blockedList.rows[0].array_length);
    if (blockedList.rows[0].array_length != null) {
      var homeFeed = await pool.query(
        "SELECT * FROM (SELECT DISTINCT ON (P.post_id) P.post_id, P.is_poll, pv.has_voted, UT.tag_id, P.post_text, P.time_posted, P.user_id, p.num_comments, p.num_upvotes, AGE(NOW(), p.time_posted) AS post_age, tar.ARRAY_AGG AS tagArray, bar.ARRAY_AGG AS pollChoices, post_names.anon_name_id AS anon_name FROM User_Tags AS UT Inner Join Post_Tags AS PT ON (UT.tag_id = PT.tag_id) Inner Join Post AS P ON (PT.post_id = P.Post_id) INNER JOIN post_names ON P.user_id = post_names.user_id AND P.post_id = post_names.post_id INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = P.post_id LEFT JOIN (SELECT post_id, ARRAY_AGG(choice_id) FROM poll_choices GROUP BY post_id) AS bar ON P.post_id = bar.post_id LEFT JOIN (SELECT post_id, has_voted FROM poll_voted WHERE user_id = ($1) GROUP BY post_id, has_voted) AS pv ON P.post_id = pv.post_id WHERE UT.User_id = $1 AND time_posted BETWEEN NOW() - INTERVAL'24 HOURS' AND NOW() AND P.user_id != all ($2)) AS SB ORDER BY SB.time_posted DESC;",
        [user_id, blockedListUsers.rows[0].blocked_users]
      );
    } else {
      var homeFeed = await pool.query(
        "SELECT * FROM (SELECT DISTINCT ON (P.post_id) P.post_id, UT.tag_id, P.is_poll, pv.has_voted, P.post_text, P.time_posted, P.user_id, p.num_comments, p.num_upvotes, AGE(NOW(), p.time_posted) AS post_age, tar.ARRAY_AGG AS tagArray, bar.ARRAY_AGG AS pollChoices, post_names.anon_name_id AS anon_name FROM User_Tags AS UT Inner Join Post_Tags AS PT ON (UT.tag_id = PT.tag_id) Inner Join Post AS P ON (PT.post_id = P.Post_id) INNER JOIN post_names ON P.user_id = post_names.user_id AND P.post_id = post_names.post_id INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = P.post_id LEFT JOIN (SELECT post_id, ARRAY_AGG(choice_id) FROM poll_choices GROUP BY post_id) AS bar ON P.post_id = bar.post_id LEFT JOIN (SELECT post_id, has_voted FROM poll_voted WHERE user_id = ($1) GROUP BY post_id, has_voted) AS pv ON P.post_id = pv.post_id WHERE UT.User_id = $1 AND time_posted BETWEEN NOW() - INTERVAL'24 HOURS' AND NOW()) AS SB ORDER BY SB.time_posted DESC;",
        [user_id]
      );
    }

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
    const { post_id, postText, num_comments, num_upvotes, postTag } = req.body;

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

    //If post tags were altered, update here
    if (postTag) {
      //First remove all tags associated with the post
      try {
        const removeTags = await pool.query(
          "DELETE FROM post_tags WHERE post_id = $1",
          [post_id]
        );
      } catch (err) {
        console.log(err.message);
      }

      //Re-insert tags associated with the updated post
      for (const i of postTag) {
        try {
          const postTags = await pool.query(
            "INSERT INTO post_tags (tag_id, post_id) VALUES ($2, $1) RETURNING *;",
            [post_id, i]
          );
        } catch (err) {
          console.log(err.message);
        }
        // console.log(i);
      }
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

//Get comments from given post_id as a query parameter
router.get("/post-comments", authorization, async (req, res) => {
  try {
    const { post_id } = req.query;
    const user_id = req.user;
    // This checks to see if there are any blocked users.
    const blockedList = await pool.query(
      "SELECT array_length(blocked_users, 1) FROM users WHERE user_id = $1;",
      [user_id]
    );

    const blockedListUsers = await pool.query(
      "SELECT blocked_users FROM users WHERE user_id = $1;",
      [user_id]
    );

    if (blockedList.rows[0].array_length != null) {
      var allComment = await pool.query(
        "SELECT comment_id, comment.post_id, num_upvotes, text, comment.user_id, " +
          "anon_name_id, time_posted, AGE(NOW(), time_posted) AS comment_age FROM " +
          "comment INNER JOIN post_names ON comment.post_id = post_names.post_id " +
          "AND comment.user_id = post_names.user_id WHERE comment.post_id = $1 AND " +
          "time_posted BETWEEN NOW() - INTERVAL'24 HOURS'  AND NOW() AND " +
          "comment.user_id != all ($2) ORDER BY " +
          "num_upvotes DESC;",
        [post_id, blockedListUsers.rows[0].blocked_users]
      );
    } else {
      var allComment = await pool.query(
        "SELECT comment_id, comment.post_id, num_upvotes, text, comment.user_id, " +
          "anon_name_id, time_posted, AGE(NOW(), time_posted) AS comment_age FROM " +
          "comment INNER JOIN post_names ON comment.post_id = post_names.post_id " +
          "AND comment.user_id = post_names.user_id WHERE comment.post_id = $1 AND " +
          "time_posted BETWEEN NOW() - INTERVAL'24 HOURS'  AND NOW() ORDER BY " +
          "num_upvotes DESC;",
        [post_id]
      );
    }
    /* For future reference, this is how to order by upvotes. */
    // const allFeed = await pool.query
    // ("SELECT * FROM post WHERE time_posted BETWEEN NOW() - INTERVAL" +
    // "'24 HOURS' AND NOW() ORDER BY votevalue DESC;");

    // console.log(allComment.rows);

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
    const user_id = req.user;

    const blockedList = await pool.query(
      "SELECT array_length(blocked_users, 1) FROM users WHERE user_id = $1;",
      [user_id]
    );

    const blockedListUsers = await pool.query(
      "SELECT blocked_users FROM users WHERE user_id = $1;",
      [user_id]
    );

    // console.log(blockedListUsers.rows[0].blocked_users);
    if (blockedList.rows[0].array_length != null) {
      var allFeed = await pool.query(
        "SELECT * FROM (SELECT DISTINCT ON (post.post_id) post.post_id AS post_id, post.is_poll, pv.has_voted, tar.ARRAY_AGG as tagArray, bar.ARRAY_AGG as pollChoices, PT.tag_id, post.user_id AS user_id, post_text, num_comments, num_upvotes, AGE(NOW(), time_posted) AS post_age, post_names.anon_name_id AS anon_name FROM post INNER JOIN post_names ON post.user_id = post_names.user_id AND post.post_id = post_names.post_id INNER JOIN post_tags AS PT ON (post.post_id = PT.post_id) INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = post.post_id LEFT JOIN (SELECT post_id, ARRAY_AGG(choice_id) FROM poll_choices GROUP BY post_id) AS bar ON post.post_id = bar.post_id LEFT JOIN (SELECT post_id, has_voted FROM poll_voted WHERE user_id = ($1) GROUP BY post_id, has_voted) AS pv ON post.post_id = pv.post_id WHERE time_posted BETWEEN NOW() - INTERVAL'24 HOURS' AND NOW() AND post.user_id != all ($2)) AS SB ORDER BY SB.post_age;",
        [user_id, blockedListUsers.rows[0].blocked_users]
      );
    } else {
      var allFeed = await pool.query(
        "SELECT * FROM (SELECT DISTINCT ON (post.post_id) post.post_id AS post_id, post.is_poll, tar.ARRAY_AGG as tagArray, pv.has_voted, bar.ARRAY_AGG as pollChoices, PT.tag_id, post.user_id AS user_id, post_text, num_comments, num_upvotes, AGE(NOW(), time_posted) AS post_age, post_names.anon_name_id AS anon_name FROM post INNER JOIN post_names ON post.user_id = post_names.user_id AND post.post_id = post_names.post_id INNER JOIN post_tags AS PT ON (post.post_id = PT.post_id) INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = post.post_id LEFT JOIN (SELECT post_id, ARRAY_AGG(choice_id) FROM poll_choices GROUP BY post_id) AS bar ON post.post_id = bar.post_id LEFT JOIN (SELECT post_id, has_voted FROM poll_voted WHERE user_id = ($1) GROUP BY post_id, has_voted) AS pv ON post.post_id = pv.post_id WHERE time_posted BETWEEN NOW() - INTERVAL'24 HOURS' AND NOW()) AS SB ORDER BY SB.post_age;",
        [user_id]
      );
    }

    /* For future reference, this is how to order by upvotes. */
    // const allFeed = await pool.query
    // ("SELECT * FROM post WHERE time_posted BETWEEN NOW() - INTERVAL" +
    // "'24 HOURS' AND NOW() ORDER BY votevalue DESC;");

    // console.log(allFeed.rows[0]);

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
      "SELECT * FROM (SELECT DISTINCT ON (post.post_id) post.post_id AS post_id, tar.ARRAY_AGG as tagArray, post.is_poll, pv.has_voted, bar.ARRAY_AGG as pollChoices, PT.tag_id, post.user_id AS user_id, post_text, num_comments, num_upvotes, AGE(NOW(), time_posted) AS post_age, post_names.anon_name_id AS anon_name FROM post INNER JOIN post_names ON post.user_id = post_names.user_id AND post.post_id = post_names.post_id INNER JOIN post_tags AS PT ON (post.post_id = PT.post_id) INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = post.post_id LEFT JOIN (SELECT post_id, ARRAY_AGG(choice_id) FROM poll_choices GROUP BY post_id) AS bar ON post.post_id = bar.post_id LEFT JOIN (SELECT post_id, has_voted FROM poll_voted WHERE user_id = ($1) GROUP BY post_id, has_voted) AS pv ON post.post_id = pv.post_id WHERE (time_posted BETWEEN NOW() - INTERVAL'24 HOURS' AND NOW()) AND post.user_id = $1) AS SB ORDER BY SB.post_age;",
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
    res.status(500).json("Server error");
  }
});

// edit a comment
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
    const { user_id, post_id } = req.query;
    const commentVotes = await pool.query(
      "SELECT * FROM comment_votes WHERE user_id = $1 AND post_id = $2",
      [user_id, post_id]
    );
    res.status(201).json(commentVotes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// add/undo post vote
router.post("/post-vote", authorization, async (req, res) => {
  try {
    console.log(req.body);

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
    res.status(201).json({ status: "Complete" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//filtering by selecting a singular tag on the main feed
// router.get("/tag-filter", authorization, async (req, res) => {
//   const tag_id = req.body;

//   try {
//     const tagFeed = await pool.query(
//       "SELECT * FROM (SELECT DISTINCT ON (post.post_id) post.post_id AS post_id, tar.ARRAY_AGG as tagArray, PT.tag_id, post.user_id AS user_id, post_text, num_comments, num_upvotes, AGE(NOW(), time_posted) AS post_age, post_names.anon_name_id AS anon_name FROM post INNER JOIN post_names ON post.user_id = post_names.user_id AND post.post_id = post_names.post_id INNER JOIN post_tags AS PT ON (post.post_id = PT.post_id) INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = post.post_id WHERE time_posted BETWEEN NOW() - INTERVAL'24 HOURS' AND NOW()) AS SB WHERE $1 = ANY(SB.tagArray) ORDER BY SB.post_age;",
//       [tag_id]
//     );

//     res.status(201).json({
//       data: {
//         post: tagFeed.rows,
//       },
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json("Server Error");
//   }
// });
router.post("/tag-filter", authorization, async (req, res) => {
  try {
    const { postTag } = req.body;
    console.log("This is the tag_id variable");
    console.log(postTag.toString());

    const user_id = req.user;

    const blockedList = await pool.query(
      "SELECT array_length(blocked_users, 1) FROM users WHERE user_id = $1;",
      [user_id]
    );

    const blockedListUsers = await pool.query(
      "SELECT blocked_users FROM users WHERE user_id = $1;",
      [user_id]
    );

    // console.log(blockedListUsers.rows[0].blocked_users);
    if (blockedList.rows[0].array_length != null) {
      var tagFeed = await pool.query(
        "SELECT * FROM (SELECT DISTINCT ON (post.post_id) post.post_id AS post_id, post.is_poll, pv.has_voted, tar.ARRAY_AGG as tagArray, bar.ARRAY_AGG as pollChoices, PT.tag_id, post.user_id AS user_id, post_text, num_comments, num_upvotes, AGE(NOW(), time_posted) AS post_age, post_names.anon_name_id AS anon_name FROM post INNER JOIN post_names ON post.user_id = post_names.user_id AND post.post_id = post_names.post_id INNER JOIN post_tags AS PT ON (post.post_id = PT.post_id) INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = post.post_id LEFT JOIN (SELECT post_id, ARRAY_AGG(choice_id) FROM poll_choices GROUP BY post_id) AS bar ON post.post_id = bar.post_id LEFT JOIN (SELECT post_id, has_voted FROM poll_voted WHERE user_id = ($3) GROUP BY post_id, has_voted) AS pv ON post.post_id = pv.post_id WHERE time_posted BETWEEN NOW() - INTERVAL'24 HOURS' AND NOW() AND post.user_id != ALL($2)) AS SB WHERE $1 = ANY(SB.tagArray) ORDER BY SB.post_age;",
        [postTag.toString(), blockedListUsers.rows[0].blocked_users, user_id]
      );
    } else {
      var tagFeed = await pool.query(
        "SELECT * FROM (SELECT DISTINCT ON (post.post_id) post.post_id AS post_id, post.is_poll, pv.has_voted, tar.ARRAY_AGG as tagArray, bar.ARRAY_AGG as pollChoices, PT.tag_id, post.user_id AS user_id, post_text, num_comments, num_upvotes, AGE(NOW(), time_posted) AS post_age, post_names.anon_name_id AS anon_name FROM post INNER JOIN post_names ON post.user_id = post_names.user_id AND post.post_id = post_names.post_id INNER JOIN post_tags AS PT ON (post.post_id = PT.post_id) INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = post.post_id LEFT JOIN (SELECT post_id, ARRAY_AGG(choice_id) FROM poll_choices GROUP BY post_id) AS bar ON post.post_id = bar.post_id LEFT JOIN (SELECT post_id, has_voted FROM poll_voted WHERE user_id = ($2) GROUP BY post_id, has_voted) AS pv ON post.post_id = pv.post_id WHERE time_posted BETWEEN NOW() - INTERVAL'24 HOURS' AND NOW()) AS SB WHERE $1 = ANY(SB.tagArray) ORDER BY SB.post_age;",
        [postTag.toString(), user_id]
      );
    }
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
  const { user_id, comments, post_id } = req.body;

  try {
    for (const i of comments) {
      console.log(i);

      //If vote value is given, update here
      if (!(i.vote_value === undefined)) {
        try {
          const insertVote = await pool.query(
            "INSERT INTO comment_votes VALUES($1, $2, $3, $4) RETURNING *",
            [user_id, i.comment_id, post_id, i.vote_value]
          );
        } catch (err) {
          const updateVote = await pool.query(
            "UPDATE comment_votes SET vote_value = $1 WHERE (user_id = $2 AND comment_id = $3) RETURNING *",
            [i.vote_value, user_id, i.comment_id]
          );
        }
      }

      //If number of votes are given, update here
      if (!(i.votes === undefined)) {
        try {
          let updateVoteCount = await pool.query(
            "UPDATE comment SET num_upvotes = $1 WHERE comment_id = $2 RETURNING *",
            [i.votes, i.comment_id]
          );
        } catch (err) {
          console.log(err.message);
        }
      }
    }
    res.status(201).json("Complete");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/edit-user-info", authorization, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      college,
      gy,
      currentPassword,
    } = req.body;
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

      const dbPassword = await pool.query(
        "SELECT user_password FROM users WHERE user_id = $1",
        [user_id]
      );

      const validPassword = await bcrypt.compare(
        currentPassword,
        dbPassword.rows[0].user_password
      );
      console.log(validPassword);
      // const bcryptCurrentPassword = await bcrypt.hash(dbPassword.rows[0].user_password, salt);

      if (validPassword) {
        const updateUserPassword = await pool.query(
          "UPDATE users SET user_password = $1 WHERE user_id = $2",
          [bcryptPassword, user_id]
        );
      } else {
        return res.status(401).json("Current Password is incorrect.");
      }
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

router.get("/current-password", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const currentPassword = await pool.query(
      "SELECT user_password FROM users WHERE user_id = $1",
      [user_id]
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// create a poll (cannot edit once created)
router.post("/create-poll", authorization, async (req, res) => {
  try {
    // const { pollOptions, pollTag, num_comments } = req.body;
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
    // console.log('req.bod');
    pollTag.unshift("Poll");
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
      // console.log("Console says " + i);
      const pollChoices = await pool.query(
        "INSERT INTO poll_choices (choice_id, post_id) VALUES ($1, $2) RETURNING *;",
        [i, postID]
      );
    }

    for (const i of pollTag) {
      // console.log("Console says " + i);
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
        // anonName: postName.rows[0],
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// vote on a poll
router.post("/post-poll-vote", authorization, async (req, res) => {
  try {
    const { post_id, choice_id, user_id } = req.body;
    
    const hasVoted = await pool.query(
      "INSERT INTO poll_voted (user_id, post_id, has_voted) VALUES ($1, $2, true)",
      [user_id, post_id]
    );

    const insertPollVote = await pool.query(
      "INSERT INTO poll_votes VALUES($1, $2, $3) RETURNING *;",
      [user_id, choice_id, post_id]
    );
    res.status(201).send({ status: "Complete" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// used to check if user has already voted for this poll
router.get("/user-poll-vote", authorization, async (req, res) => {
  try {
    const { post_id, user_id } = req.query;
    const pollVote = await pool.query(
      "SELECT * FROM poll_votes WHERE post_id = $1 AND user_id = $2;",
      [post_id, user_id]
    );
    res.status(201).json(pollVote.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get the number of votes for each poll choice
router.get("/get-poll-votes", authorization, async (req, res) => {
  try {
    const { post_id } = req.query;

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
      poll_votes: pollVotes.rows,
    });
    // res.status(201).json(pollVotes.rows);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.put("/block-user", authorization, async (req, res) => {
  let { userID } = req.body;
  let { commentOwnerID } = req.body;
  const userID2 = req.user;

  userID = "{" + userID + "}";
  commentOwnerID = "{" + commentOwnerID + "}";

  try {
    if (commentOwnerID !== "{undefined}") {
      console.log("time to cry");
      console.log(commentOwnerID);
      console.log(
        "Blocking user: " + commentOwnerID + " from user: " + userID2
      );

      const addToBlockList = await pool.query(
        "UPDATE users SET blocked_users = array_append(blocked_users, $1) WHERE user_id = $2;",
        [commentOwnerID, userID2]
      );
    } else {
      // console.log("time to die");
      // console.log(userID)
      console.log("Blocking user: " + userID + " from user: " + userID2);

      const addToBlockList = await pool.query(
        "UPDATE users SET blocked_users = array_append(blocked_users, $1) WHERE user_id = $2;",
        [userID, userID2]
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

router.post("/flag-post", authorization, async (req, res) => {
  const {
    poster_id,
    post_text,
    post_id,
    checkboxState,
    reportText,
    comment_owner,
  } = req.body;
  const reporter = req.user;

  try {
    if (typeof comment_owner !== "undefined") {
      if (checkboxState) {
        const flagPost = await pool.query(
          "INSERT INTO post_flags(poster_id, reporter_id, post_text, post_id, report_reason, comment_owner) " +
            "VALUES($1, $2, $3, $4, $5, $6);",
          [
            poster_id,
            reporter,
            post_text,
            post_id,
            checkboxState,
            comment_owner,
          ]
        );
      } else if (reportText) {
        const flagPost = await pool.query(
          "INSERT INTO post_flags(poster_id, reporter_id, post_text, post_id, report_reason, comment_owner) " +
            "VALUES($1, $2, $3, $4, $5, $6);",
          [poster_id, reporter, post_text, post_id, reportText, comment_owner]
        );
      } else {
        return;
      }
    } else {
      if (checkboxState) {
        const flagPost = await pool.query(
          "INSERT INTO post_flags(poster_id, reporter_id, post_text, post_id, report_reason ) " +
            "VALUES($1, $2, $3, $4, $5);",
          [poster_id, reporter, post_text, post_id, checkboxState]
        );
      } else if (reportText) {
        const flagPost = await pool.query(
          "INSERT INTO post_flags(poster_id, reporter_id, post_text, post_id, report_reason ) " +
            "VALUES($1, $2, $3, $4, $5);",
          [poster_id, reporter, post_text, post_id, reportText]
        );
      } else {
        return;
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

//Getting Information to store on Markers
router.get("/marker-info", authorization, async (req, res) => {
  const user_id = req.user;
  try {
    //This checks to see if there are any blocked users.
    const blockedList = await pool.query(
      "SELECT array_length(blocked_users, 1) FROM users WHERE user_id = $1;",
      [user_id]
    );

    const blockedListUsers = await pool.query(
      "SELECT blocked_users FROM users WHERE user_id = $1;",
      [user_id]
    );

    // console.log(blockedList.rows[0].array_length);
    if (blockedList.rows[0].array_length != null) {

      var markerInfo = await pool.query(
        "SELECT DISTINCT ON (P.post_id) P.is_poll, P.post_id, P.user_id, P.post_text, P.num_comments, post_names.anon_name_id AS anon_name, P.num_upvotes, P.time_posted AS post_age, P.latitude, P.longitude, tar.array_agg AS tagArray, bar.array_agg AS pollChoices FROM post P INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = P.post_id INNER JOIN post_names ON P.user_id = post_names.user_id AND P.post_id = post_names.post_id LEFT JOIN (SELECT post_id, ARRAY_AGG(choice_id) FROM poll_choices GROUP BY post_id) AS bar ON P.post_id = bar.post_id WHERE (latitude IS NOT NULL AND longitude IS NOT NULL AND P.user_id != all ($1)) GROUP BY P.post_id, tagArray, post_names.anon_name_id, pollChoices;",
        [blockedListUsers.rows[0].blocked_users]
      );
    } else {

      var markerInfo = await pool.query(
        "SELECT DISTINCT ON (P.post_id) P.is_poll, P.post_id, P.user_id, P.post_text, P.num_comments, post_names.anon_name_id AS anon_name, P.num_upvotes, P.time_posted AS post_age, P.latitude, P.longitude, tar.array_agg AS tagArray, bar.array_agg AS pollChoices FROM post P INNER JOIN (SELECT post_id, ARRAY_AGG(tag_id) FROM post_tags GROUP BY post_id) as tar ON tar.post_id = P.post_id INNER JOIN post_names ON P.user_id = post_names.user_id AND P.post_id = post_names.post_id LEFT JOIN (SELECT post_id, ARRAY_AGG(choice_id) FROM poll_choices GROUP BY post_id) AS bar ON P.post_id = bar.post_id WHERE (latitude IS NOT NULL AND longitude IS NOT NULL) GROUP BY P.post_id, tagArray, post_names.anon_name_id, pollChoices;"
      );
    }

    res.status(201).json({
      data: {
        markers: markerInfo.rows,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
