// import { QueryCommand } from "@aws-sdk/client-dynamodb";

/**
* Class for handling task list stored in DynamoDB.
*/
class TaskList {
  TableName = 'TaskTable';
  
  /** class constructor requires the db
   * @param {Object} db - new AWS.DynamoDB.DocumentClient({ region: 'sa-east-1'});
   */
  constructor(db) {
    this.db = db
  }
  
  /**
  * Get a list of tasks from the task table with optional filtering and pagination.
  * @param {Object} [filters] - Filters to apply to the task list.
  * @param {string} [filters.search] - String to search in title and description.
  * @param {boolean} [filters.done] - Whether to filter by task completion status.
  * @param {string} [pagination.lastEvaluatedKey] - The primary key of the last item in the previous page.
  * @param {number} [pagination.limit] - The number of tasks to retrieve in the current page.
  * @returns {Array} - List of tasks that match the filters and pagination.
  */
  async getTasks(filters = {}, pagination = {lastEvaluatedKey: null, limit: 20}) {
    const [ filterExpressionArr, exprAttrValues ] = this.buildSearchFilterExpression(filters.search);

    
    if (filters.done) {
      filterExpressionArr.push(`done = :done`);
      exprAttrValues[':done'] = filters.done;
    }
    const hasAttributeValues = Object.keys(exprAttrValues).length > 0;
    const ExpressionAttributeNames = { 
      '#createdAt': 'createdAt', '#id': 'id', '#done': 'done', '#title': 'title', '#description': 'description',
    };
    
    const FilterExpression = filterExpressionArr.join(' and ');
    
    const params = {
      TableName: this.TableName,
      ScanIndexForward: true, //false to sort descending, true for ascending 
      // ExpressionAttributeNames,
      // ProjectionExpression: '#id, #title, #description, #createdAt, #done',
      ...(hasAttributeValues ? {
        FilterExpression,
        ExpressionAttributeValues: {...exprAttrValues},
      } : {}),
      ...(pagination.lastEvaluatedKey ? {ExclusiveStartKey: pagination.lastEvaluatedKey} : {}),
      Limit: pagination.limit,
    };

    console.log({ params });

    const result = await this.db.scan(params).promise();

    return result.Items;
  }
  
  /**
  * Builds the filter expression for searching tasks
  *
  * @param {string} search - The search expression to read
  * @return {Array} [filterExpression, expressionAttributeValues]
  * 			- The filter expression and expression attribute values to be used in the DynamoDB scan operation
  */
  buildSearchFilterExpression(search) {
    const emptyTuple = [[], {}];
    if(!search) return emptyTuple;
    const parsedSearch = search.match(/-?"([^"]+)"|-?[^\s]+/g);
    return parsedSearch.reduce((tuple, phrase, idx) => {
      const exclude = phrase[0] === '-';
      tuple[0].push(
        `${exclude ? 'not ': ''}contains (title, :phrase${idx}) ` /* +
        `${exclude ? 'AND not': 'OR'} contains(description, :phrase${idx}))` */
      );
      tuple[1][`:phrase${idx}`] = phrase.replace(/^-?"?/, '').replace(/"$/,'');
      return tuple;
    }, emptyTuple);
  }
  
}

module.exports = TaskList;