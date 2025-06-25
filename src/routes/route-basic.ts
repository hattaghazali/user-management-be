import { Router } from "express";
import { getListOfUsers } from "../controllers/controller-basic";

// START BASIC ROUTING
const router: Router = Router();

router.get("/list-users", getListOfUsers);

export default router;
