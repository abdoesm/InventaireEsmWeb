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

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Debugging Middleware (Log Requests)
app.use((req, res, next) => {
  console.log(`🔹 ${req.method} Request to ${req.url}`);
  next();
});


app.use(userRoutes);
app.use(articleRoutes);
app.use(categoryRoutes);
app.use(emplyerRoutes);
app.use(fournisseurRoutes);
app.use("/api/services", serviceRoutes);

app.get("/api/backup", verifyToken, backupDatabase);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
