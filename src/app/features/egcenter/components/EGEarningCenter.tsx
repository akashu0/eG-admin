"use client"

import { useState, useEffect } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { AddEditCenterModal } from "./AddEditCenterModal";
import { DeleteCenterDialog } from "./DeleteCenterDialog";
import { centerService } from "@/app/features/egcenter/service/centerservice";

export interface EarningCenter {
    id: string;
    name: string;
    location: string;
    contactPerson: string;
    contactNumber: string;
    address: string;
    status: "active" | "inactive";
    createdAt: string;
}

export default function EGEarningCenter() {
    const [centers, setCenters] = useState<EarningCenter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCenter, setEditingCenter] = useState<EarningCenter | null>(null);
    const [deletingCenter, setDeletingCenter] = useState<EarningCenter | null>(null);

    // Fetch centers on component mount
    useEffect(() => {
        fetchCenters();
    }, []);

    const fetchCenters = async () => {
        try {
            setIsLoading(true);
            const data = await centerService.getAllCenters();
            setCenters(data);
        } catch (error) {
            console.error("Error fetching centers:", error);
            // Handle error (you can add toast notification here)
        } finally {
            setIsLoading(false);
        }
    };

    const columns: ColumnDef<EarningCenter>[] = [
        {
            accessorKey: "name",
            header: "Center Name",
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "location",
            header: "Location",
        },
        {
            accessorKey: "contactPerson",
            header: "Contact Person",
        },
        {
            accessorKey: "contactNumber",
            header: "Contact Number",
        },
        {
            accessorKey: "address",
            header: "Address",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                            }`}
                    >
                        {status}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const center = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => setEditingCenter(center)}
                                className="cursor-pointer"
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setDeletingCenter(center)}
                                className="cursor-pointer text-red-600"
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

    const table = useReactTable({
        data: centers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            EG Earning Centers
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage all earning centers and their details
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 cursor-pointer focus:ring-purple-600"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Center
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search centers..."
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-white shadow">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                                            <span className="ml-2 text-gray-500">Loading centers...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No centers found. Click "Add Center" to create one.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AddEditCenterModal
                isOpen={isAddModalOpen || !!editingCenter}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingCenter(null);
                }}
                center={editingCenter}
                onSuccess={(center) => {
                    if (editingCenter) {
                        setCenters(
                            centers.map((c) => (c.id === center.id ? center : c))
                        );
                    } else {
                        setCenters([...centers, center]);
                    }
                    setIsAddModalOpen(false);
                    setEditingCenter(null);
                }}
            />

            {/* Delete Dialog */}
            {/* <DeleteCenterDialog
                isOpen={!!deletingCenter}
                onClose={() => setDeletingCenter(null)}
                center={deletingCenter}
                onSuccess={() => {
                    if (deletingCenter) {
                        setCenters(centers.filter((c) => c.id !== deletingCenter.id));
                    }
                    setDeletingCenter(null);
                }}
            /> */}
        </div>
    );
}