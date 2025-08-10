"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const router = (0, express_1.Router)();
// Get
router.get("/", taskController_1.getTasks);
// Post
router.post("/", taskController_1.createTask);
// Patch
router.patch("/:taskId/status", taskController_1.updateTaskStatus);
exports.default = router;
