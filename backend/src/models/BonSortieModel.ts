import { ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { format } from 'date-fns';

export interface BonSortie {
    id: number;
    id_employeur: number;
    id_service: number;
    date: string;
}

export interface Sortie {
    id?: number;
    idArticle: number;
    quantity: number;
    idBs: number; // Bon Sortie ID
}

export class BonSortieModel {
   
        
    async updateBonSortie(bonSortieData: BonSortie, sorties: Sortie[]): Promise<BonSortie | null> {
        try {
            console.log("updateBonSortie from model", bonSortieData);

           
 
            const { id, id_employeur, id_service, date } = bonSortieData;
              // Ensure the date is in the correct format
              const formattedDate = date
              ? format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
              : null;
    
            // Update bon_sortie table
            const [result] = await pool.query<ResultSetHeader>(
                "UPDATE bon_sortie SET id_employeur = ?, id_service = ?, date = ?, last_edited = NOW() WHERE id = ?",
                [id_employeur, id_service, formattedDate, id]
            );
    
            if (result.affectedRows === 0) {
                return null; // No rows updated
            }
    
            // Remove existing sorties for this bonSortie
            await pool.query("DELETE FROM sortie WHERE id_bs = ?", [id]);
    
            // Insert updated sorties
            for (const sortie of sorties) {
                await pool.query(
                    "INSERT INTO sortie (id_bs, id_article, quantity) VALUES (?, ?, ?)", // Ensure correct column names
                    [id, sortie.idArticle, sortie.quantity] // Ensure correct variable names
                );
            }
    
            return { id, id_employeur, id_service, date };
        } catch (error) {
            console.error("Error updating Bon Sortie:", error);
            throw new Error("Failed to update Bon Sortie.");
        }
    }
    
    async createBonSortie(bonSortieData: BonSortie, sorties: Sortie[]): Promise<{ id: number } | null> {
        try {
            const formattedDate = bonSortieData.date
                ? format(new Date(bonSortieData.date), 'yyyy-MM-dd HH:mm:ss')
                : null;

            const query = "INSERT INTO bon_sortie (id_employeur, id_service, date) VALUES (?, ?, ?)";
            const [result] = await pool.query<ResultSetHeader>(query, [
                bonSortieData.id_employeur,
                bonSortieData.id_service,
                formattedDate
            ]);

            if (result.affectedRows > 0) {
                const idBs = result.insertId;
                for (const sortie of sorties) {
                    await pool.query(
                        "INSERT INTO sortie (id_bs, id_article, quantity) VALUES (?, ?, ?)",
                        [idBs, sortie.idArticle, sortie.quantity]
                    );
                }
                return { id: idBs };
            }
            return null;
        } catch (error) {
            console.error("Error creating bon sortie", error);
            return null;
        }
    }



    async addSortie(sortie: Sortie): Promise<boolean> {
        try {
            const query = "INSERT INTO sortie (id_article, quantity, id_bs) VALUES (?, ?, ?)";
            const [result] = await pool.execute(query, [
                sortie.idArticle,
                sortie.quantity,
                sortie.idBs
            ]);
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error adding Sortie:", error);
            return false;
        }
    }

    async getSortiesByBonSortieId(idBs: number): Promise<Sortie[]> {
        try {
            const query = "SELECT * FROM sortie WHERE id_bs = ?";
            const [rows] = await pool.query(query, [idBs]);
            return rows as Sortie[];
        } catch (error) {
            console.error(`Error fetching Sorties for Bon Sortie ID ${idBs}:`, error);
            return [];
        }
    }

    async getAllBonSorties() {
        const query = "SELECT id, id_employeur, id_service, date FROM bon_sortie ORDER BY date DESC;";
        try {
            console.log("here getAllBonSorties model")
            const [rows] = await pool.execute(query);
            return rows;
        } catch (error) {
            console.error("Error fetching bon de sortie:", error);
            throw new Error("Database query failed");
        }
    }

    async getBonSortieById(id: number): Promise<BonSortie | null> {
        try {
            const query = "SELECT * FROM bon_sortie WHERE id = ?";
            const [rows] = await pool.query(query, [id]);
            return (rows as BonSortie[]).length ? (rows as BonSortie[])[0] : null;
        } catch (error) {
            console.error(`Error fetching Bon Sortie with ID ${id}:`, error);
            return null;
        }
    }

    async deleteBonSortie(id: number): Promise<boolean> {
        try {
            await pool.execute("DELETE FROM sortie WHERE id_bs = ?", [id]);
            const query = "DELETE FROM bon_sortie WHERE id = ?";
            const [result] = await pool.execute(query, [id]);
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting Bon Sortie with ID ${id}:`, error);
            return false;
        }
    }
}