import express from "express";
import {
    getInventaireItems,
    getInventaireItemById,
    addInventaireItem,
    updateInventaireItem,
    deleteInventaireItem
} from "../controllers/InventaireItemController";

const router = express.Router();

// Route to get all inventaire items
router.get("/", getInventaireItems);

// Route to get a single inventaire item by ID
router.get("/:id", getInventaireItemById);

// Route to add a new inventaire item
router.post("/", addInventaireItem);

// Route to update an existing inventaire item
router.put("/:id", updateInventaireItem);

// Route to delete an inventaire item
router.delete("/:id", deleteInventaireItem);

export default router;
