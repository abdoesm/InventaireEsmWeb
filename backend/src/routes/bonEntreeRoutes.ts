import { Router } from "express";
import {
    getAllBonEntrees,
    getBonEntreeById,
    createBonEntree,
    deleteBonEntree,
    addEntree,
    getEntreesByBonEntreeId
} from "../controllers/BonEntreeController";

const router = Router();

router.get("/", getAllBonEntrees);
router.get("/:id", getBonEntreeById);
router.post("/", createBonEntree);
router.delete("/:id", deleteBonEntree);

// New routes for Entree management
router.post("/entree", addEntree);
router.get("/entree/:idBe", getEntreesByBonEntreeId);

export default router;
