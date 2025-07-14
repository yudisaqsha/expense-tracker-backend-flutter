"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth-route"));
const transaction_route_1 = __importDefault(require("./transaction-route"));
const type_route_1 = __importDefault(require("./type-route"));
const indexRoute = express_1.default.Router();
indexRoute.use("/auth", auth_route_1.default);
indexRoute.use("/transaction", transaction_route_1.default);
indexRoute.use("/type", type_route_1.default);
exports.default = indexRoute;
