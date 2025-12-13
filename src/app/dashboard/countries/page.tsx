"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Search, MoreHorizontal, FileEdit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function CountriesPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    // Placeholder data
    const countries = [
        { id: "1", name: "United Kingdom", slug: "uk", status: "published" },
        { id: "2", name: "United States", slug: "usa", status: "published" },
        { id: "3", name: "Canada", slug: "canada", status: "draft" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Countries</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage study destinations</p>
                </div>
                <Button onClick={() => router.push("/dashboard/countries/add-countries")} className="bg-purple-700 hover:bg-purple-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Country
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search countries..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="w-[300px]">Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {countries.map((country) => (
                            <TableRow key={country.id} className="cursor-pointer hover:bg-purple-50/50 transition-colors">
                                <TableCell className="font-medium">{country.name}</TableCell>
                                <TableCell>{country.slug}</TableCell>
                                <TableCell>
                                    <Badge variant={country.status === "published" ? "default" : "secondary"} className={country.status === "published" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700 hover:bg-gray-100"}>
                                        {country.status === "published" ? "Published" : "Draft"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <FileEdit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
