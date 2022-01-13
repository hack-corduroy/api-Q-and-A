var pool = require ('./index.js');
var fs = require('fs');
const readline = require('readline');

// The filename is simple the local directory and tacks on the requested url
var filename = './csv/answers_photos.csv';

async function processLineByLine() {
  const reader = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: reader,
    crlfdelay: Infinity
  })
  let isFirstLine = true;
  let lineCount = 0;
  let totalCount = 0;
  let queryStr = '';
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
      lineCount ++;
      totalCount++;
      if (lineCount === 1000) {
        queryStr += `(${line[0]}, ${line[1]}, '${line[2]}')`;
      } else {
        queryStr += `(${line[0]}, ${line[1]}, '${line[2]}'), `;
      }

    if (lineCount === 1000) {
      await pool.query(`INSERT INTO photos ( id, answer_id, url) VALUES ${queryStr}`, (err, res) => {
        //console.log(err, res);
      });
      queryStr = '';
      lineCount = 0;
    }
  }
  // console.log(queryStr)
  let endStr = queryStr.slice(0, -2);
  //console.log( endStr)
  await pool.query(`INSERT INTO photos ( id, answer_id, url) VALUES ${endStr}`, (err, res)  => {
    console.log(err, res);
  });
}
processLineByLine()