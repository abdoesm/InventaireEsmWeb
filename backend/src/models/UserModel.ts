import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserModel {
    

  static async validateLogin(username: string, password: string) {
    const query = "SELECT id, username, password, role FROM user WHERE username = ?";
    const [rows]: any = await pool.execute(query, [username]);
  
    if (rows.length === 0) throw new Error("Invalid username or password");
  
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid username or password");
  
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
  
    return { success: true, token, role: user.role };
  }
  

  static async getUsers() {
    const query = "SELECT id, username, role FROM user ORDER BY id DESC";
    const [rows]: any = await pool.execute(query);
    return rows;
  }

  static async addUser(username: string, password: string, role: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO user (username, password, role) VALUES (?, ?, ?)";
    const [result]: any = await pool.execute(query, [username, hashedPassword, role]);
    return result.affectedRows > 0;
  }

  static async updateUser(id: number, username: string, role: string, password?: string) {
    let query;
    let values;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = "UPDATE user SET username = ?, password = ?, role = ? WHERE id = ?";
      values = [username, hashedPassword, role, id];
    } else {
      query = "UPDATE user SET username = ?, role = ? WHERE id = ?";
      values = [username, role, id];
    }

    const [result]: any = await pool.execute(query, values);
    return result.affectedRows > 0;
  }

  static async deleteUser(id: number) {
    const query = "DELETE FROM user WHERE id = ?";
    const [result]: any = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

export default UserModel;