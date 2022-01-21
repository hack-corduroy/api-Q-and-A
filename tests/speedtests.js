const { db, pool } = require('../database/index.js');

let time1, time2, data, ids;

(async function main() {
  for (let i = 0; i< 5; i++) {
    let page = Math.floor(Math.random() * 100);
    let product_id = Math.floor(Math.random() * 10000);
    time1 = new Date().getTime();
    await db.getQuestions(1, 1, 100);
    time2 = new Date().getTime();
    console.log('Run(' + i + '): getQuestions(' + page + ',100) => ', time2 - time1, 'ms');
  }
  let page = Math.floor(Math.random() * 10000);
  data = await pool.query('SELECT id FROM questions ORDER BY RANDOM() limit 5');
  ids = data.rows.map((x) => x.id);
  for (let i = 0; i < ids.length; i++) {
    time1 = new Date().getTime();
    await db.getAnswers(ids[i], 1, 100);
    time2 = new Date().getTime();
    console.log('Run(' + i + '): getAnswers(' + ids[i] + ') => ', time2 - time1, 'ms');
  }

})();