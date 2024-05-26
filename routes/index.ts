import { Router, Request, Response } from "express";
import AuthController from "../controller/AuthController";

const routes: Router = Router();

routes.get("/", async (req: Request, res: Response) => {
  res.send("This is working");
});

// Login
routes.post("/login", AuthController.Login);

// Register
routes.post("/register", AuthController.Register);

export default routes;
