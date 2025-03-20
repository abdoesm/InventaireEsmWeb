import { Request, Response } from "express";
import { InventaireItemModel } from "../models/InventaireItemModel";

const inventaireItemModel = new InventaireItemModel();

export const getInventaireItems = async (_req: Request, res: Response) => {
    try {
        console.log("getInventaireItems controller")
        const items = await inventaireItemModel.getInventaireItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve inventaire items." });
    }
};

export const getInventaireItemById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
             res.status(400).json({ error: "Invalid item ID" });
             return;
        }

        const item = await inventaireItemModel.getInventaireItemById(id);
        if (!item) {
            res.status(404).json({ error: "Item not found" });
            return
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

export const addInventaireItem = async (req: Request, res: Response) => {
    try {
        const success = await inventaireItemModel.addInventaireItem(req.body);
        if (success) {
            res.status(201).json({ message: "Item added successfully." });
        } else {
            res.status(400).json({ error: "Failed to add item." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

export const updateInventaireItem = async (req: Request, res: Response) => {
    try {
        const success = await inventaireItemModel.updateInventaireItem(req.body);
        if (success) {
            res.json({ message: "Item updated successfully." });
        } else {
            res.status(400).json({ error: "Failed to update item." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

export const deleteInventaireItem = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
             res.status(400).json({ error: "Invalid item ID" });
             return
        }

        const success = await inventaireItemModel.deleteInventaireItem(id);
        if (success) {
            res.json({ message: "Item deleted successfully." });
        } else {
            res.status(400).json({ error: "Failed to delete item." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};