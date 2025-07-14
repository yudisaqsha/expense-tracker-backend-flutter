import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import validateEmail from "../functions/validate-email";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response) {
  const { username, name, email, password } = req.body;
  if (!username || !name || !validateEmail(email) || !password) {
    return res.status(400).json({ message: "All fields required" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const registeredUser = await prisma.users.create({
      data: {
        username: username,
        email: email,
        name: name,
        password: hashedPassword,
      },
      select: {
        username: true,
        email: true,
      },
    });
    return res
      .status(201)
      .json({ message: "User Registered!", registered: registeredUser });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server error", err });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        SECRET_KEY!,
        { expiresIn: "12h" }
      );
      return res.status(200).json({
        message: "Login Successful",
        user: {
          username: user.username,
          email: user.email,
        },
        token,
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error logging in",
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : null,
      },
    });
  }
}
