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
        console.log("here getArticleById from controller with id ", id);

        if (isNaN(id)) {
            console.warn(`Invalid article ID received: ${req.params.id}`);
             res.status(400).json({ error: "Invalid article ID" }); // ✅ Return immediately
             return
        }

        const article = await articleModel.getArticleById(id);
        console.log("Fetched article:", article); // ✅ Add this log

        if (!article) {
            res.status(404).json({ error: "Article not found" }); // ✅ Return immediately
            return
        }

         res.json(article); // ✅ Explicit return
    } catch (error) {
        console.error(`Error fetching article with ID ${req.params.id}:`, error);

        if (!res.headersSent) {  // ✅ Prevents duplicate responses
            res.status(500).json({ error: "Internal server error" });
            return
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
        console.log("updateArticle from the controller",req.body)
        const success = await articleModel.updateArticle(req.body);
        if (success) {
            res.json({ message: "Article updated successfully." });
            return;
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




export const getAdjustments = async (req: Request, res: Response) => {
    try {
        console.log("getAdjustments controller" + req.body)
        // Fetch all adjustments from the database
        const adjustments = await articleModel.getAdjustments();

        if (adjustments.length > 0) {
            // Send adjustments to the client
            res.json(adjustments);
            return
        }

        // If no adjustments are found, return a 404 response
         res.status(404).json({ message: "No adjustments found" });
         return
    } catch (err) {
        console.error("Error fetching adjustments:", err);
        // If headers aren't sent, send a 500 error
        if (!res.headersSent) {
           res.status(500).json({ message: "Failed to fetch adjustments" });
           return
        }
    }
};

export const addAdjustment = async (req: Request, res: Response) => {
    try {
        console.log("addAdjustment controller" + req.body)
        const adjustment = await articleModel.addAdjustment(req.body);
        res.status(201).json(adjustment);
    } catch (error) {
        console.error("Error adding adjustment:", error);
        res.status(500).json({ message: "Failed to add adjustment" });
    }
};
export const updateAdjustment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updated = await articleModel.updateAdjustment({
            ...req.body,
            id: Number(id),
         });
        if (!updated) {
          res.status(404).json({ message: "Adjustment not found" });
          return 
        }else { 
          res.status(200).json({ message: "Adjustment updated successfully" });
          return 
        }

    } catch (error) {
        console.error("Error updating adjustment:", error);
        res.status(500).json({ message: "Failed to update adjustment" });
    }
}

export const deleteAdjustment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await articleModel.deleteAdjustment(Number(id));

        if (!deleted) {
            res.status(404).json({ message: "Adjustment not found" });
            return;
        } else {
            res.status(200).json({ message: "Adjustment deleted successfully" });
            return;
        }
    } catch (error) {
        console.error("Error deleting adjustment:", error);
        res.status(500).json({ message: "Failed to delete adjustment" });
    }
};


  


