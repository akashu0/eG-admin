import apiClient from "@/lib/apiClient";
import { PaginationMeta } from "@/store/courseStore";
import { University } from "@/store/universityStore";
import { UniversityFormData } from "@/type/university";

export interface UniversityQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: 'published' | 'draft' | 'all';
    country?: string;
    city?: string;
}

export interface UniversityResponse {
    success: boolean;
    data: University[];
    pagination: PaginationMeta;
}

export interface SingleUniversityResponse {
    success: boolean;
    data: University;
}

export const universityService = {
    // Get all universities
    getAllUniversities: async (params: UniversityQueryParams = {}): Promise<UniversityResponse> => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params.country) queryParams.append('country', params.country);
        if (params.city) queryParams.append('city', params.city);

        const response = await apiClient.get<UniversityResponse>(
            `/universities?${queryParams.toString()}`
        );
        return response.data;
    },

    // Get university by slug
    getUniversityBySlug: async (slug: string): Promise<SingleUniversityResponse> => {
        const response = await apiClient.get<SingleUniversityResponse>(`/universities/${slug}`);
        return response.data;
    },

    // Create university with files
    createUniversityWithFiles: async (formData: FormData): Promise<SingleUniversityResponse> => {
        const response = await apiClient.post<SingleUniversityResponse>(
            "/universities",
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    // Update university with files
    updateUniversityWithFiles: async (
        id: string,
        formData: FormData
    ): Promise<SingleUniversityResponse> => {
        const response = await apiClient.put<SingleUniversityResponse>(
            `/universities/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    // Update university without files
    updateUniversity: async (
        id: string,
        data: Partial<UniversityFormData>
    ): Promise<SingleUniversityResponse> => {
        const response = await apiClient.put<SingleUniversityResponse>(
            `/universities/${id}`,
            data
        );
        return response.data;
    },

    // Delete university
    deleteUniversity: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.delete<{ success: boolean; message: string }>(
            `/universities/${id}`
        );
        return response.data;
    },
};