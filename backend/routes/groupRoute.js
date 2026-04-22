import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createGroup, joinGroup,getGroup } from "../controllers/groupController.js";

const groupRouter = express.Router();

groupRouter.post("/create", authMiddleware, createGroup);
groupRouter.post("/join", authMiddleware, joinGroup);
groupRouter.post("/get",authMiddleware,getGroup);

export default groupRouter;