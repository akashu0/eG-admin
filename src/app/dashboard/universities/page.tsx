// app/dashboard/universities/page.tsx
import { UniversityList } from "@/app/features/universities/components/UniversityList";
import React from "react";

export default function UniversitiesPage() {
    return (
        <div className="container mx-auto py-1 px-4">
            <UniversityList />
        </div>
    );
}