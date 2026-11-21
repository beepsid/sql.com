-- name: months where nobody was employed
-- for: 05-month-end-headcount

INSERT INTO departments VALUES (1, 'Startup');

-- company has nobody until june, everyone is gone by october.
-- jan-may and oct-dec must show 0, not disappear.
INSERT INTO employees VALUES
(1, 'Founder', 1, NULL, 100, '2024-06-03', '2024-09-30'),
(2, 'First hire', 1, 1, 80,  '2024-06-30', '2024-08-15');
