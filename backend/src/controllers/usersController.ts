import { Request, Response } from 'express';
import { UserService } from '../services/usersService';

export class UsersController {
  static async getUsers(req: Request, res: Response) {
    try {
      const { search, sortBy } = req.query;

      const users = await UserService.getUsers({
        search: search as string,
        order: sortBy as 'asc' | 'desc'
      });

      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'user not found',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}