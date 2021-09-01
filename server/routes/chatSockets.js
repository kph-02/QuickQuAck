const express = require("express"); //import Express
const pool = require("../db");

/* SOCKET DB */
const getSocketMessages = (chatroom_id) => {
  return new Promise((resolve) => {
    pool.query(
      "SELECT message_id AS _id, text AS text, time_sent AS createdAt, author_id AS user FROM messages WHERE chatroom_id = $1;",
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
      "INSERT INTO messages (text, author_id, chatroom_id) VALUES ($1, $2, $3) RETURNING message_id AS _id, text AS text, time_sent AS createdAt, author_id AS user;",
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
  createSocketMessage,
};
