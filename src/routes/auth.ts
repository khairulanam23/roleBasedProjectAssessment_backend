import { Router } from "express";
import { login, invite, registerViaInvite, getInvites } from "../controllers/auth";
import authMiddleware from "../middlewares/auth";
import roleMiddleware from "../middlewares/role";

const router = Router();

router.post("/login", login);
router.post("/invite", authMiddleware, roleMiddleware(["ADMIN"]), invite);
router.get('/invites', authMiddleware, roleMiddleware(['ADMIN']), getInvites);
router.post("/register-via-invite", registerViaInvite);

export default router;
