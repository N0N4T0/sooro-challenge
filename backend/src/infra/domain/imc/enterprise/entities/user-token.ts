import { Entity, UniqueEntityID } from '@/core'
import { Optional } from '@/core/types'

export interface UserTokenProps {
  refresh_token: string
  id_usuario: UniqueEntityID
  expiracao_token: Date
  dt_inclusao: Date
}

export class UserToken extends Entity<UserTokenProps> {
  get refresh_token() {
    return this.props.refresh_token
  }

  set refresh_token(value: string) {
    this.props.refresh_token = value
  }

  get id_usuario() {
    return this.props.id_usuario
  }

  set id_usuario(value: UniqueEntityID) {
    this.props.id_usuario = value
  }

  get expiracao_token() {
    return this.props.expiracao_token
  }

  set expiracao_token(value: Date) {
    this.props.expiracao_token = value
  }

  get dt_inclusao() {
    return this.props.dt_inclusao
  }

  static create(props: Optional<UserTokenProps, 'dt_inclusao'>, id?: UniqueEntityID) {
    const userToken = new UserToken(
      { ...props, dt_inclusao: props.dt_inclusao ?? new Date() },
      id,
    )

    return userToken
  }
}
