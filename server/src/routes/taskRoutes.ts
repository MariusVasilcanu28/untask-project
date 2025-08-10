import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
} from "../controllers/taskController";

const router = Router();

// Get
router.get("/", getTasks);

// Post
router.post("/", createTask);

// Patch
router.patch("/:taskId/status", updateTaskStatus);

export default router;
