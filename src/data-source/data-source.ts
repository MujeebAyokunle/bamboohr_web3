import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "sql.freedb.tech",
  port: 3306,
  username: "freedb_root3",
  password: "QVnm8XGtR&!AS&f",
  database: "freedb_bamboohrweb3assign",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});
