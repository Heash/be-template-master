import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript'
import { Contract } from './contract'

@Table({
  modelName: 'Profile',
})
export class Profile extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  public id!: number
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public firstName!: string
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public lastName!: string
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public profession!: string
  @Column({
    type: DataType.DECIMAL(12, 2),
  })
  public balance!: number
  @Column({
    type: DataType.ENUM('client', 'contractor'),
  })
  public type!: 'client' | 'contractor'

  @HasMany(() => Contract)
  public contracts?: Contract[]

  @HasMany(() => Contract)
  public clients?: Contract[]
}
