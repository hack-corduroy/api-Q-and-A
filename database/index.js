require('dotenv').config({ path: '.env' });
const { Pool, Client } = require("pg");

const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const pool = new Pool({ connectionString: connectionString });

let db = {
  getQuestions: async (product_id, page = 1, count = 5) => {
    let start = (page - 1) * count;
    let questionData = await pool.query(`SELECT * FROM questions WHERE product_id = ${product_id} order by id LIMIT ${count} OFFSET ${start}`)
    let answerData = await pool.query(`SELECT * FROM answers WHERE question_id = ${questionData.rows[0].id}`)
    let answerIdArr = answerData.rows.map((answer, i) => {
      return answer.id;
    })
    let photoData = await pool.query(`SELECT * FROM photos WHERE answer_id IN (${answerIdArr.join(',')})`)
    return { questionData, answerData, photoData }
  },
  getAnswers: async (question_id, page = 1, count = 5) => {
    let start = (page -1) * count;
    let answerData = await pool.query(`SELECT * FROM answers WHERE question_id = ${question_id} order by id LIMIT ${count} OFFSET ${start}`)
    let answerIdArr = answerData.rows.map((answer, i) => {
      return answer.id;
    })
    let photoData = await pool.query(`SELECT * FROM photos WHERE answer_id IN (${answerIdArr.join(',')})`)
    return {answerData, photoData}
  },
  addQuestion: async (product_id, body, date_written, asker_name, asker_email = null, reported = false, helpful = 0) => {
    const {rows} = await pool.query(`SELECT id FROM questions ORDER BY id DESC LIMIT 1`);
    await pool.query(`INSERT INTO questions ( id, product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES (${rows[0].id + 1}, ${product_id}, '${body}', '${date_written}', '${asker_name}', '${asker_email}', '${reported}', ${helpful})`)
  },
  addAnswer: async (question_id, body, date_written, asker_name, asker_email = null, photos, reported = false, helpful = 0) => {
    const {rows} = await pool.query(`SELECT id FROM answers ORDER BY id DESC LIMIT 1`);
    await pool.query(`INSERT INTO questions ( id, question_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES (${rows[0].id + 1}, $${question_id}, '${body}', '${date_written}', '${asker_name}', '${asker_email}', '${reported}', ${helpful})`)
    if(photos.length !== 0) {
      photos.forEach(async (photo, i) => {
        const {rows: photoId} = await pool.query(`SELECT id FROM photos ORDER BY id DESC LIMIT 1`);
        await pool.query(`INSERT INTO photos ( id, answer_id, url) VALUES ${photoId[0].id + 1}, ${id}, ${photo[i]}`)
      })
    }
  },
  markQuestionHelpful: async (question_id)  => {
    const {rows} = await pool.query(`SELECT helpful FROM questions WHERE id = ${question_id}`);
    await pool.query(`UPDATE questions SET helpful = '${rows[0].helpful + 1}' WHERE id = ${question_id}`)
  },
  reportQuestion: async (question_id) => {
    await pool.query(`UPDATE questions SET reported = true WHERE id = ${question_id}`)
  },
  markAnswerHelpful: async (answer_id) => {
    const {rows} = await pool.query(`SELECT helpful FROM answers WHERE id = ${answer_id}`);
    await pool.query(`UPDATE answers SET helpful = '${rows[0].helpful + 1}' WHERE id = ${answer_id}`)
  },
  reportAnswer:async (answer_id) => {
    await pool.query(`UPDATE answers SET reported = true WHERE id = ${answer_id}`)
  }
}
module.exports = { pool, db };

