-- name: ties at the cutoff, unrated movies and titles that only look like "The ..."

INSERT INTO movies VALUES
-- four movies from 2030, then two from 2029: the 5th newest is a tie, alphabetical picks 'Able'
(101, 'Zebra Crossing', 'Drama',  'Hindi',   2030, 120, NULL),
(102, 'Yellow Kite',    'Comedy', 'Hindi',   2030, 150, 9.5),
(103, 'Xylophone',      'Horror', 'English', 2030, 151, 9.5),
(104, 'Wild Card',      'Comedy', 'English', 2030, 99,  NULL),
(105, 'Bravo Bay',      'Drama',  'English', 2029, 100, 9.5),
(106, 'Able Seaman',    'Drama',  'English', 2029, 101, 9.0),
-- not "The ..." titles
(107, 'Thermos',        'Comedy', 'Hindi',   1999, 90,  4.0),
(108, 'the lowercase',  'Comedy', 'Hindi',   1998, 90,  4.0),
(109, 'The Real One',   'Horror', 'Hindi',   1997, 200, NULL);
