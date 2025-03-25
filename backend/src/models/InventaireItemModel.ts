import { ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { format } from 'date-fns';
interface InventaireItem {
    id?: number;
    idArticle: number;
    idUser: number;
    idLocalisation?: number;
    idEmployer?: number;
    numInventaire?: string;
    dateInventaire?: string;
    status?: string;
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
              const formattedDate = item.dateInventaire
                            ? format(new Date(item.dateInventaire), 'yyyy-MM-dd HH:mm:ss')
                            : null;
            const query = `INSERT INTO inventaire_item (id_article, id_localisation, user_id, time,  id_employer, num_inventaire,status)
                           VALUES (?, ?, ?, ?, ?,?, ?)`;
            const [result] = await pool.execute(query, [
                item.idArticle,
                item.idLocalisation,
                item.idUser,
                formattedDate,
                item.idEmployer,
                item.numInventaire, 
                item.status
            ]);
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error adding inventaire item:", error);
            return false;
        }
    }

    async updateInventaireItem(item: InventaireItem): Promise<boolean> {
        try {
            const query = `UPDATE inventaire_item SET id_article = ?, user_id = ?, id_localisation = ?, id_employer = ?, num_inventaire = ?, time = ? WHERE id = ?`;
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
