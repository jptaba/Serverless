import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo, getTodo } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    // TODO[DONE]: Remove a TODO item by id
    logger.info('Delete a ToDo event: ', event.pathParameters.todoId)
    const userId = getUserId(event)
    const item = await getTodo(userId, todoId)

    if (item.length === 0) {
      logger.info('Invalid todoId: ', todoId)
      return {
        statusCode: 404,
        body: 'todoId not found'
      }
    }

    await deleteTodo(userId, todoId)

    return {
      statusCode: 200,
      body: ''
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
