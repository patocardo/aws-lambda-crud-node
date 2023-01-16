const Task = require('./taskClass');
const middy = require('@middy/core');
const httpHeaderNormalizer = require('@middy/http-header-normalizer');
const httpJsonBodyParser = require('@middy/http-json-body-parser');

const handler = middy(async (event) => {
  try {
    const { title, description } = event.body;
    const task = new Task();
    const newTask = await task.create({title, description});

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'task created',
          task: newTask,
        },
        null,
        2
      )
    };

  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error })
    }
  }
})

handler.use(httpHeaderNormalizer()).use(httpJsonBodyParser());

module.exports = { add: handler };
