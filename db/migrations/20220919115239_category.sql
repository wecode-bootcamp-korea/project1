-- migrate:up
CREATE TABLE category (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50),
    PRIMARY KEY (id)
)
-- migrate:down
DROP TABLE category;