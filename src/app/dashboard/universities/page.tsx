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

export default function UniversitiesPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    // Placeholder data
    const universities = [
        { id: "1", name: "Harvard University", location: "Cambridge, MA", status: "published" },
        { id: "2", name: "Stanford University", location: "Stanford, CA", status: "draft" },
        { id: "3", name: "MIT", location: "Cambridge, MA", status: "published" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Universities</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage your university database</p>
                </div>
                <Button onClick={() => router.push("/dashboard/universities/add-universities")} className="bg-purple-700 hover:bg-purple-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add University
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search universities..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Add filters here if needed */}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="w-[300px]">Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {universities.map((uni) => (
                            <TableRow key={uni.id} className="cursor-pointer hover:bg-purple-50/50 transition-colors">
                                <TableCell className="font-medium">{uni.name}</TableCell>
                                <TableCell>{uni.location}</TableCell>
                                <TableCell>
                                    <Badge variant={uni.status === "published" ? "default" : "secondary"} className={uni.status === "published" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700 hover:bg-gray-100"}>
                                        {uni.status === "published" ? "Published" : "Draft"}
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
