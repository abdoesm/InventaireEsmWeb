import { Request, Response } from "express";
import { EmployerModel } from "../models/EmployerModel";

const employerModel = new EmployerModel();

export const getAllEmployers = async (_req: Request, res: Response) => {
    try {
    
        const employers = await employerModel.getAllEmployers();
        res.json(employers);
    } catch (err) {
        res.status(500).json({ err: "Error fetching employers" });
    }
};

export const getEmployerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employer = await employerModel.getEmployerById(Number(id));
        if (!employer) {
             res.status(404).json({ err: "Employer not found" });
        }
        res.json(employer);
    } catch (err) {
        res.status(500).json({ err: "Error fetching employer" });
    }
};

export const createEmployer = async (req: Request, res: Response) => {
    try {
        console.log("Received data:", req.body);

        const { fname, lname, title } = req.body;
        const newEmployerId = await employerModel.createEmployer({ fname, lname, title });
        if (newEmployerId) {
            res.status(201).json({ id: newEmployerId, fname, lname, title });
        } else {
            res.status(500).json({ error: "Failed to create employer" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error creating employer" });
    }
};


export const updateEmployer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fname, lname, title } = req.body;
        const success = await employerModel.updateEmployer(Number(id), { fname, lname, title });
        if (success) {
            res.json({ message: "Employer updated successfully" });
        } else {
            res.status(500).json({ error: "Failed to update employer" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error updating employer" });
    }
};

export const deleteEmployer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await employerModel.deleteEmployer(Number(id));
        if (!deleted) {
             res.status(400).json({ err: "Failed to delete employer" });
        }
        res.json({ message: "Employer deleted successfully" });
    } catch (err) {
        res.status(500).json({ err: "Error deleting employer" });
    }
};