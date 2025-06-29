import { createClient } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { Guide, Step, GuideWithStepsAndUser, CreateGuideRequest, UpdateGuideRequest } from '../types';
import { UUID } from 'crypto';

export class CodeGuideService {
  private static createUserClient(userToken: string) {
    return createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      }
    );
  }

  static async getGuides(filters: {
    search?: string;
    category?: string;
    code_language?: string;
    order?: 'asc' | 'desc';
  }): Promise<GuideWithStepsAndUser[]> {
    let query = supabase
      .from('guides')
      .select(`
        *,
        author:users!guides_author_id_fkey(*),
        steps(*)
      `);

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,tags.cs.{"${filters.search}"}`);
    }

    if (filters.category) {
      query = query.eq('category', filters.category.toLowerCase());
    }

    if (filters.code_language) {
      query = query.eq('code_language', filters.code_language.toLowerCase());
    }

    query = query.order('created_at', { ascending: filters.order === 'asc' });

    const { data, error } = await query;

    if (error) throw error;

    return data?.map(guide => ({
      ...guide,
      author: guide.author,
      steps: guide.steps.sort((a: Step, b: Step) => a.step_number - b.step_number)
    })) || [];
  }

  static async getGuideById(id: string): Promise<GuideWithStepsAndUser> {
    const { data, error } = await supabase
      .from('guides')
      .select(`
        *,
        author:users!guides_author_id_fkey(*),
        steps(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      author: data.author,
      steps: data.steps.sort((a: Step, b: Step) => a.step_number - b.step_number)
    };
  }

  static async getGuideByAuthorId(id: string): Promise<GuideWithStepsAndUser[]> {
    const { data, error } = await supabase
      .from('guides')
      .select(`
        *,
        author:users!guides_author_id_fkey(*),
        steps(*)
      `)
      .eq('author_id', id)

    if (error) throw error;

     return data?.map(guide => ({
      ...guide,
      author: guide.author,
      steps: guide.steps.sort((a: Step, b: Step) => a.step_number - b.step_number)
    })) || [];
  }

  static async createGuide(guideRequest: CreateGuideRequest, userToken: string, authorId: UUID): Promise<GuideWithStepsAndUser> {
    const userSupabase = this.createUserClient(userToken);

    try {
      const guideData: Guide = {
        title: guideRequest.title,
        description: guideRequest.description,
        author_id: authorId,
        tags: guideRequest.tags,
        code_snippet: guideRequest.code_snippet,
        code_language: guideRequest.code_language,
        category: guideRequest.category
      };

      const { data: createdGuide, error: guideError } = await userSupabase
        .from('guides')
        .insert(guideData)
        .select()
        .single();

      if (guideError) throw guideError;

      if (guideRequest.steps && guideRequest.steps.length > 0) {
        const stepsData = guideRequest.steps.map(step => ({
          step_number: step.step_number,
          title: step.title,
          description: step.description,
          start_line: step.start_line,
          end_line: step.end_line,
          guide_id: createdGuide.id as UUID
        }));

        const { data: createdSteps, error: stepsError } = await userSupabase
          .from('steps')
          .insert(stepsData)
          .select();

        if (stepsError) {
          throw stepsError;
        }

        const { data: author, error: authorError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authorId)
          .single();

        if (authorError) throw authorError;

        return {
          ...createdGuide,
          author,
          steps: createdSteps.sort((a: Step, b: Step) => a.step_number - b.step_number)
        };
      } else {
        const { data: author, error: authorError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authorId)
          .single();

        if (authorError) throw authorError;

        return {
          ...createdGuide,
          author,
          steps: []
        };
      }
    } catch (error) {
      throw error;
    }
  }

  static async updateGuide(id: string, guideRequest: UpdateGuideRequest, userToken: string): Promise<GuideWithStepsAndUser> {
    const userSupabase = this.createUserClient(userToken);

    try {
      const guideUpdateData = {
        title: guideRequest.title,
        description: guideRequest.description,
        tags: guideRequest.tags,
        code_snippet: guideRequest.code_snippet,
        code_language: guideRequest.code_language,
        category: guideRequest.category
      };

      const cleanedGuideData = Object.fromEntries(
        Object.entries(guideUpdateData).filter(([_, value]) => value !== undefined)
      );

      const { data: updatedGuide, error: guideError } = await userSupabase
        .from('guides')
        .update(cleanedGuideData)
        .eq('id', id)
        .select()
        .single();

      if (guideError) throw guideError;

      if (guideRequest.steps) {
        const { error: deleteError } = await userSupabase
          .from('steps')
          .delete()
          .eq('guide_id', id);

        if (deleteError) throw deleteError;

        if (guideRequest.steps.length > 0) {
          const stepsData = guideRequest.steps.map(step => ({
            title: step.title,
            description: step.description,
            step_number: step.step_number,
            start_line: step.start_line,
            end_line: step.end_line,
            guide_id: id
          }));

          const { data: createdSteps, error: stepsError } = await userSupabase
            .from('steps')
            .insert(stepsData)
            .select();

          if (stepsError) throw stepsError;

          const { data: author, error: authorError } = await supabase
            .from('users')
            .select('*')
            .eq('id', updatedGuide.author_id)
            .single();

          if (authorError) throw authorError;

          return {
            ...updatedGuide,
            author,
            steps: createdSteps.sort((a: Step, b: Step) => a.step_number - b.step_number)
          };
        }
      }

      return await this.getGuideById(id);
    } catch (error) {
      throw error;
    }
  }

  static async deleteGuide(id: string, userToken: string): Promise<void> {
    const userSupabase = this.createUserClient(userToken);

    const { error: stepsError } = await userSupabase
      .from('steps')
      .delete()
      .eq('guide_id', id);

    if (stepsError) throw stepsError;

    const { error: guideError } = await userSupabase
      .from('guides')
      .delete()
      .eq('id', id);

    if (guideError) throw guideError;
  }

  static async getStepsByGuideId(guideId: string): Promise<Step[]> {
    const { data, error } = await supabase
      .from('steps')
      .select('*')
      .eq('guide_id', guideId)
      .order('step_number');

    if (error) throw error;
    return data || [];
  }

  static async createStep(step: Step, userToken: string): Promise<Step> {
    const userSupabase = this.createUserClient(userToken);

    const { data, error } = await userSupabase
      .from('steps')
      .insert(step)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateStep(id: string, step: Partial<Step>, userToken: string): Promise<Step> {
    const userSupabase = this.createUserClient(userToken);

    const { data, error } = await userSupabase
      .from('steps')
      .update(step)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteStep(id: string, userToken: string): Promise<void> {
    const userSupabase = this.createUserClient(userToken);

    const { error } = await userSupabase
      .from('steps')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}