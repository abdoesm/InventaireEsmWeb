import express from "express";

import { verifyToken } from "../middleware/auth";
import { addCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/categoryController";

const router = express.Router();

// ✅ Fournisseur Routes
router.get("/", getCategories);
router.post("/", verifyToken, addCategory);
router.put("/:id", verifyToken, updateCategory);
router.delete("/:id", verifyToken, deleteCategory);
router.get("/:id", getCategoryById);

export default router;
