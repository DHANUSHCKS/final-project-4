import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { generateUploadUrl } from '../../businessLogic/todos.mjs';
import { getUserId } from '../../auth/utils.mjs';

export const handler = middy(async (event) => {
  const userId = getUserId(event);
  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
  }

  const todoId = event.pathParameters.todoId;
  const uploadUrl = await generateUploadUrl(userId, todoId);

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ uploadUrl })
  };
})
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  );
