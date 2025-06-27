import { UUID } from "crypto";

export type Guide = {
  id?: string;
  created_at?: string;
  title: string;
  description: string;
  author_id: UUID;
  tags?: string;
  code_snippet?: string;
  code_language?: string;
  category?: string;
};

export interface Step {
  id?: string;
  guide_id?: string;
  step_number: number;
  title: string;
  description: string;
  start_line: number;
  end_line: number;
}

export interface UserExtraData {
  name: string;
  profilePicture?: string;
  bio?: string;
  profession?: string[];
}

export interface TempSignup {
  email: string;
  extra_data: UserExtraData;
  created_at: string;
  expires_at: string;
}

export interface User {
  id?: string;
  email: string;
  name: string;
  profile_picture?: string;
  bio?: string;
  profession?: string[];
}

export interface GuideWithStepsAndUser extends Omit<Guide, 'author_id'> {
  author: User;
  steps: Step[];
}

export interface CreateGuideRequest {
  title: string;
  description: string;
  tags?: string;
  code_snippet?: string;
  code_language?: string;
  category?: string;
  steps: Omit<Step, 'id' | 'guide_id'>[];
}

export interface UpdateGuideRequest {
  title?: string;
  description?: string;
  tags?: string;
  code_snippet?: string;
  code_language?: string;
  category?: string;
  steps?: Step[];
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string,
  profession?: string[], 
  bio?: string
}

export interface ConfirmRequest {
  token_hash: string;
  type: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}