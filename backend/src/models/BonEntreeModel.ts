import { ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { format } from 'date-fns';
export interface BonEntree {
    id: number;
    id_fournisseur: number;
    date: string;
    TVA: number;
    document_num: string;
}

export interface Entree {
    id?: number;
    idArticle: number;
    quantity: number;
    unitPrice: number;
    idBe: number; // Bon Entree ID
}

export class BonEntreeModel {



    async createBonEntree(bon_entree: BonEntree): Promise<{ id: number } | null> {
        try {
            console.log("createBonEntree from model", bon_entree);

            // Ensure the date is in the correct format
            const formattedDate = bon_entree.date
                ? format(new Date(bon_entree.date), 'yyyy-MM-dd HH:mm:ss')
                : null;

            const query = "INSERT INTO bon_entree (id_fournisseur, date, TVA, document_num) VALUES (?, ?, ?, ?)";
            const [result] = await pool.query<ResultSetHeader>(query, [
                bon_entree.id_fournisseur,
                formattedDate,  // ✅ Correctly formatted datetime
                bon_entree.TVA,
                bon_entree.document_num
            ]);

            if (result.affectedRows > 0) {
                return { id: result.insertId }; // ✅ Return the newly created ID
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error creating bon entree", error);
            return null;
        }
    }





    async updateBonEntree(bon_entree: BonEntree, entrees: Entree[]): Promise<{ id: number } | null> {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
    
            console.log("Updating Bon Entree:", bon_entree);
    
            // Ensure the date is in the correct format
            const formattedDate = bon_entree.date
                ? format(new Date(bon_entree.date), 'yyyy-MM-dd HH:mm:ss')
                : null;
    
            // 1. Update `bon_entree`
            const updateBonEntreeQuery = `
                UPDATE bon_entree 
                SET id_fournisseur = ?, date = ?, TVA = ?, document_num = ?
                WHERE id = ?
            `;
            const [updateResult] = await connection.query<ResultSetHeader>(updateBonEntreeQuery, [
                bon_entree.id_fournisseur,
                formattedDate,
                bon_entree.TVA,
                bon_entree.document_num,
                bon_entree.id, // ID of the record to update
            ]);
    
            if (updateResult.affectedRows === 0) {
                await connection.rollback();
                return null;
            }
    
            // 2. Remove existing entries that are not in the updated list
            const entreeIds = entrees.map(e => e.id).filter(id => id !== undefined); // Keep only defined IDs
            if (entreeIds.length > 0) {
                const deleteQuery = `DELETE FROM entree WHERE id_be = ? AND id NOT IN (?)`;
                await connection.query(deleteQuery, [bon_entree.id, entreeIds]);
            } else {
                // If no entrees provided, delete all related records
                await connection.query(`DELETE FROM entree WHERE id_be = ?`, [bon_entree.id]);
            }
    
            // 3. Insert or update `entrees`
            for (const entree of entrees) {
                if (entree.id) {
                    // Update existing entree
                    const updateEntreeQuery = `
                        UPDATE entree 
                        SET id_article = ?, quantity = ?, unit_price = ?
                        WHERE id = ? AND id_be = ?
                    `;
                    await connection.query(updateEntreeQuery, [
                        entree.idArticle,
                        entree.quantity,
                        entree.unitPrice,
                        entree.id,
                        bon_entree.id
                    ]);
                } else {
                    // Insert new entree
                    const insertEntreeQuery = `
                        INSERT INTO entree (id_article, quantity, unit_price, id_be)
                        VALUES (?, ?, ?, ?)
                    `;
                    await connection.query(insertEntreeQuery, [
                        entree.idArticle,
                        entree.quantity,
                        entree.unitPrice,
                        bon_entree.id
                    ]);
                }
            }
    
            await connection.commit();
            return { id: bon_entree.id };
        } catch (error) {
            console.error("Error updating Bon Entree and Entrees:", error);
            await connection.rollback();
            return null;
        } finally {
            connection.release();
        }
    }
    
    


    async getAllBonEntrees() {
        const query = "SELECT id, id_fournisseur, date, TVA, document_num FROM bon_entree ORDER BY last_edited DESC;";
        try {
            const [rows] = await pool.execute(query);
            return rows;
        } catch (error) {
            console.error("Error fetching bon d'entrée:", error);
            throw new Error("Database query failed");
        }
    }

    async getBonEntreeById(id: number): Promise<BonEntree | null> {
        try {
            const query = "SELECT * FROM bon_entree WHERE id = ?";
            const [rows] = await pool.query(query, [id]);
            return (rows as BonEntree[]).length ? (rows as BonEntree[])[0] : null;
        } catch (error) {
            console.error(`Error fetching Bon Entree with ID ${id}:`, error);
            return null;
        }
    }

    async addEntree(entree: Entree): Promise<boolean> {
        try {
            console.log("Entree Data:", entree);
            console.log("Executing Query with:", entree.idArticle, entree.quantity, entree.unitPrice, entree.idBe);

            const query = "INSERT INTO entree (id_article, quantity, unit_price, id_be) VALUES (?, ?, ?, ?)";
            const [result] = await pool.execute(query, [
                entree.idArticle,
                entree.quantity,
                entree.unitPrice,
                entree.idBe,
            ]);
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error adding Entree:", error);
            return false;
        }
    }

    async getEntreesByBonEntreeId(idBe: number): Promise<Entree[]> {
        try {
            const query = "SELECT * FROM entree WHERE id_be = ?";
            const [rows] = await pool.query(query, [idBe]);
            return rows as Entree[];
        } catch (error) {
            console.error(`Error fetching Entrees for Bon Entree ID ${idBe}:`, error);
            return [];
        }
    }

    async deleteBonEntree(id: number): Promise<boolean> {
        try {
            // Supprimer d'abord les entrées associées
            await pool.execute("DELETE FROM entree WHERE id_be = ?", [id]);
            // Ensuite supprimer le Bon Entree
            const query = "DELETE FROM bon_entree WHERE id = ?";
            const [result] = await pool.execute(query, [id]);
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting Bon Entree with ID ${id}:`, error);
            return false;
        }
    }
}