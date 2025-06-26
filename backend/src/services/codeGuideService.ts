import { supabase } from '../config/supabase';
import { Guide, Step } from '../types';

export class CodeGuideService {
  static async getGuides(filters: {
    search?: string;
    category?: string;
    code_language?: string;
    order?: 'asc' | 'desc';
  }) {
    let query = supabase
      .from('guides')
      .select('*');

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.code_language) {
      query = query.eq('code_language', filters.code_language);
    }

    query = query.order('created_at', { ascending: filters.order === 'asc' });

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  static async getGuideById(id: string) {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createGuide(guide: Guide) {
    const { data, error } = await supabase
      .from('guides')
      .insert(guide)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateGuide(id: string, guide: Partial<Guide>, userId: string) {
    const { data, error } = await supabase
      .from('guides')
      .update(guide)
      .eq('id', id)
      .eq('author_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteGuide(id: string, userId: string) {
    const { error } = await supabase
      .from('guides')
      .delete()
      .eq('id', id)
      .eq('author_id', userId);

    if (error) throw error;
  }

  static async getStepsByGuideId(guideId: string) {
    const { data, error } = await supabase
      .from('steps')
      .select('*')
      .eq('guide_id', guideId)
      .order('step_number');

    if (error) throw error;
    return data;
  }

  static async createStep(step: Step) {
    const { data, error } = await supabase
      .from('steps')
      .insert(step)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateStep(id: string, step: Partial<Step>) {
    const { data, error } = await supabase
      .from('steps')
      .update(step)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteStep(id: string) {
    const { error } = await supabase
      .from('steps')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}