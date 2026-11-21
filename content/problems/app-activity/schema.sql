CREATE TABLE users (
  user_id      INT PRIMARY KEY,
  signup_date  DATE,
  country      TEXT,
  platform     TEXT
);

CREATE TABLE events (
  event_id    BIGINT PRIMARY KEY,
  user_id     INT,
  event_ts    TIMESTAMP,
  event_type  TEXT
);

CREATE INDEX ON events (user_id, event_ts);
CREATE INDEX ON events (event_ts);
