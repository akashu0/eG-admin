// app/features/visa/components/VisaList.tsx
"use client";

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
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { visaService } from "@/app/features/visa/services/visaService";
import { Visa } from "@/type/visa";
import { toast } from "sonner";
import { AddEditVisaModal } from "./AddEditVisaModal";
import { DeleteVisaDialog } from "./DeleteVisaDialog";

export default function VisaList() {
    const [visas, setVisas] = useState<Visa[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingVisa, setEditingVisa] = useState<Visa | null>(null);
    const [deletingVisa, setDeletingVisa] = useState<Visa | null>(null);

    useEffect(() => {
        fetchVisas();
    }, []);

    const fetchVisas = async () => {
        try {
            setIsLoading(true);
            const response = await visaService.getAllVisas();
            setVisas(response.data);
        } catch (error) {
            console.error("Error fetching visas:", error);
            toast.error("Failed to fetch visas");
        } finally {
            setIsLoading(false);
        }
    };

    const columns: ColumnDef<Visa>[] = [
        {
            accessorKey: "country",
            header: "Country",
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("country")}</div>
            ),
        },
        {
            accessorKey: "visaFee",
            header: "Visa Fee",
            cell: ({ row }) => {
                const visa = row.original;
                return (
                    <div>
                        {visa.currency} {visa.visaFee.toLocaleString()}
                    </div>
                );
            },
        },
        {
            accessorKey: "visaSuccessRate",
            header: "Success Rate",
            cell: ({ row }) => {
                const rate = row.getValue("visaSuccessRate") as number;
                return (
                    <div className="flex items-center">
                        <span className="font-medium">{rate}%</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "visaProcessingTime",
            header: "Processing Time",
            cell: ({ row }) => {
                const visa = row.original;
                return (
                    <div>
                        {visa.visaProcessingTime} {visa.visaProcessingTimeUnit}
                    </div>
                );
            },
        },
        {
            accessorKey: "visaRenewalCost",
            header: "Renewal Cost",
            cell: ({ row }) => {
                const visa = row.original;
                return (
                    <div>
                        {visa.currency} {visa.visaRenewalCost.toLocaleString()}
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <Badge variant={status === "active" ? "default" : "secondary"}>
                        {status}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const visa = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuItem
                                onClick={() => setEditingVisa(visa)}
                                className="cursor-pointer"
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setDeletingVisa(visa)}
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
        data: visas,
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
                        <h1 className="text-3xl font-bold text-gray-900">Visa Management</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage visa requirements and processing details
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Visa
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search by country..."
                            value={(table.getColumn("country")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("country")?.setFilterValue(event.target.value)
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
                                            <span className="ml-2 text-gray-500">Loading visas...</span>
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
                                        No visas found. Click "Add Visa" to create one.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AddEditVisaModal
                isOpen={isAddModalOpen || !!editingVisa}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingVisa(null);
                }}
                visa={editingVisa}
                onSuccess={() => {
                    fetchVisas();
                    setIsAddModalOpen(false);
                    setEditingVisa(null);
                }}
            />

            {/* Delete Dialog */}
            <DeleteVisaDialog
                isOpen={!!deletingVisa}
                onClose={() => setDeletingVisa(null)}
                visa={deletingVisa}
                onSuccess={() => {
                    fetchVisas();
                    setDeletingVisa(null);
                }}
            />
        </div>
    );
}