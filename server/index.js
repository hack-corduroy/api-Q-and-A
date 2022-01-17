const express = require('express')
const app = express()
const port = 3000
const {transformQuestion, transformAnswer, insertQuestion, insertAnswer, helpfulQuestion, reportQuestion, helpfulAnswer, reportAnswer} = require('./controllers.js')

app.use(express.json());

app.get(`/qa/questions/:questionId/answers`, async (req, res) => {
  const question_id = req.params.questionId;
  const page = parseInt(req.query.page) || 1;
  const count = parseInt(req.query.count) || 5;
  const data = await transformAnswer(question_id, page, count)
  res.send(data);
})
app.get('/qa/questions', async (req, res) => {
  const product_id = parseInt(req.query.product_id) || 1;
  const page = parseInt(req.query.page) || 1;
  const count = parseInt(req.query.count) || 5;
  const data = await transformQuestion(product_id, page, count)
  res.send(data);
})

app.post(`/qa/questions/:questionId/answers`, async (req, res) => {
  const question_id = req.params.questionId;
  await insertAnswer(question_id, req.body) .then (() => res.sendStatus(200))
})

app.post('/qa/questions', async (req, res) => {
  await insertQuestion(req.body) .then (() => res.sendStatus(200))
})

app.put(`/qa/questions/:questionId/helpful`, async (req, res) => {
  const question_id = req.params.questionId;
  await helpfulQuestion(question_id) .then (() => res.sendStatus(200))
})

app.put(`/qa/questions/:questionId/report`, async (req, res) => {
  const question_id = req.params.questionId;
  await reportQuestion(question_id) .then (() => res.sendStatus(200))
})

app.put(`/qa/answers/:answerId/helpful`, async (req, res) => {
  const answer_id = req.params.answerId;
  await helpfulAnswer(answer_id) .then (() => res.sendStatus(200))
})

app.put(`/qa/answers/:answerId/report`, async (req, res) => {
  const answer_id = req.params.answerId;
  await reportAnswer(answer_id) .then (() => res.sendStatus(200))
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})