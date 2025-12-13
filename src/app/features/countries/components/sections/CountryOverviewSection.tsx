"use client";

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CountryOverview } from '@/type/country';
import { RichTextEditor } from '@/app/components/common/RichTextEditor';
import { ImageUpload } from '@/app/components/common/ImageUpload';
import { useEffect } from 'react';

interface CountryOverviewSectionProps {
    data: CountryOverview;
    onSave: (data: CountryOverview) => void;
    onNext: () => void;
}

export function CountryOverviewSection({
    data,
    onSave,
    onNext,
}: CountryOverviewSectionProps) {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CountryOverview>({
        defaultValues: data,
    });

    const name = watch('name');
    const description = watch('description');
    const flag = watch('flag');
    const banner = watch('banner');

    useEffect(() => {
        if (name) {
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setValue('slug', slug);
        }
    }, [name, setValue]);

    const onSubmit = (formData: CountryOverview) => {
        onSave(formData);
        onNext();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Country Overview</h2>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <Label>Country Flag</Label>
                        <div className="mt-2">

                        </div>
                    </div>
                    <div>
                        <Label>Banner Image</Label>
                        <div className="mt-2">

                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <Label htmlFor="name">Country Name *</Label>
                        <Input
                            id="name"
                            {...register('name', { required: 'Country name is required' })}
                            placeholder="e.g., United Kingdom"
                            className="mt-2"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                            id="slug"
                            {...register('slug', { required: 'Slug is required' })}
                            className="mt-2 bg-gray-50"
                            readOnly
                        />
                    </div>

                    <div>
                        <Label>Description *</Label>
                        <div className="mt-2">
                            <RichTextEditor
                                content={description}
                                onChange={(content) => setValue('description', content)}
                                placeholder="Study in..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="submit" className="bg-purple-700 hover:bg-purple-800">
                    Save & Continue
                </Button>
            </div>
        </form>
    );
}
