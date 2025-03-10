import { Router } from "express";
import {
    getAllBonEntrees,
    getBonEntreeById,
    createBonEntree,
    deleteBonEntree,
    addEntree,
    getEntreesByBonEntreeId
} from "../controllers/bonEntreeController";
<<<<<<< HEAD
=======
import { verifyToken } from "../middleware/auth";
>>>>>>> de1aa7ae52aa018aef01a62aa5b79ec115c8ff93

const router = Router();

router.get("/", getAllBonEntrees);
router.get("/:id", getBonEntreeById);
router.post("/", verifyToken,createBonEntree);
router.delete("/:id", verifyToken,deleteBonEntree);

// New routes for Entree management
router.post("/entree", verifyToken, addEntree);
router.get("/entree/:idBe", getEntreesByBonEntreeId);

export default router;
