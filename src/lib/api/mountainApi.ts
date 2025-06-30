import { Gunung } from '@/domain/entities/Gunung';

export interface GetMountainsResponse {
  success: boolean;
  mountains: Gunung[];
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class MountainApi {
  private baseUrl = '/api/gunung';

  async getMountains(params?: {
    search?: string;
    provinsi?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<GetMountainsResponse> {
    try {
      const url = new URL(this.baseUrl, window.location.origin);
      
      if (params?.search) url.searchParams.set('search', params.search);
      if (params?.provinsi) url.searchParams.set('provinsi', params.provinsi);
      if (params?.status) url.searchParams.set('status', params.status);
      if (params?.page) url.searchParams.set('page', params.page.toString());
      if (params?.limit) url.searchParams.set('limit', params.limit.toString());

      const response = await fetch(url.toString());
      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          mountains: data.mountains || [],
          meta: data.meta
        };
      } else {
        return {
          success: false,
          mountains: [],
          error: data.error || 'Failed to fetch mountains',
        };
      }
    } catch (error) {
      console.error('Error fetching mountains:', error);
      return {
        success: false,
        mountains: [],
        error: 'Network error occurred while fetching mountains',
      };
    }
  }

  async getMountainById(id: string): Promise<{ success: boolean; mountain?: Gunung; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          mountain: data,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to fetch mountain',
        };
      }
    } catch (error) {
      console.error('Error fetching mountain:', error);
      return {
        success: false,
        error: 'Network error occurred while fetching mountain',
      };
    }
  }

  async getActiveMountains(): Promise<GetMountainsResponse> {
    return this.getMountains({ status: 'active' });
  }

  async getAvailableMountains(): Promise<GetMountainsResponse> {
    return this.getMountains({ status: 'active' });
  }

  async getMountainsByProvinsi(provinsi: string): Promise<GetMountainsResponse> {
    return this.getMountains({ provinsi });
  }

  async searchMountains(query: string): Promise<GetMountainsResponse> {
    return this.getMountains({ search: query });
  }
}

export const mountainApi = new MountainApi(); 