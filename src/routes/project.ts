import { Router } from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/project";
import authMiddleware from "../middlewares/auth";
import roleMiddleware from "../middlewares/role";

const router = Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.patch("/:id", authMiddleware, roleMiddleware(["ADMIN"]), updateProject);
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), deleteProject);

export default router;