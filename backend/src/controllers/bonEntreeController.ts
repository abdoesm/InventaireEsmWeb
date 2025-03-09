import { Request, Response } from "express";
import { BonEntreeModel, Entree } from "../models/bonEntreeModel";

const bonEntreeModel = new BonEntreeModel();

export const createBonEntree = async (req: Request, res: Response) => {
    try {
        const success = await bonEntreeModel.createBonEntree(req.body);
        if (success) {
            res.status(201).json({ message: "Bon d'entrée added successfully." });
        } else {
            res.status(400).json({ error: "Failed to add bon d'entrée." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getAllBonEntrees = async (_req: Request, res: Response) => {
    try {
        const bons = await bonEntreeModel.getAllBonEntrees();
        res.json(bons);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve bon d'entrée." });
    }
};

export const getBonEntreeById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const bon = await bonEntreeModel.getBonEntreeById(id);
        if (bon) {
            res.json(bon);
        } else {
            res.status(404).json({ error: "Bon d'entrée not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve bon d'entrée." });
    }
};


export const addEntree = async (req: Request, res: Response) => {
    try {
        const entree: Entree = req.body;
        const success = await bonEntreeModel.addEntree(entree);
        if (success) {
            res.status(201).json({ message: "Entree added successfully." });
        } else {
            res.status(400).json({ error: "Failed to add entree." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getEntreesByBonEntreeId = async (req: Request, res: Response) => {
    try {
        const idBe = parseInt(req.params.idBe);
        const entrees = await bonEntreeModel.getEntreesByBonEntreeId(idBe);
        res.json(entrees);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve entrees." });
    }
};



export const deleteBonEntree = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const success = await bonEntreeModel.deleteBonEntree(id);
        if (success) {
            res.json({ message: "Bon d'entrée deleted successfully." });
        } else {
            res.status(400).json({ error: "Cannot delete bon d'entrée because it has associated entries." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
