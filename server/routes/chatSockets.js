const express = require("express"); //import Express
const pool = require("../db");

/* SOCKET DB */
const getSocketMessages = (chatroom_id) => {
    return new Promise((resolve) => {
       pool.query(
          "SELECT * FROM messages WHERE chatroom_id = $1 ORDER BY id DESC;",
          [chatroom_id],
          (error, results) => {
             if (error) {
                throw error;
             }
             resolve(results.rows);
           }
       );
    });
  };
  const createSocketMessage = (text, author_id, chatroom_id) => {
    return new Promise((resolve) => {
       pool.query(
          "INSERT INTO messages (text, author_id, chatroom_id) VALUES ($1, $2, $3) RETURNING *;",
          [text, author_id, chatroom_id],
          (error, results) => {
             if (error) {
                throw error;
             }
             resolve(results.rows);
          }
       );
    });
  };

  module.exports = {
    getSocketMessages,
    createSocketMessage
  };
  