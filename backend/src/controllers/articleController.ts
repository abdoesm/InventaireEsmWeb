import { Request, Response } from "express";
import { ArticleModel } from "../models/ArticleModel";

const articleModel = new ArticleModel();

export const getAllArticlesNames = async (_req: Request, res: Response) => {
    console.log("getAllArticlesNames")
    try {
        const names = await articleModel.getAllArticlesNames();
        res.json(names);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve article names." });
    }
};

export const getArticles = async (_req: Request, res: Response) => {
    try {
        const articles = await articleModel.getArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve articles." });
    }
};

export const getArticleById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        
        if (isNaN(id)) {
            console.warn(`Invalid article ID received: ${req.params.id}`);
            
            res.status(400).json({ error: "Invalid article ID" }); // ✅ Stops execution
        }

        const article = await articleModel.getArticleById(id);

        if (!article) {
           res.status(404).json({ error: "Article not found" }); // ✅ Stops execution
        }

        res.json(article); // ✅ Only one response sent
    } catch (error) {
        console.error(`Error fetching article with ID ${req.params.id}:`, error);
        
        if (!res.headersSent) {  // ✅ Prevents duplicate responses
            res.status(500).json({ error: "Internal server error" });
        }
    }
};


export const addArticle = async (req: Request, res: Response) => {
    try {
        const success = await articleModel.addArticle(req.body);
        if (success) {
            res.status(201).json({ message: "Article added successfully." });
        } else {
            res.status(400).json({ error: "Failed to add article." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

export const addArticles = async (req: Request, res: Response) => {
    try {
        const success = await articleModel.addArticles(req.body);
        if (success) {
            res.status(201).json({ message: "Articles added successfully." });
        } else {
            res.status(400).json({ error: "Failed to add articles." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

export const updateArticle = async (req: Request, res: Response) => {
    try {
        const success = await articleModel.updateArticle(req.body);
        if (success) {
            res.json({ message: "Article updated successfully." });
        } else {
            res.status(400).json({ error: "Failed to update article." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

export const deleteArticle = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const success = await articleModel.deleteArticle(id);

        if (success) {
            res.json({ message: "Article deleted successfully." });
        } else {
            res.status(400).json({ error: "لا يمكن حذف العنصر لأنه مستخدم في الإدخالات." });
        }
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ داخلي في الخادم." });
    }
};


export const getArticleIdByName = async (req: Request, res: Response) => {
    try {
        const id = await articleModel.getArticleIdByName(req.params.name);
        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve article ID." });
    }
};

export const getTotalQuantityByArticleId = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const quantity = await articleModel.getTotalQuantityByArticleId(id);
        res.json({ quantity });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve total quantity." });
    }
};

export const getTotalQuantitiesByArticle = async (_req: Request, res: Response) => {
    try {
        console.log("getTotalQuantitiesByArticle controller")
        
        const quantities = await articleModel.getTotalQuantitiesByArticle();
        res.json(quantities);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve total quantities." });
    }
}