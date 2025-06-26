import { createClient } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { Guide, Step } from '../types';

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
  }) {
    let query = supabase
      .from('guides')
      .select('*');

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

    console.log(error, 'err')

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

  static async createGuide(guide: Guide, userToken: string) {
    const userSupabase = this.createUserClient(userToken);

    const { data, error } = await userSupabase
      .from('guides')
      .insert(guide)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateGuide(id: string, guide: Partial<Guide>, userToken: string) {
    const userSupabase = this.createUserClient(userToken);

    const { data, error } = await userSupabase
      .from('guides')
      .update(guide)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteGuide(id: string, userToken: string) {
    const userSupabase = this.createUserClient(userToken);

    const { error } = await userSupabase
      .from('guides')
      .delete()
      .eq('id', id);

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

  static async createStep(step: Step, userToken: string) {
    const userSupabase = this.createUserClient(userToken);

    console.log(step, 'stepunia')
    const { data, error } = await userSupabase
      .from('steps')
      .insert(step)
      .select()
      .single();

    console.log(error)
    if (error) throw error;
    return data;
  }

  static async updateStep(id: string, step: Partial<Step>, userToken: string) {
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

  static async deleteStep(id: string, userToken: string) {
    const userSupabase = this.createUserClient(userToken);

    const { error } = await userSupabase
      .from('steps')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}