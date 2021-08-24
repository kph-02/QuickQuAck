/*CREATE DATABASE Users; 
CREATE DATABASE Posts;
CREATE DATABASE Chats;*/

/* Install/Setup UUID as needed: (command below)*/

    -- post_location geography(point),

-- create extension if not exists "postgis"; 


CREATE DATABASE Main;

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
    user_id uuid NOT NULL,
    post_text VARCHAR(250),
    num_comments INTEGER NOT NULL,
    num_upvotes INTEGER NOT NULL,
    time_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT post_unique UNIQUE (post_id)
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

CREATE TABLE poll (
    poll_id BIGSERIAL,
    user_id uuid NOT NULL,
    num_comments INTEGER NOT NULL,
    time_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    poll_question VARCHAR(250),
    startsAt DATETIME,
    endsAt DATETIME,
    -- poll_location geography(point),
    PRIMARY KEY (poll_id),
    CONSTRAINT FK_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT poll_unique UNIQUE (poll_id)
);

CREATE TABLE poll_tag (
    tag_id VARCHAR(10) NOT NULL,
    poll_id INTEGER NOT NULL,
    CONSTRAINT FK_tag_id FOREIGN KEY(tag_id) REFERENCES tags(tag_id) ON UPDATE CASCADE,
    FOREIGN KEY(poll_id) REFERENCES poll(poll_id),
    PRIMARY KEY (poll_id, tag_id)
);

CREATE TABLE poll_choices (
    choice_id TEXT NOT NULL,
    poll_id BIGSERIAL,
    CONSTRAINT FK_poll_id FOREIGN KEY(poll_id) REFERENCES poll(poll_id) ON DELETE CASCADE,
    PRIMARY KEY (choice_id, poll_id)
);

CREATE TABLE poll_votes (
    user_id uuid NOT NULL,
    choice_id TEXT NOT NULL,
    poll_id BIGSERIAL,
    CONSTRAINT FK_user_id FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_poll_id FOREIGN KEY(poll_id) REFERENCES poll(poll_id) ON DELETE CASCADE,
    CONSTRAINT FK_choice_id FOREIGN KEY(choice_id) REFERENCES poll_choices(choice_id) ON DELETE CASCADE
);

CREATE TABLE post_flags (
    poster_id uuid NOT NULL,
    reporter_id uuid NOT NULL,
    post_text VARCHAR(250) NOT NULL,
    report_reason VARCHAR(255) NOT NULL,

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

CREATE TABLE messages (
  ID SERIAL PRIMARY KEY,
  text varchar(255) NOT NULL,
  username varchar(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

INSERT INTO messages (text, username)
  VALUES ('1+1=2', 'matthew'), 
  ('2+2=4', 'blake'), 
  ('3+3=6', 'julie'), 
  ('4+4=8', 'courtney'), 
  ('5+5=10', 'brian'), 
  ('6+6=12', 'michael'), 
  ('7+7=14', 'edward'), 
  ('1+1=2', 'matthew'), 
  ('2+2=4', 'blake'), 
  ('3+3=6', 'julie');