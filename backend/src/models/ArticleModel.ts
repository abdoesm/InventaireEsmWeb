import { ResultSetHeader } from "mysql2";
import pool from "../config/db";

interface Article {
    id?: number;
    name: string;
    unite: string;
    remarque: string;
    description: string;
    idCategory: number;
    minQuantity: number;
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
                article.idCategory,
                article.minQuantity,
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
            const values = articles.map((a) => [a.name, a.unite, a.remarque, a.description, a.idCategory, a.minQuantity]);
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
                idCategory: article.idCategory ?? null,
                minQuantity: article.minQuantity ?? null,
                id: article.id
            };
    
            const query = `UPDATE article SET name = ?, unite = ?, remarque = ?, description = ?, id_category = ?, min_quantity = ? WHERE id = ?`;
            const [result] = await pool.execute(query, [
                safeArticle.name,
                safeArticle.unite,
                safeArticle.remarque,
                safeArticle.description,
                safeArticle.idCategory,
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
                    COALESCE(SUM(e.quantity), 0) AS total_entree,
                    COALESCE(SUM(s.quantity), 0) AS total_sortie,
                    COALESCE(SUM(r.quantity), 0) AS total_retour,
                    COALESCE(SUM(CASE WHEN sa.adjustment_type = 'increase' THEN sa.quantity ELSE 0 END), 0) -
                    COALESCE(SUM(CASE WHEN sa.adjustment_type = 'decrease' THEN sa.quantity ELSE 0 END), 0) AS net_adjustment,
                    
                    -- Calculate final stock directly in the query
                    (COALESCE(SUM(e.quantity), 0) 
                    - COALESCE(SUM(s.quantity), 0) 
                    + COALESCE(SUM(r.quantity), 0) 
                    + (COALESCE(SUM(CASE WHEN sa.adjustment_type = 'increase' THEN sa.quantity ELSE 0 END), 0) 
                       - COALESCE(SUM(CASE WHEN sa.adjustment_type = 'decrease' THEN sa.quantity ELSE 0 END), 0))) AS total_quantity
    
                FROM article a
                LEFT JOIN entree e ON e.id_article = a.id
                LEFT JOIN sortie s ON s.id_article = a.id
                LEFT JOIN retour r ON r.id_article = a.id
                LEFT JOIN stock_adjustment sa ON sa.article_id = a.id
                GROUP BY a.id
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

