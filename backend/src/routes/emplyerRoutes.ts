import express from "express";

import { verifyToken } from "../middleware/auth";
import { getAllEmployers, getEmployerById, createEmployer, updateEmployer, deleteEmployer } from "../controllers/employerController";

const router = express.Router();

router.get("/api/employers", getAllEmployers);
router.get("/api/employers/:id", getEmployerById);
router.post("/api/employers", verifyToken, createEmployer);
router.put("/api/employers/:id", verifyToken, updateEmployer);
router.delete("/api/employers/:id", verifyToken, deleteEmployer);
export default router;
