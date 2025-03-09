import { Request, Response } from "express";

import UserModel from "../models/UserModel";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.getUsers(); // ✅ Corrected method name
    res.status(200).json(users);
  
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role } = req.body;
     const newUser = await UserModel.addUser(username, password, role);
    res.status(201).json({ message: "User created successfully", success: newUser });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.id); // ✅ Ensure ID is a number
    const { username, role, password } = req.body;
    const updatedUser = await UserModel.updateUser(userId, username, role, password);

    res.status(200).json({ message: "User updated successfully", success: updatedUser });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.id); // ✅ Ensure ID is a number
    await UserModel.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};



  export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      console.info("🔵 loginUser started", req.body);
  
      const { username, password } = req.body;
      const response = await UserModel.validateLogin(username, password);
  
      console.info("✅ Login successful:", response);
  
      res.status(200).json(response);
    } catch (error) {
      console.error("❌ Login failed:", error);
  
      res.status(401).json({ message: "Invalid credentials", error: (error as Error).message });
    }
  };
  



  