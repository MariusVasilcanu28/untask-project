import { Router } from "express";
import { getUser, getUsers, postUser } from "../controllers/userController";

const router = Router();

// Get
router.get("/", getUsers);
router.get("/:cognitoId", getUser);

// Post
router.post("/create-user", postUser);

export default router;
