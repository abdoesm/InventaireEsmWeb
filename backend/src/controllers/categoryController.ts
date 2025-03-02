import { Request, Response } from "express";
import { CategoryModel } from "../models/CategoryModel";

const categoryModel = new CategoryModel();

export const getCategories = async (_req: Request, res: Response) => {
    try {
        const categories = await categoryModel.getCategories();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Failed to fetch categories." });
    }
};

export const addCategory = async (req: Request, res: Response) => {
    try {
        const { name_cat } = req.body;
        const success = await categoryModel.addCategory({ name_cat });

        if (success) {
            res.json({ message: "Category added successfully." });
        } else {
            res.status(400).json({ error: "Failed to add category." });
        }
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name_cat } = req.body;
        const success = await categoryModel.updateCategory({ id: Number(id), name_cat });

        if (success) {
            res.json({ message: "Category updated successfully." });
        } else {
            res.status(400).json({ error: "Failed to update category." });
        }
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const success = await categoryModel.deleteCategory(Number(id));

        if (success) {
            res.json({ message: "Category deleted successfully." });
        } else {
            res.status(400).json({ error: "لا يمكن حذف الفئة لأنها مستخدمة في الإدخالات." });
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};



export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const name = await categoryModel.getCategoryById(Number(id));
        res.json({ name_cat: name });
    } catch (error) {
        console.error("Error fetching category by ID:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
