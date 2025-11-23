import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getTodosForUser } from '../../businessLogic/todos.mjs';
import { getUserId } from '../../auth/utils.mjs';

export const handler = middy(async (event) => {
  const userId = getUserId(event);
  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' })
    };
  }

  const items = await getTodosForUser(userId);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ items })
  };
})
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  );
