// services/centerService.ts (Updated to transform _id to id)

import apiClient from "@/lib/apiClient";
import { CenterListResponse, CenterMutationResponse, CenterResponse, CreateCenterDto, EarningCenter, UpdateCenterDto } from "@/type/studyCenter";


// Transform function to convert _id to id for frontend
const transformCenter = (center: CenterResponse): EarningCenter => ({
    id: center._id,
    name: center.name,
    location: center.location,
    contactPerson: center.contactPerson,
    contactNumber: center.contactNumber,
    address: center.address,
    status: center.status,
    createdAt: center.createdAt,
    updatedAt: center.updatedAt,
});

export const centerService = {
    async getAllCenters(): Promise<EarningCenter[]> {
        try {
            const response = await apiClient.get<CenterListResponse>("/study-centers/get-studycenters");
            return response.data.data.map(transformCenter);
        } catch (error) {
            console.error("Error fetching centers:", error);
            throw error;
        }
    },

    async createCenter(data: CreateCenterDto): Promise<EarningCenter> {
        try {
            const response = await apiClient.post<CenterMutationResponse>("/study-centers/create-studycenter", data);
            return transformCenter(response.data.data);
        } catch (error) {
            console.error("Error creating center:", error);
            throw error;
        }
    },

    async updateCenter(id: string, data: UpdateCenterDto): Promise<EarningCenter> {
        try {
            const response = await apiClient.put<CenterMutationResponse>(`/study-centers/update-studycenter/${id}`, data);
            return transformCenter(response.data.data);
        } catch (error) {
            console.error("Error updating center:", error);
            throw error;
        }
    },

    async deleteCenter(id: string): Promise<void> {
        try {
            await apiClient.delete(`/study-centers/delete-studycenter/${id}`);
        } catch (error) {
            console.error("Error deleting center:", error);
            throw error;
        }
    },
};