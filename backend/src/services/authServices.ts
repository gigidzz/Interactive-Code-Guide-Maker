import { supabase} from '../config/supabase';
import { UserExtraData, TempSignup, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  // Store temporary signup data
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

  // Send magic link for signup
  static async sendMagicLink(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({ email: email, password: password });

    if (error) {
      throw new Error(`Failed to send magic link: ${error.message}`);
    }
  }

  // Send magic link for login (existing users)
  static async loginSupabase(email: string, password: string): Promise<string> {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email, 
      password: password 
    });

    if (error) {
      throw new Error(`Failed to send login magic link: ${error.message}`);
    }

    return data.session.access_token
  }


  // Verify magic link token
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

  // Get temporary signup data
  static async getTempSignupData(email: string): Promise<TempSignup | null> {
    const { data, error } = await supabase
      .from('temp_signups')
      .select('*')
      .eq('email', email.toLowerCase())
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw new Error(`Failed to get temporary data: ${error.message}`);
    }

    return data;
  }

  // Create user profile
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

  // Clean up temporary data
  static async cleanupTempData(email: string): Promise<void> {
    const { error } = await supabase
      .from('temp_signups')
      .delete()
      .eq('email', email.toLowerCase());

    if (error) {
      console.error('Failed to cleanup temp data:', error.message);
    }
  }

  // Clean up expired temporary data (should be run periodically)
  static async cleanupExpiredTempData(): Promise<void> {
    const { error } = await supabase
      .from('temp_signups')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Failed to cleanup expired temp data:', error.message);
    }
  }

  // Get user profile by ID
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

  // Get user profile by email
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

  // Get current authenticated user
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(`Failed to get current user: ${error.message}`);
    }

    return user;
  }

  // Logout user
  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(`Failed to logout: ${error.message}`);
    }
  }

  // Refresh session
  static async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      throw new Error(`Failed to refresh session: ${error.message}`);
    }

    return data;
  }
}