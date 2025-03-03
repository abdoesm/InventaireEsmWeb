import { Request, Response } from "express";
import { ServiceModel } from "../models/ServiceModel";

const serviceModel = new ServiceModel();

export const getServices = async (_req: Request, res: Response) => {
    try {
        const services = await serviceModel.getServices();
        res.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ error: "Failed to fetch services." });
    }
};

export const addService = async (req: Request, res: Response) => {
    try {
        const { name, chef_service_id } = req.body;
        const success = await serviceModel.addService({ name, chef_service_id }  as any);

        if (success) {
            res.json({ message: "Service added successfully." });
        } else {
            res.status(400).json({ error: "Failed to add service." });
        }
    } catch (error) {
        console.error("Error adding service:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error." });
    }
};

export const updateService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, chef_service_id } = req.body;
        const success = await serviceModel.updateService({ id: Number(id), name, chef_service_id } as any);

        if (success) {
            res.json({ message: "Service updated successfully." });
        } else {
            res.status(400).json({ error: "Failed to update service." });
        }
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error." });
    }
};

export const deleteService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const success = await serviceModel.deleteService(Number(id));

        if (success) {
            res.json({ message: "Service deleted successfully." });
        } else {
            res.status(400).json({ error: "Failed to delete service." });
        }
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error." });
    }
};

export const getServiceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const service = await serviceModel.getServiceById(Number(id));

        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ error: "Service not found." });
        }
    } catch (error) {
        console.error("Error fetching service by ID:", error);
        res.status(500).json({ error: "Failed to fetch service by ID." });
    }
};

export const getServiceByName = async (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        const service = await serviceModel.getServiceByName(name);

        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ error: "Service not found." });
        }
    } catch (error) {
        console.error("Error fetching service by name:", error);
        res.status(500).json({ error: "Failed to fetch service by name." });
    }
};