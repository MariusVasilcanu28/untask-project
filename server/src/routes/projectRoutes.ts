import { Router } from "express";
import { createProject, getProjects } from "../controllers/projectController";

const router = Router();

// Get
router.get("/", getProjects);

// Post
router.post("/", createProject);

export default router;
