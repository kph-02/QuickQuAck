const express = require("express"); // import Express
const router = express(); // create an Express application on the app variable
const authorization = require("../middleware/authorization");
const pool = require("../db");
const bcrypt = require("bcrypt");

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
