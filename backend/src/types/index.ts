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

  // Request/Response types
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