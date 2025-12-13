// type/courseForm.ts - Add the missing fields to match API response
export type DynamicFieldType = 'text' | 'textarea' | 'dropdown' | 'radio';

export type FieldType = 'text' | 'richtext' | 'media' | 'number' | 'boolean' | 'dropdown';

export interface DynamicField {
  id: string;
  fieldName: string;
  fieldValue: any; // Can be string, number, boolean, or media object
  fieldType: FieldType;
  options?: string[]; // For dropdown
  order: number;
}

export interface CourseOverview {
  _id?: string;
  courseName: string;
  headingDescription: string;
  slug: string;
  description: string;
  durationYears?: number;
  durationMonths?: number;
  studyModeType: 'fast-track' | 'regular';
  studyMode: 'online' | 'offline' | 'hybrid';
  awardedBy: string;
  nextIntake: string;
  level: string;
  courseImage?: File | string | null;
  dynamicFields?: DynamicField[];
}

export interface ProgramDelivery {
  id: string;
  modeType: string;
  durationYears: number;
  durationMonths: number;
  studyHours: string;
  mode: string;
  support: string;
  progressionPathway: string;
}

export interface FeeStructure {
  country: string;
  programTuitionFee: number;
  studentVisaFee: number;
  accommodation: number;
  airportTransfer: number;
  vat: number;
  total: number;
  currency: string;
}

export interface DocumentRequired {
  id: string;
  documentName: string;
  description: string;
  isMandatory: boolean;
}

export interface VisaProcess {
  id: string;
}

export interface CareerOpportunity {
  id: string;
  title: string;
  description: string;
  averageSalary?: string;
}

export interface StudyCenter {
  id: string;
}

export interface Brochure {
  fileName?: string;
  title?: string;
  description?: string;
  fileUrl?: string;
  fileSize?: number;
}

export interface CourseFormData {
  _id?: string;
  overview: CourseOverview;
  programDelivery: ProgramDelivery[];
  feeStructures: FeeStructure[];
  documentsRequired: DocumentRequired[];
  visaProcess: VisaProcess[];
  careerOpportunities: CareerOpportunity[];
  studyCenters?: StudyCenter[];
  brochure: Brochure[];
  dynamicFields?: DynamicField[];
  status: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type CourseSection =
  | 'overview'
  | 'programDelivery'
  | 'feeStructure'
  | 'documents'
  | 'visa'
  | 'career'
  | 'studyCenters'
  | 'brochure'
  | 'dynamicFields';