import "reflect-metadata";
import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  address!: string;

  @Column()
  password!: string;
}
