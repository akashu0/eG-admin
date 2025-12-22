// services/countryService.ts
import apiClient from "@/lib/apiClient";
import { Country, PaginationMeta } from "@/store/countryStore";

export interface CountryQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'published' | 'draft' | 'all';
    continent?: string;
}

export interface CountryResponse {
    success: boolean;
    data: Country[];
    pagination: PaginationMeta;
}

export interface SingleCountryResponse {
    success: boolean;
    data: Country;
}

export const countryService = {
    // Get all countries
    getAllCountries: async (params: CountryQueryParams = {}): Promise<CountryResponse> => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params.continent) queryParams.append('continent', params.continent);

        const response = await apiClient.get<CountryResponse>(
            `/countries?${queryParams.toString()}`
        );
        return response.data;
    },

    // Get country by slug
    getCountryBySlug: async (slug: string): Promise<SingleCountryResponse> => {
        const response = await apiClient.get<SingleCountryResponse>(`/countries/${slug}`);
        return response.data;
    },

    // Create country with files
    createCountryWithFiles: async (formData: FormData): Promise<SingleCountryResponse> => {
        const response = await apiClient.post<SingleCountryResponse>(
            "/countries",
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    // Update country with files
    updateCountryWithFiles: async (
        id: string,
        formData: FormData
    ): Promise<SingleCountryResponse> => {
        const response = await apiClient.put<SingleCountryResponse>(
            `/countries/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    // Delete country
    deleteCountry: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.delete<{ success: boolean; message: string }>(
            `/countries/${id}`
        );
        return response.data;
    },
};