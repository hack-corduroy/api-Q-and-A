\set myId random(1, 1000000)
\set myId2 random(1, 1000000)
\set myId3 random(1, 1000000)
\set myId4 random(1, 1000000)
BEGIN;
  -- GET QUESTIONS
  SELECT * FROM questions WHERE product_id = myId order by id LIMIT 5 OFFSET 0;
  SELECT * FROM answers WHERE question_id = myId;
  SELECT * FROM photos WHERE answer_id = myId;
  -- GET ANSWERS
  SELECT * FROM answers WHERE question_id = myId order by id LIMIT 5 OFFSET 0;
  SELECT * FROM photos WHERE answer_id = myId;
  -- ADD QUESTION
  SELECT id FROM questions ORDER BY id DESC LIMIT 1;
  INSERT INTO questions ( id, product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES (myId, myId, 'test', '2022-01-19', 'tester', 'test@test.com', 'false', 0);
  -- ADD ANSWERS
  SELECT id FROM answers ORDER BY id DESC LIMIT 1;
  INSERT INTO questions ( id, question_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES (myId, myId, 'test', '2022-01-19', 'tester', 'test@test.com', 'false', 0);
  SELECT id FROM photos ORDER BY id DESC LIMIT 1;
  -- MARK QUESTION AS HELPFUL
  SELECT helpful FROM questions WHERE id = myId;
  UPDATE questions SET helpful = 1 WHERE id = myId;
  -- REPORT QUESTION
  UPDATE questions SET reported = true WHERE id = myId;
  -- MARK ANSWER AS HELPFUL
  SELECT helpful FROM answers WHERE id = myId;
  UPDATE answers SET helpful = 1 WHERE id = myId;
  -- REPORT ANSWER
  UPDATE answers SET reported = true WHERE id = myId;
END;
