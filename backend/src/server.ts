import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fournisseurRoutes from "./routes/fournisseurRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import articleRoutes  from "./routes/articleRoutes";
import userRoutes   from   "./routes/userRoutes"
import  {verifyToken} from "./middleware/auth"; 
import { backupDatabase } from "./controllers/backupController";
import emplyerRoutes from "./routes/emplyerRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import { loginUser } from "./controllers/userController";
import localisationRoutes from "./routes/localisationRoutes";
import bonEntreeRoutes from "./routes/bonEntreeRoutes";
import bonSortieRoutes from "./routes/bonSortieRoutes";
import bonRetourRoutes from "./routes/bonRetourRoutes";
import InventaireItemRoutes from "./routes/InventaireItemRoutes";
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

app.use('/api/users',userRoutes);
app.use('/api/articles',articleRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/employers',emplyerRoutes);
app.use('/api/fournisseurs',fournisseurRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/localisations", localisationRoutes);
app.use("/api/bonentrees",bonEntreeRoutes);
app.use("/api/bonsorties",bonSortieRoutes);
app.use("/api/bonretours",bonRetourRoutes);
app.use("/api/inventaire",InventaireItemRoutes);
app.get("/api/backup", verifyToken, backupDatabase);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
