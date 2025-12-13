"use client";

import { useFieldArray, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { CareerOpportunity } from '@/type/courseForm';
import { RichTextEditor } from '@/app/components/common/RichTextEditor';

interface CareerOpportunitiesSectionProps {
  data: CareerOpportunity[];
  onSave: (data: CareerOpportunity[]) => void;
  onNext: () => void;
}

export function CareerOpportunitiesSection({
  data,
  onSave,
  onNext,
}: CareerOpportunitiesSectionProps) {
  const { control, register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      careers: data.length > 0 ? data : [{
        id: Date.now().toString(),
        title: '',
        description: '',
        averageSalary: '',
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'careers',
  });

  const onSubmit = (formData: { careers: CareerOpportunity[] }) => {
    onSave(formData.careers);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Briefcase className="h-8 w-8 text-gray-900" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Career Opportunities</h2>
            <p className="text-sm text-gray-600">Potential career paths after completing this course</p>
          </div>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-6 bg-white border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Career Path {index + 1}
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
                  <Label htmlFor={`careers.${index}.title`}>Job Title *</Label>
                  <Input
                    {...register(`careers.${index}.title` as const, {
                      required: 'Job title is required'
                    })}
                    placeholder="e.g., Business Analyst, Marketing Manager"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Job Description *</Label>
                  <div className="mt-2">
                    <RichTextEditor
                      content={watch(`careers.${index}.description`)}
                      onChange={(content) =>
                        setValue(`careers.${index}.description`, content)
                      }
                      placeholder="Describe the role, responsibilities, and skills required..."
                      minHeight="120px"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`careers.${index}.averageSalary`}>Average Salary (Optional)</Label>
                  <Input
                    {...register(`careers.${index}.averageSalary` as const)}
                    placeholder="e.g., £40,000 - £60,000 per year"
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                id: Date.now().toString(),
                title: '',
                description: '',
                averageSalary: '',
              })
            }
            className="w-full border-dashed border-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Career Path
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