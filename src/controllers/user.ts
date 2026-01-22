import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User";
import { AuthRequest } from "../middlewares/auth"; // Make sure this is imported (from auth.ts)

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .select("-password -__v")
      .lean(); // faster, plain JS objects

    const total = await User.countDocuments();

    res.status(200).json({ users, total, page, limit });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

export const updateRole = [
  body("role").isIn(["ADMIN", "MANAGER", "STAFF"]).withMessage("Invalid role"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { role } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true },
      ).select("-password -__v");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (err) {
      console.error("Error updating role:", err);
      res.status(500).json({ message: "Server error while updating role" });
    }
  },
];

export const updateStatus = [
  body("status").isIn(["ACTIVE", "INACTIVE"]).withMessage("Invalid status"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { status } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true },
      ).select("-password -__v");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (err) {
      console.error("Error updating status:", err);
      res.status(500).json({ message: "Server error while updating status" });
    }
  },
];

// NEW: Get current authenticated user (used by frontend)
export const getSelf = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - no user ID" });
    }

    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching self:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching user profile" });
  }
};
