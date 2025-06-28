import { supabase } from '../config/supabase';
import { User } from '../types';

export class UserService {

  static async getUsers(filters: {
    search?: string;
    category?: string;
    code_language?: string;
    order?: 'asc' | 'desc';
  }): Promise<User[]> {
    let query = supabase
      .from('users')
      .select(`*`);

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%`);
    }

    query = query.order('created_at', { ascending: filters.order === 'asc' });

    const { data, error } = await query;

    if (error) throw error;

    return data;
  }

  static async getUserById(id: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select(`*`)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data
    };
  }

}