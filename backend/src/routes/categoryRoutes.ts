import express from "express";

import { verifyToken } from "../middleware/auth";
import { addCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/categoryController";

const router = express.Router();

// ✅ Fournisseur Routes
router.get("/api/categories", getCategories);
router.post("/api/categories", verifyToken, addCategory);
router.put("/api/categories/:id", verifyToken, updateCategory);
router.delete("/api/categories/:id", verifyToken, deleteCategory);
router.get("/api/categories/:id", getCategoryById);

export default router;
