import { ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { format } from 'date-fns';

export interface BonRetour {
    id?: number;
    id_employeur: number;
    id_service: number;
    date: string;
    return_reason: string;
}

export interface Retour {
    id?: number;
    id_article: number;
    quantity: number;
    id_br: number; // BonRetour ID
}

export class BonRetourModel {
    
    async createBonRetour(bonRetour: BonRetour, retours: Retour[] = []): Promise<{ id: number } | null> {
        try {
            const formattedDate = bonRetour.date 
                ? format(new Date(bonRetour.date), 'yyyy-MM-dd HH:mm:ss') 
                : null;
    
            // Insert BonRetour
            const query = `INSERT INTO bon_retour (id_employeur, id_service, date, return_reason, last_edited) 
                           VALUES (?, ?, ?, ?, DEFAULT)`;
    
            const [result] = await pool.query<ResultSetHeader>(query, [
                bonRetour.id_employeur,
                bonRetour.id_service,
                formattedDate,
                bonRetour.return_reason
            ]);
    
            if (result.affectedRows > 0) {
                const bonRetourId = result.insertId;
    
                // Insert retours if they exist
                if (retours.length > 0) {
                    for (const retour of retours) {
                        retour.id_br = bonRetourId; // Assign BonRetour ID
                        const success = await this.saveRetour(retour);
                        if (!success) {
                            console.error("Failed to insert retour:", retour);
                            return null; // If any retour fails, return null
                        }
                    }
                }
    
                return { id: bonRetourId };
            }
    
            return null;
        } catch (error) {
            console.error("Error creating BonRetour:", error);
            return null;
        }
    }
    

    async saveRetour(retour: Retour): Promise<boolean> {
        try {
            const query = "INSERT INTO retour (id_article, quantity, id_br) VALUES (?, ?, ?)";
            const [result] = await pool.query<ResultSetHeader>(query, [
                retour.id_article,
                retour.quantity,
                retour.id_br
            ]);
    
            if (result.affectedRows > 0) {
                console.log("Retour successfully inserted:", retour);
                return true;
            } else {
                console.error("Retour insertion failed:", retour);
                return false;
            }
        } catch (error) {
            console.error("Error saving Retour:", error);
            return false;
        }
    }
    

    async getRetoursByIdBonRetour(idBonRetour: number): Promise<Retour[]> {
        try {
            const query = "SELECT * FROM retour WHERE id_br = ?";
            const [rows] = await pool.query(query, [idBonRetour]);
            return rows as Retour[];
        } catch (error) {
            console.error("Error fetching Retours:", error);
            throw new Error("Database query failed");
        }
    }

    async getBonRetourById(id: number): Promise<BonRetour | null> {
        try {
            const query = "SELECT id, id_employeur, id_service, date, return_reason, last_edited FROM bon_retour WHERE id = ?";
            const [rows] = await pool.query(query, [id]);
            return (rows as BonRetour[])[0] || null;
        } catch (error) {
            console.error("Error fetching BonRetour:", error);
            return null;
        }
    }

    async getAllBonRetours(): Promise<BonRetour[]> {
        try {
            const query = "SELECT id, id_employeur, id_service, date, return_reason, last_edited FROM bon_retour ORDER BY last_edited DESC";
            const [rows] = await pool.query(query);
            return rows as BonRetour[];
        } catch (error) {
            console.error("Error fetching BonRetours:", error);
            throw new Error("Database query failed");
        }
    }

   
    async deleteBonRetour(id: number): Promise<boolean> {
        try {
            const [result]: any = await pool.query("DELETE FROM bon_retour WHERE id = ?", [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting bon de retour:", error);
            return false;
        }
    }

    async updateBonRetour(bonRetourData: any, retours: Retour[]): Promise<{ id: number } | null> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
    
            console.log("Updating Bon Retour:", bonRetourData);
    
            // Ensure the date is formatted correctly
            const formattedDate = bonRetourData.date
                ? format(new Date(bonRetourData.date), 'yyyy-MM-dd HH:mm:ss')
                : null;
    
            // 1. Update `bon_retour`
            const updateBonRetourQuery = `
                UPDATE bon_retour 
                SET id_employeur = ?, id_service = ?, date = ?, return_reason = ?
                WHERE id = ?
            `;
            const [updateResult] = await connection.query<ResultSetHeader>(updateBonRetourQuery, [
                bonRetourData.id_employeur,
                bonRetourData.id_service,
                formattedDate,
                bonRetourData.return_reason,
                bonRetourData.id
            ]);
    
            if (updateResult.affectedRows === 0) {
                await connection.rollback();
                return null;
            }
    
            // 2. Delete existing retours not in the update list
            const retourIds = retours.map(r => r.id).filter(id => id !== undefined);
            if (retourIds.length > 0) {
                const deleteQuery = `DELETE FROM retour WHERE id_br = ? AND id NOT IN (?)`;
                await connection.query(deleteQuery, [bonRetourData.id, retourIds]);
            } else {
                // If no retours provided, delete all existing ones
                await connection.query(`DELETE FROM retour WHERE id_br = ?`, [bonRetourData.id]);
            }
    
            // 3. Insert or update `retours`
            if (retours.length > 0) {
                console.log("Inserting or updating retours:", retours);
    
                await Promise.all(
                    retours.map(async (retour) => {
                        if (retour.id) {
                            // Update existing retour
                            const updateRetourQuery = `
                                UPDATE retour 
                                SET id_article = ?, quantity = ?
                                WHERE id = ? AND id_br = ?
                            `;
                            await connection.query(updateRetourQuery, [
                                retour.id_article,
                                retour.quantity,
                                retour.id,
                                bonRetourData.id
                            ]);
                        } else {
                            // Insert new retour
                            const insertRetourQuery = `
                                INSERT INTO retour (id_article, quantity, id_br)
                                VALUES (?, ?, ?)
                            `;
                            await connection.query(insertRetourQuery, [
                                retour.id_article,
                                retour.quantity,
                                bonRetourData.id
                            ]);
                        }
                    })
                );
            } else {
                console.log("No new retours to insert.");
            }
    
            await connection.commit();
            return { id: bonRetourData.id };
        } catch (error) {
            console.error("Error updating Bon Retour and Retours:", error);
            await connection.rollback();
            return null;
        } finally {
            connection.release();
        }
    }
    
    
    
}

