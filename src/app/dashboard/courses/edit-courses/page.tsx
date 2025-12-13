import EditCourses from "@/app/features/courses/components/EditCourses";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditCourses />
        </Suspense>
    );
}
