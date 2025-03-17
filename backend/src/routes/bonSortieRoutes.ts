import express from "express";
import { 
    createBonSortie, 
    getAllBonSorties, 
    getBonSortieById, 
    updateBonSortie, 
    addSortie, 
    getSortiesByBonSortieId, 
    deleteBonSortie 
} from "../controllers/bonSortieController";

const router = express.Router();

// Routes pour les bons de sortie
router.get("/", getAllBonSorties);
router.get("/:id", getBonSortieById);
router.post("/", createBonSortie);
router.put("/:id", updateBonSortie);
router.delete("/:id", deleteBonSortie);

// Routes pour les sorties associées à un bon de sortie
router.post("/sortie", addSortie);
router.get("/sortie/:idBs", getSortiesByBonSortieId);

export default router;
