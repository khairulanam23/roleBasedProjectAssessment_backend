import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User";
import Invite from "../models/Invite";

export const login = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password required"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // CRITICAL FIX: We NEED the password → use +password to force include
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== "ACTIVE") {
      return res.status(401).json({ message: "Account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }, // increased for better UX
    );

    return res.json({ token });
  },
];

export const invite = [
  body("email").isEmail().withMessage("Invalid email"),
  body("role").isIn(["ADMIN", "MANAGER", "STAFF"]).withMessage("Invalid role"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, role } = req.body;

    // Prevent duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "A user with this email already exists" });
    }

    // Prevent multiple active invites
    const existingInvite = await Invite.findOne({
      email,
      acceptedAt: null,
      expiresAt: { $gt: new Date() },
    });
    if (existingInvite) {
      return res
        .status(409)
        .json({ message: "An active invite already exists for this email" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const invite = new Invite({ email, role, token, expiresAt });
    await invite.save();

    // SIMULATED EMAIL (as allowed by task)
    console.log(
      `\nINVITE LINK → http://localhost:3000/register?token=${token}\n`,
    );

    return res.status(201).json({
      message: "Invite created successfully",
      inviteLink: `http://localhost:3000/register?token=${token}`, // optional for testing
    });
  },
];

export const registerViaInvite = [
  body("token").notEmpty().withMessage("Token required"),
  body("name").trim().notEmpty().withMessage("Name required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, name, password } = req.body;

    const invite = await Invite.findOne({ token });
    if (!invite || invite.acceptedAt || invite.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "Invalid or expired invite token" });
    }

    const existingUser = await User.findOne({ email: invite.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email: invite.email,
      password: hashedPassword,
      role: invite.role,
      invitedAt: new Date(),
      status: "ACTIVE",
    });

    await user.save();

    // Mark invite as accepted
    invite.acceptedAt = new Date();
    await invite.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  },
];
