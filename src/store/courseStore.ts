import { create } from 'zustand';

// Simplified Course interface matching backend response
export interface Course {
    brochure: never[];
    dynamicFields: never[];
    studyCenters: never[];
    careerOpportunities: never[];
    visaProcess: never[];
    feeStructures: never[];
    documentsRequired: never[];
    programDelivery: never[];
    overview: any;
    _id: string;
    // overview: {
    courseName: string;
    slug: string;
    courseImage?: string;
    description?: string;
    level?: string;
    durationYears?: number;
    durationMonths?: number;
    studyModeType: 'fast-track' | 'regular';
    studyMode: 'online' | 'offline' | 'hybrid';
    nextIntake: string;
    awardedBy?: string;
    // };
    status: 'draft' | 'published';
}

export interface PaginationMeta {
    hasPrevPage: boolean;
    hasNextPage: boolean;
    totalPages: number;
    page: number;
    limit: number;
    total: number;
    pages: number;
}

interface CourseState {
    courses: Course[];
    paginationMeta: PaginationMeta | null;
    selectedCourseSlug: string | null;

    setCourses: (courses: Course[], meta: PaginationMeta) => void;
    clearCourses: () => void;
    setSelectedCourseSlug: (slug: string | null) => void;
    deleteCourseFromList: (id: string) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
    courses: [],
    paginationMeta: null,
    selectedCourseSlug: null,

    setCourses: (courses, meta) => {
        set({ courses, paginationMeta: meta });
    },

    clearCourses: () => set({
        courses: [],
        paginationMeta: null
    }),

    setSelectedCourseSlug: (slug) => set({ selectedCourseSlug: slug }),

    deleteCourseFromList: (id) =>
        set((state) => ({
            courses: state.courses.filter((course) => course._id !== id),
        })),
}));