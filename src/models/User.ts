import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
//import { Role } from './Role';

@Table({
  tableName: 'users',
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  uuid!: string;

  //@ForeignKey(() => School)
  @Column({
    type: DataType.STRING,
    allowNull: true,
    //field: 'school_id',
  })
  school_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstname!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastname!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password!: string;

  //@ForeignKey(() => Role)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  role_id!: string;

  @Column({
    type: DataType.TEXT('long'),
    allowNull: true,
  })
  avatar!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  invited_by!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  deleted!: number;

  // Define the association with School
  // @BelongsTo(() => School)
  // school!: School;

  // Define the association with School
  // @BelongsTo(() => School, { foreignKey: 'school_id', targetKey: 'uuid' })  // Point foreign key 'school_id' to 'uuid'
  // school!: School;

  // // Define the association with School
  // @BelongsTo(() => Role, { foreignKey: 'role_id', targetKey: 'uuid' })  // Point foreign key 'school_id' to 'uuid'
  // role!: Role;
}
