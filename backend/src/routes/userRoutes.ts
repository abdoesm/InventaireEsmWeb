import express from "express";

import { verifyToken } from "../middleware/auth";
import {loginUser, getUsers, addUser, updateUser, deleteUser } from "../controllers/userController";

const router = express.Router();
// ✅ Authentication Route
router.post("/api/login", loginUser);

// ✅ Protected Route (Requires Auth)
router.get("/api/protected", verifyToken, (req, res) => {
  res.json({ success: true, message: "Access granted", user: req.user });
});
router.get("/", getUsers);
router.post("/", verifyToken, addUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
