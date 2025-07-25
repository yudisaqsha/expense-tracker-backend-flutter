"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showType = showType;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function showType(req, res) {
    try {
        const showData = await prisma.type.findMany();
        return res
            .status(200)
            .json({ message: "successfully get type transaction", type: showData });
    }
    catch (error) {
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
