// store/universityStore.ts
export interface University {
    _id: string;
    name: string;
    location: string;
    country: string;
    city: string;
    websiteLink?: string;
    founded: number;
    totalStudents: number;
    internationalStudents: number;
    rank: number;
    about: string;
    logo?: string;
    banner?: string;
    status: 'published' | 'draft';
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}