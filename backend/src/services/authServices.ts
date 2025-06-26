import { supabase } from '../config/supabase';
import { UserExtraData, TempSignup, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  static async storeTempSignupData(email: string, extraData: UserExtraData): Promise<string> {
    const tempId = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const { error } = await supabase
      .from('temp_signups')
      .insert({
        id: tempId,
        email: email.toLowerCase(),
        extra_data: extraData,
        expires_at: expiresAt.toISOString()
      });

    if (error) {
      throw new Error(`Failed to store temporary data: ${error.message}`);
    }

    return tempId;
  }

  static async sendMagicLink(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new Error(`Failed to send magic link: ${error.message}`);
    }
  }

  static async loginSupabase(email: string, password: string): Promise<string> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
    return data.session.access_token;
  }

  static async verifyMagicLink(token: string, type: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as any
    });

    if (error) {
      throw new Error(`Failed to verify magic link: ${error.message}`);
    }

    return data;
  }

  static async getTempSignupData(email: string): Promise<TempSignup | null> {
    const { data, error } = await supabase
      .from('temp_signups')
      .select('*')
      .eq('email', email.toLowerCase())
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get temporary data: ${error.message}`);
    }

    return data;
  }

  static async createUserProfile(authUserId: string, email: string, extraData: UserExtraData): Promise<User> {
    const userData = {
      id: authUserId,
      email: email.toLowerCase(),
      name: extraData.name,
      profession: extraData.profession,
      profile_picture: extraData.profilePicture,
      bio: extraData.bio
    };

    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user profile: ${error.message}`);
    }

    return data;
  }

  static async cleanupTempData(email: string): Promise<void> {
    const { error } = await supabase
      .from('temp_signups')
      .delete()
      .eq('email', email.toLowerCase());

    if (error) {
      console.error('Failed to cleanup temp data:', error.message);
    }
  }

  static async cleanupExpiredTempData(): Promise<void> {
    const { error } = await supabase
      .from('temp_signups')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Failed to cleanup expired temp data:', error.message);
    }
  }

  static async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }

    return data;
  }

  static async getUserByAuthId(authUserId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUserId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get user by auth ID: ${error.message}`);
    }

    return data;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }

    return data;
  }
}