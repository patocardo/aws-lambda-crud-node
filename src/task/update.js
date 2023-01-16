"use strict";
const AWS = require('aws-sdk');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');

const TableName = 'TaskTable';

const update = async (event) => {
  try {
    const {id} = event.pathParameters;
    const { done, title, description } = event.body;
    const task = new Task();
    const updated = await task.create({id, done/*, title, description*/});
  
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'task updated',
          task: updated,
        },
        null,
        2
      ),
    };

  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error })
    }
  }
};

module.exports = { update: middy(update).use(jsonBodyParser) };
