import {
  Table,
  Column,
  DataType,
  Model,
  BelongsTo,
  HasMany,
  ForeignKey,
  Index,
} from 'sequelize-typescript'
import { Job } from './job'
import { Profile } from './profile'

@Table({
  modelName: 'Contract',
})
export class Contract extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  public id!: number
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  public terms!: string
  @Column({
    type: DataType.ENUM('new', 'in_progress', 'terminated'),
  })
  public status!: 'new' | 'in_progress' | 'terminated'

  @ForeignKey(() => Profile)
  @Index
  @Column
  public ContractorId!: number

  @ForeignKey(() => Profile)
  @Index
  @Column
  public ClientId!: number

  @BelongsTo(() => Profile)
  public Contractor!: Profile

  @BelongsTo(() => Profile)
  public Client!: Profile

  @HasMany(() => Job)
  public Jobs?: Job[]
}
