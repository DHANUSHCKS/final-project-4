import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { createTodo } from '../../businessLogic/todos.mjs';
import { getUserId } from '../../auth/utils.mjs';

export const handler = middy(async (event) => {
  const userId = getUserId(event);
  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
  }

  const newTodoReq = JSON.parse(event.body);
  const item = await createTodo(userId, newTodoReq);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ item })
  };
})
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  );
