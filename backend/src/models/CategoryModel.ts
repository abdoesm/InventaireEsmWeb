import { ResultSetHeader } from "mysql2";
import pool from "../config/db";

interface Category {
    id?: number;
    name_cat: string;
}

export class CategoryModel {
    async getAllCategoryNames(): Promise<string[]> {
        try {
            const query = "SELECT name FROM category ORDER BY name DESC;";
            const [rows] = await pool.query(query);
            return (rows as any[]).map((row) => row.name);
        } catch (error) {
            console.error("Error fetching category names:", error);
            return [];
        }
    }

    async getCategories(): Promise<Category[]> {
        try {
            const query = "SELECT id, name_cat FROM category ORDER BY id DESC;";
            const [rows] = await pool.query(query);
            return rows as Category[];
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    }

    async getCategoryById(id: number): Promise<Category | null> {
        try {
            const query = "SELECT * FROM category WHERE id = ?";
            const [rows] = await pool.query(query, [id]);
            return (rows as Category[]).length ? (rows as Category[])[0] : null;
        } catch (error) {
            console.error(`Error fetching category with ID ${id}:`, error);
            return null;
        }
    }

 /*   async addCategory(category: Category): Promise<boolean> {
        try {
            const query = "INSERT INTO category (name_cat) VALUES (?)";
            const [result] = await pool.execute(query, [category.name_cat]);
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error adding category:", error);
            return false;
        }
    }*/
    async addCategory(category: Category): Promise<boolean> {
        try {
            console.log("Received category data:", category); // Debugging
    
            if (!category.name_cat) {
                console.error("Category name_cat is undefined!");
                return false;
            }
    
            const query = "INSERT INTO category (name_cat) VALUES (?)";
            const [result] = await pool.execute(query, [category.name_cat]);
    
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error adding category:", error);
            return false;
        }
    }
    

    async updateCategory(category: Category): Promise<boolean> {
        try {
            const query = "UPDATE category SET name_cat = ? WHERE id = ?";
            const [result] = await pool.execute(query, [category.name_cat, category.id]);
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error updating category:", error);
            return false;
        }
    }

    async deleteCategory(id: number): Promise<boolean> {
        try {
            console.log("Checking dependencies before deleting category: " + id);
            
            // Check if the category is referenced in 'article'
            const checkQuery = "SELECT COUNT(*) as count FROM article WHERE id_category = ?";
            const [rows]: any = await pool.execute(checkQuery, [id]);
            
            if (rows[0].count > 0) {
                console.warn(`Cannot delete category ${id}, it is referenced in articles.`);
                return false; // Prevent deletion
            }
    
            // Proceed with deletion
            const deleteQuery = "DELETE FROM category WHERE id = ?";
            const [result] = await pool.execute(deleteQuery, [id]);
    
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting category with ID ${id}:`, error);
            return false;
        }
    }

    async getCategoryIdByName(name: string): Promise<number> {
        try {
            const query = "SELECT id FROM category WHERE name_cat = ? ORDER BY name_cat DESC;";
            const [rows] = await pool.query(query, [name]);
            const result = rows as { id: number }[];
            return result.length ? result[0].id : -1;
        } catch (error) {
            console.error(`Error getting category ID by name ${name}:`, error);
            return -1;
        }
    }
}
