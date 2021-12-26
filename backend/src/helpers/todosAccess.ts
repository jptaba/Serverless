import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'

// TODO[DONE]: Implement the dataLayer logic
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('AccessTodo')

export class AccessTodo {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todoTable = process.env.TODOS_TABLE
  ) {}

  // This will access and read all Todo items for the user
  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info(`Getting all todos for user: ${userId}`)
    const result = await this.docClient
      .query({
        TableName: this.todoTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items

    return items as TodoItem[]
  }

  // This will access and read a specific Todo item for the user
  async getUserTodo(userId: string, todoId: string): Promise<TodoItem[]> {
    logger.info(`Getting todo: ${todoId} for user: ${userId}`)
    const result = await this.docClient
      .query({
        TableName: this.todoTable,
        KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':todoId': todoId
        }
      })
      .promise()

    const items = result.Items

    return items as TodoItem[]
  }

  // This will access and create a new Todo item for the user
  async createTodo(todoEntry: TodoItem): Promise<TodoItem> {
    logger.info(`Creating todo: ${todoEntry}`)
    await this.docClient
      .put({
        TableName: this.todoTable,
        Item: todoEntry
      })
      .promise()

    return Promise.resolve(todoEntry)
  }

  // This will access and update a Todo item for the user
  async updateTodo(updatedTodo: any): Promise<TodoItem> {
    logger.info(`Updating todo: ${updatedTodo}`)
    await this.docClient
      .update({
        TableName: this.todoTable,
        Key: {
          todoId: updatedTodo.todoId,
          userId: updatedTodo.userId
        },
        ExpressionAttributeNames: { '#N': 'name' },
        UpdateExpression: 'set #N = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          ':name': updatedTodo.name,
          ':dueDate': updatedTodo.dueDate,
          ':done': updatedTodo.done
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()

    return updatedTodo
  }

  // This will access and delete a Todo item for the user
  async deleteTodo(userId: string, todoId: string) {
    logger.info(`Deleting todo: ${todoId}, from user: ${userId}`)
    await this.docClient.delete({
      TableName: this.todoTable,
      Key: {
        todoId,
        userId
      }
    })
  }

  // This will access and update attachment URL of a Todo item for the user
  async updateAttachmentUrl(userId: string, todoId: string, uploadUrl: string) {
    logger.info(`Updating the image URL: ${uploadUrl} of todo ${todoId}`)
    console.log('updateAttachmentUrl' + uploadUrl.split('?')[0])
    await this.docClient
      .update({
        TableName: this.todoTable,
        Key: { userId, todoId },
        UpdateExpression: 'set attachmentUrl=:URL',
        ExpressionAttributeValues: {
          ':URL': uploadUrl.split('?')[0]
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()
  }
}
