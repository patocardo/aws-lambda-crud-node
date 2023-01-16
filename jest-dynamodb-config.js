module.exports = async () => {
  // const serverless = new (require('serverless'))();
  // If using monorepo where DynamoDB serverless.yml is in another directory
  // const serverless = new (require('serverless'))({ servicePath: '../../../core/data' });

  // await serverless.init();
  // const service = await serverless.variables.populateService();
  // const resources = service.resources.filter(r => Object.keys(r).includes('Resources'))[0];

  // const tables = Object.keys(resources)
  //   .map(name => resources[name])
  //   .filter(r => r.Type === 'AWS::DynamoDB::Table')
  //   .map(r => r.Properties);

  return {
    tables: [
      {
        TableName: `TaskTable`,
        IndexName: "createdAt",
        KeySchema: [
          {AttributeName: 'id', KeyType: 'HASH'},
        ],
        AttributeDefinitions: [
          {AttributeName: 'id', AttributeType: 'S'},
        ],
        ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
      },
    ],
    port: 8000,
  };
};