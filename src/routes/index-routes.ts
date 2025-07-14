import express, { Request, Response } from "express";
import authRoute from "./auth-route";
import transactionRoute from "./transaction-route";
import typeRoute from "./type-route";

const indexRoute = express.Router();

indexRoute.use("/auth", authRoute);
indexRoute.use("/transaction", transactionRoute);
indexRoute.use("/type", typeRoute);
export default indexRoute;
