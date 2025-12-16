

// components/UniversityList.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UniversityDataTable } from "./UniversityDataTable";
import { createColumns } from "./columns";
import { University, PaginationMeta } from "@/store/universityStore";
import { Loader2, Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { universityService, UniversityQueryParams } from "../services/universityService";
import { toast } from "sonner";
import { AddUniversityModal } from "./AddUniversityModal";
import { useRouter } from "next/navigation";

export function UniversityList() {
    const router = useRouter();
    const [universities, setUniversities] = useState<University[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [queryParams, setQueryParams] = useState<UniversityQueryParams>({
        page: 1,
        limit: 10,
        status: 'all'
    });

    const fetchUniversities = useCallback(async () => {
        try {
            setIsFetching(true);
            const response = await universityService.getAllUniversities(queryParams);

            const universitiesData = response.data || [];

            const meta: PaginationMeta = {
                page: response.pagination.page,
                limit: response.pagination.limit,
                total: response.pagination.total,
                totalPages: response.pagination.totalPages,
                currentPage: response.pagination.page,
                itemsPerPage: response.pagination.limit,
                totalItems: response.pagination.total,
                hasNextPage: response.pagination.hasNextPage,
                hasPrevPage: response.pagination.hasPrevPage,
            };

            setUniversities(universitiesData);
            setPagination(meta);
        } catch (error) {
            console.error("Error fetching universities:", error);
            toast.error("Failed to fetch universities");
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [queryParams]);

    useEffect(() => {
        fetchUniversities();
    }, [fetchUniversities]);

    const handleEdit = (university: University) => {
        // Navigate to edit page with university slug
        router.push(`/dashboard/universities/edit-university?slug=${university.slug}`);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this university?")) {
            try {
                await universityService.deleteUniversity(id);
                toast.success("University deleted successfully");
                fetchUniversities();
            } catch (error) {
                console.error("Error deleting university:", error);
                toast.error("Failed to delete university");
            }
        }
    };

    const handleAddUniversity = () => {
        setIsModalOpen(true);
    };

    const handleModalSuccess = () => {
        fetchUniversities();
    };

    const goToPage = useCallback((page: number) => {
        setQueryParams((prev) => ({ ...prev, page }));
    }, []);

    const setPageSize = useCallback((limit: number) => {
        setQueryParams((prev) => ({ ...prev, limit, page: 1 }));
    }, []);

    const setSearch = useCallback((search: string) => {
        setQueryParams((prev) => ({ ...prev, search, page: 1 }));
    }, []);

    const setSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
        setQueryParams((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
    }, []);

    const handleRefresh = () => {
        fetchUniversities();
    };

    const columns = createColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
    });

    if (isLoading && !universities.length) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Universities</h1>
                    <p className="text-gray-600 mt-1">
                        Manage university listings and information
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isFetching}
                        className="border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                        <RefreshCcw
                            className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                    <Button
                        className="bg-gray-900 hover:bg-gray-800 cursor-pointer"
                        onClick={handleAddUniversity}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add University
                    </Button>
                </div>
            </div>

            <UniversityDataTable
                columns={columns}
                data={universities}
                pagination={pagination}
                onPageChange={goToPage}
                onPageSizeChange={setPageSize}
                onSearchChange={setSearch}
                onSortChange={setSort}
                isLoading={isFetching}
            />

            <AddUniversityModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
}