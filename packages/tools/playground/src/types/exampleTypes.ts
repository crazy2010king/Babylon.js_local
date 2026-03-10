/**
 * Example category type definition
 */
export interface ExampleCategory {
  id: string;
  name: string;
  parentId?: string;
  children?: ExampleCategory[];
  examples?: ExampleMetadata[];
}

/**
 * Example metadata type definition
 */
export interface ExampleMetadata {
  id: string;
  snippetId: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
}

/**
 * Example detail type including code and configuration
 */
export interface ExampleDetail extends ExampleMetadata {
  code: string;
  files?: Record<string, string>;
  configuration?: {
    engine?: string;
    version?: string;
    template?: string;
  };
}
