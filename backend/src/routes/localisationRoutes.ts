import { Router } from "express";
import {
    getAllLocalisations,
    getLocalisationById,
    getLocalisationByNameHandler,
    getLocalisationsByService,
    createLocalisation,
    modifyLocalisation,
    removeLocalisation,
    getLocationNames,
    getLocationIdByName
} from "../controllers/localisationController";

const router = Router();

// Define routes for localisation
router.get("/", getAllLocalisations); // Get all localisations
router.get("/:id", getLocalisationById); // Get a localisation by ID
router.get("/name/:name", getLocalisationByNameHandler); // Get localisation by name
router.get("/service/:serviceId", getLocalisationsByService); // Get localisations by service ID
router.post("/", createLocalisation); // Create a new localisation
router.put("/:id", modifyLocalisation); // Update an existing localisation
router.delete("/:id", removeLocalisation); // Delete a localisation
router.get("/names", getLocationNames); // Get all location names
router.get("/id/:name", getLocationIdByName); // Get location ID by name

export default router;
