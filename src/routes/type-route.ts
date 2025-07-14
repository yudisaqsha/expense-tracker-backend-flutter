import express, { Request, Response } from "express";
import * as typeController from "../controllers/type-controllers";
const typeRoute = express.Router();

typeRoute.get("/", typeController.showType);

export default typeRoute;
