import { Router } from 'express'
import { makeAuthMiddleware } from '@/infra/factories/make-auth-middleware'
import { makeListUserController } from '@/infra/factories/make-list-user-controller'
import { makeRegisterUserController } from '@/infra/factories/make-register-user-controller'
import { makeUpdateUserController } from '@/infra/factories/make-update-user-controller'
import { makeDeleteUserController } from '@/infra/factories/make-delete-user-controller'
import { makeUpdateUserSituationController } from '@/infra/factories/make-update-user-situation-controller'
import { makeCreateExamImcController } from '@/infra/factories/make-create-exam-imc-controller'
import { makeGetExamImcController } from '@/infra/factories/make-get-exam-imc-controller'
import { makeUpdateExamImcController } from '@/infra/factories/make-update-exam-imc-controller'
import { makeDeleteExamImcController } from '@/infra/factories/make-delete-exam-imc-controller'

const authRoutes = Router()

authRoutes.post('/register', (req, res, next) => {
  const authMiddleware = makeAuthMiddleware()
  return authMiddleware.handle(req, res, next)
}, (req, res) => {
  const registerUserController = makeRegisterUserController()
  return registerUserController.handle(req, res)
})

authRoutes.put('/user/:id', (req, res, next) => {
  const authMiddleware = makeAuthMiddleware()
  return authMiddleware.handle(req, res, next)
}, (req, res) => {
  const updateUserController = makeUpdateUserController()
  return updateUserController.handle(req, res)
})

authRoutes.get('/user/:id', (req, res, next) => {
  const authMiddleware = makeAuthMiddleware()
  return authMiddleware.handle(req, res, next)
}, (req: any, res) => {
  const listUserController = makeListUserController()
  return listUserController.handle(req, res)
})

authRoutes.delete('/user/:id', (req, res, next) => {
  const authMiddleware = makeAuthMiddleware()
  return authMiddleware.handle(req, res, next)
}, (req, res) => {
  const deleteUserController = makeDeleteUserController()
  return deleteUserController.handle(req, res)
})

authRoutes.patch('/user/:id', (req, res, next) => {
  const authMiddleware = makeAuthMiddleware()
  return authMiddleware.handle(req, res, next)
}, (req, res) => {
  const updateUserSituationController = makeUpdateUserSituationController()
  return updateUserSituationController.handle(req, res)
})

authRoutes.post('/exam-imc', (req, res, next) => {
  const authMiddleware = makeAuthMiddleware()
  return authMiddleware.handle(req, res, next)
}, (req, res) => {
  const createExamImcController = makeCreateExamImcController()
  return createExamImcController.handle(req, res)
})

authRoutes.get('/exam-imc/:nameOrUsername', (req, res, next) => {
  const authMiddleware = makeAuthMiddleware()
  return authMiddleware.handle(req, res, next)
}, (req, res) => {
  const getExamImcController = makeGetExamImcController()
  return getExamImcController.handle(req, res)
})

authRoutes.delete('/exam-imc/:id', (req, res, next) => {
  const authMiddleware = makeAuthMiddleware()
  return authMiddleware.handle(req, res, next)
}, (req, res) => {
  const deleteExamImcController = makeDeleteExamImcController()
  return deleteExamImcController.handle(req, res)
})

authRoutes.put('/exam-imc/:id', (req, res, next) => {
  const authMiddleware = makeAuthMiddleware()
  return authMiddleware.handle(req, res, next)
}, (req, res) => {
  const updateExamImcController = makeUpdateExamImcController()
  return updateExamImcController.handle(req, res)
})

authRoutes.get('/validate', async (req, res, next) => {
  const authMiddleware = makeAuthMiddleware()
  return authMiddleware.handle(req, res, next)
}, (req: any, res) => {
  return res.json({
    message: 'Token válido',
    valid: true,
    user: req.user
  })
})

export { authRoutes }
