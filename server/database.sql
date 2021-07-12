CREATE DATABASE Main;

/*CREATE DATABASE Users; 
CREATE DATABASE Posts;
CREATE DATABASE Chats;*/

/* Install/Setup UUID as needed: (command below)*/
/* create extension if not exists "uuid-ossp"; */

CREATE TABLE users (
    user_id uuid NOT NULL PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_of_birth DATE NOT NULL,
    college VARCHAR(50) NOT NULL, 
    grad_year INTEGER NOT NULL,
    blocked_users uuid[],
    revealed_users uuid[]
);

CREATE TABLE post (
    post_id PRIMARY KEY,
    user_id FOREIGN KEY,
    post_text VARCHAR(250),
    tags VARCHAR(40),
    time_posted TIMESTAMP CURRENT_TIMESTAMP,

);

CREATE TABLE comment (
    comment_id SERIAL,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    text VARCHAR(100) NOT NULL,
    time_posted TIMESTAMP CURRENT_TIMESTAMP
    PRIMARY KEY (comment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_id) REFERENCES post(post_id)
);


CREATE TABLE vote (
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, post_id)
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_id) REFERENCES post(post_id),
    FOREIGN KEY (comment_id) REFERENCES comment(comment)

);

CREATE TABLE tags (
    tag_id INTEGER NOT NULL,
    tag_text VARCHAR(10) NOT NULL,
    tag_color VARCHAR(7) NOT NULL,
    PRIMARY KEY (tag_id)
    FOREIGN KEY(post_id) REFERENCES post(post_id)
);



