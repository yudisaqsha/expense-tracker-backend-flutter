import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export function authentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1]; // bearer token

  if (!token) {
    return res.status(401).json({ message: "Access token missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, String(SECRET_KEY)) as {
      id: string;
      username: string;
    };

    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
