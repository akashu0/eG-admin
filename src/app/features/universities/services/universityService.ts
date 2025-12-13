import apiClient from "@/lib/apiClient";
import { UniversityFormData } from "@/type/university";

export interface University {
    id: string;
    overview: {
        name: string;
        slug: string;
        description: string;
        location: string;
        establishedYear: string;
        website: string;
        logo?: string;
        banner?: string;
    };
    // Add other sections as needed for list view or full detail
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
}

export interface UniversityResponse {
    universities: University[];
    pagination: {
        total: number;
        pages: number;
        page: number;
        limit: number;
    };
}

export const universityService = {
    // Get all universities
    getAllUniversities: async (params: any = {}): Promise<UniversityResponse> => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);

        const response = await apiClient.get<UniversityResponse>(`/universities?${queryParams.toString()}`);
        return response.data;
    },

    // Get university by ID
    getUniversityById: async (id: string): Promise<University> => {
        const response = await apiClient.get<University>(`/universities/${id}`);
        return response.data;
    },

    // Create university
    createUniversity: async (data: UniversityFormData): Promise<University> => {
        const response = await apiClient.post<University>("/universities", data);
        return response.data;
    },

    // Update university
    updateUniversity: async (id: string, data: Partial<UniversityFormData>): Promise<University> => {
        const response = await apiClient.put<University>(`/universities/${id}`, data);
        return response.data;
    },

    // Delete university
    deleteUniversity: async (id: string): Promise<void> => {
        await apiClient.delete(`/universities/${id}`);
    },

    // Save draft
    saveDraft: async (draftId: string, data: Partial<UniversityFormData>): Promise<void> => {
        await apiClient.post(`/universities/drafts/${draftId}`, data);
    },

};
