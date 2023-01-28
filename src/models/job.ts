import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Model,
  Table,
} from 'sequelize-typescript'
import { Contract } from './contract'

@Table({
  modelName: 'Job',
})
export class Job extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  public id!: number
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public description!: string
  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  public price!: number
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  public paid!: boolean
  @Column({
    type: DataType.DATE,
  })
  public paymentDate!: Date

  @ForeignKey(() => Contract)
  @Index
  @Column
  public ContractId!: number

  @BelongsTo(() => Contract)
  public contract?: Contract
}
