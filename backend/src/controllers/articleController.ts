import { Request, Response } from "express";
import { ArticleModel } from "../models/ArticleModel";

const articleModel = new ArticleModel();

export const getAllArticlesNames = async (req: Request, res: Response) => {
    console.log("getAllArticlesNames")
    try {
        const names = await articleModel.getAllArticlesNames();
        res.json(names);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve article names." });
    }
};

export const getArticles = async (req: Request, res: Response) => {
    try {
        const articles = await articleModel.getArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve articles." });
    }
};

export const getArticleById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const article = await articleModel.getArticleById(id);
        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ error: "Article not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve article." });
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
            res.status(400).json({ error: "Failed to delete article." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
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

export const getTotalQuantitiesByArticle = async (req: Request, res: Response) => {
    try {
        const quantities = await articleModel.getTotalQuantitiesByArticle();
        res.json(quantities);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve total quantities." });
    }
};
