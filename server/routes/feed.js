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

//
router.get("/main-feed", authorization, async (req, res) => {
    try {
        //const filters = [''] 
        

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.delete("/delete-post", authorization, async (req, res) => {
    try {
        const { id } = req.body;
        //const selectedPost = 'SELECT * FROM post WHERE post_id = $1';
        //const { rows: [post] } = await pool.query(selectedPost, [id]);
        const selectedPost = await pool.query("DELETE FROM post WHERE post_id = $1", [id]);
        //console.log(selectedPost);

        /*if (!post) {
            return res.status(404).send({ error: 'Could not find post' });
        }
        if (post.author_id !== req.user.id) {
            return res.status(404).send({ error: 'Must be the post author to delete post' });
        }*/
        //res.send(selectedPost);

        //TODO: Delete comments along with the posts

        res.status(201).json({
            status: "Delete Success"
          });
    }   
    catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;