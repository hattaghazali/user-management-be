import { NextFunction, Request, Response } from "express";
import { User } from "../models/users";

const getListOfUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    if (users) {
      res.status(200).json(users);
      return;
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: `Error of getListOfUsers: ${error.message}`,
      });
      return;
    }
  }
};

export { getListOfUsers };
