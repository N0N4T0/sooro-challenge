import { ZodError } from 'zod'

export interface ValidationError {
  field: string
  message: string
  code: string
  received?: any
}

export interface ErrorResponse {
  error: string
  details?: ValidationError[]
}

export interface SuccessResponse<T = any> {
  message: string
  data?: T
}

export function formatZodError(error: ZodError): ValidationError[] {
  return error.issues.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
    received: 'received' in err ? err.received : undefined
  }))
}

export function createValidationErrorResponse(error: ZodError): ErrorResponse {
  return {
    error: 'Dados de entrada inválidos',
    details: formatZodError(error)
  }
}

export function createSuccessResponse<T>(message: string, data?: T): SuccessResponse<T> {
  return {
    message,
    data
  }
}
