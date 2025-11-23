import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX;


export async function getTodos(userId) {
  const params = {
    TableName: todosTable,
    IndexName: todosCreatedAtIndex,
    KeyConditionExpression: 'userId = :u',
    ExpressionAttributeValues: {
      ':u': userId
    },
    ScanIndexForward: false 
  };

  const result = await docClient.query(params).promise();
  return result.Items;
}

export async function createTodo(item) {
  const params = {
    TableName: todosTable,
    Item: item
  };
  await docClient.put(params).promise();
}

export async function updateTodo(userId, todoId, updateRequest) {
  
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  const setExpressions = [];

  if (updateRequest.name !== undefined) {
    ExpressionAttributeNames['#n'] = 'name';
    ExpressionAttributeValues[':name'] = updateRequest.name;
    setExpressions.push('#n = :name');
  }

  if (updateRequest.dueDate !== undefined) {
    ExpressionAttributeNames['#d'] = 'dueDate';
    ExpressionAttributeValues[':dueDate'] = updateRequest.dueDate;
    setExpressions.push('#d = :dueDate');
  }

  if (updateRequest.done !== undefined) {
    ExpressionAttributeNames['#done'] = 'done';
    ExpressionAttributeValues[':done'] = updateRequest.done;
    setExpressions.push('#done = :done');
  }

  if (setExpressions.length === 0) return;

  const params = {
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'SET ' + setExpressions.join(', '),
    ExpressionAttributeNames,
    ExpressionAttributeValues
  };

  await docClient.update(params).promise();
}

export async function updateTodoAttachment(userId, todoId, attachmentUrl) {
  const params = {
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
    UpdateExpression: 'SET attachmentUrl = :a',
    ExpressionAttributeValues: {
      ':a': attachmentUrl
    }
  };
  await docClient.update(params).promise();
}

export async function deleteTodo(userId, todoId) {
  const params = {
    TableName: todosTable,
    Key: {
      userId,
      todoId
    }
  };
  await docClient.delete(params).promise();
}
