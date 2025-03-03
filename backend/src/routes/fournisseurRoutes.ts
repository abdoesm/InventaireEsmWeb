import express from "express";
import { 
    getFournisseurIdByName, 
    getFournisseurById, 
    addFournisseur, 
    updateFournisseur, 
    deleteFournisseur, 
    getFournisseurs
} from "../controllers/fournisseurController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// ✅ Fournisseur Routes
router.get("/api/fournisseurs", getFournisseurs);
router.get("/api/fournisseurs/:id", getFournisseurById);
router.get("/api/fournisseurs/name/:name", getFournisseurIdByName);
router.post("/api/fournisseurs", verifyToken, addFournisseur);
router.put("/api/fournisseurs/:id", verifyToken, updateFournisseur);
router.delete("/api/fournisseurs/:id", verifyToken, deleteFournisseur);

export default router;
