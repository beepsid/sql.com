# SQL Functions Cheat Sheet

Every function and operator you'll find on a typical sql cheat sheet, with what it actually does and what it's called in postgres, mysql and sql server. Same idea, different names, that's 90% of the pain when you switch databases.

A dash means that database doesn't have it built in. Click the topic links if you want the full explanation with examples.

## data types

> notes: [Data Types](beginner/09-data-types)

| name | what it holds | postgres | mysql | sql server |
|---|---|---|---|---|
| fixed text | text that's always the same length, padded with spaces | `CHAR(n)` | `CHAR(n)` | `CHAR(n)` / `NCHAR(n)` |
| variable text | text up to n characters, the one you'll use most | `VARCHAR(n)` | `VARCHAR(n)` | `VARCHAR(n)` / `NVARCHAR(n)` |
| long text | big text, no real limit | `TEXT` | `TEXT`, `MEDIUMTEXT`, `LONGTEXT` | `VARCHAR(MAX)` |
| tiny whole number | -128 to 127 (0 to 255 in sql server) | `SMALLINT` | `TINYINT` | `TINYINT` |
| small whole number | about ±32 thousand | `SMALLINT` | `SMALLINT` | `SMALLINT` |
| whole number | about ±2.1 billion | `INT` | `INT` | `INT` |
| big whole number | about ±9.2 quintillion, for ids that grow forever | `BIGINT` | `BIGINT` | `BIGINT` |
| auto increment id | number that goes up by itself on every insert | `GENERATED ALWAYS AS IDENTITY` / `SERIAL` | `AUTO_INCREMENT` | `IDENTITY(1,1)` |
| exact decimal | exact, use it for money | `NUMERIC(p,s)` | `DECIMAL(p,s)` | `DECIMAL(p,s)` |
| float | approximate, fast, never for money | `REAL`, `DOUBLE PRECISION` | `FLOAT`, `DOUBLE` | `REAL`, `FLOAT` |
| true / false | a boolean | `BOOLEAN` | `BOOLEAN` (really `TINYINT(1)`) | `BIT` |
| date | just the date, YYYY-MM-DD | `DATE` | `DATE` | `DATE` |
| time | just the time, HH:MM:SS | `TIME` | `TIME` | `TIME` |
| date and time | date plus time, no timezone | `TIMESTAMP` | `DATETIME` | `DATETIME2` |
| date and time with zone | stores the exact moment, timezone aware | `TIMESTAMPTZ` | `TIMESTAMP` (converts to UTC) | `DATETIMEOFFSET` |
| binary | raw bytes, files, images | `BYTEA` | `BLOB`, `MEDIUMBLOB`, `LONGBLOB` | `VARBINARY(MAX)` |
| one of a list | only values from a fixed list | `CREATE TYPE ... AS ENUM` | `ENUM('a','b')` | — (use a CHECK constraint) |
| set of options | several values from a fixed list | arrays, `TEXT[]` | `SET('a','b')` | — |
| json | json documents | `JSON`, `JSONB` | `JSON` | `NVARCHAR(MAX)` + json functions |
| uuid | random 128 bit id | `UUID` | `CHAR(36)` / `BINARY(16)` | `UNIQUEIDENTIFIER` |

## comparison operators

> notes: [WHERE & Filtering](beginner/02-where-filtering), [NULL Handling](beginner/04-null-handling)

| name | what it does | postgres | mysql | sql server |
|---|---|---|---|---|
| equal | same value | `=` | `=` | `=` |
| not equal | different value | `<>`, `!=` | `<>`, `!=` | `<>`, `!=` |
| greater / less | bigger or smaller | `>`, `<`, `>=`, `<=` | `>`, `<`, `>=`, `<=` | `>`, `<`, `>=`, `<=` |
| BETWEEN | in a range, both ends included | `BETWEEN a AND b` | `BETWEEN a AND b` | `BETWEEN a AND b` |
| NOT BETWEEN | outside the range | `NOT BETWEEN a AND b` | `NOT BETWEEN a AND b` | `NOT BETWEEN a AND b` |
| IN | matches any value in a list | `IN (1, 2, 3)` | `IN (1, 2, 3)` | `IN (1, 2, 3)` |
| IS NULL | value is missing. `= NULL` never works | `IS NULL` | `IS NULL` | `IS NULL` |
| IS NOT NULL | value is there | `IS NOT NULL` | `IS NOT NULL` | `IS NOT NULL` |
| null safe equal | equal, and NULL equals NULL | `IS NOT DISTINCT FROM` | `<=>` | `IS NOT DISTINCT FROM` (2022+) |
| IS TRUE / FALSE | checks a boolean, NULL counts as not true | `IS TRUE`, `IS FALSE` | `IS TRUE`, `IS FALSE` | — |
| LIKE | pattern match, `%` any characters, `_` one character | `LIKE` | `LIKE` | `LIKE` |
| NOT LIKE | doesn't match the pattern | `NOT LIKE` | `NOT LIKE` | `NOT LIKE` |
| case insensitive LIKE | LIKE but ignores upper / lower case | `ILIKE` | `LIKE` (default collation already ignores case) | `LIKE` (same) |
| regex match | matches a regular expression | `~`, `~*` (ignore case) | `REGEXP`, `RLIKE` | — |
| regex not match | doesn't match | `!~`, `!~*` | `NOT REGEXP` | — |
| SOUNDS LIKE | words that sound the same | `soundex(a) = soundex(b)` (fuzzystrmatch) | `SOUNDS LIKE` | `SOUNDEX(a) = SOUNDEX(b)` |

## logical operators

> notes: [Logical Operators (AND, OR, NOT)](beginner/03-logical-operators)

| name | what it does | postgres | mysql | sql server |
|---|---|---|---|---|
| AND | both are true | `AND` | `AND`, `&&` | `AND` |
| OR | at least one is true | `OR` | `OR`, `\|\|` (old mode) | `OR` |
| NOT | flips true and false | `NOT` | `NOT`, `!` | `NOT` |
| XOR | exactly one is true | `a <> b` | `XOR` | `a <> b` |

## math operators

> notes: [Numeric Functions](intermediate/13-numeric-functions)

| name | what it does | postgres | mysql | sql server |
|---|---|---|---|---|
| add, subtract, multiply | the usual | `+`, `-`, `*` | `+`, `-`, `*` | `+`, `-`, `*` |
| divide | int / int drops the decimals in postgres and sql server | `/` | `/` (always decimal) | `/` |
| integer divide | whole part only | `div(a, b)` or int `/` | `DIV` | int `/` |
| modulo | the remainder | `%`, `MOD()` | `%`, `MOD()` | `%` |
| power | a to the power b | `^`, `POWER()` | `POWER()`, `POW()` | `POWER()` |
| assignment | set a variable or column | `:=` (in pl/pgsql), `=` in UPDATE | `:=`, `=` | `=` |

## bitwise operators

> notes: [System & Misc Functions](advanced/13-system-and-misc-functions)

| name | what it does | postgres | mysql | sql server |
|---|---|---|---|---|
| bit AND | bits on in both | `&` | `&` | `&` |
| bit OR | bits on in either | `\|` | `\|` | `\|` |
| bit XOR | bits on in one but not both | `#` | `^` | `^` |
| bit NOT | flip every bit | `~` | `~` | `~` |
| shift left | move bits left, same as × 2 | `<<` | `<<` | `<<` (2022+) |
| shift right | move bits right, same as ÷ 2 | `>>` | `>>` | `>>` (2022+) |

## string functions

> notes: [String Functions](intermediate/09-string-functions)

| name | what it does | postgres | mysql | sql server |
|---|---|---|---|---|
| CONCAT | joins text together | `CONCAT()`, `\|\|` | `CONCAT()` | `CONCAT()`, `+` |
| CONCAT_WS | joins with a separator, skips NULLs | `CONCAT_WS(', ', a, b)` | `CONCAT_WS()` | `CONCAT_WS()` |
| LENGTH | number of characters | `LENGTH()`, `CHAR_LENGTH()` | `CHAR_LENGTH()` (`LENGTH()` is bytes!) | `LEN()` (ignores trailing spaces) |
| byte length | number of bytes, not characters | `OCTET_LENGTH()` | `LENGTH()`, `OCTET_LENGTH()` | `DATALENGTH()` |
| bit length | number of bits | `BIT_LENGTH()` | `BIT_LENGTH()` | — |
| UPPER / LOWER | change case | `UPPER()`, `LOWER()` | `UPPER()`, `LOWER()`, `UCASE()`, `LCASE()` | `UPPER()`, `LOWER()` |
| INITCAP | first letter of each word capital | `INITCAP()` | — | — |
| SUBSTRING | part of a string, starts at 1 not 0 | `SUBSTRING(s, start, len)`, `SUBSTR()` | `SUBSTRING()`, `SUBSTR()`, `MID()` | `SUBSTRING()` |
| LEFT / RIGHT | first or last n characters | `LEFT()`, `RIGHT()` | `LEFT()`, `RIGHT()` | `LEFT()`, `RIGHT()` |
| SUBSTRING_INDEX | everything before the nth delimiter | `SPLIT_PART(s, '@', 1)` | `SUBSTRING_INDEX(s, '@', 1)` | — |
| split into rows | one row per piece | `STRING_TO_TABLE()`, `UNNEST(STRING_TO_ARRAY())` | — | `STRING_SPLIT()` |
| position | where a substring starts, 0 if not found | `POSITION('x' IN s)`, `STRPOS()` | `LOCATE()`, `INSTR()`, `POSITION()` | `CHARINDEX()`, `PATINDEX()` |
| FIELD | position of a value in a list | `ARRAY_POSITION(ARRAY[...], x)` | `FIELD(x, 'a', 'b')` | — |
| FIND_IN_SET | position in a comma separated string | `ARRAY_POSITION(STRING_TO_ARRAY(s, ','), x)` | `FIND_IN_SET()` | — |
| ELT | nth item of a list | `(ARRAY[...])[n]` | `ELT(n, 'a', 'b')` | `CHOOSE(n, 'a', 'b')` |
| TRIM | remove spaces (or other characters) from both ends | `TRIM()`, `BTRIM()` | `TRIM()` | `TRIM()` (2017+) |
| LTRIM / RTRIM | remove from one side | `LTRIM()`, `RTRIM()` | `LTRIM()`, `RTRIM()` | `LTRIM()`, `RTRIM()` |
| LPAD / RPAD | pad to a fixed length, `LPAD('7', 3, '0')` → `007` | `LPAD()`, `RPAD()` | `LPAD()`, `RPAD()` | `RIGHT(REPLICATE('0', 3) + s, 3)` |
| REPLACE | swap every match for something else | `REPLACE()` | `REPLACE()` | `REPLACE()` |
| INSERT | overwrite part of a string at a position | `OVERLAY(s PLACING x FROM 2 FOR 3)` | `INSERT(s, 2, 3, x)` | `STUFF(s, 2, 3, x)` |
| TRANSLATE | swap characters one for one | `TRANSLATE()` | — | `TRANSLATE()` (2017+) |
| REVERSE | backwards | `REVERSE()` | `REVERSE()` | `REVERSE()` |
| REPEAT | the same text n times | `REPEAT()` | `REPEAT()` | `REPLICATE()` |
| SPACE | n spaces | `REPEAT(' ', n)` | `SPACE()` | `SPACE()` |
| ASCII / CHAR | character to code and back | `ASCII()`, `CHR()` | `ASCII()`, `ORD()`, `CHAR()` | `ASCII()`, `CHAR()`, `UNICODE()` |
| FORMAT | number with commas, `1,234.50` | `TO_CHAR(n, 'FM9,999.00')` | `FORMAT(n, 2)` | `FORMAT(n, 'N2')` |
| QUOTE | wrap in quotes, escaped for SQL | `QUOTE_LITERAL()`, `QUOTE_IDENT()` | `QUOTE()` | `QUOTENAME()` |
| HEX / UNHEX | text or number as hex and back | `ENCODE(s::bytea, 'hex')`, `TO_HEX(n)` | `HEX()`, `UNHEX()` | `CONVERT(VARCHAR, CAST(s AS VARBINARY), 2)` |
| BIN / OCT | number in binary or octal | `n::bit(8)` | `BIN()`, `OCT()` | — |
| CONV | change number base | — | `CONV(n, from, to)` | — |
| regex replace | replace using a regular expression | `REGEXP_REPLACE()` | `REGEXP_REPLACE()` (8.0+) | — |
| regex extract | pull out the part that matches | `SUBSTRING(s FROM 'pattern')`, `REGEXP_SUBSTR()` | `REGEXP_SUBSTR()` | — |
| STRCMP | compare two strings, -1 / 0 / 1 | `CASE` with `<`, `=` | `STRCMP()` | — |
| SOUNDEX | code for how a word sounds | `SOUNDEX()` (fuzzystrmatch) | `SOUNDEX()` | `SOUNDEX()`, `DIFFERENCE()` |
| MATCH AGAINST | full text search | `to_tsvector(s) @@ to_tsquery('word')` | `MATCH(col) AGAINST('word')` | `CONTAINS()`, `FREETEXT()` |
| LOAD_FILE | read a file on the server into a string | `pg_read_file()` (superuser) | `LOAD_FILE()` | `OPENROWSET(BULK ...)` |
| MAKE_SET / EXPORT_SET | build a string from bits | — | `MAKE_SET()`, `EXPORT_SET()` | — |

## numeric functions

> notes: [Numeric Functions](intermediate/13-numeric-functions)

| name | what it does | postgres | mysql | sql server |
|---|---|---|---|---|
| ABS | distance from zero, always positive | `ABS()` | `ABS()` | `ABS()` |
| SIGN | -1, 0 or 1 | `SIGN()` | `SIGN()` | `SIGN()` |
| ROUND | round to n decimals, negative n rounds to tens / hundreds | `ROUND(x, n)` | `ROUND(x, n)` | `ROUND(x, n)` |
| CEIL | round up | `CEIL()`, `CEILING()` | `CEIL()`, `CEILING()` | `CEILING()` |
| FLOOR | round down | `FLOOR()` | `FLOOR()` | `FLOOR()` |
| TRUNCATE | cut off decimals, no rounding | `TRUNC(x, n)` | `TRUNCATE(x, n)` | `ROUND(x, n, 1)` |
| MOD | remainder | `MOD()`, `%` | `MOD()`, `%` | `%` |
| POWER | a to the power b | `POWER()` | `POWER()`, `POW()` | `POWER()` |
| SQRT | square root | `SQRT()` | `SQRT()` | `SQRT()` |
| EXP | e to the power x | `EXP()` | `EXP()` | `EXP()` |
| LN | natural log | `LN()` | `LN()`, `LOG(x)` | `LOG(x)` |
| LOG10 / LOG2 | log base 10 or 2 | `LOG(x)`, `LOG(2, x)` | `LOG10()`, `LOG2()` | `LOG10()`, `LOG(x, 2)` |
| PI | 3.14159... | `PI()` | `PI()` | `PI()` |
| RAND | random number from 0 to 1 | `RANDOM()` | `RAND()` | `RAND()` |
| GREATEST / LEAST | biggest or smallest across columns | `GREATEST()`, `LEAST()` | `GREATEST()`, `LEAST()` | `GREATEST()`, `LEAST()` (2022+) |
| trig | sin, cos, tan and friends, in radians | `SIN()`, `COS()`, `TAN()`, `COT()`, `ASIN()`, `ACOS()`, `ATAN()`, `ATAN2()` | same names | same names (`ATN2()` for atan2) |
| DEGREES / RADIANS | convert angles | `DEGREES()`, `RADIANS()` | `DEGREES()`, `RADIANS()` | `DEGREES()`, `RADIANS()` |
| CRC32 | quick checksum number | — | `CRC32()` | `CHECKSUM()` |

## date and time functions

> notes: [Date & Time Functions](intermediate/10-date-functions)

| name | what it does | postgres | mysql | sql server |
|---|---|---|---|---|
| now | current date and time | `NOW()`, `CURRENT_TIMESTAMP` | `NOW()`, `CURRENT_TIMESTAMP`, `SYSDATE()` | `GETDATE()`, `SYSDATETIME()` |
| today | current date | `CURRENT_DATE` | `CURDATE()`, `CURRENT_DATE` | `CAST(GETDATE() AS DATE)` |
| current time | current time only | `CURRENT_TIME`, `LOCALTIME` | `CURTIME()`, `CURRENT_TIME` | `CAST(GETDATE() AS TIME)` |
| UTC now | current time in UTC | `NOW() AT TIME ZONE 'UTC'` | `UTC_TIMESTAMP()`, `UTC_DATE()`, `UTC_TIME()` | `GETUTCDATE()` |
| get a part | year, month, day, hour from a date | `EXTRACT(YEAR FROM d)`, `DATE_PART('year', d)` | `EXTRACT()`, `YEAR()`, `MONTH()`, `DAY()`, `HOUR()`, `MINUTE()`, `SECOND()`, `MICROSECOND()` | `DATEPART(YEAR, d)`, `YEAR()`, `MONTH()`, `DAY()` |
| quarter | 1 to 4 | `EXTRACT(QUARTER FROM d)` | `QUARTER()` | `DATEPART(QUARTER, d)` |
| week | week number of the year | `EXTRACT(WEEK FROM d)` | `WEEK()`, `WEEKOFYEAR()`, `YEARWEEK()` | `DATEPART(WEEK, d)`, `DATEPART(ISO_WEEK, d)` |
| day of week | which weekday as a number | `EXTRACT(DOW FROM d)` (0 = sunday), `ISODOW` (1 = monday) | `DAYOFWEEK()` (1 = sunday), `WEEKDAY()` (0 = monday) | `DATEPART(WEEKDAY, d)` (depends on settings) |
| day of year | 1 to 366 | `EXTRACT(DOY FROM d)` | `DAYOFYEAR()` | `DATEPART(DAYOFYEAR, d)` |
| day / month name | monday, january... | `TO_CHAR(d, 'Day')`, `TO_CHAR(d, 'Month')` | `DAYNAME()`, `MONTHNAME()` | `DATENAME(WEEKDAY, d)`, `DATENAME(MONTH, d)` |
| add time | date plus an interval | `d + INTERVAL '7 days'` | `DATE_ADD(d, INTERVAL 7 DAY)`, `ADDDATE()`, `ADDTIME()`, `TIMESTAMPADD()` | `DATEADD(DAY, 7, d)` |
| subtract time | date minus an interval | `d - INTERVAL '7 days'` | `DATE_SUB()`, `SUBDATE()`, `SUBTIME()` | `DATEADD(DAY, -7, d)` |
| difference in days | days between two dates | `d2 - d1` | `DATEDIFF(d2, d1)` | `DATEDIFF(DAY, d1, d2)` |
| difference in any unit | months, hours, seconds between | `AGE()`, `EXTRACT(EPOCH FROM t2 - t1)` | `TIMESTAMPDIFF(MONTH, d1, d2)`, `TIMEDIFF()` | `DATEDIFF(MONTH, d1, d2)` |
| period math | months between YYYYMM periods | — | `PERIOD_ADD()`, `PERIOD_DIFF()` | — |
| start of month / week | cut a date down to its month or week | `DATE_TRUNC('month', d)` | `DATE_FORMAT(d, '%Y-%m-01')` | `DATETRUNC(MONTH, d)` (2022+), `DATEFROMPARTS(YEAR(d), MONTH(d), 1)` |
| end of month | last day of the month | `DATE_TRUNC('month', d) + INTERVAL '1 month - 1 day'` | `LAST_DAY()` | `EOMONTH()` |
| format a date | date to text in any format | `TO_CHAR(d, 'YYYY-MM-DD')` | `DATE_FORMAT(d, '%Y-%m-%d')`, `TIME_FORMAT()` | `FORMAT(d, 'yyyy-MM-dd')`, `CONVERT(VARCHAR, d, 23)` |
| parse a date | text to date | `TO_DATE('01/07/2024', 'DD/MM/YYYY')`, `TO_TIMESTAMP()` | `STR_TO_DATE('01/07/2024', '%d/%m/%Y')` | `CONVERT(DATE, '01/07/2024', 103)`, `TRY_CONVERT()` |
| format strings | the format codes for each database | `TO_CHAR` patterns | `GET_FORMAT()` | style numbers in `CONVERT()` |
| build a date | from year, month, day numbers | `MAKE_DATE(2024, 7, 1)`, `MAKE_TIMESTAMP()` | `MAKEDATE(2024, 183)`, `MAKETIME()` | `DATEFROMPARTS(2024, 7, 1)`, `TIMEFROMPARTS()` |
| take the date part | drop the time from a timestamp | `t::date` | `DATE(t)` | `CAST(t AS DATE)` |
| take the time part | drop the date | `t::time` | `TIME(t)` | `CAST(t AS TIME)` |
| unix timestamp to date | seconds since 1970 to a real date | `TO_TIMESTAMP(n)` | `FROM_UNIXTIME(n)` | `DATEADD(SECOND, n, '1970-01-01')` |
| date to unix timestamp | real date to seconds since 1970 | `EXTRACT(EPOCH FROM t)` | `UNIX_TIMESTAMP(t)` | `DATEDIFF_BIG(SECOND, '1970-01-01', t)` |
| day number | days since year 0 | — | `TO_DAYS()`, `FROM_DAYS()` | — |
| seconds of a time | time to seconds and back | `EXTRACT(EPOCH FROM tm)` | `TIME_TO_SEC()`, `SEC_TO_TIME()`, `TO_SECONDS()` | `DATEDIFF(SECOND, '00:00', tm)` |
| change timezone | convert a time between zones | `t AT TIME ZONE 'Asia/Kolkata'` | `CONVERT_TZ(t, '+00:00', '+05:30')` | `t AT TIME ZONE 'India Standard Time'` |

## aggregate (group by) functions

> notes: [Aggregation Basics](beginner/07-aggregation-basics), [GROUP BY & HAVING](intermediate/05-group-by-having), [Advanced Aggregation](advanced/10-advanced-aggregation)

| name | what it does | postgres | mysql | sql server |
|---|---|---|---|---|
| COUNT | number of rows, or non NULL values in a column | `COUNT(*)`, `COUNT(col)` | same | same (`COUNT_BIG()` for huge tables) |
| COUNT DISTINCT | number of different values | `COUNT(DISTINCT col)` | same | same |
| SUM | total | `SUM()` | `SUM()` | `SUM()` |
| AVG | average, ignores NULLs | `AVG()` | `AVG()` | `AVG()` (int column gives int!) |
| MIN / MAX | smallest / biggest | `MIN()`, `MAX()` | `MIN()`, `MAX()` | `MIN()`, `MAX()` |
| join values into one string | all the values in a group as one string | `STRING_AGG(col, ', ')` | `GROUP_CONCAT(col SEPARATOR ', ')` | `STRING_AGG(col, ', ')` |
| collect into an array | all the values as an array / json | `ARRAY_AGG()`, `JSON_AGG()` | `JSON_ARRAYAGG()` | — |
| standard deviation | how spread out the values are | `STDDEV()`, `STDDEV_SAMP()`, `STDDEV_POP()` | `STD()`, `STDDEV()`, `STDDEV_SAMP()`, `STDDEV_POP()` | `STDEV()`, `STDEVP()` |
| variance | spread, squared | `VARIANCE()`, `VAR_SAMP()`, `VAR_POP()` | `VARIANCE()`, `VAR_SAMP()`, `VAR_POP()` | `VAR()`, `VARP()` |
| median / percentile | middle value, or any percentile | `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY col)` | — (window function trick) | `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY col) OVER ()` |
| bit aggregates | AND / OR / XOR of all the values' bits | `BIT_AND()`, `BIT_OR()`, `BIT_XOR()` | `BIT_AND()`, `BIT_OR()`, `BIT_XOR()` | — |
| bool aggregates | all true? any true? | `BOOL_AND()`, `BOOL_OR()` | `MIN(cond)`, `MAX(cond)` | `MIN(CASE...)`, `MAX(CASE...)` |
| FILTER | aggregate only some rows | `COUNT(*) FILTER (WHERE ...)` | `SUM(CASE WHEN ... THEN 1 END)` | `SUM(CASE WHEN ... THEN 1 END)` |

## information functions

> notes: [System & Misc Functions](advanced/13-system-and-misc-functions)

| name | what it does | postgres | mysql | sql server |
|---|---|---|---|---|
| current user | who you're logged in as | `CURRENT_USER`, `SESSION_USER` | `CURRENT_USER()`, `USER()`, `SESSION_USER()`, `SYSTEM_USER()` | `CURRENT_USER`, `SUSER_NAME()` |
| current database | which database you're in | `CURRENT_DATABASE()` | `DATABASE()`, `SCHEMA()` | `DB_NAME()` |
| version | database version | `VERSION()` | `VERSION()` | `@@VERSION` |
| last inserted id | id generated by your last insert | `INSERT ... RETURNING id`, `LASTVAL()` | `LAST_INSERT_ID()` | `SCOPE_IDENTITY()`, `OUTPUT inserted.id` |
| rows changed | how many rows the last statement touched | `GET DIAGNOSTICS` (pl/pgsql), `RETURNING` | `ROW_COUNT()` | `@@ROWCOUNT` |
| rows found | total rows ignoring LIMIT | `COUNT(*) OVER ()` | `FOUND_ROWS()` (deprecated), `COUNT(*) OVER ()` | `COUNT(*) OVER ()` |
| connection id | id of your session | `PG_BACKEND_PID()` | `CONNECTION_ID()` | `@@SPID` |
| charset / collation | how text is stored and compared | `pg_encoding_to_char(encoding)`, `COLLATION FOR (s)` | `CHARSET()`, `COLLATION()`, `COERCIBILITY()` | `COLLATIONPROPERTY()` |
| benchmark | run something n times to time it | `EXPLAIN ANALYZE` | `BENCHMARK(n, expr)` | `SET STATISTICS TIME ON` |

## encryption and hashing

> notes: [System & Misc Functions](advanced/13-system-and-misc-functions)

| name | what it does | postgres | mysql | sql server |
|---|---|---|---|---|
| MD5 | 32 character hash, fine for fingerprints, never for passwords | `MD5()` | `MD5()` | `HASHBYTES('MD5', s)` |
| SHA1 | 40 character hash, old | `encode(digest(s, 'sha1'), 'hex')` (pgcrypto) | `SHA1()`, `SHA()` | `HASHBYTES('SHA1', s)` |
| SHA2 | 64 character hash (sha256) | `encode(SHA256(s::bytea), 'hex')` | `SHA2(s, 256)` | `HASHBYTES('SHA2_256', s)` |
| encrypt / decrypt | lock and unlock with a key | `PGP_SYM_ENCRYPT()`, `PGP_SYM_DECRYPT()` (pgcrypto) | `AES_ENCRYPT()`, `AES_DECRYPT()` | `ENCRYPTBYPASSPHRASE()`, `DECRYPTBYPASSPHRASE()` |
| old encryption | DES, ENCODE, ENCRYPT, removed or deprecated, don't use | — | `DES_ENCRYPT()`, `ENCODE()`, `ENCRYPT()` (removed in 8.0) | — |
| password hashing | hash a password properly | `CRYPT(pw, GEN_SALT('bf'))` (pgcrypto) | do it in your app (`PASSWORD()` was removed) | do it in your app |
| compress | shrink text | automatic (TOAST) | `COMPRESS()`, `UNCOMPRESS()`, `UNCOMPRESSED_LENGTH()` | `COMPRESS()`, `DECOMPRESS()` |
| base64 | bytes to text and back | `ENCODE(b, 'base64')`, `DECODE()` | `TO_BASE64()`, `FROM_BASE64()` | `FOR XML` / `BASE64_ENCODE()` (2025) |

## misc functions

> notes: [System & Misc Functions](advanced/13-system-and-misc-functions), [NULL Handling](beginner/04-null-handling), [CASE WHEN](beginner/10-case-when)

| name | what it does | postgres | mysql | sql server |
|---|---|---|---|---|
| COALESCE | first value that isn't NULL | `COALESCE()` | `COALESCE()`, `IFNULL()` | `COALESCE()`, `ISNULL()` |
| NULLIF | NULL if the two values are equal, great for divide by zero | `NULLIF()` | `NULLIF()` | `NULLIF()` |
| IF | inline if else | `CASE WHEN ... THEN ... ELSE ... END` | `IF(cond, a, b)`, `CASE` | `IIF(cond, a, b)`, `CASE` |
| CAST | change the type | `CAST(x AS INT)`, `x::int` | `CAST()`, `CONVERT()` | `CAST()`, `CONVERT()`, `TRY_CAST()` |
| UUID | random unique id | `GEN_RANDOM_UUID()` | `UUID()`, `UUID_SHORT()` | `NEWID()` |
| DEFAULT | the column's default value | `DEFAULT` | `DEFAULT(col)` | `DEFAULT` |
| VALUES | the new value in an upsert | `EXCLUDED.col` in `ON CONFLICT` | `VALUES(col)` / alias in `ON DUPLICATE KEY UPDATE` | `MERGE` |
| sleep | wait n seconds | `PG_SLEEP(n)` | `SLEEP(n)` | `WAITFOR DELAY '00:00:05'` |
| named locks | app level lock on a name or number | `PG_ADVISORY_LOCK()`, `PG_TRY_ADVISORY_LOCK()`, `PG_ADVISORY_UNLOCK()` | `GET_LOCK()`, `RELEASE_LOCK()`, `IS_FREE_LOCK()`, `IS_USED_LOCK()` | `sp_getapplock`, `sp_releaseapplock` |
| ip addresses | ip text to number and back | `'1.2.3.4'::inet` (proper type) | `INET_ATON()`, `INET_NTOA()`, `INET6_ATON()` | — |
| NAME_CONST | give a value a column name | `SELECT 5 AS x` | `NAME_CONST('x', 5)` | `SELECT 5 AS x` |
| replication wait | wait for a replica to catch up | — | `MASTER_POS_WAIT()` (old), `SOURCE_POS_WAIT()` | — |

## the classic queries

> notes: [SELECT & Basic Queries](beginner/01-select-basics), [INNER JOIN](intermediate/01-inner-join), [LIMIT & OFFSET](beginner/06-limit-offset)

| name | what it does | postgres | mysql | sql server |
|---|---|---|---|---|
| all columns | every column, every row | `SELECT * FROM t` | same | same |
| some columns | just what you need | `SELECT a, b FROM t` | same | same |
| filter | rows that match | `SELECT * FROM t WHERE ...` | same | same |
| group | one row per group, filter groups with HAVING | `SELECT a, COUNT(*) FROM t GROUP BY a HAVING COUNT(*) > 1` | same | same |
| first n rows | limit the result | `... LIMIT 10` | `... LIMIT 10` | `SELECT TOP 10 ...` |
| skip and take | pagination | `LIMIT 10 OFFSET 20` | `LIMIT 20, 10` or `LIMIT 10 OFFSET 20` | `OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY` |
| no repeats | unique rows | `SELECT DISTINCT a FROM t` | same | same |
| join | combine two tables | `SELECT ... FROM t1 JOIN t2 ON t1.id = t2.t1_id` | same | same |
