

-- CREATE DATABASE IF NOT EXISTS chat;
-- USE chat;

-- CREATE TABLE IF NOT EXISTS messages (
--     id INT(11) NOT NULL AUTO_INCREMENT,
--     message VARCHAR(255) NOT NULL,
--     sender VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     PRIMARY KEY (id)
-- );

-- LOAD DATA INFILE '/docker-entrypoint-initdb.d/messages.csv'
-- INTO TABLE messages
-- FIELDS TERMINATED BY ','
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n'
-- IGNORE 1 ROWS
-- (channel_id, created_at, authorId, content)
-- SET channel_id = TRIM(channel_id);
