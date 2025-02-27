import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { loginUser, getUsers, addUser, updateUser, deleteUser } from "./controllers/userController";
import  {verifyToken} from "./middleware/auth"; 
import { backupDatabase } from "./controllers/backupController";

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
