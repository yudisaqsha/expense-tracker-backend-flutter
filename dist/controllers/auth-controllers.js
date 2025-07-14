"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const client_1 = require("@prisma/client");
const validate_email_1 = __importDefault(require("../functions/validate-email"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY;
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 10;
async function register(req, res) {
    const { username, name, email, password } = req.body;
    if (!username || !name || !(0, validate_email_1.default)(email) || !password) {
        return res.status(400).json({ message: "All fields required" });
    }
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
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
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server error", err });
    }
}
async function login(req, res) {
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
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (isMatch) {
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                username: user.username,
                email: user.email,
            }, SECRET_KEY, { expiresIn: "12h" });
            return res.status(200).json({
                message: "Login Successful",
                user: {
                    username: user.username,
                    email: user.email,
                },
                token,
            });
        }
        else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Error logging in",
            error: {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : null,
            },
        });
    }
}
