import { v4 as uuidv4 } from 'uuid';
import * as todosAccess from '../dataLayer/todosAccess.mjs';
import { getUploadUrl, getAttachmentUrl } from '../fileStorage/attachmentUtils.mjs';

export async function getTodosForUser(userId) {
  return await todosAccess.getTodos(userId);
}

export async function createTodo(userId, createTodoRequest) {
  const todoId = uuidv4();
  const createdAt = new Date().toISOString();

  const item = {
    userId,
    todoId,
    createdAt,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
   
  };

  await todosAccess.createTodo(item);
  return item;
}

export async function updateTodo(userId, todoId, updateRequest) {
 
  await todosAccess.updateTodo(userId, todoId, updateRequest);
}

export async function deleteTodo(userId, todoId) {
  await todosAccess.deleteTodo(userId, todoId);
}

export async function generateUploadUrl(userId, todoId) {
  
  const uploadUrl = await getUploadUrl(todoId);
  const attachmentUrl = getAttachmentUrl(todoId);

  
  await todosAccess.updateTodoAttachment(userId, todoId, attachmentUrl);

  return uploadUrl;
}

