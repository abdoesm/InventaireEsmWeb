import { ResultSetHeader } from "mysql2";
import pool from "../config/db";

export interface Fournisseur {
  id?: number;
  name: string;
  RC: string;
  NIF: string;
  AI: string;
  NIS: string;
  TEL: string;
  FAX: string;
  ADDRESS: string;
  EMAIL: string;
  RIB: string;
}

export class FournisseurModel {
  async getAllFournisseursNames(): Promise<string[]> {
    try {
      const query = "SELECT name FROM fournisseur ORDER BY name DESC;";
      const [rows] = await pool.query(query);
      return (rows as any[]).map((row) => row.name);
    } catch (error) {
      console.error("Error fetching fournisseur names:", error);
      return [];
    }
  }

  async getFournisseurs(): Promise<Fournisseur[]> {
    try {
      const query = "SELECT * FROM fournisseur ORDER BY id DESC;";
      const [rows] = await pool.query(query);
      return rows as Fournisseur[];
    } catch (error) {
      console.error("Error fetching fournisseurs:", error);
      return [];
    }
  }

  async getFournisseurById(id: number): Promise<Fournisseur | null> {
    try {
      const query = "SELECT * FROM fournisseur WHERE id = ?";
      const [rows] = await pool.query(query, [id]);
      return (rows as Fournisseur[]).length ? (rows as Fournisseur[])[0] : null;
    } catch (error) {
      console.error(`Error fetching fournisseur with ID ${id}:`, error);
      return null;
    }
  }

  async addFournisseur(fournisseur: Fournisseur): Promise<boolean> {
    try {
      console.log("expceted fornissur"+fournisseur)
      const query = "INSERT INTO fournisseur (name, RC, NIF, AI, NIS, TEL, FAX, ADDRESS, EMAIL, RIB) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const [result] = await pool.execute(query, [
        fournisseur.name,
        fournisseur.RC,
        fournisseur.NIF,
        fournisseur.AI,
        fournisseur.NIS,
        fournisseur.TEL,
        fournisseur.FAX,
        fournisseur.ADDRESS,
        fournisseur.EMAIL,
        fournisseur.RIB,
      ]);
      return (result as ResultSetHeader).affectedRows > 0;
    } catch (error) {
      console.error("Error adding fournisseur:", error);
      return false;
    }
  }

  async updateFournisseur(fournisseur: Fournisseur): Promise<boolean> {
    try {
        console.log("Expected fournisseur update:", fournisseur);  // Log received object
        
        // Check for undefined values in the fields
        const values = [
            fournisseur.name ?? null,
            fournisseur.RC ?? null,
            fournisseur.NIF ?? null,
            fournisseur.AI ?? null,
            fournisseur.NIS ?? null,
            fournisseur.TEL ?? null,
            fournisseur.FAX ?? null,
            fournisseur.ADDRESS ?? null,
            fournisseur.EMAIL ?? null,
            fournisseur.RIB ?? null,
            fournisseur.id
        ];
        
        console.log("Query values before execution:", values); // Log parameter values

        const query = `
            UPDATE fournisseur 
            SET name = ?, RC = ?, NIF = ?, AI = ?, NIS = ?, TEL = ?, FAX = ?, ADDRESS = ?, EMAIL = ?, RIB = ? 
            WHERE id = ?`;

        const [result] = await pool.execute(query, values);

        return (result as ResultSetHeader).affectedRows > 0;
    } catch (error) {
        console.error("Error updating fournisseur:", error);
        return false;
    }
}


  async deleteFournisseur(id: number): Promise<boolean> {
    try {
      const query = "DELETE FROM fournisseur WHERE id = ?";
      const [result] = await pool.execute(query, [id]);
      return (result as ResultSetHeader).affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting fournisseur with ID ${id}:`, error);
      return false;
    }
  }
  async getFournisseurIdByName(name: string): Promise<number | null> {
    try {
      const query = "SELECT id FROM fournisseur WHERE name = ?";
      const [result]: any = await pool.execute(query, [name]);
      return result.length > 0 ? result[0].id : null;
    } catch (error) {
      console.error(`Error retrieving fournisseur ID for name ${name}:`, error);
      return null;
    }
  }

}
