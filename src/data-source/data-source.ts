import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 4306,
  username: "root3",
  password: "mujeeb123456",
  database: "web3assignment",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});
