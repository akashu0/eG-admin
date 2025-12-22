"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Country, useCountryStore } from "@/store/countryStore";
import { countryService } from "@/app/features/countries/services/countryService";
import { createCountryColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { CountryDataTable } from "./CountryDataTable";
import { AddCountryModal } from "./AddCountryModal";
import { DeleteCountryModal } from "./DeleteCountryModal";



export default function CountriesPage() {
    const {
        countries,
        pagination,
        isLoading,
        setCountries,
        setPagination,
        setIsLoading,
        removeCountry,
    } = useCountryStore();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [countryToDelete, setCountryToDelete] = useState<Country | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchCountries();
    }, [searchQuery, currentPage, pageSize, sortBy, sortOrder]);

    const fetchCountries = async () => {
        setIsLoading(true);
        try {
            const response = await countryService.getAllCountries({
                page: currentPage,
                limit: pageSize,
                search: searchQuery || undefined,
            });

            setCountries(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error("Error fetching countries:", error);
            toast.error("Failed to fetch countries");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (country: Country) => {
        setCountryToDelete(country);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!countryToDelete) return;

        setIsDeleting(true);
        try {
            await countryService.deleteCountry(countryToDelete._id);
            removeCountry(countryToDelete._id);
            toast.success("Country deleted successfully");
            setDeleteDialogOpen(false);
            setCountryToDelete(null);
        } catch (error) {
            console.error("Error deleting country:", error);
            toast.error("Failed to delete country");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (country: Country) => {
        // TODO: Implement edit functionality
        toast.info("Edit functionality coming soon");
    };

    const handleView = (country: Country) => {
        // TODO: Implement view functionality
        toast.info("View functionality coming soon");
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const handleSortChange = (sortByField: string, order: "asc" | "desc") => {
        setSortBy(sortByField);
        setSortOrder(order);
    };

    const columns = createCountryColumns({
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
        onView: handleView,
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Countries</h1>
                        <p className="text-gray-600 mt-1">
                            Manage country information and details
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-gray-900 hover:bg-gray-800"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Country
                    </Button>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <CountryDataTable
                        columns={columns}
                        data={countries}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        onSearchChange={handleSearch}
                        onSortChange={handleSortChange}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* Add Country Modal */}
            <AddCountryModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSuccess={fetchCountries}
            />

            {/* Delete Confirmation Modal */}
            <DeleteCountryModal
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                countryName={countryToDelete?.name}
            />
        </div>
    );
}