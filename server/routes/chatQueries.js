const express = require("express"); //import Express
const router = express(); //create an Express application on the app variable
const authorization = require("../middleware/authorization");
const pool = require("../db");

const getMessages = (request, response) => {
    pool.query(
       "SELECT * FROM messages ORDER BY id DESC LIMIT 10",
       (error, results) => {
          if (error) {
             throw error;
          }
          response.status(200).json(results.rows);
        }
    );
};

const createMessage = (request, response) => {
    const { text, username } = request.body;
    pool.query(
    "INSERT INTO messages (text, username) VALUES ($1, $2) RETURNING " 
    + "text, username, created_at",
       [text, username],
       (error, results) => {
          if (error) {
             throw error;
          }
          response.status(201).send(results.rows);
          }
    );
};

/* SOCKET DB */
const getSocketMessages = () => {
    return new Promise((resolve) => {
       pool.query(
          "SELECT * FROM messages ORDER BY id DESC LIMIT 10",
          (error, results) => {
             if (error) {
                throw error;
             }
             resolve(results.rows);
           }
       );
    });
 };
 const createSocketMessage = (message) => {
    return new Promise((resolve) => {
       pool.query(
          "INSERT INTO messages (text, username) VALUES ($1, $2) " 
          + "RETURNING text, username, created_at",
          [message.text, message.username],
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
    getMessages,
    createMessage,
    getSocketMessages,
    createSocketMessage,
 };