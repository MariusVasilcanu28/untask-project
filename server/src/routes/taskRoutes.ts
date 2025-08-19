import { Router } from "express";
import {
  createTask,
  getTasks,
  getUserTasks,
  updateTaskStatus,
} from "../controllers/taskController";

const router = Router();

// Get
router.get("/", getTasks);
router.get("/user/:userId", getUserTasks);

// Post
router.post("/", createTask);

// Patch
router.patch("/:taskId/status", updateTaskStatus);

export default router;
