import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Thing {
  @PrimaryGeneratedColumn("uuid")
  id = undefined;

  @Column("varchar")
  name = "";
}