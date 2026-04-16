import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createGroup, joinGroup } from "../controllers/groupController.js";

const groupRouter = express.Router();

groupRouter.post("/create", authMiddleware, createGroup);
groupRouter.post("/join", authMiddleware, joinGroup);

export default groupRouter;