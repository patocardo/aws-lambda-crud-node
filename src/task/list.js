"use strict";
const { v4 } = require('uuid');
const AWS = require('aws-sdk');
const { DateTime: { fromJSDate } } = require('luxon');

const TableName = 'TaskTable';

const list = async () => {
  try {
    
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const result = await dynamodb.scan({ TableName }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items.map((Item) => ({
        ...Item,
        other: false
      })))
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error })
    }
  }
}

module.exports = { list };
