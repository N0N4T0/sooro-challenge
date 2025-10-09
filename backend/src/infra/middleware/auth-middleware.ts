import { Request, Response, NextFunction } from 'express'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string
    [key: string]: any
  }
}

export class AuthMiddleware {
  constructor(private jwtEncrypter: JwtEncrypter) {}

  async handle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader) {
        return res.status(401).json({
          error: 'Token de acesso não fornecido'
        })
      }

      const [, token] = authHeader.split(' ')

      if (!token) {
        return res.status(401).json({
          error: 'Token de acesso malformado'
        })
      }

      const payload = await this.jwtEncrypter.verify(token)
      
      req.user = payload as { sub: string; [key: string]: any }
      
      next()
    } catch (error) {
      return res.status(401).json({
        error: 'Token de acesso inválido'
      })
    }
  }
}
