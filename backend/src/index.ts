import express from 'express'
import {
  ListUsersController
} from './infra/domain/imc/application/controllers'
import { sqliteConnection } from './infra/database/sqlite-connection'
import { UsersRepository } from './infra/database/repositories/users-repository'
import { authRoutes } from './routes/auth-routes'
import dotenv from 'dotenv'
import { makeCreateSessionController } from './infra/factories/make-create-session-controller'

dotenv.config()

const app = express()
const port = 5000

sqliteConnection.connect()

const usersRepository = new UsersRepository()

const listUsersController = new ListUsersController(usersRepository)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/auth', authRoutes)

app.post('/login', async (req, res) => {
  const createSessionController = makeCreateSessionController()
  return createSessionController.handle(req, res)
})

app.get('/users', (req, res) => listUsersController.handle(req, res))

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`)
})