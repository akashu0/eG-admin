import apiClient from "@/lib/apiClient";
import { CountryFormData } from "@/type/country";

export interface Country {
    id: string;
    overview: {
        name: string;
        slug: string;
        description: string;
        flag?: string;
        banner?: string;
    };
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
}

export interface CountryResponse {
    countries: Country[];
    pagination: {
        total: number;
        pages: number;
        page: number;
        limit: number;
    };
}

export const countryService = {
    // Get all countries
    getAllCountries: async (params: any = {}): Promise<CountryResponse> => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);

        const response = await apiClient.get<CountryResponse>(`/countries?${queryParams.toString()}`);
        return response.data;
    },

    // Get country by ID
    getCountryById: async (id: string): Promise<Country> => {
        const response = await apiClient.get<Country>(`/countries/${id}`);
        return response.data;
    },

    // Create country
    createCountry: async (data: CountryFormData): Promise<Country> => {
        const response = await apiClient.post<Country>("/countries", data);
        return response.data;
    },

    // Update country
    updateCountry: async (id: string, data: Partial<CountryFormData>): Promise<Country> => {
        const response = await apiClient.put<Country>(`/countries/${id}`, data);
        return response.data;
    },

    // Delete country
    deleteCountry: async (id: string): Promise<void> => {
        await apiClient.delete(`/countries/${id}`);
    },

    // Save draft
    saveDraft: async (draftId: string, data: Partial<CountryFormData>): Promise<void> => {
        await apiClient.post(`/countries/drafts/${draftId}`, data);
    },

    // Upload Image
    uploadImage: async (file: File, type: 'flag' | 'banner'): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        const response = await apiClient.post<{ url: string }>('/countries/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
