import "./env";
import express from "express";
import routes from "./routes";
import { env } from "node:process";
import { AppDataSource } from "./src/data-source/data-source";
import http from "http";
import cors from "cors";
import { SocketsEvents } from "./routes/sockets";

const app = express();
let server = http.createServer(app);

SocketsEvents.SocketRoute(server);

const port = env.PORT || "3000";

AppDataSource.initialize()
  .then(() => {
    app.use(express.json());
    app.use(cors({ origin: "*" }));
    app.use("/api", routes);

    server.listen(port, () => {
      console.log(`listening at port ${port}`);
    });
  })
  .catch((error) => {
    console.log("db connection error", error);
  });
