"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransaction = getTransaction;
exports.getTransactionById = getTransactionById;
exports.addData = addData;
exports.updateData = updateData;
exports.deleteData = deleteData;
exports.getTotalTransaction = getTotalTransaction;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function getTransaction(req, res) {
    const userId = req.user.id;
    try {
        const getData = await prisma.transaction.findMany({
            where: { userId: userId },
            include: {
                type: true,
            },
        });
        return res
            .status(200)
            .json({ message: "All data retrieved", transactions: getData });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : null,
            },
        });
    }
}
async function getTransactionById(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const getData = await prisma.transaction.findUnique({
            where: { id: id },
            include: {
                type: true,
            },
        });
        if (getData?.userId != String(userId)) {
            return res.status(400).json({ message: "Unauthorized" });
        }
        if (!getData) {
            return res.status(404).json({ message: "Not Found" });
        }
        return res
            .status(200)
            .json({ message: "All data retrieved", transactions: getData });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : null,
            },
        });
    }
}
async function addData(req, res) {
    const userId = req.user.id;
    const { name, typeId, value } = req.body;
    if (!name || !typeId || value == 0) {
        return res.status(400).json({ message: "All fields required" });
    }
    let valueFinal = value;
    try {
        const findUser = await prisma.users.findUnique({
            where: { id: userId },
        });
        if (!findUser) {
            return res.status(404).json({ message: "User Not Found" });
        }
        const findType = await prisma.type.findUnique({
            where: {
                id: typeId,
            },
        });
        if (!findType) {
            return res.status(400).json({ message: "error showing type" });
        }
        if (findType.name.toLocaleLowerCase().includes("expenses")) {
            valueFinal = value * -1;
        }
        const addTransaction = await prisma.transaction.create({
            data: {
                name: name,
                value: valueFinal,
                typeId: typeId,
                userId: findUser.id,
            },
        });
        return res
            .status(200)
            .json({ message: "All data retrieved", transactions: addTransaction });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : null,
            },
        });
    }
}
async function updateData(req, res) {
    const userId = req.user.id;
    const { name, typeId, value } = req.body;
    const { id } = req.params;
    try {
        const findUser = await prisma.users.findUnique({
            where: { id: userId },
        });
        if (!findUser) {
            return res.status(404).json({ message: "User Not Found" });
        }
        const transaction = await prisma.transaction.findUnique({
            where: { id: id },
        });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction Not Found" });
        }
        if (transaction.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const findType = await prisma.type.findUnique({
            where: {
                id: typeId,
            },
        });
        if (!findType) {
            return res.status(400).json({ message: "error showing type" });
        }
        const updateData = {};
        if (name && name !== transaction.name)
            updateData.name = name;
        if (typeId && typeId !== transaction.typeId)
            updateData.type = typeId;
        if (value != null && value !== transaction.value)
            updateData.value = value;
        const updatedTransaction = await prisma.transaction.update({
            where: { id: id },
            data: updateData,
        });
        return res.status(200).json({
            message: "Transaction updated successfully",
            transactions: updatedTransaction,
        });
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
async function deleteData(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const findUser = await prisma.users.findUnique({
            where: { id: userId },
        });
        if (!findUser) {
            return res.status(404).json({ message: "User Not Found" });
        }
        const transaction = await prisma.transaction.findUnique({
            where: { id: id },
        });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction Not Found" });
        }
        if (transaction.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const deleteTransaction = await prisma.transaction.delete({
            where: { id: id },
        });
        return res.status(200).json({
            message: "Transaction deleted successfully",
            transactions: deleteTransaction,
        });
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
async function getTotalTransaction(req, res) {
    const userId = req.user.id;
    try {
        const getData = await prisma.transaction.findMany({
            where: { userId: userId },
            select: {
                value: true,
            },
        });
        const daftarNilai = getData.map((item) => {
            return typeof item.value === "object" && "toNumber" in item.value
                ? item.value.toNumber()
                : Number(item.value);
        });
        const totalNilai = daftarNilai.reduce((a, b) => a + b);
        return res
            .status(200)
            .json({ message: "All data retrieved", transactions: totalNilai });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : null,
            },
        });
    }
}
