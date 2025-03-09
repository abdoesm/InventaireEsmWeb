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
router.get("/", getFournisseurs);
router.get("/:id", getFournisseurById);
router.get("/:name", getFournisseurIdByName);
router.post("/", verifyToken, addFournisseur);
router.put("/:id", verifyToken, updateFournisseur);
router.delete("/:id", verifyToken, deleteFournisseur);

export default router;
