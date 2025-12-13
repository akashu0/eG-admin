"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { CourseOverview, DynamicFieldType } from '@/type/courseForm';
import { RichTextEditor } from '@/app/components/common/RichTextEditor';
import { ImageUpload } from '@/app/components/common/ImageUpload';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';

interface CourseOverviewSectionProps {
  data: CourseOverview;
  onSave: (data: CourseOverview) => Promise<void>;
  onNext: () => void;
}

export function CourseOverviewSection({
  data,
  onSave,
  onNext,
}: CourseOverviewSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<CourseOverview>({
    defaultValues: data,
  });

  // Dynamic fields array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dynamicFields',
  });

  const courseName = watch('courseName');
  const description = watch('description');
  const courseImage = watch('courseImage');

  // Auto-generate slug
  useEffect(() => {
    if (courseName) {
      const slug = courseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  }, [courseName, setValue]);

  const onSubmit = async (formData: CourseOverview) => {
    try {
      setIsSubmitting(true);
      await onSave(formData);
      onNext();
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add option to dropdown/radio field
  const addOption = (fieldIndex: number) => {
    const currentOptions = watch(`dynamicFields.${fieldIndex}.options`) || [];
    setValue(`dynamicFields.${fieldIndex}.options`, [...currentOptions, '']);
  };

  // Remove option from dropdown/radio field
  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const currentOptions = watch(`dynamicFields.${fieldIndex}.options`) || [];
    const newOptions = currentOptions.filter((_, i) => i !== optionIndex);
    setValue(`dynamicFields.${fieldIndex}.options`, newOptions);
  };

  // Update option value
  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const currentOptions = watch(`dynamicFields.${fieldIndex}.options`) || [];
    const newOptions = [...currentOptions];
    newOptions[optionIndex] = value;
    setValue(`dynamicFields.${fieldIndex}.options`, newOptions);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Overview</h2>

        <div className="space-y-6">
          {/* Course Image */}
          <div>
            <Label>Course Image</Label>
            <div className="mt-2">
              <ImageUpload
                value={courseImage}
                onChange={(file) => setValue('courseImage', file)}
                onRemove={() => setValue('courseImage', null)}
              />
            </div>
          </div>

          {/* Course Name */}
          <div>
            <Label htmlFor="courseName">Course Name *</Label>
            <Input
              id="courseName"
              {...register('courseName', { required: 'Course name is required' })}
              placeholder="e.g., Master of Business Administration"
              className="mt-2"
              disabled={isSubmitting}
            />
            {errors.courseName && (
              <p className="text-sm text-red-600 mt-1">{errors.courseName.message}</p>
            )}
          </div>

          {/* Heading Description */}
          <div>
            <Label htmlFor="headingDescription">Heading Description *</Label>
            <Input
              id="headingDescription"
              {...register('headingDescription', { required: 'Heading description is required' })}
              placeholder="Short compelling description"
              className="mt-2"
              disabled={isSubmitting}
            />
            {errors.headingDescription && (
              <p className="text-sm text-red-600 mt-1">{errors.headingDescription.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <Label htmlFor="slug">Slug (URL-friendly) *</Label>
            <Input
              id="slug"
              {...register('slug', { required: 'Slug is required' })}
              placeholder="auto-generated-from-name"
              className="mt-2 bg-gray-50"
              readOnly
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description *</Label>
            <div className="mt-2">
              <RichTextEditor
                content={description}
                onChange={(content) => setValue('description', content)}
                placeholder="Detailed course description..."
              />
            </div>
          </div>

          {/* Duration Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Years */}
            <div>
              <Label htmlFor="durationYears">Years</Label>
              <Input
                id="durationYears"
                type="number"
                min="0"
                {...register('durationYears', { valueAsNumber: true })}
                placeholder="1"
                className="mt-2"
                disabled={isSubmitting}
              />
            </div>

            {/* Months */}
            <div>
              <Label htmlFor="durationMonths">Months</Label>
              <Input
                id="durationMonths"
                type="number"
                min="0"
                max="11"
                {...register('durationMonths', { valueAsNumber: true })}
                placeholder="6"
                className="mt-2"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Study Mode */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor="studyMode">Study Mode *</Label>
              <Select
                value={watch('studyMode')}
                onValueChange={(value) => setValue('studyMode', value as 'online' | 'offline' | 'hybrid')}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="studyModeType">Study Mode Type *</Label>
              <Select
                value={watch('studyModeType')}
                onValueChange={(value) => setValue('studyModeType', value as 'fast-track' | 'regular')}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="fast-track">Fast Track</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Awarded By */}
          <div>
            <Label htmlFor="awardedBy">Awarded By *</Label>
            <Input
              id="awardedBy"
              {...register('awardedBy', { required: 'Awarded by is required' })}
              placeholder="e.g., University of London"
              className="mt-2"
              disabled={isSubmitting}
            />
          </div>

          {/* Next Intake */}
          <div>
            <Label htmlFor="nextIntake">Next Intake *</Label>
            <Input
              id="nextIntake"
              type="date"
              {...register('nextIntake', { required: 'Next intake is required' })}
              className="mt-2"
              disabled={isSubmitting}
            />
          </div>

          {/* Level */}
          <div>
            <Label htmlFor="level">Level *</Label>
            <Select
              value={watch('level')}
              onValueChange={(value) => setValue('level', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="postgraduate">Postgraduate</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="doctorate">Doctorate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Fields Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Additional Fields</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add custom fields specific to this course
                </p>
              </div>
              <Button
                type="button"
                onClick={() => append({ label: '', value: '', type: 'text', options: [] })}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4" />
                Add Field
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-sm text-gray-500">No additional fields added yet</p>
                <Button
                  type="button"
                  onClick={() => append({ label: '', value: '', type: 'text', options: [] })}
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  disabled={isSubmitting}
                >
                  Add your first field
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => {
                  const fieldType = watch(`dynamicFields.${index}.type`) as DynamicFieldType;
                  const needsOptions = fieldType === 'dropdown' || fieldType === 'radio';

                  return (
                    <div key={field.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex gap-4 items-start mb-4">
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          {/* Field Label */}
                          <div>
                            <Label htmlFor={`dynamicFields.${index}.label`}>
                              Field Label *
                            </Label>
                            <Input
                              {...register(`dynamicFields.${index}.label`, {
                                required: 'Field label is required',
                              })}
                              placeholder="e.g., Accreditation"
                              className="mt-2"
                              disabled={isSubmitting}
                            />
                            {errors.dynamicFields?.[index]?.label && (
                              <p className="text-sm text-red-600 mt-1">
                                {errors.dynamicFields[index]?.label?.message}
                              </p>
                            )}
                          </div>

                          {/* Field Type */}
                          <div>
                            <Label htmlFor={`dynamicFields.${index}.type`}>
                              Field Type *
                            </Label>
                            <Select
                              value={fieldType}
                              onValueChange={(value) => {
                                setValue(`dynamicFields.${index}.type`, value as DynamicFieldType);
                                if (value === 'dropdown' || value === 'radio') {
                                  setValue(`dynamicFields.${index}.options`, ['']);
                                } else {
                                  setValue(`dynamicFields.${index}.options`, []);
                                }
                              }}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="textarea">Textarea</SelectItem>
                                <SelectItem value="dropdown">Dropdown</SelectItem>
                                <SelectItem value="radio">Radio</SelectItem>
                                <SelectItem value="file">File</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Field Value (only show for text/textarea/file) */}
                          {!needsOptions && (
                            <div>
                              <Label htmlFor={`dynamicFields.${index}.value`}>
                                Field Value *
                              </Label>
                              {fieldType === 'textarea' ? (
                                <Textarea
                                  {...register(`dynamicFields.${index}.value`, {
                                    required: 'Field value is required',
                                  })}
                                  placeholder="Enter value"
                                  className="mt-2"
                                  rows={3}
                                  disabled={isSubmitting}
                                />
                              ) : (
                                <Input
                                  {...register(`dynamicFields.${index}.value`, {
                                    required: 'Field value is required',
                                  })}
                                  placeholder="e.g., AACSB Accredited"
                                  className="mt-2"
                                  disabled={isSubmitting}
                                />
                              )}
                              {errors.dynamicFields?.[index]?.value && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors.dynamicFields[index]?.value?.message}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Delete Button */}
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="ghost"
                          size="icon"
                          className="mt-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Options for Dropdown/Radio */}
                      {needsOptions && (
                        <div className="ml-4 pl-4 border-l-2 border-gray-300">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm font-medium">
                              Options *
                            </Label>
                            <Button
                              type="button"
                              onClick={() => addOption(index)}
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              disabled={isSubmitting}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Option
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {(watch(`dynamicFields.${index}.options`) || []).map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2 items-center">
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                  placeholder={`Option ${optionIndex + 1}`}
                                  className="flex-1"
                                  disabled={isSubmitting}
                                />
                                <Button
                                  type="button"
                                  onClick={() => removeOption(index, optionIndex)}
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  disabled={isSubmitting}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}

                            {(!watch(`dynamicFields.${index}.options`) || watch(`dynamicFields.${index}.options`)?.length === 0) && (
                              <p className="text-sm text-gray-500 italic">
                                No options added yet. Click "Add Option" to create options.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="submit"
          className="bg-gray-900 hover:bg-gray-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Save & Continue'
          )}
        </Button>
      </div>
    </form>
  );
}