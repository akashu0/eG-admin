export type FieldType = 'text' | 'richtext' | 'media' | 'number' | 'boolean' | 'dropdown';

export interface DynamicField {
    id: string;
    fieldName: string;
    fieldValue: any; // Can be string, number, boolean, or media object
    fieldType: FieldType;
    options?: string[]; // For dropdown
    order: number;
}
