import { Entity, UniqueEntityID } from '@/core'
import { Optional } from '@/core/types'

export interface UserProps {
  nome: string
  usuario: string
  senha: string
  perfil: "admin" | "aluno" | "professor"
  situacao: "ativo" | "inativo"
  dt_inclusao: Date
}

export class User extends Entity<UserProps> {
  get nome() {
    return this.props.nome
  }

  set nome(value: string) {
    this.props.nome = value
  }

  get usuario() {
    return this.props.usuario
  }

  set usuario(value: string) {
    this.props.usuario = value
  }

  get senha() {
    return this.props.senha
  }

  set senha(value: string) {
    this.props.senha = value
  }

  get perfil() {
    return this.props.perfil
  }

  set perfil(value: "admin" | "aluno" | "professor") {
    this.props.perfil = value
  }

  get situacao() {
    return this.props.situacao
  }

  set situacao(value: "ativo" | "inativo") {
    this.props.situacao = value
  }

  get dt_inclusao() {
    return this.props.dt_inclusao
  }

  static create(props: Optional<UserProps, 'dt_inclusao'>, id?: UniqueEntityID) {
    const user = new User(
      { ...props, dt_inclusao: props.dt_inclusao ?? new Date() },
      id,
    )

    return user
  }
}
