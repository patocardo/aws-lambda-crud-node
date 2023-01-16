const fs = require('fs');
const truncateTable = require('./truncateTable');
/**
* Bulk insert data into a DynamoDB table
* @param {string} json - relative path of a json file
* @param {DynamoDB.DocumentClient} db - instance of a DynamoDB.DocumentClient
* @param {string} tableName - name of the table to insert records
* @param {boolean} truncate - if the table should be emptied before inserting data
* @returns {Array} - data gobtained from the file
*/
const bulkInsert = async (json, db, tableName, truncate = false) => {
  try {
    if(truncate) await truncateTable(tableName, db);
    const chunkSize = 25;
    const data = JSON.parse(fs.readFileSync(json));
    for(let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const batchWrite = chunk.map(Item => ({ PutRequest: { Item } }));
      const params = { RequestItems: {[tableName]: batchWrite} };
      await db.batchWrite(params).promise();
    }
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

module.exports = bulkInsert;