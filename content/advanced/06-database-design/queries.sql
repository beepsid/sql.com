-- database design
-- run sample-data.sql first
-- these are mostly design exercises, answers are one reasonable design, not the only one.

-- examples ---------------------------------------------------------

-- foreign keys stop bad data
INSERT INTO orders VALUES (999, 42, '2024-08-01', 'pending', 100);
-- ERROR: customer 42 doesn't exist

-- check constraints
CREATE TABLE orders_v2 (
  order_id    BIGINT PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(customer_id),
  status      TEXT NOT NULL CHECK (status IN ('pending','shipped','delivered','cancelled')),
  amount      NUMERIC(10,2) CHECK (amount >= 0)
);
INSERT INTO orders_v2 VALUES (1, 1, 'lost', 100);
-- ERROR: violates check constraint
DROP TABLE orders_v2;


-- practice ---------------------------------------------------------

-- 1. what's wrong with this table? redesign it.
--    students(student_id, name, courses)  where courses = 'Math, Physics, Chemistry'
--
-- 2. what's wrong here? redesign it.
--    enrollments(student_id, course_id, course_name, teacher_name, grade)
--
-- 3. design tables for a simple blog: users write posts, posts have many tags,
--    a tag can be on many posts, users can comment on posts.
--
-- 4. add a rule to products so price can never be negative or NULL.


-- answers ----------------------------------------------------------

-- 1
-- breaks 1NF, many values in one cell. can't query "who takes Physics" properly.
CREATE TABLE students   (student_id INT PRIMARY KEY, name TEXT);
CREATE TABLE courses    (course_id INT PRIMARY KEY, course_name TEXT);
CREATE TABLE enrollment (
  student_id INT REFERENCES students(student_id),
  course_id  INT REFERENCES courses(course_id),
  PRIMARY KEY (student_id, course_id)
);

-- 2
-- course_name and teacher_name depend only on course_id, not on (student_id, course_id). breaks 2NF.
-- move them to courses. grade stays because it depends on both student and course.
DROP TABLE enrollment, courses, students;
CREATE TABLE teachers (teacher_id INT PRIMARY KEY, teacher_name TEXT);
CREATE TABLE courses  (course_id INT PRIMARY KEY, course_name TEXT, teacher_id INT REFERENCES teachers(teacher_id));
CREATE TABLE students (student_id INT PRIMARY KEY, name TEXT);
CREATE TABLE enrollments (
  student_id INT REFERENCES students(student_id),
  course_id  INT REFERENCES courses(course_id),
  grade      TEXT,
  PRIMARY KEY (student_id, course_id)
);
DROP TABLE enrollments, students, courses, teachers;

-- 3
CREATE TABLE users    (user_id BIGINT PRIMARY KEY, username TEXT UNIQUE NOT NULL);
CREATE TABLE posts    (post_id BIGINT PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(user_id),
                       title TEXT NOT NULL, body TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE tags     (tag_id INT PRIMARY KEY, tag_name TEXT UNIQUE NOT NULL);
CREATE TABLE post_tags(post_id BIGINT REFERENCES posts(post_id), tag_id INT REFERENCES tags(tag_id),
                       PRIMARY KEY (post_id, tag_id));
CREATE TABLE comments (comment_id BIGINT PRIMARY KEY, post_id BIGINT NOT NULL REFERENCES posts(post_id),
                       user_id BIGINT NOT NULL REFERENCES users(user_id), body TEXT NOT NULL,
                       created_at TIMESTAMPTZ DEFAULT NOW());
DROP TABLE comments, post_tags, tags, posts, users;

-- 4
ALTER TABLE products ALTER COLUMN price SET NOT NULL;
ALTER TABLE products ADD CONSTRAINT price_not_negative CHECK (price >= 0);
