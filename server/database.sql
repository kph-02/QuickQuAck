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
    tag_id VARCHAR(10)[],
    blocked_users uuid[],
    revealed_users uuid[]
); 


CREATE TABLE post (
    post_id BIGSERIAL,
    user_id uuid NOT NULL,
    post_text VARCHAR(250),
    time_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT post_unique UNIQUE (post_id)
);

CREATE TABLE comment (
    comment_id BIGSERIAL,
    post_id INTEGER NOT NULL,
    user_id uuid NOT NULL,
    text VARCHAR(100) NOT NULL,
    time_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_id) REFERENCES post(post_id)
);

CREATE TYPE voting AS ENUM (
    'like',
    'dislike'
);

CREATE TABLE vote (
    user_id uuid NOT NULL,
    post_id INTEGER NOT NULL,
    comment_id INTEGER NOT NULL,
    vote_value voting, 
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comment(comment_id) ON DELETE CASCADE
);

-- storage of all the tags

CREATE TABLE tags (
    tag_id VARCHAR(10)[] NOT NULL,
    post_id INTEGER NOT NULL,
    PRIMARY KEY (tag_id),
    FOREIGN KEY(post_id) REFERENCES post(post_id)
);


-- insert into this table to connect tags to posts 
-- connecting a tag to a post

CREATE TABLE post_tags (
    tag_id VARCHAR(10)[] NOT NULL,
    post_id INTEGER NOT NULL,
    FOREIGN KEY(tag_id) REFERENCES tags(tag_id) ON UPDATE CASCADE,
    FOREIGN KEY(post_id) REFERENCES post(post_id),
    PRIMARY KEY (post_id, tag_id)
);

-- connecting tags to a user 

CREATE TABLE user_tags (
    user_id uuid NOT NULL,
    tag_id VARCHAR(10)[] NOT NULL,
    PRIMARY KEY (user_id, tag_id),
    FOREIGN KEY(tag_id) REFERENCES tags(tag_id) ON UPDATE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);


