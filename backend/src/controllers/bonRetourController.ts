import { Request, Response } from "express";
import { BonRetourModel, Retour } from "../models/BonRetourModel";

const bonRetourModel = new BonRetourModel();

export const createBonRetour = async (req: Request, res: Response) => {
    try {
        console.log("createBonRetour from controller", req.body);

        const { retours, ...bonRetourData } = req.body; // Extract retours from request body
        const bonRetour = await bonRetourModel.createBonRetour(bonRetourData, retours);

        if (bonRetour) {
            res.status(201).json({ id: bonRetour.id, message: "Bon de retour and retours added successfully." });
        } else {
            res.status(400).json({ error: "Failed to add bon de retour." });
        }
    } catch (error) {
        console.error("Error in createBonRetour:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


export const getAllBonRetours = async (_req: Request, res: Response) => {
    try {
        const bons = await bonRetourModel.getAllBonRetours();
        res.json(bons);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve bon de retour." });
    }
};

export const getBonRetourById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const bon = await bonRetourModel.getBonRetourById(id);
        if (bon) {
            res.json(bon);
        } else {
            res.status(404).json({ error: "Bon de retour not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve bon de retour." });
    }
};

export const addRetour = async (req: Request, res: Response) => {
    try {
        const retour: Retour = req.body;
        console.log("Received retour data:", retour);
        const success = await bonRetourModel.saveRetour(retour);
        
        if (success) {
            res.status(201).json({ message: "Retour added successfully." });
        } else {
            console.error("Database insertion failed.");
            res.status(400).json({ error: "Failed to add retour." });
        }
    } catch (error) {
        console.error("Error in addRetour:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getRetoursByBonRetourId = async (req: Request, res: Response) => {
    try {
        const idBr = parseInt(req.params.idBr);
        const retours = await bonRetourModel.getRetoursByIdBonRetour(idBr);
        res.json(retours);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve retours." });
    }


};


// Delete BonRetour
export const deleteBonRetour = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const success = await bonRetourModel.deleteBonRetour(id);
        
        if (success) {
            res.json({ message: "Bon de retour deleted successfully." });
        } else {
            res.status(404).json({ error: "Bon de retour not found or could not be deleted." });
        }
    } catch (error) {
        console.error("Error in deleteBonRetour:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Update BonRetour
export const updateBonRetour = async (req: Request, res: Response) => {
    try {
        console.log("updateBonRetour from the controller");
        
        const bonRetourData = { id: parseInt(req.params.id), ...req.body };
        const retours: Retour[] = req.body.retours || []; // Ensure retours is always an array

        const updatedBonRetour = await bonRetourModel.updateBonRetour(bonRetourData, retours);

        if (updatedBonRetour) {
            res.json({ message: "Bon de retour updated successfully.", id: updatedBonRetour.id });
        } else {
            res.status(400).json({ error: "Failed to update bon de retour or no changes were made." });
        }
    } catch (error) {
        console.error("Error in updateBonRetour:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
