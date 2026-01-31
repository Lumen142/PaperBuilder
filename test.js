const questionService = require("./packages/QuestionService.js");

questionService.Question("scale", "answer", "TEST", [
    {
      name: 'answer',
      message: 'What is the maximum amount of RAM you will allocate to the server?',
      initial: 3
    }
  ]).then(value => {
    console.log(value.answer.toString());
})
