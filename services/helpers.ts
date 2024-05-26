import { sign, verify } from "jsonwebtoken";
import "../env";
import { env } from "node:process";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = env.JWT_SECRET_KEY || "";
const salt = env.AUTH_SALT || "";

export const JwtSignPayload = async (payload: string) => {
  const token = await sign(payload, JWT_SECRET);

  return token;
};

export const JwtVerifyPayload = async (token: string) => {
  // , { algorithm: 'RS256' }
  try {
    const decoded = await verify(token, JWT_SECRET);

    return decoded;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const validateString = (hash: string, value: string) => {
  const hashChecker = crypto
    .pbkdf2Sync(value, salt, 1000, 64, `sha512`)
    .toString("hex");

  return hash == hashChecker;
};

export const hashString = async (param: string) => {
  const hash = await crypto
    .pbkdf2Sync(param, salt, 1000, 64, `sha512`)
    .toString("hex");

  return hash;
};

export const authorizeUser = async (param: string) => {
  if (!param) {
    return null;
  }

  const [bearer, token] = param.split(" ");

  if (bearer === "Bearer" && token) {
    const decoded_token = await JwtVerifyPayload(token);

    if (!decoded_token) {
      return null;
    }
    return decoded_token;
  } else {
    return null;
  }
};
