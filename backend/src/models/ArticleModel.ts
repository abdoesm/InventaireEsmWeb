import { ResultSetHeader } from "mysql2";
import pool from "../config/db";
import { format } from 'date-fns';
interface Article {
    id?: number;
    name: string;
    unite: string;
    remarque: string;
    description: string;
    id_category: number;
    min_quantity: number;
}
export interface Adjustement {
    id: number;
    article_id: number;
    user_id: number;  // optional if user_id is not always present
    adjustment_date: string;  // ISO format like "2024-04-07"
    quantity: number;
    adjustment_type: "ADD" | "REMOVE" | "UPDATE";  // optional union type (if consistent)
  }
  

export class ArticleModel {
    async getAllArticlesNames(): Promise<string[]> {
        try {
            const query = "SELECT name FROM article ORDER BY name DESC;";
            const [rows] = await pool.query(query);
            return (rows as any[]).map((row) => row.name);
        } catch (error) {
            console.error("Error fetching article names:", error);
            return [];
        }
    }

    async getArticles(): Promise<Article[]> {
        try {
            const query = "SELECT id, name, unite, remarque, description, id_category, last_edited, min_quantity FROM article ORDER BY last_edited DESC;";
            const [rows] = await pool.query(query);
            return rows as Article[];
        } catch (error) {
            console.error("Error fetching articles:", error);
            return [];
        }
    }
   
     
    
    async getAdjustments(): Promise<Adjustement[]> {
        try {
            console.log("getAdjustments model")
            const query = `
                SELECT 
                    id,
                    article_id, 
                    adjustment_type, 
                    quantity, 
                    adjustment_date 
                FROM stock_adjustment 
                ORDER BY adjustment_date DESC;
            `;
            
            const [rows] = await pool.query(query);
    
            // Ensure rows are returned correctly, as the type definition might not match
            if (Array.isArray(rows)) {
                return rows as Adjustement[];  // Cast to Adjustement[] type
            }
    
            throw new Error("Unexpected database response");  // If rows is not an array, throw an error
        } catch (error) {
            console.error("Error fetching adjustments:", error);
            throw new Error("Database query failed");  // Throwing a custom error for easier handling
        }
    }
    

    async getArticleById(id: number): Promise<Article | null> {
        if (!id || isNaN(id)) {
            console.error("Invalid article ID received:", id);
            return null;
        }
    
        try {
            console.log("Fetching article with id:", id);
            const query = "SELECT * FROM article WHERE id = ?";
            const [rows] = await pool.query(query, [id]);
    
            console.log("Query Result:", rows); // 🔍 Add this debug log
    
            return (rows as Article[]).length ? (rows as Article[])[0] : null;
        } catch (error) {
            console.error(`Error fetching article with ID ${id}:`, error);
            return null;
        }
    }
    
    

    async addArticle(article: Article): Promise<boolean> {
        try {
            const query = "INSERT INTO article (name, unite, remarque, description, id_category, min_quantity) VALUES (?, ?, ?, ?, ?, ?)";
            const [result] = await pool.execute(query, [
                article.name,
                article.unite,
                article.remarque,
                article.description,
                article.id_category,
                article.min_quantity,
            ]);
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error adding article:", error);
            return false;
        }
    }

    async addArticles(articles: Article[]): Promise<boolean> {
        if (articles.length === 0) return false;
        try {
            const query = "INSERT INTO article (name, unite, remarque, description, id_category, min_quantity) VALUES ?";
            const values = articles.map((a) => [a.name, a.unite, a.remarque, a.description, a.id_category, a.min_quantity]);
            const [result] = await pool.query(query, [values]);
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error adding multiple articles:", error);
            return false;
        }
    }

    async updateArticle(article: Article): Promise<boolean> {
        try {
            console.log("Updating article:", article);
    
            // Ensure all properties are defined
            const safeArticle = {
                name: article.name ?? null,
                unite: article.unite ?? null,
                remarque: article.remarque ?? null,
                description: article.description ?? null,
                id_category: article.id_category ?? null,
                minQuantity: article.min_quantity ?? null,
                id: article.id
            };
    
            const query = `UPDATE article SET name = ?, unite = ?, remarque = ?, description = ?, id_category = ?, min_quantity = ? WHERE id = ?`;
            const [result] = await pool.execute(query, [
                safeArticle.name,
                safeArticle.unite,
                safeArticle.remarque,
                safeArticle.description,
                safeArticle.id_category,
                safeArticle.minQuantity,
                safeArticle.id,
            ]);
    
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error updating article:", error);
            return false;
        }
    }
    
    async deleteArticle(id: number): Promise<boolean> {
        try {
            console.log("Checking dependencies before deleting article: " + id);
            
            // Check if the article is referenced in 'entree'
            const checkQuery = "SELECT COUNT(*) as count FROM entree WHERE id_article = ?";
            const [rows]: any = await pool.execute(checkQuery, [id]);
            
            if (rows[0].count > 0) {
                console.warn(`Cannot delete article ${id}, it is referenced in entree.`);
                return false; // Prevent deletion
            }
    
            // Proceed with deletion
            const deleteQuery = "DELETE FROM article WHERE id = ?";
            const [result] = await pool.execute(deleteQuery, [id]);
    
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error(`Error deleting article with ID ${id}:`, error);
            return false;
        }
    }
    

    async getArticleIdByName(name: string): Promise<number> {
        try {
            const query = "SELECT id FROM article WHERE name = ?";
            const [rows] = await pool.query(query, [name]);
            const result = rows as { id: number }[];
            return result.length ? result[0].id : -1;
        } catch (error) {
            console.error(`Error getting article ID by name ${name}:`, error);
            return -1;
        }
    }

    async getTotalAdjustmentByArticleId(articleId: number): Promise<number> {
        try {
            const query = `
                SELECT 
                    COALESCE(SUM(CASE WHEN adjustment_type = 'increase' THEN quantity ELSE 0 END), 0) - 
                    COALESCE(SUM(CASE WHEN adjustment_type = 'decrease' THEN quantity ELSE 0 END), 0) 
                    AS net_adjustment 
                FROM stock_adjustment 
                WHERE article_id = ?`;
            
            const [rows] = await pool.query(query, [articleId]);
            const result = rows as { net_adjustment: number }[];
            return result[0]?.net_adjustment || 0;
        } catch (error) {
            console.error(`Error fetching total adjustment quantity for article ${articleId}:`, error);
            return 0;
        }
    }

    async addAdjustment(adjustment: Adjustement): Promise<boolean> {
        try {
            console.log("Adding adjustment:", adjustment);
            const query = `
                INSERT INTO stock_adjustment (article_id, adjustment_date,user_id, quantity, adjustment_type) 
                VALUES (?, ?, ?,?, ?)`;
            const [result] = await pool.execute(query, [
                adjustment.article_id,
                adjustment.adjustment_date,
                adjustment.user_id,
                adjustment.quantity,
                adjustment.adjustment_type,
            ]);
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error adding adjustment:", error);
            return false;
        }
    }

    async updateAdjustment(adjustment: Adjustement): Promise<boolean> {
        try {
              const formattedDate = adjustment.adjustment_date
                            ? format(new Date(adjustment.adjustment_date), 'yyyy-MM-dd HH:mm:ss')
                            : null;
            console.log("Updating adjustment:", adjustment);
            const query = `
                UPDATE stock_adjustment 
                SET article_id = ?, 
                    adjustment_date = ?, 
                    user_id = ?, 
                    quantity = ?, 
                    adjustment_type = ?
                WHERE id = ?`;
    
            const [result] = await pool.execute(query, [
                adjustment.article_id,
                formattedDate, // Use the formatted date
                adjustment.user_id,
                adjustment.quantity,
                adjustment.adjustment_type,
                adjustment.id, // Don't forget the ID for WHERE condition
            ]);
    
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error updating adjustment:", error);
            return false;
        }
    }

    
    async deleteAdjustment(id: number): Promise<boolean> {
        try {
            console.log("Deleting adjustment with ID:", id);
            const query = `
                DELETE FROM stock_adjustment
                WHERE id = ?`;
    
            const [result] = await pool.execute(query, [id]);
    
            return (result as ResultSetHeader).affectedRows > 0;
        } catch (error) {
            console.error("Error deleting adjustment:", error);
            return false;
        }
    }
    
    
    async getTotalQuantityByArticleId(articleId: number): Promise<number> {
        try {
            const totalEntree = await this.getTotalEntredQuantityByArticleId(articleId);
            const totalSortie = await this.getTotalSortieQuantityByArticleId(articleId);
            const totalRetour = await this.getTotalRetourQuantityByArticleId(articleId);
            const totalAdjustment = await this.getTotalAdjustmentByArticleId(articleId);
    
            return totalEntree - totalSortie + totalRetour + totalAdjustment;
        } catch (error) {
            console.error(`Error calculating total quantity for article ${articleId}:`, error);
            return 0;
        }
    }
    
    async getTotalEntredQuantityByArticleId(articleId: number): Promise<number> {
        try {
            const query = "SELECT COALESCE(SUM(quantity), 0) AS total_entree FROM entree WHERE id_article = ?";
            const [rows] = await pool.query(query, [articleId]);
            const result = rows as { total_entree: number }[];
            return result[0]?.total_entree || 0;
        } catch (error) {
            console.error(`Error fetching total entered quantity for article ${articleId}:`, error);
            return 0;
        }
    }

    async getTotalSortieQuantityByArticleId(articleId: number): Promise<number> {
        try {
            const query = "SELECT COALESCE(SUM(quantity), 0) AS total_sortie FROM sortie WHERE id_article = ?";
            const [rows] = await pool.query(query, [articleId]);
            const result = rows as { total_sortie: number }[];
            return result[0]?.total_sortie || 0;
        } catch (error) {
            console.error(`Error fetching total sortie quantity for article ${articleId}:`, error);
            return 0;
        }
    }

    async getTotalRetourQuantityByArticleId(articleId: number): Promise<number> {
        try {
            const query = "SELECT COALESCE(SUM(quantity), 0) AS total_retour FROM retour WHERE id_article = ?";
            const [rows] = await pool.query(query, [articleId]);
            const result = rows as { total_retour: number }[];
            return result[0]?.total_retour || 0;
        } catch (error) {
            console.error(`Error fetching total retour quantity for article ${articleId}:`, error);
            return 0;
        }
    }
    async getTotalQuantitiesByArticle(): Promise<{ idArticle: number; totalQuantity: number }[]> {
        try {
            console.log("getTotalQuantitiesByArticle model");
    
            const query = `
               SELECT 
    a.id AS article_id,
    COALESCE(e.total_entree, 0) AS total_entree,
    COALESCE(s.total_sortie, 0) AS total_sortie,
    COALESCE(r.total_retour, 0) AS total_retour,
    COALESCE(sa.increase_qty, 0) - COALESCE(sa.decrease_qty, 0) AS net_adjustment,

    -- Final stock calculation
    (
        COALESCE(e.total_entree, 0)
        - COALESCE(s.total_sortie, 0)
        + COALESCE(r.total_retour, 0)
        + (COALESCE(sa.increase_qty, 0) - COALESCE(sa.decrease_qty, 0))
    ) AS total_quantity

FROM article a
LEFT JOIN (
    SELECT id_article, SUM(quantity) AS total_entree
    FROM entree
    GROUP BY id_article
) e ON e.id_article = a.id

LEFT JOIN (
    SELECT id_article, SUM(quantity) AS total_sortie
    FROM sortie
    GROUP BY id_article
) s ON s.id_article = a.id

LEFT JOIN (
    SELECT id_article, SUM(quantity) AS total_retour
    FROM retour
    GROUP BY id_article
) r ON r.id_article = a.id

LEFT JOIN (
    SELECT 
        article_id,
        SUM(CASE WHEN adjustment_type = 'increase' THEN quantity ELSE 0 END) AS increase_qty,
        SUM(CASE WHEN adjustment_type = 'decrease' THEN quantity ELSE 0 END) AS decrease_qty
    FROM stock_adjustment
    GROUP BY article_id
) sa ON sa.article_id = a.id

ORDER BY total_quantity DESC, a.id ASC;

            `;
    
            const [rows] = await pool.query(query);
            return (rows as { article_id: number; total_quantity: number }[]).map(row => ({
                idArticle: row.article_id,
                totalQuantity: row.total_quantity, // Directly use the calculated total_quantity from SQL
            }));
    
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error fetching total quantities by article:", error.message);
            } else {
                console.error("An unknown error occurred:", error);
            }
            return [];
        }
    }
    
    
    
}

