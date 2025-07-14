"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_routes_1 = __importDefault(require("./routes/index-routes"));
dotenv_1.default.config();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use("/api", index_routes_1.default);
app.get("/", (req, res) => {
    return res.status(200).send("Connected");
});
app.listen(PORT, () => {
    console.log(`Connected to PORT : ${PORT}`);
});
exports.default = app;
