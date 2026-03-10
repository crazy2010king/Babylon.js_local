import { ExampleMetadata, ExampleDetail, ExampleCategory } from '../types/exampleTypes';
import { LoadManager } from '../tools/loadManager';

/**
 * Service for managing example data and operations
 */
export class ExampleService {
  private static instance: ExampleService;
  private categories: ExampleCategory[] = [];
  private examples: Map<string, ExampleMetadata> = new Map();
  private loadManager: LoadManager;

  private constructor() {
    this.loadManager = LoadManager.Instance;
  }

  public static get Instance(): ExampleService {
    if (!ExampleService.instance) {
      ExampleService.instance = new ExampleService();
    }
    return ExampleService.instance;
  }

  /**
   * Fetch all example categories
   */
  public async getCategories(): Promise<ExampleCategory[]> {
    if (this.categories.length > 0) {
      return this.categories;
    }

    try {
      // In production, this would fetch from the Playground API
      const response = await fetch('/api/examples/categories');
      this.categories = await response.json();
      return this.categories;
    } catch (error) {
      console.warn('Failed to fetch categories, using mock data', error);
      return this.getMockCategories();
    }
  }

  /**
   * Search examples by keyword
   */
  public async searchExamples(keyword: string, categoryId?: string): Promise<ExampleMetadata[]> {
    await this.ensureExamplesLoaded();

    let results = Array.from(this.examples.values());

    if (categoryId) {
      results = results.filter(example => example.category === categoryId);
    }

    if (keyword.trim()) {
      const lowerKeyword = keyword.toLowerCase();
      results = results.filter(example =>
        example.name.toLowerCase().includes(lowerKeyword) ||
        example.description.toLowerCase().includes(lowerKeyword) ||
        example.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
      );
    }

    return results;
  }

  /**
   * Get example details by snippet ID
   */
  public async getExampleBySnippetId(snippetId: string): Promise<ExampleDetail | null> {
    try {
      // First try to load from our metadata
      await this.ensureExamplesLoaded();
      const metadata = Array.from(this.examples.values()).find(e => e.snippetId === snippetId);

      // Load the actual snippet content using LoadManager
      const snippet = await this.loadManager.loadSnippet(snippetId);

      if (!snippet) {
        return null;
      }

      return {
        ...(metadata || this.getMockExampleMetadata(snippetId)),
        code: typeof snippet === 'string' ? snippet : JSON.stringify(snippet, null, 2),
        files: typeof snippet !== 'string' ? snippet : undefined
      };
    } catch (error) {
      console.error('Failed to load example', error);
      return null;
    }
  }

  /**
   * Get featured examples
   */
  public async getFeaturedExamples(): Promise<ExampleMetadata[]> {
    await this.ensureExamplesLoaded();
    return Array.from(this.examples.values()).filter(e => e.featured);
  }

  private async ensureExamplesLoaded(): Promise<void> {
    if (this.examples.size === 0) {
      try {
        // In production, this would fetch from the Playground API
        const response = await fetch('/api/examples');
        const examples = await response.json();
        examples.forEach((example: ExampleMetadata) => {
          this.examples.set(example.id, example);
        });
      } catch (error) {
        console.warn('Failed to fetch examples, using mock data', error);
        const mockExamples = this.getMockExamples();
        mockExamples.forEach(example => {
          this.examples.set(example.id, example);
        });
      }
    }
  }

  private getMockCategories(): ExampleCategory[] {
    return [
      {
        id: 'getting-started',
        name: 'Getting Started',
        examples: []
      },
      {
        id: 'meshes',
        name: 'Meshes & Geometry',
        examples: []
      },
      {
        id: 'materials',
        name: 'Materials & Textures',
        examples: []
      },
      {
        id: 'animations',
        name: 'Animations',
        examples: []
      },
      {
        id: 'physics',
        name: 'Physics',
        examples: []
      },
      {
        id: 'cameras',
        name: 'Cameras & Input',
        examples: []
      },
      {
        id: 'advanced',
        name: 'Advanced',
        examples: []
      }
    ];
  }

  private getMockExamples(): ExampleMetadata[] {
    return [
      {
        id: '1',
        snippetId: 'PG9V6Y',
        name: 'Hello World',
        description: 'A simple Hello World example to get started with Babylon.js',
        category: 'getting-started',
        tags: ['basic', 'hello world', 'introduction'],
        difficulty: 'beginner',
        featured: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '2',
        snippetId: 'Y6V9PG',
        name: 'Basic Scene',
        description: 'Create a basic scene with a sphere, light, and camera',
        category: 'getting-started',
        tags: ['basic', 'scene', 'sphere'],
        difficulty: 'beginner',
        featured: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '3',
        snippetId: 'X1Y2Z3',
        name: 'PBR Materials',
        description: 'Demonstration of Physically Based Rendering materials',
        category: 'materials',
        tags: ['materials', 'pbr', 'shading'],
        difficulty: 'intermediate',
        featured: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '4',
        snippetId: 'A4B5C6',
        name: 'Animation Basics',
        description: 'Learn how to animate objects in Babylon.js',
        category: 'animations',
        tags: ['animation', 'tween', 'keyframes'],
        difficulty: 'intermediate',
        featured: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ];
  }

  private getMockExampleMetadata(snippetId: string): ExampleMetadata {
    return {
      id: snippetId,
      snippetId,
      name: `Example ${snippetId}`,
      description: 'Example loaded from snippet',
      category: 'uncategorized',
      tags: ['snippet'],
      difficulty: 'beginner',
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}
