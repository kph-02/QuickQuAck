/*CREATE DATABASE Users; 
CREATE DATABASE Posts;
CREATE DATABASE Chats;*/

/* Install/Setup UUID as needed: (command below)*/

    -- post_location geography(point),

-- create extension if not exists "postgis"; 


CREATE DATABASE main;

create extension if not exists "uuid-ossp"; 

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
    tag_id VARCHAR(10),
    blocked_users uuid[],
    revealed_users uuid[]
); 

CREATE TABLE post (
    post_id BIGSERIAL,
    is_poll BOOLEAN,
    user_id uuid NOT NULL,
    post_text VARCHAR(250),
    num_comments INTEGER NOT NULL,
    latitude NUMERIC (10,7),
    longitude NUMERIC (10,7),
    num_upvotes INTEGER NOT NULL,
    time_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT post_unique UNIQUE (post_id)
);

CREATE TABLE poll_voted (
    post_id INTEGER NOT NULL,
    user_id uuid NOT NULL,
    has_voted BOOLEAN,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE comment (
    comment_id BIGSERIAL,
    post_id INTEGER NOT NULL,
    num_upvotes INTEGER NOT NULL,
    user_id uuid NOT NULL,
    text VARCHAR(100) NOT NULL,
    time_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_post FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE
);


CREATE TABLE post_votes (
    user_id uuid NOT NULL,
    post_id INTEGER NOT NULL,
    vote_value INTEGER NOT NULL CHECK (-1 <= vote_value AND vote_value <= 1), 
    PRIMARY KEY (user_id, post_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE
);

CREATE TABLE comment_votes(
  user_id uuid NOT NULL,
  comment_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  vote_value INTEGER NOT NULL CHECK (-1 <= vote_value AND vote_value <= 1),
  PRIMARY KEY (user_id, comment_id),
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_comment FOREIGN KEY(comment_id) REFERENCES comment(comment_id) ON DELETE CASCADE,
  CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE
);


CREATE TABLE tags (
    tag_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (tag_id)
);

CREATE TABLE post_tags (
    tag_id VARCHAR(10) NOT NULL,
    post_id INTEGER NOT NULL,
    CONSTRAINT FK_tag_id FOREIGN KEY(tag_id) REFERENCES tags(tag_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(post_id) REFERENCES post(post_id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE user_tags (
    user_id uuid NOT NULL,
    tag_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (user_id, tag_id),
    FOREIGN KEY(tag_id) REFERENCES tags(tag_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE anon_names (
    anon_name_id VARCHAR(25) NOT NULL,
    PRIMARY KEY(anon_name_id)
);

CREATE TABLE post_names (
    user_id uuid NOT NULL,
    anon_name_id VARCHAR(25) NOT NULL,
    post_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, anon_name_id, post_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(anon_name_id) REFERENCES anon_names(anon_name_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(post_id) REFERENCES post(post_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE poll_choices (
    choice_id TEXT NOT NULL,
    post_id BIGSERIAL,
    CONSTRAINT FK_poll_id FOREIGN KEY(post_id) REFERENCES post(post_id) ON DELETE CASCADE,
    PRIMARY KEY (choice_id, post_id),
    UNIQUE(choice_id) --might want to remove this constraint
);

CREATE TABLE poll_votes (
    user_id uuid NOT NULL,
    choice_id TEXT NOT NULL,
    post_id BIGSERIAL,
    CONSTRAINT FK_user_id FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_poll_id FOREIGN KEY(post_id) REFERENCES post(post_id) ON DELETE CASCADE,
    CONSTRAINT FK_choice_id FOREIGN KEY(choice_id) REFERENCES poll_choices(choice_id) ON DELETE CASCADE
);

CREATE TABLE post_flags (
    poster_id uuid NOT NULL,
    reporter_id uuid NOT NULL,
    post_text VARCHAR(250) NOT NULL,
    post_id BIGSERIAL NOT NULL,
    report_reason VARCHAR(255) NOT NULL

);

CREATE TABLE chatrooms (
    chatroom_id BIGSERIAL,
    initiator_id uuid NOT NULL,
    recipient_id uuid NOT NULL,
    initiator_anon_name VARCHAR(255) NOT NULL,
    initiator_color VARCHAR(255) NOT NULL,
    recipient_anon_name VARCHAR(255) NOT NULL,
    recipient_color VARCHAR(255) NOT NULL,
    message_preview VARCHAR(255),
    initiator_name VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    initiator_reveal VARCHAR(1) NOT NULL,
    recipient_reveal VARCHAR(1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (chatroom_id),
    CONSTRAINT FK_initiator_id FOREIGN KEY (initiator_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_recipient_id FOREIGN KEY (recipient_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE messages (
    message_id BIGSERIAL,
    text VARCHAR(100) NOT NULL,
    author_id uuid NOT NULL,
    chatroom_id INTEGER NOT NULL,
    time_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id),
    CONSTRAINT FK_author_id FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_chatroom_id FOREIGN KEY (chatroom_id) REFERENCES chatrooms(chatroom_id) ON DELETE CASCADE
);

INSERT INTO tags (tag_id) VALUES ('Revelle');
INSERT INTO tags (tag_id) VALUES ('Muir');
INSERT INTO tags (tag_id) VALUES ('Warren');
INSERT INTO tags (tag_id) VALUES ('ERC');
INSERT INTO tags (tag_id) VALUES ('Marshall');
INSERT INTO tags (tag_id) VALUES ('Sixth');
INSERT INTO tags (tag_id) VALUES ('Seventh');
INSERT INTO tags (tag_id) VALUES ('Food');
INSERT INTO tags (tag_id) VALUES ('Social');
INSERT INTO tags (tag_id) VALUES ('Poll');
INSERT INTO tags (tag_id) VALUES ('Question');
