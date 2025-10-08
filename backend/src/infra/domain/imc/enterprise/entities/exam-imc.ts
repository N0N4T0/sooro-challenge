import { Entity, UniqueEntityID } from '@/core'
import { Optional } from '@/core/types'

export interface ExamIMCProps {
  id_usuario_avaliacao: UniqueEntityID
  id_usuario_aluno: UniqueEntityID
  altura: number
  peso: number
  imc: number
  classificacao: string
  dt_inclusao: Date
}

export class ExamIMC extends Entity<ExamIMCProps> {
  get id_usuario_avaliacao() {
    return this.props.id_usuario_avaliacao
  }

  get id_usuario_aluno() {
    return this.props.id_usuario_aluno
  }

  get altura() {
    return this.props.altura
  }

  set altura(value: number) {
    this.props.altura = value
  }

  get peso() {
    return this.props.peso
  }

  set peso(value: number) {
    this.props.peso = value
  }

  get imc() {
    return this.props.imc
  }

  set imc(value: number) {
    this.props.imc = value
  }

  get classificacao() {
    return this.props.classificacao
  }

  set classificacao(value: string) {
    this.props.classificacao = value
  }

  get dt_inclusao() {
    return this.props.dt_inclusao
  }

  static create(
    props: Optional<ExamIMCProps, 'dt_inclusao'>,
    id?: UniqueEntityID,
  ) {
    const examIMC = new ExamIMC(
      { ...props, dt_inclusao: props.dt_inclusao ?? new Date() },
      id,
    )

    return examIMC
  }
}
