import type { IDataSource, DataSourceResult, ListOptions } from './dataSource';
import type { Ingredient } from '../model/types';

/**
 * API Data Source Configuration
 */
export interface ApiDataSourceConfig {
  baseUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * API Data Source Implementation
 * Provides dynamic data loading from REST API endpoints
 */
export class ApiDataSource implements IDataSource {
  private config: ApiDataSourceConfig;
  private cache: Map<string, any> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  constructor(config: ApiDataSourceConfig) {
    this.config = {
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  /**
   * Fetch data from API with error handling and retries
   */
  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt < this.config.retryAttempts!) {
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay! * attempt));
        return this.fetchWithRetry<T>(url, options, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Build query parameters for API requests
   */
  private buildQueryParams(params?: ListOptions): URLSearchParams {
    const searchParams = new URLSearchParams();

    if (params) {
      if (params.search) searchParams.append('search', params.search);
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(`${key}[]`, v));
          } else {
            searchParams.append(key, String(value));
          }
        });
      }
      if (params.sortBy) {
        params.sortBy.forEach(sort => {
          searchParams.append('sort', `${sort.field}:${sort.direction}`);
        });
      }
      if (params.groupBy) searchParams.append('groupBy', params.groupBy);
      if (params.page !== undefined) searchParams.append('page', String(params.page));
      if (params.pageSize !== undefined) searchParams.append('pageSize', String(params.pageSize));
    }

    return searchParams;
  }

  /**
   * Get cached data or fetch from API
   */
  private async getCachedOrFetch<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await fetchFn();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  /**
   * List ingredients with query parameters
   */
  async list(params?: ListOptions): Promise<DataSourceResult<Ingredient[]>> {
    const cacheKey = `list:${JSON.stringify(params)}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const queryParams = this.buildQueryParams(params);
      const url = `${this.config.baseUrl}/ingredients?${queryParams}`;
      
      const response = await this.fetchWithRetry<{
        data: Ingredient[];
        total: number;
        page: number;
        pageSize: number;
        hasMore: boolean;
      }>(url);

      return {
        data: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
        hasMore: response.hasMore,
        success: true,
      };
    });
  }

  /**
   * Get single ingredient by ID
   */
  async get(id: string): Promise<DataSourceResult<Ingredient>> {
    const cacheKey = `get:${id}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const url = `${this.config.baseUrl}/ingredients/${id}`;
      const ingredient = await this.fetchWithRetry<Ingredient>(url);

      return {
        data: ingredient,
        success: true,
      };
    });
  }

  /**
   * Create new ingredient
   */
  async create(ingredient: Partial<Ingredient>): Promise<DataSourceResult<Ingredient>> {
    const url = `${this.config.baseUrl}/ingredients`;
    const newIngredient = await this.fetchWithRetry<Ingredient>(url, {
      method: 'POST',
      body: JSON.stringify(ingredient),
    });

    // Clear cache after creation
    this.clearCache();

    return {
      data: newIngredient,
      success: true,
    };
  }

  /**
   * Update existing ingredient
   */
  async update(id: string, changes: Partial<Ingredient>): Promise<DataSourceResult<Ingredient>> {
    const url = `${this.config.baseUrl}/ingredients/${id}`;
    const updatedIngredient = await this.fetchWithRetry<Ingredient>(url, {
      method: 'PUT',
      body: JSON.stringify(changes),
    });

    // Clear cache after update
    this.clearCache();

    return {
      data: updatedIngredient,
      success: true,
    };
  }

  /**
   * Delete ingredient
   */
  async delete(id: string): Promise<DataSourceResult<void>> {
    const url = `${this.config.baseUrl}/ingredients/${id}`;
    await this.fetchWithRetry<void>(url, {
      method: 'DELETE',
    });

    // Clear cache after deletion
    this.clearCache();

    return {
      data: undefined,
      success: true,
    };
  }

  /**
   * Export ingredients
   */
  async export(ids: string[], format: 'csv' | 'json'): Promise<DataSourceResult<string>> {
    const url = `${this.config.baseUrl}/ingredients/export`;
    const response = await this.fetchWithRetry<{ downloadUrl: string }>(url, {
      method: 'POST',
      body: JSON.stringify({ ids, format }),
    });

    return {
      data: response.downloadUrl,
      success: true,
    };
  }

  /**
   * Get filter options from API
   */
  async getFilterOptions(): Promise<DataSourceResult<{
    categories: string[];
    families: string[];
    suppliers: string[];
    statuses: string[];
    types: string[];
  }>> {
    const cacheKey = 'filterOptions';
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const url = `${this.config.baseUrl}/ingredients/filter-options`;
      const options = await this.fetchWithRetry<{
        categories: string[];
        families: string[];
        suppliers: string[];
        statuses: string[];
        types: string[];
      }>(url);

      return {
        data: options,
        success: true,
      };
    });
  }

  /**
   * Get statistics from API
   */
  async getStats(): Promise<DataSourceResult<{
    total: number;
    active: number;
    favorites: number;
    lowStock: number;
  }>> {
    const cacheKey = 'stats';
    
    return this.getCachedOrFetch(cacheKey, async () => {
      const url = `${this.config.baseUrl}/ingredients/stats`;
      const stats = await this.fetchWithRetry<{
        total: number;
        active: number;
        favorites: number;
        lowStock: number;
      }>(url);

      return {
        data: stats,
        success: true,
      };
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ApiDataSourceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.clearCache(); // Clear cache when config changes
  }

  /**
   * Get current configuration
   */
  getConfig(): ApiDataSourceConfig {
    return { ...this.config };
  }

  /**
   * Bulk export ingredients
   */
  async bulkExport(ids: string[], options: { format: 'csv' | 'json' }): Promise<DataSourceResult<string>> {
    const url = `${this.config.baseUrl}/export`;
    const data = await this.fetchWithRetry<string>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids,
        format: options.format
      })
    });
    
    return {
      success: true,
      data,
      error: undefined
    };
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string): Promise<DataSourceResult<Ingredient>> {
    const url = `${this.config.baseUrl}/ingredients/${id}/toggle-favorite`;
    const data = await this.fetchWithRetry<Ingredient>(url, {
      method: 'POST'
    });
    
    return {
      success: true,
      data,
      error: undefined
    };
  }

  /**
   * Duplicate an ingredient
   */
  async duplicate(id: string): Promise<DataSourceResult<Ingredient>> {
    const url = `${this.config.baseUrl}/ingredients/${id}/duplicate`;
    const data = await this.fetchWithRetry<Ingredient>(url, {
      method: 'POST'
    });
    
    return {
      success: true,
      data,
      error: undefined
    };
  }

  /**
   * Archive an ingredient (soft delete)
   */
  async archive(id: string): Promise<DataSourceResult<Ingredient>> {
    const url = `${this.config.baseUrl}/ingredients/${id}/archive`;
    const data = await this.fetchWithRetry<Ingredient>(url, {
      method: 'POST'
    });
    
    return {
      success: true,
      data,
      error: undefined
    };
  }
}

/**
 * Factory function to create API data source
 */
export function createApiDataSource(config: ApiDataSourceConfig): ApiDataSource {
  return new ApiDataSource(config);
}

/**
 * Default API endpoints configuration
 */
export const DEFAULT_API_ENDPOINTS = {
  ingredients: '/api/v2/ingredients',
  export: '/api/v2/ingredients/export',
  filterOptions: '/api/v2/ingredients/filter-options',
  stats: '/api/v2/ingredients/stats',
} as const;
