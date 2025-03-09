import { Request, Response } from "express";
import { FournisseurModel } from "../models/FournisseurModel";

const fournisseurModel = new FournisseurModel();

export const getAllFournisseursNames = async (_req: Request, res: Response) => {
    console.log("getAllFournisseursNames");
    try {
        const names = await fournisseurModel.getAllFournisseursNames();
        res.json(names);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve fournisseur names." });
    }
};

export const getFournisseurs = async (_req: Request, res: Response) => {
    try {
        const fournisseurs = await fournisseurModel.getFournisseurs();
        res.json(fournisseurs);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve fournisseurs." });
    }
};

export const getFournisseurById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const fournisseur = await fournisseurModel.getFournisseurById(id);
        if (fournisseur) {
            res.json(fournisseur);
        } else {
            res.status(404).json({ error: "Fournisseur not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve fournisseur." });
    }
};

export const addFournisseur = async (req: Request, res: Response) => {
    try {
        const success = await fournisseurModel.addFournisseur(req.body);
        if (success) {
            res.status(201).json({ message: "Fournisseur added successfully." });
        } else {
            res.status(400).json({ error: "Failed to add fournisseur." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

export const updateFournisseur = async (req: Request, res: Response) => {
    try {
      
        const success = await fournisseurModel.updateFournisseur(req.body);
        if (success) {
            res.json({ message: "Fournisseur updated successfully." });
        } else {
            res.status(400).json({ error: "Failed to update fournisseur." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

export const deleteFournisseur = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const success = await fournisseurModel.deleteFournisseur(id);
        
        if (success) {
            res.json({ message: "Fournisseur deleted successfully." });
        } else {
            res.status(400).json({ error: "لا يمكن حذف المورد لأنه مستخدم في الإدخالات." });
        }
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ داخلي في الخادم." });
    }
};

export const getFournisseurIdByName = async (req: Request, res: Response) => {
    try {
        const id = await fournisseurModel.getFournisseurIdByName(req.params.name);
        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve fournisseur ID." });
    }
};
