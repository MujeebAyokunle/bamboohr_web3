import { Response, Request } from "express";
import { AppDataSource } from "../src/data-source/data-source";
import { User } from "../src/entity/User";
import {
  JwtSignPayload,
  hashString,
  validateString,
} from "../services/helpers";

class AuthController {
  // Login account
  static Login = async (req: Request, res: Response) => {
    try {
      const { address, password } = req.body;

      if (!address || !password) {
        res.status(400).json({
          error: true,
          message: "address and password is required",
        });
        return;
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: {
          address,
        },
      });

      if (!user) {
        res.status(400).json({
          error: true,
          message: "User account not found",
        });
        return;
      }

      if (!validateString(user.password, password)) {
        res.status(400).json({
          error: true,
          message: "Invalid login credentials",
        });
        return;
      }
      const stringifyData = JSON.stringify(user);
      let token = await JwtSignPayload(stringifyData);

      res.json({
        error: false,
        message: "Login successful",
        token,
      });
    } catch (error: any) {
      console.log("login error", error);
      res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  };

  //   Register account
  static Register = async (req: Request, res: Response) => {
    try {
      const { address, password } = req.body;

      if (!address || !password) {
        res.status(400).json({
          error: true,
          message: "address and password is required",
        });
        return;
      }

      const encrypted_pass = await hashString(password);

      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: {
          address,
        },
      });

      if (user) {
        res.status(400).json({
          error: true,
          message: "Wallet address exists for another registered user",
        });
        return;
      }

      const newUser = userRepository.create({
        address,
        password: encrypted_pass,
      });
      const response = await userRepository.save(newUser);

      if (!response) {
        res.status(400).json({
          error: true,
          message: "error creating user",
        });
        return;
      }
      let stringData = JSON.stringify(response);
      let token = await JwtSignPayload(stringData);

      res.json({
        error: false,
        message: "User created successfully",
        token,
      });
    } catch (error: any) {
      console.log("login error", error);
      res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  };
}

export default AuthController;
