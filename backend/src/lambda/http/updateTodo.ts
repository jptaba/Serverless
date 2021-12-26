import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getTodo, updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('updateTodo')

// TODO[DONE]: Update a TODO item with the provided id using values in the "updatedTodo" object

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Update a ToDo event: ', event.pathParameters.todoId)
    const todoId = event.pathParameters.todoId
    const userId = await getUserId(event)
    const item = await getTodo(userId, todoId)

    if (item.length == 0) {
      return {
        statusCode: 404,
        body: 'todoId not found'
      }
    }

    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const items = await updateTodo(updatedTodo, userId, todoId)
    return {
      statusCode: 200,
      body: JSON.stringify(items)
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
