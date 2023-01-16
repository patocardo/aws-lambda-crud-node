const TaskList = require('../src/task/taskListClass');
const bulkInsert = require('../src/common/bulkInsert');
const AWS = require('aws-sdk');
const path = require("path");
const truncateTable = require('../src/common/truncateTable');

// jest.mock('aws-sdk', () => {
//   const mDocumentClient = { get: jest.fn() };
//   const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };
//   return { DynamoDB: mDynamoDB };
// });

// Configure DynamoDB client to use local endpoint
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  // convertEmptyValues: true,
  endpoint: new AWS.Endpoint('http://localhost:8000'),
  sslEnabled: false,
  region: 'local-env',
  // credentials: {
  //   accessKeyId: 'fakeMyKeyId',
  //   secretAccessKey: 'fakeSecretAccessKey',
  // },
});



const taskTable = 'TaskTable';
const json = path.resolve(__dirname, './taskData.mock.json');

describe('TaskList', () => {
  let taskList;
  let mockData;
  
  beforeAll(async () => {
    try {
      const rawData = await bulkInsert(json, dynamoDb, taskTable, true);
      mockData = rawData.sort((a, b) => {
        if (a.id < b.id)  return -1;
        if (a.id > b.id) return 1;
        return 0;
      });
      taskList = new TaskList(dynamoDb);
    } catch(error) {
      console.error(error);
    }
  }, 15000);

  afterAll(async () => {
    try {
      await truncateTable(taskTable, dynamoDb);
    } catch(error) {
      console.error(error);
    }
  })
  
  // it('should return a list of 20 tasks as default', async () => {
  //   const tasks = await taskList.getTasks();
  //   expect(tasks.length).toEqual(20);
  // });
    
  // it('should return a list of 15 tasks as parametrized', async () => {
  //   const tasks = await taskList.getTasks({ limit: 15 });
  //   expect(tasks.length).toEqual(20);
  // });

  it('should return a list of tasks that match the search filter', async () => {
    const tasks = await taskList.getTasks({ search: 'Force' });
    expect(tasks.length).toEqual(2);
  });
  
  // it('should return a list of tasks that match the done filter', async () => {
  //   const tasks = await taskList.getTasks({ done: true });
  //   expect(tasks.length).toEqual(10);
  // });
  
});
