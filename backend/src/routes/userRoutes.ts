import express from "express";

import { verifyToken } from "../middleware/auth";
import { getUsers, addUser, updateUser, deleteUser } from "../controllers/userController";

const router = express.Router();

router.get("/", getUsers);
router.post("/", verifyToken, addUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
