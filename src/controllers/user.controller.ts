import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { errorResponse, successResponse } from "../utils/response";

export class UserController {
  static async getUser(req: Request, res: Response) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.json(successResponse('User fetched successfully', user));
    } catch (error) {
      res.status(404).json(errorResponse('User not found', error));
    }
  }
}