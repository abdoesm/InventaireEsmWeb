import { ResultSetHeader } from "mysql2";
import pool from "../config/db";

export interface BonEntree {
    id?: number;
    idFournisseur: number;
    date: Date;
    tva: number;
    documentNum: string;
}

export interface Entree {
    id?: number;
    idArticle: number;
    quantity: number;
    unitPrice: number;
    idBe: number; // Bon Entree ID
}

export class BonEntreeModel {



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