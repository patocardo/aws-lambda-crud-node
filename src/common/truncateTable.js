
/**
 * Emtpy a table without deleting it
 * @param {string} tableName 
 * @param {DynamoDB.DocumentClient} dynamoDb
 * @return {integer} number of deleted items
 */
async function truncateTable(tableName, dynamoDb) {
    const rows = await dynamoDb.scan({
        TableName: tableName,
        AttributesToGet: ['id'],
    }).promise();
    const rtrn = rows.length;
    rows.Items.forEach(async function(element, i) {
      await dynamoDb.delete({
        TableName: tableName,
        Key: element,
      }).promise();
    });
    return rtrn;
}

module.exports = truncateTable;
