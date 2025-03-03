
import express from "express";

import { verifyToken } from "../middleware/auth";
import { getAllArticlesNames, getArticles, getArticleById, addArticle, addArticles, updateArticle, deleteArticle, getArticleIdByName, getTotalQuantityByArticleId, getTotalQuantitiesByArticle } from "../controllers/articleController";

const router = express.Router(); 

router.get("/api/articles/names", getAllArticlesNames);
router.get("/api/articles", getArticles);
router.get("/api/articles/:id", getArticleById);
router.post("/api/articles", verifyToken, addArticle);
router.post("/api/articles/bulk", verifyToken, addArticles);
router.put("/api/articles/:id", verifyToken, updateArticle);
router.delete("/api/articles/:id", verifyToken, deleteArticle);
router.get("/api/articles/name/:name", getArticleIdByName);
router.get("/api/articles/quantity/:id", getTotalQuantityByArticleId);
router.get("/api/articles/quantities", getTotalQuantitiesByArticle);

export default router;