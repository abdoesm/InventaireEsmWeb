import express from "express";

import { verifyToken } from "../middleware/auth";
import { getAllEmployers, getEmployerById, createEmployer, updateEmployer, deleteEmployer } from "../controllers/employerController";

const router = express.Router();

router.get("/", getAllEmployers);
router.get("/:id", getEmployerById);
router.post("/", verifyToken, createEmployer);
router.put("/:id", verifyToken, updateEmployer);
router.delete("/:id", verifyToken, deleteEmployer);
export default router;
