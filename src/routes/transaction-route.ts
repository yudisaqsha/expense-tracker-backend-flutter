import express, { Request, Response } from "express";
import { authentication } from "../middlewares/authentication";
import * as transactionController from "../controllers/transaction-controllers";
const transactionRoute = express.Router();

transactionRoute.get("/", authentication, transactionController.getTransaction);
transactionRoute.get(
  "/total",
  authentication,
  transactionController.getTotalTransaction
);
transactionRoute.get(
  "/:id",
  authentication,
  transactionController.getTransactionById
);
transactionRoute.post("/", authentication, transactionController.addData);
transactionRoute.put("/:id", authentication, transactionController.updateData);
transactionRoute.delete(
  "/:id",
  authentication,
  transactionController.deleteData
);

export default transactionRoute;
