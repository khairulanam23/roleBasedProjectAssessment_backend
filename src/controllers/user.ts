import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User";

export const getUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find({})
    .skip(skip)
    .limit(limit)
    .select("-password -__v")
    .lean(); // faster, plain JS objects
  const total = await User.countDocuments();

  res.json({ users, total, page, limit });
};

export const updateRole = [
  body("role").isIn(["ADMIN", "MANAGER", "STAFF"]).withMessage("Invalid role"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
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
    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  },
];
