import { Request, Response } from 'express';
import { CodeGuideService } from '../services/codeGuideService';
import { UUID } from 'crypto';
import { CreateGuideRequest, UpdateGuideRequest } from '../types';

export class CodeGuideController {
  static async getGuides(req: Request, res: Response) {
    try {
      const { search, category, code_language, sortBy } = req.query;

      const guides = await CodeGuideService.getGuides({
        search: search as string,
        category: category as string,
        code_language: code_language as string,
        order: sortBy as 'asc' | 'desc'
      });

      res.json({
        success: true,
        data: guides
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch guides',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getGuideById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const guide = await CodeGuideService.getGuideById(id);

      res.json({
        success: true,
        data: guide
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Guide not found',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

    static async getGuideByAuthorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const guide = await CodeGuideService.getGuideByAuthorId(id);

      res.json({
        success: true,
        data: guide
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Guide not found',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async createGuide(req: Request, res: Response) {
    try {
      const guideRequest: CreateGuideRequest = req.body;
      const authorId = req.user!.id as UUID;

      const token = req.headers.authorization?.split(' ')[1];
      
      const guide = await CodeGuideService.createGuide(guideRequest, token!, authorId);

      res.status(201).json({
        success: true,
        data: guide
      });
    } catch (error) {
      console.log(error, 'create guide error');
      res.status(400).json({
        success: false,
        message: 'Failed to create guide',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async updateGuide(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const guideRequest: UpdateGuideRequest = req.body;
      const token = req.headers.authorization?.split(' ')[1];
      
      const guide = await CodeGuideService.updateGuide(id, guideRequest, token!);

      res.json({
        success: true,
        data: guide
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to update guide',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async deleteGuide(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization?.split(' ')[1];
      
      await CodeGuideService.deleteGuide(id, token!);

      res.json({
        success: true,
        message: 'Guide deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to delete guide',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async getStepsByGuideId(req: Request, res: Response) {
    try {
      const { guideId } = req.params;
      const steps = await CodeGuideService.getStepsByGuideId(guideId);

      res.json({
        success: true,
        data: steps
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch steps',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async createStep(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const step = await CodeGuideService.createStep(req.body, token!);

      res.status(201).json({
        success: true,
        data: step
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to create step',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async updateStep(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization?.split(' ')[1];
      const step = await CodeGuideService.updateStep(id, req.body, token!);

      res.json({
        success: true,
        data: step
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to update step',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async deleteStep(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization?.split(' ')[1];
      await CodeGuideService.deleteStep(id, token!);

      res.json({
        success: true,
        message: 'Step deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to delete step',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}