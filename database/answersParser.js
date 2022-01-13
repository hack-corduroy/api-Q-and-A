var pool = require ('./index.js');
var fs = require('fs');
const readline = require('readline');

// The filename is simple the local directory and tacks on the requested url
var filename = './csv/answers.csv';

async function processLineByLine() {
  const reader = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: reader,
    crlfdelay: Infinity
  })
  let isFirstLine = true;
  for await (let line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }
    line = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    for (let j = 0; j < line.length; j++) {
      if (line[j][0] === '"') {
        line[j] = line[j].substr(1)
      }
      if (line[j][line[j].length -1] === '"') {
        line[j] = line[j].substr(0, line[j].length - 1)
      }
      line[j] = line[j].replaceAll("'","''");
    }
    if (! (await pool.query(`SELECT EXISTS (SELECT 1 FROM questions WHERE id = ${parseInt(line[0])})`)).rows[0].exists) {
      await pool.query(`INSERT INTO questions ( id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful) VALUES (${line[0]}, ${line[1]}, '${line[2]}', '${line[3]}', '${line[4]}', '${line[5]}', '${line[6]}', ${line[7]})`, (err, res) => {
        // console.log(err, res);
      });
    }
  }
}
processLineByLine()