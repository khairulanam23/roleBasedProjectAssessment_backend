import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import Project from "../models/Project";
import { AuthRequest } from "../middlewares/auth";

export const createProject = [
  body("name").notEmpty().withMessage("Name required"),
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, description } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const project = new Project({ name, description, createdBy: req.user.id });
    await project.save();
    res.status(201).json(project);
  },
];

export const getProjects = async (req: Request, res: Response) => {
  const projects = await Project.find({ isDeleted: false })
    .select("-__v")
    .populate("createdBy", "name email")
    .lean();
  res.json(projects);
};

export const updateProject = [
  body("name").optional().notEmpty().withMessage("Name required if provided"),
  body("description").optional(),
  body("status")
    .optional()
    .isIn(["ACTIVE", "ARCHIVED", "DELETED"])
    .withMessage("Invalid status"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date() };
    const project = await Project.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updates,
      { new: true, runValidators: true },
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  },
];

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await Project.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, status: "DELETED", updatedAt: new Date() },
    { new: true },
  );
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json({ message: "Project soft deleted" });
};
