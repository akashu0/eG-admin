"use client";

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UniversityOverview } from '@/type/university';
import { RichTextEditor } from '@/app/components/common/RichTextEditor';
import { ImageUpload } from '@/app/components/common/ImageUpload';
import { useEffect } from 'react';

interface UniversityOverviewSectionProps {
    data: UniversityOverview;
    onSave: (data: UniversityOverview) => void;
    onNext: () => void;
}

export function UniversityOverviewSection({
    data,
    onSave,
    onNext,
}: UniversityOverviewSectionProps) {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<UniversityOverview>({
        defaultValues: data,
    });

    const name = watch('name');
    const description = watch('description');
    const logo = watch('logo');
    const banner = watch('banner');

    // Auto-generate slug
    useEffect(() => {
        if (name) {
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setValue('slug', slug);
        }
    }, [name, setValue]);

    const onSubmit = (formData: UniversityOverview) => {
        onSave(formData);
        onNext();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">University Overview</h2>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <Label>University Logo</Label>
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
                        <Label htmlFor="name">University Name *</Label>
                        <Input
                            id="name"
                            {...register('name', { required: 'University name is required' })}
                            placeholder="e.g., Harvard University"
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
                        <Label htmlFor="location">Location *</Label>
                        <Input
                            id="location"
                            {...register('location', { required: 'Location is required' })}
                            placeholder="City, Country"
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label htmlFor="website">Website *</Label>
                        <Input
                            id="website"
                            {...register('website', { required: 'Website is required' })}
                            placeholder="https://..."
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label htmlFor="establishedYear">Established Year *</Label>
                        <Input
                            id="establishedYear"
                            {...register('establishedYear', { required: 'Established year is required' })}
                            placeholder="e.g. 1990"
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label>Description *</Label>
                        <div className="mt-2">
                            <RichTextEditor
                                content={description}
                                onChange={(content) => setValue('description', content)}
                                placeholder="About the university..."
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
