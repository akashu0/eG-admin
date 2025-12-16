// components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { University } from "@/store/universityStore";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

interface ColumnActions {
    onEdit: (university: University) => void;
    onDelete: (id: string) => void;
}

export const createColumns = ({
    onEdit,
    onDelete,
}: ColumnActions): ColumnDef<University>[] => [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="hover:bg-gray-100 -ml-4"
                    >
                        University Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const university = row.original;
                return (
                    <div className="flex items-center gap-3">
                        {university.logo && (
                            <img
                                src={university.logo}
                                alt={university.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        )}
                        <div>
                            <div className="font-medium text-gray-900">{university.name}</div>
                            <div className="text-sm text-gray-500">
                                {university.city}, {university.country}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "rank",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="hover:bg-gray-100 -ml-4"
                    >
                        Rank
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="font-medium text-gray-900">#{row.getValue("rank")}</div>
            ),
        },
        {
            accessorKey: "totalStudents",
            header: "Total Students",
            cell: ({ row }) => {
                const total = row.getValue("totalStudents") as number;
                return (
                    <div className="text-gray-700">
                        {total.toLocaleString()}
                    </div>
                );
            },
        },
        {
            accessorKey: "internationalStudents",
            header: "International",
            cell: ({ row }) => {
                const international = row.getValue("internationalStudents") as number;
                const total = row.original.totalStudents;
                const percentage = ((international / total) * 100).toFixed(1);
                return (
                    <div>
                        <div className="text-gray-700">{international.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{percentage}%</div>
                    </div>
                );
            },
        },
        {
            accessorKey: "founded",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="hover:bg-gray-100 -ml-4"
                    >
                        Founded
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="text-gray-700">{row.getValue("founded")}</div>
            ),
        },
        {
            accessorKey: "websiteLink",
            header: "Website",
            cell: ({ row }) => {
                const website = row.getValue("websiteLink") as string | undefined;
                return website ? (
                    <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        <ExternalLink className="h-3 w-3" />
                        Visit
                    </a>
                ) : (
                    <span className="text-gray-400">-</span>
                );
            },
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
                const university = row.original;

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
                                onClick={() => onEdit(university)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(university._id)}
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