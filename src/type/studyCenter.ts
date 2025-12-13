// types/studyCenter.ts (Updated with correct field name)
export interface CreateCenterDto {
    name: string;
    location: string;
    contactPerson: string;
    contactNumber: string;
    address: string;
    status?: "active" | "inactive";
}

export interface UpdateCenterDto extends Partial<CreateCenterDto> { }

export interface CenterResponse {
    _id: string; // Backend uses _id
    name: string;
    location: string;
    contactPerson: string;
    contactNumber: string;
    address: string;
    status: "active" | "inactive";
    createdAt: string;
    updatedAt: string;
}

// For frontend usage with 'id' field
export interface EarningCenter {
    id: string;
    name: string;
    location: string;
    contactPerson: string;
    contactNumber: string;
    address: string;
    status: "active" | "inactive";
    createdAt: string;
    updatedAt?: string;
}

export interface CenterListResponse {
    success: boolean;
    data: CenterResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface SingleCenterResponse {
    success: boolean;
    data: CenterResponse;
}

export interface CenterMutationResponse {
    success: boolean;
    message: string;
    data: CenterResponse;
}