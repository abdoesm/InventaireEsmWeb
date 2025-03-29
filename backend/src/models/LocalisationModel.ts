import { ResultSetHeader } from "mysql2";
import pool from "../config/db";

interface Localisation {
    id?: number;
    loc_name: string;
    floor: number;
    id_service: number;
}

export class LocalisationModel {
    async createLocalisation(localisation: Localisation): Promise<number | null> {
        console.log("createLocalisation from model",localisation)
        const query = "INSERT INTO localisation (loc_name, floor, id_service) VALUES (?, ?, ?)";
        try {
            const [result] = await pool.execute<ResultSetHeader>(query, [
                localisation.loc_name,
                localisation.floor,
                localisation.id_service,
            ]);
            return result.insertId;
        } catch (error) {
            console.error("Error inserting localisation:", error);
            return null;
        }
    }

    async getAllLocalisations(): Promise<Localisation[]> {
        console.log("getAllLocalisations  in the model")
        const query = "SELECT * FROM localisation ORDER BY id DESC";
        const [rows] = await pool.execute(query);
        return rows as Localisation[];
    }

    async getLocalisationById(id: number): Promise<Localisation | null> {
        const query = "SELECT * FROM localisation WHERE id = ?";
        const [rows] = await pool.execute<any[]>(query, [id]);
        return rows.length ? (rows[0] as Localisation) : null;
    }

    async updateLocalisation(localisation: Localisation): Promise<boolean> {
        console.log("modifyLocalisation from controller")
        const query = "UPDATE localisation SET loc_name = ?, floor = ?, id_service = ? WHERE id = ?";
        try {
            const [result] = await pool.execute<ResultSetHeader>(query, [
                localisation.loc_name,
                localisation.floor,
                localisation.id_service,
                localisation.id,
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error updating localisation:", error);
            return false;
        }
    }

    async deleteLocalisation(id: number): Promise<boolean> {
        try {
            const query = "DELETE FROM localisation WHERE id = ?";
            const [result] = await pool.execute<ResultSetHeader>(query, [id]);
            return result.affectedRows > 0;
        } catch (error: any) {
            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                throw new Error("Cannot delete localisation as it is referenced in other records.");
            }
            console.error("Error deleting localisation:", error);
            return false;
        }
    }

    async getLocalisationByName(name: string): Promise<Localisation | null> {
        const query = "SELECT * FROM localisation WHERE loc_name = ?";
        const [rows] = await pool.execute<any[]>(query, [name]);
        return rows.length ? (rows[0] as Localisation) : null;
    }
    
    async getLocalisationsByServiceId(serviceId: number): Promise<Localisation[]> {
        const query = "SELECT * FROM localisation WHERE id_service = ?";
        const [rows] = await pool.execute(query, [serviceId]);
        return rows as Localisation[];
    }
    
    async getAllLocations(): Promise<string[]> {
        const query = "SELECT loc_name FROM localisation";
        const [rows] = await pool.execute<any[]>(query);
        return rows.map(row => row.loc_name);
    }
    
    async getLocationIdByName(name: string): Promise<number | null> {
        const query = "SELECT id FROM localisation WHERE loc_name = ?";
        const [rows] = await pool.execute<any[]>(query, [name]);
        return rows.length ? rows[0].id : null;
    }
    
}
