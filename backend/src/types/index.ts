export interface Guide {
    id: number;
    title: string;
    description: string;
    code_content: string;
    language: string;
    created_at: Date;
    updated_at: Date;
  }

  export interface Step {
    id: number;
    guide_id: number;
    step_number: number;
    title: string;
    explanation: string;
    highlighted_lines: number[];
    created_at: Date;
  }

  export interface CreateGuideRequest {
    title: string;
    description: string;
    code_content: string;
    language: string;
  }

  export interface UpdateGuideRequest {
    title?: string;
    description?: string;
    code_content?: string;
    language?: string;
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

