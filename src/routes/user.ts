import { Router } from "express";
import { getUsers, updateRole, updateStatus } from "../controllers/user";
import authMiddleware from "../middlewares/auth";
import roleMiddleware from "../middlewares/role";

const router = Router();

router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), getUsers);
router.patch(
  "/:id/role",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  updateRole,
);
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  updateStatus,
);

export default router;
