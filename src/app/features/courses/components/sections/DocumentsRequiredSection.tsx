"use client";

import { useFieldArray, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, FileText } from 'lucide-react';
import { DocumentRequired } from '@/type/courseForm';

interface DocumentsRequiredSectionProps {
  data: DocumentRequired[];
  onSave: (data: DocumentRequired[]) => void;
  onNext: () => void;
}

export function DocumentsRequiredSection({
  data,
  onSave,
  onNext,
}: DocumentsRequiredSectionProps) {
  const { control, register, handleSubmit, watch } = useForm({
    defaultValues: {
      documents: data.length > 0 ? data : [{
        id: Date.now().toString(),
        documentName: '',
        description: '',
        isMandatory: true,
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documents',
  });

  const onSubmit = (formData: { documents: DocumentRequired[] }) => {
    onSave(formData.documents);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-8 w-8 text-gray-900" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Documents Required</h2>
            <p className="text-sm text-gray-600">List all documents needed for admission</p>
          </div>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-6 bg-white border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Document {index + 1}
                </h3>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`documents.${index}.documentName`}>Document Name *</Label>
                  <Input
                    {...register(`documents.${index}.documentName` as const, {
                      required: 'Document name is required'
                    })}
                    placeholder="e.g., Passport Copy, Academic Transcripts"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor={`documents.${index}.description`}>Description</Label>
                  <Textarea
                    {...register(`documents.${index}.description` as const)}
                    placeholder="Additional details about this document..."
                    className="mt-2 min-h-[80px]"
                  />
                </div>
                {/* 
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor={`documents.${index}.isMandatory`} className="text-sm font-medium">
                      Mandatory Document
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Mark as mandatory if required for admission
                    </p>
                  </div>
                  <Switch
                    id={`documents.${index}.isMandatory`}
                    checked={watch(`documents.${index}.isMandatory`)}
                    onCheckedChange={(checked) => {
                      const currentValues = watch('documents');
                      currentValues[index].isMandatory = checked;
                    }}
                  />
                </div> */}
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                id: Date.now().toString(),
                documentName: '',
                description: '',
                isMandatory: true,
              })
            }
            className="w-full border-dashed border-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Document
          </Button>
        </div>
      </div>

      <div className="flex justify-between gap-4 pt-6 border-t">

        <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
          Save & Continue
        </Button>
      </div>
    </form>
  );
}