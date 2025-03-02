import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { loginUser, getUsers, addUser, updateUser, deleteUser } from "./controllers/userController";
import  {verifyToken} from "./middleware/auth"; 
import { backupDatabase } from "./controllers/backupController";
import { getAllArticlesNames, getArticles, getArticleById, addArticle, addArticles, updateArticle, deleteArticle, getArticleIdByName, getTotalQuantityByArticleId, getTotalQuantitiesByArticle } from "./controllers/articleController";
import { addCategory, deleteCategory, getCategories, getCategoryById,  updateCategory } from "./controllers/categoryController";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Debugging Middleware (Log Requests)
app.use((req, res, next) => {
  console.log(`🔹 ${req.method} Request to ${req.url}`);
  next();
});

// ✅ Authentication Route
app.post("/api/login", loginUser);

// ✅ Protected Route (Requires Auth)
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ success: true, message: "Access granted", user: req.user });
});

// ✅ User Routes
app.get("/api/users", getUsers);
app.post("/api/users", verifyToken, addUser);
app.put("/api/users/:id", verifyToken, updateUser);
app.delete("/api/users/:id", verifyToken, deleteUser);

// ✅ Backup Route
app.get("/api/backup", verifyToken, backupDatabase);

// ✅ Article Routes
app.get("/api/articles/names", getAllArticlesNames);
app.get("/api/articles", getArticles);
app.get("/api/articles/:id", getArticleById);
app.post("/api/articles", verifyToken, addArticle);
app.post("/api/articles/bulk", verifyToken, addArticles);
app.put("/api/articles/:id", verifyToken, updateArticle);
app.delete("/api/articles/:id", verifyToken, deleteArticle);
app.get("/api/articles/name/:name", getArticleIdByName);
app.get("/api/articles/quantity/:id", getTotalQuantityByArticleId);
app.get("/api/articles/quantities", getTotalQuantitiesByArticle);

app.get("/api/categories", getCategories);
app.post("/api/categories", verifyToken, addCategory);
app.put("/api/categories/:id", verifyToken, updateCategory);
app.delete("/api/categories/:id", verifyToken, deleteCategory);
app.get("/api/categories/:id", getCategoryById);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
