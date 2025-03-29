import { Request, Response } from "express";
import { LocalisationModel } from "../models/LocalisationModel";
const localisationModel = new LocalisationModel() 

// Get all localisations
export const getAllLocalisations = async (req: Request, res: Response) => {
    try {
        console.log("getAllLocalisations  in the controller")
        const localisations = await localisationModel.getAllLocalisations();
        res.json(localisations);
    } catch (error) {
        res.status(500).json({ error: "Error fetching localisations" });
    }
};

// Get localisation by ID
export const getLocalisationById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const localisation = await localisationModel.getLocalisationById(Number(id));
        if (!localisation) res.status(404).json({ message: "Localisation not found" });
        res.json(localisation);
    } catch (error) {
        res.status(500).json({ error: "Error fetching localisation" });
    }
};

// Get localisation by name
export const getLocalisationByNameHandler = async (req: Request, res: Response) => {
    const { name } = req.params;
    try {
        const localisation = await localisationModel.getLocalisationByName(name);
        if (!localisation)  res.status(404).json({ message: "Localisation not found" });
        res.json(localisation);
    } catch (error) {
        res.status(500).json({ error: "Error fetching localisation" });
    }
};

// Get localisations by service ID
export const getLocalisationsByService = async (req: Request, res: Response) => {
    const { serviceId } = req.params;
    try {
        const localisations = await localisationModel.getLocalisationsByServiceId(Number(serviceId));
        res.json(localisations);
    } catch (error) {
        res.status(500).json({ error: "Error fetching localisations" });
    }
};

// Create new localisation
export const createLocalisation = async (req: Request, res: Response) => {
    try {
        console.log("createLocalisation from controller ",req.body)
        const insertId = await localisationModel.createLocalisation(req.body);
        if (insertId) {
            res.status(201).json({ message: "Localisation added successfully", id: insertId });
        } else {
            res.status(400).json({ error: "Failed to add localisation" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error adding localisation" });
    }
};


// Update localisation
export const modifyLocalisation = async (req: Request, res: Response) => {
    try {
        console.log("modifyLocalisation from controller")
        const success = await localisationModel.updateLocalisation(req.body);
        if (success) {
            res.json({ message: "Localisation updated successfully" });
        } else {
            res.status(404).json({ error: "Localisation not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error updating localisation" });
    }
};

// Delete localisation
export const removeLocalisation = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const success = await localisationModel.deleteLocalisation(Number(id));
        if (success) {
            res.json({ message: "Localisation deleted successfully" });
        } else {
            res.status(404).json({ error: "Localisation not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Error deleting localisation" });
    }
};

// Get all location names
export const getLocationNames = async (req: Request, res: Response) => {
    try {
        const locations = await localisationModel.getAllLocations();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: "Error fetching location names" });
    }
};

// Get location ID by name
export const getLocationIdByName = async (req: Request, res: Response) => {
    const { name } = req.params;
    try {
        const id = await localisationModel.getLocationIdByName(name);
        if (id === -1)  res.status(404).json({ message: "Localisation not found" });
        res.json({ id });
    } catch (error) {
        res.status(500).json({ error: "Error fetching location ID" });
    }
};
