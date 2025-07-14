import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function showType(req: Request, res: Response) {
  try {
    const showData = await prisma.type.findMany();
    return res
      .status(200)
      .json({ message: "successfully get type transaction", type: showData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : null,
      },
    });
  }
}
