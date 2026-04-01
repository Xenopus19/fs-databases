CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('author', 'localhost', 'TE
ST');

insert into blogs (author, url, title) values ('author2', 'localhost2', '
TEST2');