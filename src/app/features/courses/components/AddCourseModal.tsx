// app/components/courses/AddCourseModal.tsx
"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CourseOverview } from "@/type/courseForm";
import { courseService } from "../services/courseService";
import { toast } from "sonner";
import { CourseOverviewSection } from "./sections/CourseOverviewSection";

interface AddCourseModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddCourseModal({
    open,
    onOpenChange,
    onSuccess,
}: AddCourseModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialData: CourseOverview = {
        courseName: "",
        headingDescription: "",
        slug: "",
        description: "",
        durationYears: 0,
        durationMonths: 0,
        studyMode: "online",
        studyModeType: "regular",
        awardedBy: "",
        nextIntake: "",
        level: "undergraduate",
        courseImage: null,
        dynamicFields: [],
    };

    const handleSave = async (data: CourseOverview) => {
        try {
            setIsSubmitting(true);

            // Call the API
            const response = await courseService.createCourseOverview(data);

            toast.success(response.message || "Course created successfully");

            // Close modal and refresh course list
            onOpenChange(false);
            onSuccess();

        } catch (error: any) {
            console.error("Error creating course:", error);
            toast.error(error.response?.data?.message || "Failed to create course");
            throw error; // Re-throw to prevent onNext from being called
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        // No need to do anything here since we're closing the modal after save
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] lg:max-w-[85vw] xl:max-w-[75vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Course</DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    <CourseOverviewSection
                        data={initialData}
                        onSave={handleSave}
                        onNext={handleNext}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}