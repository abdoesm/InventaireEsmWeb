import { Router } from "express";
import {
    getAllBonRetours,
    getBonRetourById,
    createBonRetour,

    addRetour,
    getRetoursByBonRetourId,
    updateBonRetour,
    deleteBonRetour
} from "../controllers/bonRetourController";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.get("/", getAllBonRetours);
router.get("/:id", getBonRetourById);
router.post("/", verifyToken, createBonRetour);
router.delete("/:id", verifyToken, deleteBonRetour);
router.put("/:id", verifyToken, updateBonRetour);

// New routes for Retour management
router.post("/retour", verifyToken, addRetour);
router.get("/retour/:idBr", getRetoursByBonRetourId);

export default router;
