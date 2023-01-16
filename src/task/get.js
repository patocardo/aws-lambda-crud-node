const Task = require('./taskClass');
const middy = require('@middy/core');
const httpHeaderNormalizer = require('@middy/http-header-normalizer');
const httpJsonBodyParser = require('@middy/http-json-body-parser');

const handler = middy(async (event) => {
  try {
    const {id} = event.pathParameters;
    const task = new Task(title, description);
    const item = await task.get(id);
    return {
      statusCode: 200,
      body: JSON.stringify(item),
    };    
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error })
    }
  }
});

handler.use(httpHeaderNormalizer()).use(httpJsonBodyParser());

module.exports = { get: handler };
