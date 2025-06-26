import { Request, Response } from 'express';
import { CodeGuideService } from '../services/codeGuideService';
import { UUID } from 'crypto';

export class CodeGuideController {
  static async getGuides(req: Request, res: Response) {
    try {
      const { search, category, code_language, order = 'desc' } = req.query;

      const guides = await CodeGuideService.getGuides({
        search: search as string,
        category: category as string,
        code_language: code_language as string,
        order: order as 'asc' | 'desc'
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

static async createGuide(req: Request, res: Response) {
  try {
    const guideData = {
      ...req.body,
      author_id: req.user!.id as UUID
    };

    // Extract token from authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    const guide = await CodeGuideService.createGuide(guideData, token!);

    res.status(201).json({
      success: true,
      data: guide
    });
  } catch (error) {
    console.log(error, 'errorrrrr')
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
      const guide = await CodeGuideService.updateGuide(id, req.body, req.user!.id);

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
      await CodeGuideService.deleteGuide(id, req.user!.id);

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
      const step = await CodeGuideService.createStep(req.body);

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
      const step = await CodeGuideService.updateStep(id, req.body);

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
      await CodeGuideService.deleteStep(id);

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