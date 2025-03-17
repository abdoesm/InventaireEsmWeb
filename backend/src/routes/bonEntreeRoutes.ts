import { Router } from "express";
import {
    getAllBonEntrees,
    getBonEntreeById,
    createBonEntree,
    deleteBonEntree,
    updateBonEntree,
    addEntree,
    getEntreesByBonEntreeId
} from "../controllers/bonEntreeController";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.get("/", getAllBonEntrees);
router.get("/:id", getBonEntreeById);
router.post("/", verifyToken,createBonEntree);
router.delete("/:id", verifyToken,deleteBonEntree);
router.put("/:id", verifyToken, updateBonEntree);


// New routes for Entree management
router.post("/entree", verifyToken, addEntree);
router.get("/entree/:idBe", getEntreesByBonEntreeId);

export default router;
