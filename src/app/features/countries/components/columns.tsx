// components/countryColumns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Country } from "@/store/countryStore";

interface ColumnActions {
    onEdit: (country: Country) => void;
    onDelete: (country: Country) => void;
    onView: (country: Country) => void;
}

export const createCountryColumns = ({
    onEdit,
    onDelete,
    onView,
}: ColumnActions): ColumnDef<Country>[] => [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="hover:bg-gray-100 -ml-4"
                    >
                        Country Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const country = row.original;
                return (
                    <div className="flex items-center gap-3">
                        {country.flag ? (
                            <img
                                src={country.flag}
                                alt={country.name}
                                className="h-10 w-10 rounded object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                                <span className="text-xs text-gray-400">No Flag</span>
                            </div>
                        )}
                        <div>
                            <div className="font-medium text-gray-900">{country.name}</div>
                            <div className="text-sm text-gray-500">{country.code}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "capital",
            header: "Capital",
            cell: ({ row }) => (
                <div className="text-gray-700">{row.getValue("capital")}</div>
            ),
        },
        {
            accessorKey: "continent",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="hover:bg-gray-100 -ml-4"
                    >
                        Continent
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="text-gray-700">{row.getValue("continent")}</div>
            ),
        },
        {
            accessorKey: "language",
            header: "Language",
            cell: ({ row }) => {
                const language = row.getValue("language") as string;
                return <div className="text-gray-700">{language}</div>;
            },
        },
        {
            accessorKey: "population",
            header: "Population",
            cell: ({ row }) => (
                <div className="text-gray-700">{row.getValue("population")}</div>
            ),
        },
        {
            accessorKey: "currency",
            header: "Currency",
            cell: ({ row }) => (
                <div className="text-gray-700">{row.getValue("currency")}</div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <Badge
                        variant={status === "published" ? "default" : "secondary"}
                        className={
                            status === "published"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                    >
                        {status}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const country = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onView(country)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onEdit(country)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(country)}
                                className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];