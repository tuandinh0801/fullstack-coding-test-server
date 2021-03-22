import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true, default: 'user' })
  role: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: Date;
}
