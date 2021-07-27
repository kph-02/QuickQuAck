const express = require("express"); //import Express
const router = express(); //create an Express application on the app variable
const authorization = require("../middleware/authorization");
const pool = require("../db");

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
*/

/*
const allTags= await pool.query("SELECT tag_id, tag_text, tag_color FROM tags", [
    //Will this work?
    allTagIds, allTagTexts, allTagColors
]); 
*/

//Not implemented tags and post types 
router.post("/create-post", authorization, async (req, res) => {
    try {

        /*
        const allTags= await pool.query("SELECT tag_id, tag_text, tag_color FROM tags", [
            //Will this work?
            req.allTags
        ]); 
        */

        //Reading information contained in post
        const {postText} = req.body;
        const author_id = req.user;
        //const postType = req.body.type;
        //const postTags = req.body.tags;
        
        const newPost = await pool.query
        ("INSERT INTO post (post_text, user_id) VALUES ($1, $2) RETURNING *",
            [postText, author_id]

        );
        res.status(201).json({
            status: "Post Success",
            data: {
              post: newPost.rows[0],
            },
          });

        /*
        const newPostTags = await pool.query
        ("INSERT INTO tags (post_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [postText, author_id]

        );
        */
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }

});


// update a post
router.put("/update-post", authorization, async (req, res) => {
    try {

        const {postId, postText} = req.body;
        const updatePost = await pool.query("UPDATE post SET post_text = $1 where post_id = $2", [postText, postId]);
        res.status(201).json({
            status: "Update Success"
        });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// delete a post
router.delete("/delete-post", authorization, async (req, res) => {
    try {
        const { postId } = req.body;

        const selectedPost = await pool.query("DELETE FROM post WHERE post_id = $1", [postId]);

        res.status(201).json({
            status: "Delete Success"
          });
    }   
    catch (err) {
        res.status(500).send("Server error");
    }
});

// post a comment 
router.post("/create-comment", authorization, async (req, res) => {
    try {
        const { commentText, post_id } = req.body;
        const user_id = req.user;
        const newComment = await pool.query
            ("INSERT INTO comment (comment_text, user_id, post_id) VALUES ($1, $2, $3) RETURNING *",
                [commentText, user_id, post_id]); 
        res.status(201).json({
            status: "Comment Success"
        });
    } catch (err) {
        console.log("Hi");
        res.status(500).send("Server error");
    }
});

//This renders all-posts in the past 24 hours sorted in Ascending order
router.get("/all-posts", authorization, async (req, res) => {
    try {

        const allFeed = await pool.query
        ("SELECT * FROM post WHERE time_posted BETWEEN NOW() - INTERVAL" +
        "'24 HOURS' AND NOW() ORDER BY time_posted ASC;");

        /* For future reference, this is how to order by upvotes. */
        // const allFeed = await pool.query
        // ("SELECT * FROM post WHERE time_posted BETWEEN NOW() - INTERVAL" +
        // "'24 HOURS' AND NOW() ORDER BY votevalue DESC;");

        const numAllPosts = allFeed.rowCount;

        res.status(201).json({
            // postCount: numAllPosts,
            // data: {
            //   post: allFeed.rows,
            // },
            post: allFeed.rows
          });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});





//INCOMPLETE: This renders home-posts in the past 24 hours sorted in Ascending order
//This is filtered by the selected tags on profile
router.get("/home-posts", authorization, async (req, res) => {
    try {


    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//INCOMPLETE: This renders search-posts in the past 24 hours. 
//The user selects < 5 tags for search
router.get("/search-posts", authorization, async (req, res) => {
    try {

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
