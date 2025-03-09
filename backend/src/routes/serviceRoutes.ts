import express from "express";
import {
    getServices,
    addService,
    updateService,
    deleteService,
    getServiceById,
    getServiceByName,
} from "../controllers/serviceController";

const router = express.Router();

router.get("/", getServices);
router.post("/", addService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);
router.get("/:id", getServiceById);
router.get("/name/:name", getServiceByName);

export default router;