
import express from "express";

import { verifyToken } from "../middleware/auth";
import {getAllArticlesNames, getArticles,  addArticle, addArticles, updateArticle,
     deleteArticle, getArticleIdByName, getTotalQuantityByArticleId, getTotalQuantitiesByArticle, 
     getArticleById, getAdjustments ,addAdjustment,
     updateAdjustment,
     deleteAdjustment} from "../controllers/articleController";

const router = express.Router(); 

router.get("/names", getAllArticlesNames);
router.get("/", getArticles);
router.post("/", verifyToken, addArticle);
router.post("/bulk", verifyToken, addArticles);
router.put("/:id", verifyToken, updateArticle);
router.delete("/:id", verifyToken, deleteArticle);
router.get("/name/:name", getArticleIdByName);
router.get("/quantity/:id", getTotalQuantityByArticleId);
router.get("/quantities", getTotalQuantitiesByArticle);

// Adjustments routes
router.get("/adjustments/:id", getTotalQuantitiesByArticle);
router.get("/adjustments",getAdjustments);
router.post("/adjustments",addAdjustment);
router.put("/adjustments/:id",updateAdjustment);
router.delete("/adjustments/:id",deleteAdjustment);
// put this function last alwais
router.get("/:id", getArticleById);


export default router;