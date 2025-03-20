import { ResultSetHeader } from "mysql2";
import pool from "../config/db";

interface InventaireItem {
    id?: number;
    idArticle: number;
    idUser: number;
    idLocalisation?: number;
    idEmployer?: number;
    numInventaire?: string;
    dateInventaire?: string;
}

export class InventaireItemModel {
    async getInventaireItems(): Promise<InventaireItem[]> {
        try {
            console.log("getInventaireItems model")
            const query = "SELECT * FROM inventaire_item ORDER BY last_edited DESC;";
            const [rows] = await pool.query(query);
            return rows as InventaireItem[];
        } catch (error) {
            console.error("Error fetching inventaire items:", error);
            return [];
        }
    }

    async getInventaireItemById(id: number): Promise<InventaireItem | null> {
        if (!id || isNaN(id)) {
            console.error("Invalid inventaire item ID received:", id);
            return null;
        }
        try {
            const query = "SELECT * FROM inventaire_item WHERE id = ?";
            const [rows] = await pool.query(query, [id]);
            return (rows as InventaireItem[]).length ? (rows as InventaireItem[])[0] : null;
        } catch (error) {
            console.error(`Error fetching inventaire item with ID ${id}:`, error);
            return null;
        }
    }

    async addInventaireItem(item: InventaireItem): Promise<boolean> {
        try {
            const query = `INSERT INTO inventaire_item (id_article, user_id, id_localisation, id_employer, num_inventaire, date_inventaire)
                           VALUES (?, ?, ?, ?, ?, ?)`;
            const [result] = await pool.execute(query, [
                item.idArticle,
                item.idUser,
                item.idLocalisation,
                item.idEmployer,
                item.numInventaire,
                item.dateInventaire
            ]);
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error adding inventaire item:", error);
            return false;
        }
    }

    async updateInventaireItem(item: InventaireItem): Promise<boolean> {
        try {
            const query = `UPDATE inventaire_item SET id_article = ?, user_id = ?, id_localisation = ?, id_employer = ?, num_inventaire = ?, date_inventaire = ? WHERE id = ?`;
            const [result] = await pool.execute(query, [
                item.idArticle,
                item.idUser,
                item.idLocalisation,
                item.idEmployer,
                item.numInventaire,
                item.dateInventaire,
                item.id
            ]);
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error updating inventaire item:", error);
            return false;
        }
    }

    async deleteInventaireItem(id: number): Promise<boolean> {
        try {
            const query = "DELETE FROM inventaire_item WHERE id = ?";
            const [result] = await pool.execute(query, [id]);
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting inventaire item with ID ${id}:`, error);
            return false;
        }
    }
}
