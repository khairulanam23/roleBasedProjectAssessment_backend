import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

const roleMiddleware =
  (roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };

export default roleMiddleware;
