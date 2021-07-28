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
Upvote/Downvote a post (POST)
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

// update a post
router.put("/update-post", authorization, async (req, res) => {
    try {
        /*const { post_id } = req.body;
        const { postText } = req.body;*/
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
        //const selectedPost = 'SELECT * FROM post WHERE post_id = $1';
        //const { rows: [post] } = await pool.query(selectedPost, [id]);
        const selectedPost = await pool.query("DELETE FROM post WHERE post_id = $1", [postId]);
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

// delete a comment
router.delete("/delete-comment", authorization, async (req, res) => {
    try {
        const { comment_id } = req.body;
        // code to select any single comment
        const deletedComment = await pool.query("DELETE FROM comment WHERE comment_id = $1 RETURNING *", [comment_id]);
        res.status(201).json({
            status: "Deleted comment"
        });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// edit a comment

// check vote type (post or comment)
const checkVoteType = (voteType) => {
    const types = ['post', 'comment'];
    let err;
    if (!types.includes(voteType)) {
        err = "Invalid vote type";
    }
    //console.log("Part 1");
    console.log("1. " + voteType);
    return { voteType, err };
} 

// check valid vote value 
const checkVoteValue = async (item_id, vote_value, vote_type) => {
    let status, error;
    /*if (!/^\d+$/.test(item_id)) {
        //console.log("Part 2");
        status = 400;
        error = "Invalid ${vote_type} id";
    }*/
    /*else*/ if (![-1, 0, 1].includes(parseInt(vote_value))) {
        status = 400;
        error = "Invalid vote value";
    }
    else {
        try {
            const item = await pool.query("SELECT * FROM ${vote_type} WHERE ${vote_type}_id = $1", [item_id]);
        }
        catch (err) {
            console.log(err.message);
        }    
        if (!item) {
            status = 404;
            error = "Could not find vote type";
        }
    }
    return { status, error };
}

// get post votes
router.get('/:voteType', authorization, async (req, res) => {
    try {
        const { voteType, error } = checkVoteType(req.params.voteType);
        console.log(voteType);
        if (error) {
            return res.status(400).send({ error });
        }
        const postVotes = await pool.query("SELECT * FROM ${voteType}_votes"); 
        res.send(postVotes.rows);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// add post votes
router.post("/post-vote", authorization, async (req, res) => {
    try {
        const { voteType, error: voteTypeError } = checkVoteType(req.params.voteType);
        if (voteTypeError) {
            //console.log("Hello");
            res.status(400).send({ error: voteTypeError });
        }
        const { item_id, vote_value } = req.body;
        const { status, error } = await checkVoteValue(item_id, vote_value, voteType);
        // the above line produces an error
        console.log("Hello");
        if (error) {
            res.status(400).send({ error });
        }
        let item_vote;
        try {
            const insertVote = await pool.query("INSERT INTO ${voteType}_votes VALUES($1, $2, $3) RETURNING *",
                [req.user.id, item_id, vote_value]);
            item_vote = vote;
        } catch (err) {
            const updateVote = await pool.query("UPDATE ${voteType}_votes SET vote_value = $1 WHERE user_id = $2" +  
                "AND ${voteType}_id = $3 RETURNING *", [vote_value, req.user.id, item_id]);
            item_vote = vote;
        }
        res.status(201).send(item_vote);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
