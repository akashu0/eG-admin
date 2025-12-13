"use client";

import { DraftList } from "@/app/features/courses/components/DraftList";
import React from "react";

export default function DraftsPage() {
    return (
        <div className="container mx-auto py-6 px-4">
            <DraftList />
        </div>
    );
}
