"use client";

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ProgramDelivery } from '@/type/courseForm';
// import { RichTextEditor } from '@/app/components/common/RichTextEditor';

interface ProgramDeliverySectionProps {
  data: ProgramDelivery[];
  onSave: (data: ProgramDelivery[]) => Promise<void>;
  onNext: () => void;
}

export function ProgramDeliverySection({
  data,
  onSave,
  onNext,
}: ProgramDeliverySectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, register, handleSubmit, formState: { errors } } = useForm<{
    deliveryModes: ProgramDelivery[];
  }>({
    defaultValues: {
      deliveryModes: data.length > 0 ? data : [{
        id: Date.now().toString(),
        modeType: '',
        durationYears: 0,
        durationMonths: 0,
        studyHours: '',
        mode: '',
        support: '',
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'deliveryModes',
  });

  const onSubmit = async (formData: { deliveryModes: ProgramDelivery[] }) => {
    try {
      setIsSubmitting(true);
      await onSave(formData.deliveryModes);
      onNext();
    } catch (error) {
      console.error('Error saving program delivery:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Program Delivery</h2>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-6 bg-white border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delivery Mode {index + 1}
                </h3>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={isSubmitting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Mode Type *</Label>
                  <Input
                    {...register(`deliveryModes.${index}.modeType` as const, {
                      required: 'Mode type is required'
                    })}
                    placeholder="e.g., Regular track, Express track"
                    className="mt-2"
                    disabled={isSubmitting}
                  />
                  {errors.deliveryModes?.[index]?.modeType && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.deliveryModes[index]?.modeType?.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Duration Years *</Label>
                    <Input
                      type="number"
                      {...register(`deliveryModes.${index}.durationYears` as const, {
                        required: 'Duration years is required',
                        valueAsNumber: true,
                        min: { value: 0, message: 'Must be 0 or greater' }
                      })}
                      placeholder="e.g., 1"
                      className="mt-2"
                      disabled={isSubmitting}
                    />
                    {errors.deliveryModes?.[index]?.durationYears && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.deliveryModes[index]?.durationYears?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Duration Months *</Label>
                    <Input
                      type="number"
                      {...register(`deliveryModes.${index}.durationMonths` as const, {
                        required: 'Duration months is required',
                        valueAsNumber: true,
                        min: { value: 0, message: 'Must be between 0 and 11' },
                        max: { value: 11, message: 'Must be between 0 and 11' }
                      })}
                      placeholder="e.g., 6"
                      className="mt-2"
                      disabled={isSubmitting}
                    />
                    {errors.deliveryModes?.[index]?.durationMonths && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.deliveryModes[index]?.durationMonths?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Study Hours *</Label>
                  <Input
                    {...register(`deliveryModes.${index}.studyHours` as const, {
                      required: 'Study hours is required'
                    })}
                    placeholder="e.g., 20 hours/week"
                    className="mt-2"
                    disabled={isSubmitting}
                  />
                  {errors.deliveryModes?.[index]?.studyHours && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.deliveryModes[index]?.studyHours?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Mode *</Label>
                  <Input
                    {...register(`deliveryModes.${index}.mode` as const, {
                      required: 'Mode is required'
                    })}
                    placeholder="e.g., Full-time, Part-time"
                    className="mt-2"
                    disabled={isSubmitting}
                  />
                  {errors.deliveryModes?.[index]?.mode && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.deliveryModes[index]?.mode?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Support *</Label>
                  <Input
                    {...register(`deliveryModes.${index}.support` as const, {
                      required: 'Support is required'
                    })}
                    placeholder="e.g., 24/7 tutor support, Weekly office hours"
                    className="mt-2"
                    disabled={isSubmitting}
                  />
                  {errors.deliveryModes?.[index]?.support && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.deliveryModes[index]?.support?.message}
                    </p>
                  )}
                </div>

                {/* Progression Pathway - Commented out for now */}
                {/* <div>
                  <Label>Progression Pathway</Label>
                  <div className="mt-2">
                    <RichTextEditor
                      content={watch(`deliveryModes.${index}.progressionPathway`)}
                      onChange={(content) =>
                        setValue(`deliveryModes.${index}.progressionPathway`, content)
                      }
                      placeholder="What opportunities are available after this mode..."
                      minHeight="120px"
                      disabled={isSubmitting}
                    />
                  </div>
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
                modeType: '',
                durationYears: 0,
                durationMonths: 0,
                studyHours: '',
                mode: '',
                support: '',
                progressionPathway: '',
              })
            }
            disabled={isSubmitting}
            className="w-full border-dashed border-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Delivery Mode
          </Button>
        </div>
      </div>

      <div className="flex justify-between gap-4 pt-6 border-t">

        <Button
          type="submit"
          className="bg-gray-900 hover:bg-gray-800 cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save '
          )}
        </Button>
      </div>
    </form>
  );
}