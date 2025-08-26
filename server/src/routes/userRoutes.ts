import { Router } from "express";
import { getUsers, postUser } from "../controllers/userController";

const router = Router();

// Get
router.get("/", getUsers);

// Post
router.post("/create-user", postUser);
export default router;
