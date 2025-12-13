import { DynamicField } from './common';

export interface CountryOverview {
    name: string;
    slug: string;
    description: string; // "Study in {Country}"
    flag?: string;
    banner?: string;
}

export interface CountryIntake {
    title: string;
    months: string[];
    description: string;
}

export interface CountryFormData {
    id?: string;
    overview: CountryOverview;
    // For other sections, we can use a generic structure or specific ones.
    // Given the timeline, I will use a generic "SectionData" or placeholders for now,
    // but specific enough to be valid.
    intakes: CountryIntake[];
    scholarshipsDescription?: string;
    visaProcessDescription?: string;
    topUniversitiesDescription?: string;
    topCoursesDescription?: string;
    costOfStudyDescription?: string;
    examsAndEligibilityDescription?: string;
    workOpportunitiesDescription?: string;

    dynamicFields: DynamicField[];
    status: 'draft' | 'published';
}

export type CountrySection =
    | 'overview'
    | 'intake'
    | 'scholarships'
    | 'visa'
    | 'topUniversities'
    | 'topCourses'
    | 'costOfStudy'
    | 'exams'
    | 'work'
    | 'dynamicFields';
