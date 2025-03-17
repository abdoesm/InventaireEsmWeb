import { Request, Response } from "express";
import { BonSortieModel, Sortie } from "../models/BonSortieModel";

const bonSortieModel = new BonSortieModel();

export const createBonSortie = async (req: Request, res: Response) => {
    try {
        console.log("createBonSortie from controller", req.body);
        const bonSortie = await bonSortieModel.createBonSortie(req.body);

        if (bonSortie) {
            res.status(201).json({ id: bonSortie.id, message: "Bon de sortie added successfully." });
        } else {
            res.status(400).json({ error: "Failed to add bon de sortie." });
        }
    } catch (error) {
        console.error("Error in createBonSortie:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getAllBonSorties = async (_req: Request, res: Response) => {
    try {
        console.log("here getAllBonSorties controller")
        const bons = await bonSortieModel.getAllBonSorties();
        res.json(bons);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve bons de sortie." });
    }
};

export const getBonSortieById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const bon = await bonSortieModel.getBonSortieById(id);
        if (bon) {
            res.json(bon);
        } else {
            res.status(404).json({ error: "Bon de sortie not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve bon de sortie." });
    }
};

export const updateBonSortie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const bonSortieData = req.body;
        const sorties = bonSortieData.sorties || [];
        bonSortieData.id = Number(id);

        const updatedBonSortie = await bonSortieModel.updateBonSortie(bonSortieData, sorties);

        if (updatedBonSortie) {
            res.status(200).json({ message: "Bon de sortie updated successfully", id: updatedBonSortie.id });
        } else {
            res.status(404).json({ message: "Bon de sortie not found or not updated" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating bon de sortie", error });
    }
};

export const addSortie = async (req: Request, res: Response) => {
    try {
        const sortie: Sortie = req.body;
        console.log("Received sortie data:", sortie);
        const success = await bonSortieModel.addSortie(sortie);
        
        if (success) {
            res.status(201).json({ message: "Sortie added successfully." });
        } else {
            console.error("Database insertion failed.");
            res.status(400).json({ error: "Failed to add sortie." });
        }
    } catch (error) {
        console.error("Error in addSortie:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getSortiesByBonSortieId = async (req: Request, res: Response) => {
    try {
        const idBs = parseInt(req.params.idBs);
        const sorties = await bonSortieModel.getSortiesByBonSortieId(idBs);
        res.json(sorties);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve sorties." });
    }
};

export const deleteBonSortie = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const success = await bonSortieModel.deleteBonSortie(id);
        if (success) {
            res.json({ message: "Bon de sortie deleted successfully." });
        } else {
            res.status(400).json({ error: "Cannot delete bon de sortie because it has associated sorties." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};