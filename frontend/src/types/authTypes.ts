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
}

export interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ProfessionInputProps {
  professions: string[];
  professionInput: string;
  error?: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface LoginFormProps {
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    email: string;
    password: string;
  };
  errors: {
    email?: string;
    password?: string;
  };
  isLoading: boolean;
  apiError: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface AuthHeaderProps {
  title: string;
  subtitle: string;
  linkText: string;
  linkTo: string;
}

export interface AuthContainerProps {
  children: React.ReactNode;
}