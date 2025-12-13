import { DynamicField } from './common';

export interface UniversityOverview {
    name: string;
    slug: string;
    description: string;
    logo?: string;
    banner?: string;
    location: string;
    establishedYear: string;
    website: string;
}

export interface UniversityCost {
    averageTuitionFee: number;
    currency: string;
    details: string;
}

export interface UniversityAdmission {
    requirements: string; // Rich text
    deadlines: { term: string; date: string }[];
}

export interface UniversityRanking {
    nationalRank: number;
    globalRank: number;
    description: string;
}

export interface UniversityCostOfLiving {
    accommodation: number;
    food: number;
    transport: number;
    others: number;
    currency: string;
}

export interface UniversityFormData {
    id?: string;
    overview: UniversityOverview;
    // Courses would be a separate relation usually, but for the form we might list them or just have a placeholder 
    // The requirement says "Courses" tab. It might be to add courses to this university.
    // For now I'll assume it's just a section to maybe link existing courses or just text description.
    // "Add University Tabs... Courses". 
    // If it's a list functionality, it might need a complex component.
    // I'll add a placeholder for now.
    coursesDescription?: string;
    cost: UniversityCost;
    admission: UniversityAdmission;
    ranking: UniversityRanking;
    costOfLiving: UniversityCostOfLiving;
    dynamicFields: DynamicField[];
    status: 'draft' | 'published';
}

export type UniversitySection =
    | 'overview'
    | 'courses'
    | 'cost'
    | 'admission'
    | 'ranking'
    | 'costOfLiving'
    | 'dynamicFields';
