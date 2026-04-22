import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createGroup, joinGroup,getGroup,addItemToGroup } from "../controllers/groupController.js";

const groupRouter = express.Router();

groupRouter.post("/create", authMiddleware, createGroup);
groupRouter.post("/join", authMiddleware, joinGroup);
groupRouter.post("/get",authMiddleware,getGroup);
groupRouter.post("/add-item",authMiddleware,addItemToGroup);

export default groupRouter;