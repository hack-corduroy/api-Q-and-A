var pool = require('./index.js');
var fs = require('fs');
const readline = require('readline');

// The filename is simple the local directory and tacks on the requested url
var filename = './csv/questions.csv';

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
      if (line[j][line[j].length - 1] === '"') {
        line[j] = line[j].substr(0, line[j].length - 1)
      }
      line[j] = line[j].replaceAll("'", "''");
    }

    lineCount++;
    totalCount++;
    if (lineCount === 1000) {
      queryStr += `(${line[0]}, ${line[1]}, '${line[2]}', '${line[3]}', '${line[4]}', '${line[5]}', '${line[6]}', ${line[7]})`;
    } else {
      queryStr += `(${line[0]}, ${line[1]}, '${line[2]}', '${line[3]}', '${line[4]}', '${line[5]}', '${line[6]}', ${line[7]}), `;
    }

    if (lineCount === 1000) {
      await pool.query(`INSERT INTO questions ( id, product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES ${queryStr}`, (err, res) => {
        // console.log(err, res);
      });
      queryStr = '';
      lineCount = 0;
    }
  }
  // console.log(queryStr)
  let endStr = queryStr.slice(0, -2);
  // console.log( endStr)
  await pool.query(`INSERT INTO questions ( id, product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES ${endStr}`, (err, res) => {
    console.log(err, res);
  });
}
processLineByLine()

// async function processLineByLine() {
//   const reader = fs.createReadStream(filename);
//   const rl = readline.createInterface({
//     input: reader,
//     crlfdelay: Infinity
//   })
//   let isFirstLine = true;
//   for await (let line of rl) {
//     if (isFirstLine) {
//       isFirstLine = false;
//       continue;
//     }
//     line = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
//     for (let j = 0; j < line.length; j++) {
//       if (line[j][0] === '"') {
//         line[j] = line[j].substr(1)
//       }
//       if (line[j][line[j].length -1] === '"') {
//         line[j] = line[j].substr(0, line[j].length - 1)
//       }
//       line[j] = line[j].replaceAll("'","''");
//     }
//     if (! (await pool.query(`SELECT EXISTS (SELECT 1 FROM questions WHERE id = ${parseInt(line[0])})`)).rows[0].exists) {
//       await pool.query(`INSERT INTO questions ( id, product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES (${line[0]}, ${line[1]}, '${line[2]}', '${line[3]}', '${line[4]}', '${line[5]}', '${line[6]}', ${line[7]})`, (err, res) => {
//         // console.log(err, res);
//       });
//     }
//   }
// }
// processLineByLine()

// let chunkCounter = 0;

// // Read and display the file data on console
// reader.on('data', function (chunk) {
//   chunkHandler(chunk)
//   chunkCounter++;
//     // console.log(chunk.toString());
// });

// let columns = [];

// reader.on('close', function() {
//   console.log('you have this many chunks: ', chunkCounter)
//   console.log(columns)
// })


// const chunkHandler = async (chonkyBoi) => {
//   const lines = chonkyBoi.toString().split('\n');
//   let index = 0;
//   if (chunkCounter === 0) {
//     columns = lines[0].split(', ');
//     index = 1;
//   }
//   for(let i = index; i<lines.length; i++) {
//     let line = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
//     for (let j = 0; j < line.length; j++) {
//       if (line[j][0] === '"') {
//         line[j] = line[j].substr(1)
//       }
//       if (line[j][line[j].length -1] === '"') {
//         line[j] = line[j].substr(0, line[j].length - 1)
//       }
//       line[j] = line[j].replaceAll("'","''");
//     }
//     console.log("THIS", parseInt(line[0]), line, lines)
//     if (! (await pool.query(`SELECT EXISTS (SELECT 1 FROM questions WHERE id = ${parseInt(line[0])})`)).rows[0].exists) {
//       await pool.query(`INSERT INTO questions ( id, product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES (${line[0]}, ${line[1]}, '${line[2]}', '${line[3]}', '${line[4]}', '${line[5]}', '${line[6]}', ${line[7]})`, (err, res) => {
//         console.log(err, res);
//       });
//     }
//   }
//   pool.end();
//   // console.log(lines)
// }