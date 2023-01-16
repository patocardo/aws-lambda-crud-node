const { v4 } = require('uuid');
const { DynamoDB } = require('aws-sdk');
const { DateTime } = require('luxon');

class Task {
  TableName = 'TaskTable';

  constructor() {
    this.db = new DynamoDB.DocumentClient();
  }

  /**
   * Get a task from DDBB
   * @function
   * @param {string} id - task id
   * @returns {Object} task values
   */
  async get(id) {
    try {
      const result = await this.db.get({ TableName: this.TableName, Key: { id } }).promise();
      return result.Item;
    } catch (error) {
      throw new Error(error.message + ': cannot get task')
    }
  }

  /**
   * Create a task in DDBB
   * @function
   * @param {Object} task - task object
   * @param {string} task.title - task title
   * @param {string} task.description - task description
   * @returns {Object} task values
   */
  async create() {
    try {
      const newTask = {
        id: v4(),
        title: this.title,
        description: this.description,
        createdAt: DateTime.now().toISO(),
        done: false,
      }
  
      await this.db.put({
        TableName: this.TableName,
        Item: newTask,
      }).promise();
      
      return newTask

    } catch (error) {
      throw new Error(error.message + ': cannot create task')
    }
  }

  /**
   * Remove a task from DDBB
   * @function
   * @param {string} id - task id
   * @returns {Object} task values
   */
  async remove(id) {
    try {
      const result = await this.db.delete({ TableName: this.TableName, Key: { id } }).promise();
      return result;
    } catch (error) {
      throw new Error(error.message + ': cannot delete task')
    }
  }

  /**
   * Update a task
   * @function
   * @param {Object} task - task object
   * @param {string} task.id - task id
   * @param {boolean} [task.done] - task done status
   * @param {string} [task.title] - task title
   * @param {string} [task.description] - task description
   * @returns {Object} - attributes changed
   */
  async update(task) {
    try {
      const { id } = task;
      const updateExpression = Object.keys(task).reduce((expr, key) => {
        if (key !== 'id') {
          expr.set += `#${key} = :${key},`;
          expr.expressionAttributeNames[`#${key}`] = key;
          expr.expressionAttributeValues[`:${key}`] = task[key];
        }
        return expr;
      }, { set: '', expressionAttributeNames: {}, expressionAttributeValues: {} });
      updateExpression.set = updateExpression.set.slice(0, -1);
      const params = {
        TableName: this.TableName,
        Key: { id },
        UpdateExpression: updateExpression.set,
        ExpressionAttributeNames: updateExpression.expressionAttributeNames,
        ExpressionAttributeValues: updateExpression.expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      };
      // const result = await this.db.update(params).promise();
      // return result.Attributes;
      return { updateExpression, params};
    } catch (error) {
      throw new Error(error.message + ': cannot update task')
    }  
  }

}

module.exports = Task;
