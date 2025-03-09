
import express from "express";

import { verifyToken } from "../middleware/auth";
import { getAllArticlesNames, getArticles, getArticleById, addArticle, addArticles, updateArticle, deleteArticle, getArticleIdByName, getTotalQuantityByArticleId, getTotalQuantitiesByArticle } from "../controllers/articleController";

const router = express.Router(); 

router.get("/names", getAllArticlesNames);
router.get("/", getArticles);
router.get("/:id", getArticleById);
router.post("/", verifyToken, addArticle);
router.post("/bulk", verifyToken, addArticles);
router.put("/:id", verifyToken, updateArticle);
router.delete("/:id", verifyToken, deleteArticle);
router.get("/name/:name", getArticleIdByName);
router.get("/quantity/:id", getTotalQuantityByArticleId);
router.get("/quantities", getTotalQuantitiesByArticle);

export default router;