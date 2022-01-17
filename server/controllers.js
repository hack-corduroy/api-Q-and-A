const { db } = require('../database/index.js');

async function transformQuestion(product_id, page, count) {
  const { questionData, answerData, photoData } = await db.getQuestions(product_id, page, count);
  let photoObj = {};
  photoData.rows.forEach((photo, i) => {
    if (!photoObj[photo.answer_id]) {
      photoObj[photo.answer_id] = [
        {
          id: photo.id,
          url: photo.url
        }
      ]
    } else {
      photoObj[photo.answer_id].push({
        id: photo.id,
        url: photo.url
      })
    }
  });
  let returnObj = {
    product_id: `${product_id}`,
    results: questionData.rows.map((question, i) => {
      let answerObj = {}
      answerData.rows.forEach((answer, i) => {
        answerObj[answer.id] = {
          id: answer.id,
          body: answer.body,
          date: answer.date_written,
          answerer_name: answer.answerer_name,
          answerer_email: answer.answerer_email,
          reported: answer.reported,
          helpfulness: answer.helpful,
          photos: photoObj[answer.id] || []
        }
      })
      return ({
        question_id: question.id,
        question_body: question.body,
        question_date: question.date_written,
        asker_name: question.asker_name,
        asker_email: question.asker_email,
        question_helpfulness: question.helpful,
        reported: question.reported,
        answers: answerObj
      })
    })
  }
  return returnObj
}

async function transformAnswer(question_id, page = 1, count = 5) {
  const { answerData, photoData } = await db.getQuestions(question_id, page, count);
  const returnObj = {
    question: `${question_id}`,
    page: page,
    count: count,
    results: answerData.rows.map((answer, i) => {
      return ({
        answer_id: answer.id,
        body: answer.body,
        date: answer.date_written,
        answerer_name: answer.answerer_name,
        answerer_email: answer.answerer_email,
        reported: answer.reported,
        helpfulness: answer.helpful,
        photos: photoData.rows.map((photo, i) => {
          return ({
            id: photo.id,
            url: photo.url
          })
        })
      })
    })
  }
  return returnObj
}

async function insertQuestion(reqBody) {
  const date = new Date().toISOString().slice(0, 10);
  await db.addQuestion(reqBody.product_id, reqBody.body, date, reqBody.name, reqBody.email)
}

async function insertAnswer(question_id, reqBody) {
  const date = new Date().toISOString().slice(0, 10);
  await db.addAnswer(question_id, reqBody.body, date, reqBody.name, reqBody.email, reqBody.photos)
}

async function helpfulQuestion(question_id) {
  await db.markQuestionHelpful(question_id)
}

async function reportQuestion(question_id) {
  await db.reportQuestion(question_id)
}

async function helpfulAnswer(answer_id) {
  await db.markAnswerHelpful(answer_id)
}

async function reportAnswer(answer_id) {
  await db.reportAnswer(answer_id)
}

module.exports = {
  transformQuestion,
  transformAnswer,
  insertQuestion,
  insertAnswer,
  helpfulQuestion,
  reportQuestion,
  helpfulAnswer,
  reportAnswer
};

