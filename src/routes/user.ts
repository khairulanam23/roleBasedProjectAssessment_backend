import { Router } from "express";
import {
  getUsers,
  updateRole,
  updateStatus,
  getSelf,
  deleteUser,
} from "../controllers/user"; // FIXED: added getSelf here
import authMiddleware from "../middlewares/auth";
import roleMiddleware from "../middlewares/role";

const router = Router();

// Admin-only: list all users (paginated)
router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), getUsers);

// Protected: get current authenticated user (used by frontend useAuth hook)
router.get("/self", authMiddleware, getSelf);

// Admin-only: change role
router.patch(
  "/:id/role",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  updateRole,
);

// Admin-only: change status (activate/deactivate)
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  updateStatus,
);

router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteUser);

export default router;
