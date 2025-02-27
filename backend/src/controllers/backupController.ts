import { Request, Response } from "express";
import mysqldump from "mysqldump";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const backupDatabase = async (req: Request, res: Response) => {
  try {
    const backupPath = path.join(__dirname, "../../backup.sql");

    await mysqldump({
      connection: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "your_database",
      },
      dumpToFile: backupPath,
    });

    res.download(backupPath, "backup.sql", (err) => {
      if (err) {
        console.error("Download failed:", err);
        res.status(500).send("Backup failed");
      }
      fs.unlinkSync(backupPath); // ✅ Delete the file after download
    });
  } catch (error) {
    console.error("Backup error:", error);
    res.status(500).send("Error creating backup");
  }
};
