/**
 * Service for managing routing and navigation
 */
export class RouteService {
  private static instance: RouteService;

  private constructor() {}

  public static get Instance(): RouteService {
    if (!RouteService.instance) {
      RouteService.instance = new RouteService();
    }
    return RouteService.instance;
  }

  /**
   * Navigate to home page
   */
  public navigateToHome(): void {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  /**
   * Navigate to example detail page
   */
  public navigateToExample(snippetId: string): void {
    window.history.pushState({}, '', `/example/${snippetId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  /**
   * Navigate to playground editor with specific snippet
   */
  public navigateToPlayground(snippetId?: string): void {
    const url = snippetId ? `/#${snippetId}` : '/';
    window.open(url, '_blank');
  }

  /**
   * Get current path
   */
  public getCurrentPath(): string {
    return window.location.pathname;
  }

  /**
   * Get snippet ID from current URL if present
   */
  public getSnippetIdFromUrl(): string | null {
    const path = this.getCurrentPath();
    const match = path.match(/^\/example\/([^\/]+)/);
    return match ? match[1] : null;
  }

  /**
   * Check if current route is home page
   */
  public isHomePage(): boolean {
    const path = this.getCurrentPath();
    return path === '/' || path === '';
  }

  /**
   * Check if current route is example detail page
   */
  public isExamplePage(): boolean {
    return this.getSnippetIdFromUrl() !== null;
  }
}
