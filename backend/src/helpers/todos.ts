import { AccessTodo } from './todosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { createUploadPresignedUrl } from './attachmentUtils'

// TODO[DONE]: Implement businessLogic
const todosAccess = new AccessTodo()

// This GETS ALL the Todo items for the user
export async function getUserTodos(userId: string): Promise<any> {
  return await todosAccess.getAllTodos(userId)
}

// This GETS A SPECIFIC Todo item for the user
export async function getTodo(
  userId: string,
  todoId: string
): Promise<TodoItem[]> {
  return await todosAccess.getUserTodo(userId, todoId)
}

// This CREATES a Todo item for the user
export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const createdAt = new Date().toISOString()
  var done = false
  const todoId = uuid.v4()

  if (new Date().getTime() > new Date(createTodoRequest.dueDate).getTime()) {
    done = true
  }
  return await todosAccess.createTodo({
    userId,
    todoId,
    createdAt,
    attachmentUrl: '',
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: done
  })
}

// This UPDATES a Todo item for the user
export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  userId: string,
  todoId: string
): Promise<TodoItem> {
  return await todosAccess.updateTodo({
    userId,
    todoId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}

// This DELETES a Todo item for the user
export async function deleteTodo(userId: string, todoId: string) {
  return await todosAccess.deleteTodo(userId, todoId)
}

// This UPDATES the Attachment's URL of a Todo item for the user
export async function createAttachmentPresignedUrl(
  userId: string,
  todoId: string
): Promise<string> {
  const uploadUrl: string = await createUploadPresignedUrl(todoId)
  await todosAccess.updateAttachmentUrl(userId, todoId, uploadUrl)
  return uploadUrl
}
