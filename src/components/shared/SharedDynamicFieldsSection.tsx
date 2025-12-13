"use client";

import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { DynamicField } from '@/type/common';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const DynamicFieldBuilder = dynamic(
    () => import('@/components/shared/DynamicFieldBuilder').then((mod) => mod.DynamicFieldBuilder),
    { ssr: false }
);

interface SharedDynamicFieldsSectionProps {
    data: DynamicField[];
    onSave: (data: DynamicField[]) => void;
    onPrevious: () => void;
    entityName: string; // "course", "university", "country"
}

export function SharedDynamicFieldsSection({
    data,
    onSave,
    onPrevious,
    entityName
}: SharedDynamicFieldsSectionProps) {
    const [fields, setFields] = useState<DynamicField[]>(data || []);

    useEffect(() => {
        setFields(data || []);
    }, [data]);

    const handleSave = () => {
        onSave(fields);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Settings className="h-8 w-8 text-gray-900" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Additional Fields</h2>
                    <p className="text-sm text-gray-600">Optional: Add any custom fields specific to this {entityName}</p>
                </div>
            </div>

            <DynamicFieldBuilder fields={fields} onChange={setFields} />

            <div className="flex justify-between gap-4 pt-6 border-t mt-8">
                <Button type="button" variant="outline" onClick={onPrevious}>
                    Previous
                </Button>
                <Button type="button" onClick={handleSave} className="bg-gray-900 hover:bg-gray-800">
                    Save Final Section
                </Button>
            </div>
        </div>
    );
}
