import { ResultSetHeader } from "mysql2";
import pool from "../config/db"; 

interface Employer {
    id?: number;
    fname: string;
    lname: string;
    title: string;
}

export class EmployerModel {
     async createEmployer(employer: Employer): Promise<number | null> {
        const query = "INSERT INTO employeur (firstname, lastname, title) VALUES (?, ?, ?)";
        try {
            const [result] = await pool.execute<ResultSetHeader>(query, [
                employer.fname,
                employer.lname,
                employer.title,
            ]);
            return result.insertId;
        } catch (error) {
            console.error("Error inserting employer:", error);
            return null;
        }
    }

     async getAllEmployers(): Promise<Employer[]> {
        const query = "SELECT id, firstname AS fname, lastname AS lname, title FROM employeur ORDER BY id DESC";
        try {
            const [rows] = await pool.execute(query);
            return rows as Employer[];
        } catch (error) {
            console.error("Error fetching employers:", error);
            return [];
        }
    }

    async getEmployerById(id: number): Promise<Employer | null> {
        const query = "SELECT id, firstname AS fname, lastname AS lname, title FROM employeur WHERE id = ?";
        try {
            const [rows] = await pool.execute(query, [id]);
            const employers = rows as Employer[];
            return employers.length > 0 ? employers[0] : null;
        } catch (error) {
            console.error("Error fetching employer:", error);
            return null;
        }
    }

     async updateEmployer(id: number, employer: Employer): Promise<boolean> {
        const query = "UPDATE employeur SET firstname = ?, lastname = ?, title = ? WHERE id = ?";
        try {
            const [result] = await pool.execute<ResultSetHeader>(query, [
                employer.fname,
                employer.lname,
                employer.title,
                id,
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error updating employer:", error);
            return false;
        }
    }

     async deleteEmployer(id: number): Promise<boolean> {
        const query = "DELETE FROM employeur WHERE id = ?";
        try {
            const [result] = await pool.execute<ResultSetHeader>(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error deleting employer:", error);
            return false;
        }
    }
}