import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db";

interface Service extends RowDataPacket {
    id?: number;
    name: string;
    chef_service_id: number;
}

export class ServiceModel {
    async getServices(): Promise<Service[]> {
        const query = "SELECT * FROM service ORDER BY id DESC;";
        try {
            const [rows] = await pool.query<Service[]>(query);
            return rows;
        } catch (error: any) {
            console.error("Error fetching services:", error.message);
            throw new Error("Database error: Failed to fetch services.");
        }
    }

    async addService(service: Service): Promise<Service | null> {
        console.log(service)
        const query = "INSERT INTO service (name, chef_service_id) VALUES (?, ?)";
        try {
            const [result] = await pool.execute<ResultSetHeader>(query, [service.name, service.chef_service_id]);
            if (result.affectedRows > 0) {
                return { id: result.insertId, ...service };
            }
            return null;
        } catch (error: any) {
            console.error("Error adding service:", error.message);
            throw new Error("Database error: Failed to add service.");
        }
    }

    async updateService(service: Service): Promise<boolean> {
        if (!service.id) {
            throw new Error("Service ID is required for updating.");
        }

        const query = "UPDATE service SET name = ?, chef_service_id = ? WHERE id = ?";
        try {
            const [result] = await pool.execute<ResultSetHeader>(query, [service.name, service.chef_service_id, service.id]);
            return result.affectedRows > 0;
        } catch (error: any) {
            console.error("Error updating service:", error.message);
            throw new Error("Database error: Failed to update service.");
        }
    }

    async deleteService(id: number): Promise<boolean> {
        const query = "DELETE FROM service WHERE id = ?";
        try {
            const [result] = await pool.execute<ResultSetHeader>(query, [id]);
            return result.affectedRows > 0;
        } catch (error: any) {
            console.error("Error deleting service:", error.message);
            if (error.code === "ER_ROW_IS_REFERENCED") {
                throw new Error("Cannot delete service: It is referenced in other records.");
            }
            throw new Error("Database error: Failed to delete service.");
        }
    }

    async getServiceById(id: number): Promise<Service | null> {
        const query = "SELECT * FROM service WHERE id = ?";
        try {
            const [rows] = await pool.query<Service[]>(query, [id]);
            return rows.length ? rows[0] : null;
        } catch (error: any) {
            console.error("Error fetching service by ID:", error.message);
            throw new Error("Database error: Failed to fetch service by ID.");
        }
    }

    async getServiceByName(name: string): Promise<Service | null> {
        const query = "SELECT * FROM service WHERE name = ? LIMIT 1;";
        try {
            const [rows] = await pool.query<Service[]>(query, [name]);
            return rows.length ? rows[0] : null;
        } catch (error: any) {
            console.error("Error fetching service by name:", error.message);
            throw new Error("Database error: Failed to fetch service by name.");
        }
    }
}
