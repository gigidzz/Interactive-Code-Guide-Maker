export interface SignUpFormState {
  name: string;
  profession: string[];
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpFormErrors {
  name?: string;
  profession?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface SignUpData {
  name: string;
  profession?: string[];
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}